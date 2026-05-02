import React from 'react';
import { UserStats, Quiz, LessonContent, UserProfile } from '../types';
import { THEMES } from '../lib/utils';
import { translations } from '../services/translations';
import { TrendingUp, Award, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  profile: UserProfile;
  stats: UserStats;
  lessons: LessonContent[];
  quizzes: Quiz[];
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, stats, lessons, quizzes }) => {
  const theme = THEMES[profile.theme];
  const t = translations[profile.language || 'fr'];

  const statCards = [
    { label: t.statLessons, value: lessons.length, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: t.statQuizzes, value: quizzes.length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: t.statTime, value: stats.totalTimeSpent, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: t.statScore, value: `${stats.averageScore}%`, icon: Award, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className={`text-4xl font-black mb-2 ${theme.text}`}>{t.statsTitle}</h1>
          <p className="text-gray-500 text-xl">{t.statsSub}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 ${theme.card}`}
            >
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
                <p className="text-gray-500 text-sm font-semibold">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Lessons */}
          <section className={`p-8 rounded-[40px] shadow-sm border border-gray-100 ${theme.card}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="text-blue-500" /> Derniers cours
            </h2>
            <div className="space-y-4">
              {lessons.slice(0, 5).map(lesson => (
                <div key={lesson.id} className="p-4 rounded-2xl bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{lesson.title}</h4>
                    <p className="text-xs text-gray-400">{new Date(lesson.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-bold border">
                    {lesson.gradeLevel}
                  </span>
                </div>
              ))}
              {lessons.length === 0 && <p className="text-gray-400 italic">Aucun cours pour le moment.</p>}
            </div>
          </section>

          {/* Recent Quizzes */}
          <section className={`p-8 rounded-[40px] shadow-sm border border-gray-100 ${theme.card}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="text-amber-500" /> Mes Badges
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-amber-200">
                  📚
                </div>
                <span className="text-xs font-bold text-center">Grand Lecteur</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-emerald-200">
                  🎯
                </div>
                <span className="text-xs font-bold text-center">Sans-faute</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-indigo-200">
                  ⚡
                </div>
                <span className="text-xs font-bold text-center">Flash Quiz</span>
              </div>
            </div>
            <div className="mt-8 bg-blue-50 p-4 rounded-2xl">
              <p className="text-blue-700 text-sm font-medium">Continue tes quiz pour débloquer de nouveaux badges !</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
