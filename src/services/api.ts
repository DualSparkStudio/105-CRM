import { supabase } from '../lib/supabase';
import { User, Questionnaire, Question, InterviewResponse, CreateUserData, CreateQuestionnaireData } from '../types';

// User Services
export const userService = {
  async getUsers(): Promise<User[]> {
    console.log('🔍 API: Fetching users...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('🔍 API: Users response:', { data, error });
    if (error) {
      console.error('❌ API: Users error:', error);
      throw error;
    }
    console.log('✅ API: Users loaded:', data?.length || 0);
    return data || [];
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username: userData.username,
        email: userData.email,
        role: userData.role,
        is_active: true,
        interview_count: 0,
        completed_forms: 0,
        incomplete_forms: 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Questionnaire Services
export const questionnaireService = {
  async getQuestionnaires(): Promise<Questionnaire[]> {
    console.log('🔍 API: Fetching questionnaires...');
    const { data, error } = await supabase
      .from('questionnaires')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('🔍 API: Questionnaires response:', { data, error });
    if (error) {
      console.error('❌ API: Questionnaires error:', error);
      throw error;
    }
    console.log('✅ API: Questionnaires loaded:', data?.length || 0);
    return data || [];
  },

  async getQuestionnaireById(id: string): Promise<Questionnaire | null> {
    const { data, error } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createQuestionnaire(questionnaireData: CreateQuestionnaireData): Promise<Questionnaire> {
    const { data, error } = await supabase
      .from('questionnaires')
      .insert([{
        title: questionnaireData.title,
        description: questionnaireData.description,
        assigned_to: questionnaireData.assignedTo,
        is_active: true,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateQuestionnaire(id: string, updates: Partial<Questionnaire>): Promise<Questionnaire> {
    const { data, error } = await supabase
      .from('questionnaires')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteQuestionnaire(id: string): Promise<void> {
    const { error } = await supabase
      .from('questionnaires')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Question Services
export const questionService = {
  async getQuestionsByQuestionnaire(questionnaireId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('questionnaire_id', questionnaireId)
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createQuestion(question: Omit<Question, 'id'>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteQuestion(id: string): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Interview Response Services
export const responseService = {
  async getResponses(): Promise<InterviewResponse[]> {
    console.log('🔍 API: Fetching responses...');
    const { data, error } = await supabase
      .from('interview_responses')
      .select(`
        *,
        response_answers (
          question_id,
          answer
        )
      `)
      .order('last_modified', { ascending: false });

    console.log('🔍 API: Responses response:', { data, error });
    if (error) {
      console.error('❌ API: Responses error:', error);
      throw error;
    }
    console.log('✅ API: Responses loaded:', data?.length || 0);
    return data || [];
  },

  async getResponsesByUser(userId: string): Promise<InterviewResponse[]> {
    const { data, error } = await supabase
      .from('interview_responses')
      .select(`
        *,
        response_answers (
          question_id,
          answer
        )
      `)
      .eq('user_id', userId)
      .order('last_modified', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getResponseById(id: string): Promise<InterviewResponse | null> {
    const { data, error } = await supabase
      .from('interview_responses')
      .select(`
        *,
        response_answers (
          question_id,
          answer
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createResponse(response: Omit<InterviewResponse, 'id'>): Promise<InterviewResponse> {
    const { responses, ...responseData } = response;
    
    const { data, error } = await supabase
      .from('interview_responses')
      .insert([responseData])
      .select()
      .single();

    if (error) throw error;

    // Insert response answers
    if (responses && responses.length > 0) {
      const answerData = responses.map(r => ({
        response_id: data.id,
        question_id: r.questionId,
        answer: Array.isArray(r.answer) ? r.answer.join(', ') : r.answer,
      }));

      const { error: answersError } = await supabase
        .from('response_answers')
        .insert(answerData);

      if (answersError) throw answersError;
    }

    return data;
  },

  async updateResponse(id: string, updates: Partial<InterviewResponse>): Promise<InterviewResponse> {
    const { responses, ...responseData } = updates;
    
    const { data, error } = await supabase
      .from('interview_responses')
      .update(responseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update response answers if provided
    if (responses && responses.length > 0) {
      // Delete existing answers
      await supabase
        .from('response_answers')
        .delete()
        .eq('response_id', id);

      // Insert new answers
      const answerData = responses.map(r => ({
        response_id: id,
        question_id: r.questionId,
        answer: Array.isArray(r.answer) ? r.answer.join(', ') : r.answer,
      }));

      const { error: answersError } = await supabase
        .from('response_answers')
        .insert(answerData);

      if (answersError) throw answersError;
    }

    return data;
  },

  async deleteResponse(id: string): Promise<void> {
    // Delete response answers first
    await supabase
      .from('response_answers')
      .delete()
      .eq('response_id', id);

    // Delete response
    const { error } = await supabase
      .from('interview_responses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Dashboard Stats Service
export const statsService = {
  async getDashboardStats(): Promise<any> {
    const [
      { count: totalUsers },
      { count: totalQuestionnaires },
      { count: totalResponses },
      { count: completedResponses },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('questionnaires').select('*', { count: 'exact', head: true }),
      supabase.from('interview_responses').select('*', { count: 'exact', head: true }),
      supabase.from('interview_responses').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    ]);

    return {
      totalUsers: totalUsers || 0,
      totalQuestionnaires: totalQuestionnaires || 0,
      totalResponses: totalResponses || 0,
      completedResponses: completedResponses || 0,
    };
  },
};
