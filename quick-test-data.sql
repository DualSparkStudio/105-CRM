-- Quick test data insertion
-- This will add minimal data to test the app

-- Add a test user
INSERT INTO users (id, username, email, role, created_at)
VALUES (
    gen_random_uuid(),
    'testuser',
    'test@example.com',
    'user',
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Add a test questionnaire
INSERT INTO questionnaires (id, title, description, created_at)
VALUES (
    gen_random_uuid(),
    'Test Questionnaire',
    'A simple test questionnaire',
    NOW()
) ON CONFLICT DO NOTHING;

-- Get the IDs for reference
DO $$
DECLARE
    test_user_id UUID;
    test_questionnaire_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO test_user_id FROM users WHERE username = 'testuser' LIMIT 1;
    
    -- Get questionnaire ID
    SELECT id INTO test_questionnaire_id FROM questionnaires WHERE title = 'Test Questionnaire' LIMIT 1;
    
    -- Add a test question
    INSERT INTO questions (id, questionnaire_id, text, type, "order", required, created_at)
    VALUES (
        gen_random_uuid(),
        test_questionnaire_id,
        'What is your name?',
        'text',
        1,
        true,
        NOW()
    );
    
    -- Add a test response
    INSERT INTO interview_responses (id, user_id, questionnaire_id, status, completion_percentage, submitted_at, last_modified)
    VALUES (
        gen_random_uuid(),
        test_user_id,
        test_questionnaire_id,
        'completed',
        100,
        NOW(),
        NOW()
    );
    
    -- Get response ID
    DECLARE
        test_response_id UUID;
    BEGIN
        SELECT id INTO test_response_id 
        FROM interview_responses 
        WHERE user_id = test_user_id AND questionnaire_id = test_questionnaire_id 
        LIMIT 1;
        
        -- Add a test answer
        INSERT INTO response_answers (id, response_id, question_id, answer, created_at)
        VALUES (
            gen_random_uuid(),
            test_response_id,
            (SELECT id FROM questions WHERE questionnaire_id = test_questionnaire_id LIMIT 1),
            'John Doe',
            NOW()
        );
    END;
END $$;

-- Show the data we just added
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Questionnaires', COUNT(*) FROM questionnaires
UNION ALL
SELECT 'Questions', COUNT(*) FROM questions
UNION ALL
SELECT 'Responses', COUNT(*) FROM interview_responses
UNION ALL
SELECT 'Answers', COUNT(*) FROM response_answers;
