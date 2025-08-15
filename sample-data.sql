-- Sample Data for CRM System
-- Run this after setting up the database schema
-- This script handles existing data gracefully

-- Insert sample users (skip if already exist)
INSERT INTO users (username, email, role, is_active, interview_count, completed_forms, incomplete_forms) VALUES
('john_doe', 'john.doe@example.com', 'user', true, 5, 4, 1),
('jane_smith', 'jane.smith@example.com', 'user', true, 3, 3, 0),
('mike_johnson', 'mike.johnson@example.com', 'user', true, 2, 1, 1),
('sarah_wilson', 'sarah.wilson@example.com', 'user', true, 4, 3, 1),
('david_brown', 'david.brown@example.com', 'user', true, 1, 0, 1),
('emma_davis', 'emma.davis@example.com', 'user', true, 6, 5, 1),
('alex_taylor', 'alex.taylor@example.com', 'user', true, 2, 2, 0),
('lisa_anderson', 'lisa.anderson@example.com', 'user', true, 3, 2, 1)
ON CONFLICT (username) DO NOTHING;

-- Insert sample questionnaires (skip if already exist)
INSERT INTO questionnaires (title, description, is_active, assigned_to) VALUES
('Technical Skills Assessment', 'Comprehensive assessment for technical roles including programming, problem-solving, and system design skills', true, ARRAY[]::uuid[]),
('Customer Service Evaluation', 'Evaluation of customer service skills, communication, and problem resolution abilities', true, ARRAY[]::uuid[]),
('Leadership Assessment', 'Assessment of leadership qualities, team management, and strategic thinking', true, ARRAY[]::uuid[]),
('Sales Performance Review', 'Review of sales techniques, customer relationship management, and performance metrics', true, ARRAY[]::uuid[]),
('General Information Form', 'Basic information collection form for new employees', true, ARRAY[]::uuid[])
ON CONFLICT DO NOTHING;

-- Get questionnaire IDs for questions
DO $$
DECLARE
    tech_assessment_id UUID;
    customer_service_id UUID;
    leadership_id UUID;
    sales_id UUID;
    general_info_id UUID;
