-- Temporarily disable RLS to fix infinite recursion issue
-- This will allow the app to work while we fix the policies

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE response_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE threshold_config DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to view all users" ON users;

DROP POLICY IF EXISTS "Users can view questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Admins can manage questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Allow authenticated users to view questionnaires" ON questionnaires;

DROP POLICY IF EXISTS "Users can view questions" ON questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;
DROP POLICY IF EXISTS "Allow authenticated users to view questions" ON questions;

DROP POLICY IF EXISTS "Users can view their own responses" ON interview_responses;
DROP POLICY IF EXISTS "Admins can view all responses" ON interview_responses;
DROP POLICY IF EXISTS "Users can create responses" ON interview_responses;
DROP POLICY IF EXISTS "Users can update their own responses" ON interview_responses;
DROP POLICY IF EXISTS "Admins can update all responses" ON interview_responses;
DROP POLICY IF EXISTS "Users can delete their own responses" ON interview_responses;
DROP POLICY IF EXISTS "Admins can delete all responses" ON interview_responses;
DROP POLICY IF EXISTS "Allow authenticated users to view all responses" ON interview_responses;

DROP POLICY IF EXISTS "Users can view their own answers" ON response_answers;
DROP POLICY IF EXISTS "Admins can view all answers" ON response_answers;
DROP POLICY IF EXISTS "Users can create answers" ON response_answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON response_answers;
DROP POLICY IF EXISTS "Admins can update all answers" ON response_answers;
DROP POLICY IF EXISTS "Users can delete their own answers" ON response_answers;
DROP POLICY IF EXISTS "Admins can delete all answers" ON response_answers;
DROP POLICY IF EXISTS "Allow authenticated users to view all answers" ON response_answers;

DROP POLICY IF EXISTS "Admins can manage threshold config" ON threshold_config;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'questionnaires', 'questions', 'interview_responses', 'response_answers', 'threshold_config');
