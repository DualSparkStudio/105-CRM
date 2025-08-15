-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    interview_count INTEGER DEFAULT 0,
    completed_forms INTEGER DEFAULT 0,
    incomplete_forms INTEGER DEFAULT 0
);

-- Questionnaires table
CREATE TABLE questionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    assigned_to UUID[] DEFAULT '{}'
);

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'number', 'email', 'phone', 'date', 'select', 'radio', 'checkbox')),
    required BOOLEAN DEFAULT FALSE,
    options TEXT[],
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview responses table
CREATE TABLE interview_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('completed', 'incomplete', 'draft')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
);

-- Response answers table
CREATE TABLE response_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID NOT NULL REFERENCES interview_responses(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Threshold configuration table
CREATE TABLE threshold_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    min_interviews INTEGER NOT NULL DEFAULT 5,
    warning_threshold INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_questionnaires_created_at ON questionnaires(created_at);
CREATE INDEX idx_questionnaires_is_active ON questionnaires(is_active);
CREATE INDEX idx_questions_questionnaire_id ON questions(questionnaire_id);
CREATE INDEX idx_questions_order ON questions("order");
CREATE INDEX idx_interview_responses_user_id ON interview_responses(user_id);
CREATE INDEX idx_interview_responses_questionnaire_id ON interview_responses(questionnaire_id);
CREATE INDEX idx_interview_responses_status ON interview_responses(status);
CREATE INDEX idx_interview_responses_last_modified ON interview_responses(last_modified);
CREATE INDEX idx_response_answers_response_id ON response_answers(response_id);
CREATE INDEX idx_response_answers_question_id ON response_answers(question_id);

-- Insert default admin user
INSERT INTO users (username, email, role) VALUES 
('admin', 'admin@example.com', 'admin');

-- Insert default threshold configuration
INSERT INTO threshold_config (min_interviews, warning_threshold) VALUES 
(5, 3);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE threshold_config ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create policies for questionnaires table
CREATE POLICY "All authenticated users can view questionnaires" ON questionnaires
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage questionnaires" ON questionnaires
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create policies for questions table
CREATE POLICY "All authenticated users can view questions" ON questions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage questions" ON questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create policies for interview_responses table
CREATE POLICY "Users can view their own responses" ON interview_responses
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all responses" ON interview_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can manage their own responses" ON interview_responses
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Create policies for response_answers table
CREATE POLICY "Users can view their own response answers" ON response_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM interview_responses 
            WHERE id = response_id 
            AND user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can view all response answers" ON response_answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can manage their own response answers" ON response_answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM interview_responses 
            WHERE id = response_id 
            AND user_id::text = auth.uid()::text
        )
    );

-- Create policies for threshold_config table
CREATE POLICY "Admins can manage threshold config" ON threshold_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user interview count and completion stats
    UPDATE users 
    SET 
        interview_count = (
            SELECT COUNT(*) 
            FROM interview_responses 
            WHERE user_id = NEW.user_id
        ),
        completed_forms = (
            SELECT COUNT(*) 
            FROM interview_responses 
            WHERE user_id = NEW.user_id AND status = 'completed'
        ),
        incomplete_forms = (
            SELECT COUNT(*) 
            FROM interview_responses 
            WHERE user_id = NEW.user_id AND status IN ('incomplete', 'draft')
        )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating user stats
CREATE TRIGGER trigger_update_user_stats
    AFTER INSERT OR UPDATE OR DELETE ON interview_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

-- Create function to calculate completion percentage
CREATE OR REPLACE FUNCTION calculate_completion_percentage()
RETURNS TRIGGER AS $$
DECLARE
    total_questions INTEGER;
    answered_questions INTEGER;
BEGIN
    -- Get total questions for the questionnaire
    SELECT COUNT(*) INTO total_questions
    FROM questions
    WHERE questionnaire_id = NEW.questionnaire_id;
    
    -- Get answered questions
    SELECT COUNT(*) INTO answered_questions
    FROM response_answers
    WHERE response_id = NEW.id;
    
    -- Update completion percentage
    UPDATE interview_responses
    SET completion_percentage = CASE 
        WHEN total_questions = 0 THEN 0
        ELSE (answered_questions * 100) / total_questions
    END
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for calculating completion percentage
CREATE TRIGGER trigger_calculate_completion_percentage
    AFTER INSERT OR UPDATE OR DELETE ON response_answers
    FOR EACH ROW
    EXECUTE FUNCTION calculate_completion_percentage();
