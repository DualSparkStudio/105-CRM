-- Empty all tables in the correct order to avoid foreign key violations
-- This will delete all data but keep the table structure

-- Disable triggers temporarily to avoid issues
SET session_replication_role = replica;

-- Empty tables in reverse dependency order
DELETE FROM response_answers;
DELETE FROM interview_responses;
DELETE FROM questions;
DELETE FROM questionnaires;
DELETE FROM users;
DELETE FROM threshold_config;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- Verify tables are empty
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