BEGIN
    -- Get questionnaire IDs
    SELECT id INTO tech_assessment_id FROM questionnaires WHERE title = 'Technical Skills Assessment';
    SELECT id INTO customer_service_id FROM questionnaires WHERE title = 'Customer Service Evaluation';
    SELECT id INTO leadership_id FROM questionnaires WHERE title = 'Leadership Assessment';
    SELECT id INTO sales_id FROM questionnaires WHERE title = 'Sales Performance Review';
    SELECT id INTO general_info_id FROM questionnaires WHERE title = 'General Information Form';

    -- Only insert questions if questionnaires exist and don't have questions yet
    IF tech_assessment_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM questions WHERE questionnaire_id = tech_assessment_id) THEN
        -- Insert questions for Technical Skills Assessment
        INSERT INTO questions (questionnaire_id, text, type, required, options, "order") VALUES
        (tech_assessment_id, 'Full Name', 'text', true, NULL, 1),
        (tech_assessment_id, 'Email Address', 'email', true, NULL, 2),
        (tech_assessment_id, 'Phone Number', 'phone', true, NULL, 3),
        (tech_assessment_id, 'Current Role/Position', 'text', true, NULL, 4),
        (tech_assessment_id, 'Years of Experience', 'number', true, NULL, 5),
        (tech_assessment_id, 'Programming Languages', 'text', true, NULL, 6),
        (tech_assessment_id, 'Database Technologies', 'select', true, ARRAY['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite'], 7),
        (tech_assessment_id, 'Cloud Platforms', 'checkbox', false, ARRAY['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Heroku'], 8),
        (tech_assessment_id, 'Problem-Solving Approach', 'text', true, NULL, 9),
        (tech_assessment_id, 'Preferred Work Environment', 'radio', true, ARRAY['Remote', 'Hybrid', 'Office'], 10);
    END IF;

    IF customer_service_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM questions WHERE questionnaire_id = customer_service_id) THEN
        -- Insert questions for Customer Service Evaluation
        INSERT INTO questions (questionnaire_id, text, type, required, options, "order") VALUES
        (customer_service_id, 'Full Name', 'text', true, NULL, 1),
        (customer_service_id, 'Email Address', 'email', true, NULL, 2),
        (customer_service_id, 'Department', 'select', true, ARRAY['Support', 'Sales', 'Technical', 'Billing'], 3),
        (customer_service_id, 'How do you handle difficult customers?', 'text', true, NULL, 4),
        (customer_service_id, 'Communication Style', 'radio', true, ARRAY['Direct', 'Empathetic', 'Professional', 'Casual'], 5),
        (customer_service_id, 'Tools you use for customer service', 'checkbox', false, ARRAY['Zendesk', 'Intercom', 'Freshdesk', 'HubSpot', 'Custom CRM'], 6),
        (customer_service_id, 'Average response time to customer inquiries', 'number', true, NULL, 7),
        (customer_service_id, 'Customer satisfaction rating', 'number', true, NULL, 8);
    END IF;

    IF leadership_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM questions WHERE questionnaire_id = leadership_id) THEN
        -- Insert questions for Leadership Assessment
        INSERT INTO questions (questionnaire_id, text, type, required, options, "order") VALUES
        (leadership_id, 'Full Name', 'text', true, NULL, 1),
        (leadership_id, 'Email Address', 'email', true, NULL, 2),
        (leadership_id, 'Current Leadership Level', 'select', true, ARRAY['Team Lead', 'Manager', 'Director', 'VP', 'C-Level'], 3),
        (leadership_id, 'Team Size Managed', 'number', true, NULL, 4),
        (leadership_id, 'Leadership Style', 'radio', true, ARRAY['Democratic', 'Autocratic', 'Transformational', 'Servant Leadership'], 5),
        (leadership_id, 'Key Leadership Challenges', 'text', true, NULL, 6),
        (leadership_id, 'Success Metrics', 'text', true, NULL, 7),
        (leadership_id, 'Mentoring Experience', 'text', false, NULL, 8);
    END IF;

    IF sales_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM questions WHERE questionnaire_id = sales_id) THEN
        -- Insert questions for Sales Performance Review
        INSERT INTO questions (questionnaire_id, text, type, required, options, "order") VALUES
        (sales_id, 'Full Name', 'text', true, NULL, 1),
        (sales_id, 'Email Address', 'email', true, NULL, 2),
        (sales_id, 'Sales Territory', 'text', true, NULL, 3),
        (sales_id, 'Monthly Sales Target', 'number', true, NULL, 4),
        (sales_id, 'Actual Sales This Month', 'number', true, NULL, 5),
        (sales_id, 'Sales Tools Used', 'checkbox', false, ARRAY['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho', 'Custom CRM'], 6),
        (sales_id, 'Sales Approach', 'radio', true, ARRAY['Consultative', 'Transactional', 'Relationship-based', 'Solution-selling'], 7),
        (sales_id, 'Biggest Sales Challenge', 'text', true, NULL, 8);
    END IF;

    IF general_info_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM questions WHERE questionnaire_id = general_info_id) THEN
        -- Insert questions for General Information Form
        INSERT INTO questions (questionnaire_id, text, type, required, options, "order") VALUES
        (general_info_id, 'Full Name', 'text', true, NULL, 1),
        (general_info_id, 'Email Address', 'email', true, NULL, 2),
        (general_info_id, 'Phone Number', 'phone', true, NULL, 3),
        (general_info_id, 'Date of Birth', 'date', true, NULL, 4),
        (general_info_id, 'Department', 'select', true, ARRAY['IT', 'HR', 'Marketing', 'Sales', 'Finance', 'Operations'], 5),
        (general_info_id, 'Employment Type', 'radio', true, ARRAY['Full-time', 'Part-time', 'Contract', 'Intern'], 6),
        (general_info_id, 'Skills and Certifications', 'text', false, NULL, 7),
        (general_info_id, 'Emergency Contact', 'text', true, NULL, 8);
    END IF;

END $$;

