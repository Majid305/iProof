import { UserProfile, UserStats, LessonContent, Quiz } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'mon-prof-ia-profile',
  STATS: 'mon-prof-ia-stats',
  LESSONS: 'mon-prof-ia-lessons',
  QUIZZES: 'mon-prof-ia-quizzes'
};

export const storageService = {
  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getStats: (): UserStats => {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : { sessionsCount: 0, quizzesCompleted: 0, totalTimeSpent: 0, averageScore: 0 };
  },
  saveStats: (stats: UserStats) => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  getLessons: (): LessonContent[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
    return data ? JSON.parse(data) : [];
  },
  saveLesson: (lesson: LessonContent) => {
    try {
      const lessons = storageService.getLessons();
      // On ne stocke pas le texte original (très lourd) dans le localStorage
      // On en a besoin pour l'IA au début mais pas pour l'affichage permanent
      const storedLesson = { ...lesson, originalText: '' }; 
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify([storedLesson, ...lessons]));
    } catch (error) {
      console.error("Storage Error (Lessons):", error);
      // Si le quota est dépassé, on essaie de supprimer les plus anciens
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const lessons = storageService.getLessons();
        if (lessons.length > 5) {
          localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify([lesson, ...lessons.slice(0, 5)]));
        }
      }
    }
  },

  getQuizzes: (): Quiz[] => {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return data ? JSON.parse(data) : [];
  },
  saveQuiz: (quiz: Quiz) => {
    const quizzes = storageService.getQuizzes();
    const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
    if (existingIndex >= 0) {
      quizzes[existingIndex] = quiz;
    } else {
      quizzes.unshift(quiz);
    }
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  }
};
