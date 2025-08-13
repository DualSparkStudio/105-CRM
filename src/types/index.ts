export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  isActive: boolean;
  interviewCount: number;
  completedForms: number;
  incompleteForms: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'radio' | 'checkbox';
  required: boolean;
  options?: string[];
  order: number;
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  isActive: boolean;
  assignedTo: string[];
}

export interface InterviewResponse {
  id: string;
  questionnaireId: string;
  userId: string;
  responses: {
    questionId: string;
    answer: string | string[];
  }[];
  status: 'completed' | 'incomplete' | 'draft';
  submittedAt?: string;
  lastModified: string;
  completionPercentage: number;
}

export interface UserStats {
  userId: string;
  username: string;
  totalInterviews: number;
  completedInterviews: number;
  incompleteInterviews: number;
  completionRate: number;
  lastActivity: string;
  isBelowThreshold: boolean;
}

export interface ThresholdConfig {
  id: string;
  minInterviews: number;
  warningThreshold: number;
  createdAt: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalQuestionnaires: number;
  activeQuestionnaires: number;
  totalInterviews: number;
  completedInterviews: number;
  usersBelowThreshold: number;
  averageCompletionRate: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface CreateQuestionnaireData {
  title: string;
  description: string;
  questions: Omit<Question, 'id'>[];
  assignedTo: string[];
}
