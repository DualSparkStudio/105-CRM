import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          role: 'admin' | 'user';
          created_at: string;
          is_active: boolean;
          interview_count: number;
          completed_forms: number;
          incomplete_forms: number;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          role: 'admin' | 'user';
          created_at?: string;
          is_active?: boolean;
          interview_count?: number;
          completed_forms?: number;
          incomplete_forms?: number;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          role?: 'admin' | 'user';
          created_at?: string;
          is_active?: boolean;
          interview_count?: number;
          completed_forms?: number;
          incomplete_forms?: number;
        };
      };
      questionnaires: {
        Row: {
          id: string;
          title: string;
          description: string;
          created_at: string;
          is_active: boolean;
          assigned_to: string[];
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          created_at?: string;
          is_active?: boolean;
          assigned_to?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          created_at?: string;
          is_active?: boolean;
          assigned_to?: string[];
        };
      };
      questions: {
        Row: {
          id: string;
          questionnaire_id: string;
          text: string;
          type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'radio' | 'checkbox';
          required: boolean;
          options?: string[];
          order: number;
        };
        Insert: {
          id?: string;
          questionnaire_id: string;
          text: string;
          type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'radio' | 'checkbox';
          required: boolean;
          options?: string[];
          order: number;
        };
        Update: {
          id?: string;
          questionnaire_id?: string;
          text?: string;
          type?: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'radio' | 'checkbox';
          required?: boolean;
          options?: string[];
          order?: number;
        };
      };
      interview_responses: {
        Row: {
          id: string;
          questionnaire_id: string;
          user_id: string;
          status: 'completed' | 'incomplete' | 'draft';
          submitted_at?: string;
          last_modified: string;
          completion_percentage: number;
        };
        Insert: {
          id?: string;
          questionnaire_id: string;
          user_id: string;
          status?: 'completed' | 'incomplete' | 'draft';
          submitted_at?: string;
          last_modified?: string;
          completion_percentage?: number;
        };
        Update: {
          id?: string;
          questionnaire_id?: string;
          user_id?: string;
          status?: 'completed' | 'incomplete' | 'draft';
          submitted_at?: string;
          last_modified?: string;
          completion_percentage?: number;
        };
      };
      response_answers: {
        Row: {
          id: string;
          response_id: string;
          question_id: string;
          answer: string;
        };
        Insert: {
          id?: string;
          response_id: string;
          question_id: string;
          answer: string;
        };
        Update: {
          id?: string;
          response_id?: string;
          question_id?: string;
          answer?: string;
        };
      };
    };
  };
}
