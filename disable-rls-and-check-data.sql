-- Disable RLS completely and check data
-- This will allow the app to access all data

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE response_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE threshold_config DISABLE ROW LEVEL SECURITY;

-- Drop all policies to be safe
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

-- Check if data exists in tables
SELECT '=== DATA CHECK ===' as info;

SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Questionnaires', COUNT(*) FROM questionnaires
UNION ALL
SELECT 'Questions', COUNT(*) FROM questions
UNION ALL
SELECT 'Responses', COUNT(*) FROM interview_responses
UNION ALL
SELECT 'Answers', COUNT(*) FROM response_answers
UNION ALL
SELECT 'Threshold Config', COUNT(*) FROM threshold_config;

-- Show sample data from each table
SELECT '=== SAMPLE USERS ===' as info;
SELECT id, username, email, role FROM users LIMIT 5;

SELECT '=== SAMPLE QUESTIONNAIRES ===' as info;
SELECT id, title, description FROM questionnaires LIMIT 5;

SELECT '=== SAMPLE QUESTIONS ===' as info;
SELECT id, questionnaire_id, text, type FROM questions LIMIT 5;

SELECT '=== SAMPLE RESPONSES ===' as info;
SELECT id, user_id, questionnaire_id, status, completion_percentage FROM interview_responses LIMIT 5;

SELECT '=== SAMPLE ANSWERS ===' as info;
SELECT id, response_id, question_id, answer FROM response_answers LIMIT 5;

-- Verify RLS is disabled
SELECT '=== RLS STATUS ===' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'questionnaires', 'questions', 'interview_responses', 'response_answers', 'threshold_config');
