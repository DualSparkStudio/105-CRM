-- Fix the calculate_completion_percentage trigger function
-- Run this in your Supabase SQL Editor to fix the existing trigger

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS trigger_calculate_completion_percentage ON response_answers;

-- Drop the existing function
DROP FUNCTION IF EXISTS calculate_completion_percentage();

-- Recreate the function with the correct logic
CREATE OR REPLACE FUNCTION calculate_completion_percentage()
RETURNS TRIGGER AS $$
DECLARE
    total_questions INTEGER;
    answered_questions INTEGER;
    response_questionnaire_id UUID;
BEGIN
    -- Get the questionnaire_id for the response
    SELECT questionnaire_id INTO response_questionnaire_id
    FROM interview_responses
    WHERE id = NEW.response_id;
    
    -- Get total questions for the questionnaire
    SELECT COUNT(*) INTO total_questions
    FROM questions
    WHERE questionnaire_id = response_questionnaire_id;
    
    -- Get answered questions for this response
    SELECT COUNT(*) INTO answered_questions
    FROM response_answers
    WHERE response_id = NEW.response_id;
    
    -- Update completion percentage
    UPDATE interview_responses
    SET completion_percentage = CASE 
        WHEN total_questions = 0 THEN 0
        ELSE (answered_questions * 100) / total_questions
    END
    WHERE id = NEW.response_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trigger_calculate_completion_percentage
    AFTER INSERT OR UPDATE OR DELETE ON response_answers
    FOR EACH ROW
    EXECUTE FUNCTION calculate_completion_percentage();