-- Insert sample interview responses (only if they don't exist)
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    user4_id UUID;
    user5_id UUID;
    user6_id UUID;
    user7_id UUID;
    user8_id UUID;
    tech_assessment_id UUID;
    customer_service_id UUID;
    leadership_id UUID;
    sales_id UUID;
    general_info_id UUID;
    response1_id UUID;
    response2_id UUID;
    response3_id UUID;
    response4_id UUID;
    response5_id UUID;
    response6_id UUID;
    response7_id UUID;
    response8_id UUID;
    response9_id UUID;
    response10_id UUID;
    response11_id UUID;
    response12_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO user1_id FROM users WHERE username = 'john_doe';
    SELECT id INTO user2_id FROM users WHERE username = 'jane_smith';
    SELECT id INTO user3_id FROM users WHERE username = 'mike_johnson';
    SELECT id INTO user4_id FROM users WHERE username = 'sarah_wilson';
    SELECT id INTO user5_id FROM users WHERE username = 'david_brown';
    SELECT id INTO user6_id FROM users WHERE username = 'emma_davis';
    SELECT id INTO user7_id FROM users WHERE username = 'alex_taylor';
    SELECT id INTO user8_id FROM users WHERE username = 'lisa_anderson';

    -- Get questionnaire IDs
    SELECT id INTO tech_assessment_id FROM questionnaires WHERE title = 'Technical Skills Assessment';
    SELECT id INTO customer_service_id FROM questionnaires WHERE title = 'Customer Service Evaluation';
    SELECT id INTO leadership_id FROM questionnaires WHERE title = 'Leadership Assessment';
    SELECT id INTO sales_id FROM questionnaires WHERE title = 'Sales Performance Review';
    SELECT id INTO general_info_id FROM questionnaires WHERE title = 'General Information Form';

    -- Only insert responses if users and questionnaires exist and responses don't already exist
    IF user1_id IS NOT NULL AND tech_assessment_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user1_id AND questionnaire_id = tech_assessment_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (tech_assessment_id, user1_id, 'completed', NOW() - INTERVAL '5 days', 100);
    END IF;

    IF user2_id IS NOT NULL AND customer_service_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user2_id AND questionnaire_id = customer_service_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (customer_service_id, user2_id, 'completed', NOW() - INTERVAL '3 days', 100);
    END IF;

    IF user3_id IS NOT NULL AND leadership_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user3_id AND questionnaire_id = leadership_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (leadership_id, user3_id, 'incomplete', NULL, 60);
    END IF;

    IF user4_id IS NOT NULL AND sales_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user4_id AND questionnaire_id = sales_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (sales_id, user4_id, 'completed', NOW() - INTERVAL '1 day', 100);
    END IF;

    IF user5_id IS NOT NULL AND general_info_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user5_id AND questionnaire_id = general_info_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (general_info_id, user5_id, 'draft', NULL, 30);
    END IF;

    IF user6_id IS NOT NULL AND tech_assessment_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user6_id AND questionnaire_id = tech_assessment_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (tech_assessment_id, user6_id, 'completed', NOW() - INTERVAL '2 days', 100);
    END IF;

    IF user7_id IS NOT NULL AND customer_service_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user7_id AND questionnaire_id = customer_service_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (customer_service_id, user7_id, 'completed', NOW() - INTERVAL '4 days', 100);
    END IF;

    IF user8_id IS NOT NULL AND leadership_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user8_id AND questionnaire_id = leadership_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (leadership_id, user8_id, 'incomplete', NULL, 80);
    END IF;

    IF user1_id IS NOT NULL AND sales_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user1_id AND questionnaire_id = sales_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (sales_id, user1_id, 'completed', NOW() - INTERVAL '6 days', 100);
    END IF;

    IF user2_id IS NOT NULL AND general_info_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user2_id AND questionnaire_id = general_info_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (general_info_id, user2_id, 'completed', NOW() - INTERVAL '7 days', 100);
    END IF;

    IF user3_id IS NOT NULL AND tech_assessment_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user3_id AND questionnaire_id = tech_assessment_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (tech_assessment_id, user3_id, 'draft', NULL, 40);
    END IF;

    IF user4_id IS NOT NULL AND customer_service_id IS NOT NULL AND 
       NOT EXISTS (SELECT 1 FROM interview_responses WHERE user_id = user4_id AND questionnaire_id = customer_service_id) THEN
        INSERT INTO interview_responses (questionnaire_id, user_id, status, submitted_at, completion_percentage) VALUES
        (customer_service_id, user4_id, 'completed', NOW() - INTERVAL '8 days', 100);
    END IF;

    -- Get response IDs for inserting answers
    SELECT id INTO response1_id FROM interview_responses WHERE user_id = user1_id AND questionnaire_id = tech_assessment_id LIMIT 1;
    SELECT id INTO response2_id FROM interview_responses WHERE user_id = user2_id AND questionnaire_id = customer_service_id LIMIT 1;
    SELECT id INTO response3_id FROM interview_responses WHERE user_id = user3_id AND questionnaire_id = leadership_id LIMIT 1;
    SELECT id INTO response4_id FROM interview_responses WHERE user_id = user4_id AND questionnaire_id = sales_id LIMIT 1;
    SELECT id INTO response5_id FROM interview_responses WHERE user_id = user5_id AND questionnaire_id = general_info_id LIMIT 1;
    SELECT id INTO response6_id FROM interview_responses WHERE user_id = user6_id AND questionnaire_id = tech_assessment_id LIMIT 1;
    SELECT id INTO response7_id FROM interview_responses WHERE user_id = user7_id AND questionnaire_id = customer_service_id LIMIT 1;
    SELECT id INTO response8_id FROM interview_responses WHERE user_id = user8_id AND questionnaire_id = leadership_id LIMIT 1;
    SELECT id INTO response9_id FROM interview_responses WHERE user_id = user1_id AND questionnaire_id = sales_id LIMIT 1;
    SELECT id INTO response10_id FROM interview_responses WHERE user_id = user2_id AND questionnaire_id = general_info_id LIMIT 1;
    SELECT id INTO response11_id FROM interview_responses WHERE user_id = user3_id AND questionnaire_id = tech_assessment_id LIMIT 1;
    SELECT id INTO response12_id FROM interview_responses WHERE user_id = user4_id AND questionnaire_id = customer_service_id LIMIT 1;

    -- Insert response answers only if responses exist and don't have answers yet
    IF response1_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response1_id) THEN
        -- Response 1: John Doe - Technical Skills Assessment (Completed)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response1_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'John Doe'
            WHEN 2 THEN 'john.doe@example.com'
            WHEN 3 THEN '+1234567890'
            WHEN 4 THEN 'Senior Software Engineer'
            WHEN 5 THEN '8'
            WHEN 6 THEN 'JavaScript, TypeScript, Python, Java'
            WHEN 7 THEN 'PostgreSQL'
            WHEN 8 THEN 'AWS, Google Cloud'
            WHEN 9 THEN 'I analyze the problem, break it down into smaller parts, and solve each part systematically'
            WHEN 10 THEN 'Remote'
        END
        FROM questions q WHERE q.questionnaire_id = tech_assessment_id;
    END IF;

    IF response2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response2_id) THEN
        -- Response 2: Jane Smith - Customer Service Evaluation (Completed)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response2_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Jane Smith'
            WHEN 2 THEN 'jane.smith@example.com'
            WHEN 3 THEN 'Support'
            WHEN 4 THEN 'I listen actively, empathize with their situation, and work to find a mutually beneficial solution'
            WHEN 5 THEN 'Empathetic'
            WHEN 6 THEN 'Zendesk, Intercom'
            WHEN 7 THEN '2'
            WHEN 8 THEN '95'
        END
        FROM questions q WHERE q.questionnaire_id = customer_service_id;
    END IF;

    IF response3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response3_id) THEN
        -- Response 3: Mike Johnson - Leadership Assessment (Incomplete)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response3_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Mike Johnson'
            WHEN 2 THEN 'mike.johnson@example.com'
            WHEN 3 THEN 'Manager'
            WHEN 4 THEN '12'
            WHEN 5 THEN 'Democratic'
            WHEN 6 THEN 'Managing remote teams and maintaining team morale'
        END
        FROM questions q WHERE q.questionnaire_id = leadership_id AND q."order" <= 6;
    END IF;

    IF response4_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response4_id) THEN
        -- Response 4: Sarah Wilson - Sales Performance Review (Completed)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response4_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Sarah Wilson'
            WHEN 2 THEN 'sarah.wilson@example.com'
            WHEN 3 THEN 'North Region'
            WHEN 4 THEN '50000'
            WHEN 5 THEN '52000'
            WHEN 6 THEN 'Salesforce, HubSpot'
            WHEN 7 THEN 'Consultative'
            WHEN 8 THEN 'Long sales cycles and complex decision-making processes'
        END
        FROM questions q WHERE q.questionnaire_id = sales_id;
    END IF;

    IF response5_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response5_id) THEN
        -- Response 5: David Brown - General Information Form (Draft)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response5_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'David Brown'
            WHEN 2 THEN 'david.brown@example.com'
            WHEN 3 THEN '+1555666777'
        END
        FROM questions q WHERE q.questionnaire_id = general_info_id AND q."order" <= 3;
    END IF;

    IF response6_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response6_id) THEN
        -- Response 6: Emma Davis - Technical Skills Assessment (Completed)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response6_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Emma Davis'
            WHEN 2 THEN 'emma.davis@example.com'
            WHEN 3 THEN '+1987654321'
            WHEN 4 THEN 'Full Stack Developer'
            WHEN 5 THEN '5'
            WHEN 6 THEN 'React, Node.js, Python, SQL'
            WHEN 7 THEN 'PostgreSQL, MongoDB'
            WHEN 8 THEN 'AWS, Heroku'
            WHEN 9 THEN 'I use a systematic approach with debugging and testing at each step'
            WHEN 10 THEN 'Hybrid'
        END
        FROM questions q WHERE q.questionnaire_id = tech_assessment_id;
    END IF;

    IF response7_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response7_id) THEN
        -- Response 7: Alex Taylor - Customer Service Evaluation (Completed)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response7_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Alex Taylor'
            WHEN 2 THEN 'alex.taylor@example.com'
            WHEN 3 THEN 'Sales'
            WHEN 4 THEN 'I focus on understanding the root cause and providing clear, actionable solutions'
            WHEN 5 THEN 'Professional'
            WHEN 6 THEN 'HubSpot, Custom CRM'
            WHEN 7 THEN '1'
            WHEN 8 THEN '92'
        END
        FROM questions q WHERE q.questionnaire_id = customer_service_id;
    END IF;

    IF response8_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response8_id) THEN
        -- Response 8: Lisa Anderson - Leadership Assessment (Incomplete)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response8_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Lisa Anderson'
            WHEN 2 THEN 'lisa.anderson@example.com'
            WHEN 3 THEN 'Team Lead'
            WHEN 4 THEN '8'
            WHEN 5 THEN 'Transformational'
            WHEN 6 THEN 'Balancing technical and people management responsibilities'
            WHEN 7 THEN 'Team productivity, employee satisfaction, project delivery'
            WHEN 8 THEN 'I have mentored 3 junior developers over the past year'
        END
        FROM questions q WHERE q.questionnaire_id = leadership_id;
    END IF;

    IF response9_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response9_id) THEN
        -- Response 9: John Doe - Sales Performance Review (Completed)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response9_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'John Doe'
            WHEN 2 THEN 'john.doe@example.com'
            WHEN 3 THEN 'East Region'
            WHEN 4 THEN '45000'
            WHEN 5 THEN '48000'
            WHEN 6 THEN 'Salesforce'
            WHEN 7 THEN 'Relationship-based'
            WHEN 8 THEN 'Competition from larger companies'
        END
        FROM questions q WHERE q.questionnaire_id = sales_id;
    END IF;

    IF response10_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response10_id) THEN
        -- Response 10: Jane Smith - General Information Form (Completed)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response10_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Jane Smith'
            WHEN 2 THEN 'jane.smith@example.com'
            WHEN 3 THEN '+1987654321'
            WHEN 4 THEN '1990-05-15'
            WHEN 5 THEN 'Support'
            WHEN 6 THEN 'Full-time'
            WHEN 7 THEN 'Customer Service Certification, Zendesk Admin'
            WHEN 8 THEN 'John Smith - +1234567890'
        END
        FROM questions q WHERE q.questionnaire_id = general_info_id;
    END IF;

    IF response11_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response11_id) THEN
        -- Response 11: Mike Johnson - Technical Skills Assessment (Draft)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response11_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Mike Johnson'
            WHEN 2 THEN 'mike.johnson@example.com'
            WHEN 3 THEN '+1555666777'
            WHEN 4 THEN 'Engineering Manager'
        END
        FROM questions q WHERE q.questionnaire_id = tech_assessment_id AND q."order" <= 4;
    END IF;

    IF response12_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM response_answers WHERE response_id = response12_id) THEN
        -- Response 12: Sarah Wilson - Customer Service Evaluation (Completed)
        INSERT INTO response_answers (response_id, question_id, answer) 
        SELECT response12_id, q.id, 
        CASE q."order"
            WHEN 1 THEN 'Sarah Wilson'
            WHEN 2 THEN 'sarah.wilson@example.com'
            WHEN 3 THEN 'Sales'
            WHEN 4 THEN 'I use active listening and focus on finding win-win solutions'
            WHEN 5 THEN 'Consultative'
            WHEN 6 THEN 'Salesforce, HubSpot'
            WHEN 7 THEN '3'
            WHEN 8 THEN '88'
        END
        FROM questions q WHERE q.questionnaire_id = customer_service_id;
    END IF;

END $$;

-- Update user statistics (this will be done automatically by triggers, but we can also do it manually)
UPDATE users SET 
    interview_count = (
        SELECT COUNT(*) FROM interview_responses WHERE user_id = users.id
    ),
    completed_forms = (
        SELECT COUNT(*) FROM interview_responses WHERE user_id = users.id AND status = 'completed'
    ),
    incomplete_forms = (
        SELECT COUNT(*) FROM interview_responses WHERE user_id = users.id AND status IN ('incomplete', 'draft')
    );

-- Verify the data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Questionnaires', COUNT(*) FROM questionnaires
UNION ALL
SELECT 'Questions', COUNT(*) FROM questions
UNION ALL
SELECT 'Interview Responses', COUNT(*) FROM interview_responses
UNION ALL
SELECT 'Response Answers', COUNT(*) FROM response_answers;
