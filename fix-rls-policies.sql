-- Fix RLS Policies to prevent infinite recursion
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;

-- Recreate simplified policies
-- Allow all authenticated users to view all users (for admin panel)
CREATE POLICY "Allow authenticated users to view all users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow admins to update all users
CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to delete users
CREATE POLICY "Admins can delete users" ON users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to insert users
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Fix questionnaires policies
DROP POLICY IF EXISTS "Users can view questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Admins can manage questionnaires" ON questionnaires;

CREATE POLICY "Allow authenticated users to view questionnaires" ON questionnaires
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage questionnaires" ON questionnaires
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Fix questions policies
DROP POLICY IF EXISTS "Users can view questions" ON questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;

CREATE POLICY "Allow authenticated users to view questions" ON questions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage questions" ON questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Fix interview_responses policies
DROP POLICY IF EXISTS "Users can view their own responses" ON interview_responses;
DROP POLICY IF EXISTS "Admins can view all responses" ON interview_responses;
DROP POLICY IF EXISTS "Users can create responses" ON interview_responses;
DROP POLICY IF EXISTS "Users can update their own responses" ON interview_responses;
DROP POLICY IF EXISTS "Admins can update all responses" ON interview_responses;
DROP POLICY IF EXISTS "Users can delete their own responses" ON interview_responses;
DROP POLICY IF EXISTS "Admins can delete all responses" ON interview_responses;

CREATE POLICY "Allow authenticated users to view all responses" ON interview_responses
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create responses" ON interview_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" ON interview_responses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all responses" ON interview_responses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can delete their own responses" ON interview_responses
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all responses" ON interview_responses
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Fix response_answers policies
DROP POLICY IF EXISTS "Users can view their own answers" ON response_answers;
DROP POLICY IF EXISTS "Admins can view all answers" ON response_answers;
DROP POLICY IF EXISTS "Users can create answers" ON response_answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON response_answers;
DROP POLICY IF EXISTS "Admins can update all answers" ON response_answers;
DROP POLICY IF EXISTS "Users can delete their own answers" ON response_answers;
DROP POLICY IF EXISTS "Admins can delete all answers" ON response_answers;

CREATE POLICY "Allow authenticated users to view all answers" ON response_answers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create answers" ON response_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM interview_responses 
            WHERE id = response_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own answers" ON response_answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM interview_responses 
            WHERE id = response_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update all answers" ON response_answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can delete their own answers" ON response_answers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM interview_responses 
            WHERE id = response_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete all answers" ON response_answers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Fix threshold_config policies
DROP POLICY IF EXISTS "Admins can manage threshold config" ON threshold_config;

CREATE POLICY "Admins can manage threshold config" ON threshold_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
