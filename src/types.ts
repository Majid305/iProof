/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GradeLevel = 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2' | '6eme' | '5eme' | '4eme' | '3eme';

export type ThemeType = 'space' | 'forest' | 'ocean' | 'vibrant';

export type Language = 'fr' | 'ar';

export type ViewMode = 'pc' | 'mobile-p' | 'mobile-l';

export interface UserProfile {
  name: string;
  grade: GradeLevel;
  avatar: string;
  theme: ThemeType;
  language: Language;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  score?: number;
  completedAt?: number;
}

export interface LessonContent {
  id: string;
  title: string;
  originalText: string;
  simplifiedText: string;
  keywords: string[];
  summary: string;
  gradeLevel: GradeLevel;
  timestamp: number;
}

export interface UserStats {
  sessionsCount: number;
  quizzesCompleted: number;
  totalTimeSpent: number; // in minutes
  averageScore: number;
}
