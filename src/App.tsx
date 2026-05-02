/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, UserStats, LessonContent, Quiz, ViewMode } from './types';
import { ProfileSetup } from './components/ProfileSetup';
import { Sidebar } from './components/Sidebar';
import { LessonView } from './components/LessonView';
import { Dashboard } from './components/Dashboard';
import { storageService } from './services/storageService';
import { THEMES } from './lib/utils';
import { translations } from './services/translations';
import { AnimatePresence, motion } from 'motion/react';
import { Smartphone, Monitor, SmartphoneNfc, Menu, X } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState('lessons');
  const [viewMode, setViewMode] = useState<ViewMode>('pc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProfile = storageService.getProfile();
    if (savedProfile && !savedProfile.language) {
      savedProfile.language = 'fr';
      storageService.saveProfile(savedProfile);
    }
    const savedLessons = storageService.getLessons();
    const savedQuizzes = storageService.getQuizzes();
    const savedStats = storageService.getStats();

    setProfile(savedProfile);
    setLessons(savedLessons);
    setQuizzes(savedQuizzes);
    setStats(savedStats);
    setIsLoaded(true);
  }, []);

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setActiveView('lessons');
  };

  const handleNewLesson = (lesson: LessonContent) => {
    setLessons(prev => [lesson, ...prev]);
    storageService.saveLesson(lesson);
  };

  const handleQuizComplete = (quiz: Quiz) => {
    const newQuizzes = [quiz, ...quizzes];
    setQuizzes(newQuizzes);
    storageService.saveQuiz(quiz);

    const updatedStats: UserStats = {
      sessionsCount: stats?.sessionsCount || 0,
      quizzesCompleted: newQuizzes.length,
      totalTimeSpent: (stats?.totalTimeSpent || 0) + 5,
      averageScore: Math.round(newQuizzes.reduce((acc, q) => acc + (q.score || 0), 0) / newQuizzes.length)
    };
    setStats(updatedStats);
    storageService.saveStats(updatedStats);
  };

  const handleLogout = () => {
    if (confirm("Garde tes progrès pour la prochaine fois ! Veux-tu vraiment quitter ?")) {
      setProfile(null);
    }
  };

  if (!isLoaded) return <div className="h-screen w-screen flex items-center justify-center">Chargement...</div>;

  if (!profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  const theme = THEMES[profile.theme];
  const t = translations[profile.language || 'fr'];
  const isRtl = (profile.language || 'fr') === 'ar';

  const isMobile = viewMode === 'mobile-p' || viewMode === 'mobile-l';

  const viewStyles: Record<ViewMode, string> = {
    'pc': 'w-full h-full',
    'mobile-p': 'w-[375px] h-[667px] shadow-2xl rounded-[40px] border-[12px] border-slate-800',
    'mobile-l': 'w-[667px] h-[375px] shadow-2xl rounded-[40px] border-[12px] border-slate-800'
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`h-screen w-screen flex transition-colors duration-500 font-sans ${theme.bg} items-center justify-center bg-slate-200`}>
      <div className={`flex bg-white transition-all duration-500 overflow-hidden relative ${viewStyles[viewMode]}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/50 z-30"
          />
        )}

        <div className={`
          ${isMobile ? 'absolute inset-y-0 z-40 transition-transform duration-300 transform' : 'relative'}
          ${isMobile && !isSidebarOpen ? (isRtl ? 'translate-x-full' : '-translate-x-full') : 'translate-x-0'}
          ${isMobile ? (isRtl ? 'right-0' : 'left-0') : ''}
          h-full
        `}>
          <Sidebar 
            profile={profile} 
            activeView={activeView} 
            onViewChange={handleViewChange} 
            onLogout={handleLogout} 
            onClose={isMobile ? () => setIsSidebarOpen(false) : undefined}
          />
        </div>
        
        <main className="flex-1 flex flex-col relative overflow-hidden h-full">
          {/* Header with Menu Button for Mobile/Smaller views */}
          <div className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} z-20 pointer-events-none`}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-3 rounded-2xl bg-white shadow-xl pointer-events-auto transition-all hover:scale-110 active:scale-95 ${(!isSidebarOpen || isMobile) ? 'flex' : 'hidden'}`}
            >
              <Menu size={24} className={theme.accent} />
            </button>
          </div>

          <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${theme.gradient} pointer-events-none`} />
          
          <AnimatePresence mode="wait">
            {activeView === 'lessons' && (
              <motion.div 
                key="lessons"
                initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                className="flex-1 flex flex-col"
              >
                <LessonView 
                  profile={profile} 
                  lessons={lessons} 
                  onNewLesson={handleNewLesson} 
                  onQuizComplete={handleQuizComplete}
                />
              </motion.div>
            )}

            {activeView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                className="flex-1 overflow-auto"
              >
                <Dashboard 
                  profile={profile} 
                  stats={stats || { sessionsCount: 0, quizzesCompleted: 0, totalTimeSpent: 0, averageScore: 0 }} 
                  lessons={lessons} 
                  quizzes={quizzes} 
                />
              </motion.div>
            )}

            {activeView === 'planning' && (
               <div className="flex-1 flex flex-col items-center justify-center opacity-50 scale-75 p-12 text-center">
                  <LessonView profile={profile} lessons={[]} onNewLesson={() => {}} onQuizComplete={() => {}} />
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                     <h2 className="text-3xl font-bold">{isRtl ? 'قريباً!' : 'Bientôt !'}</h2>
                     <p className="mt-2">{isRtl ? 'خطط لجلساتك الدراسية المقبلة.' : 'Prépare tes sessions d\'étude préférées prochainement.'}</p>
                  </div>
               </div>
            )}

            {activeView === 'settings' && (
              <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className={`p-10 rounded-[40px] shadow-xl ${theme.card} max-w-lg w-full text-center space-y-10 border-2`}>
                   <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                     ⚙️
                   </div>
                   <h2 className="text-3xl font-black">{t.navSettings}</h2>
                   
                   <div className="space-y-6">
                      <div className="text-left" dir={isRtl ? 'rtl' : 'ltr'}>
                        <label className="block text-sm font-black uppercase text-slate-400 mb-3 tracking-widest">{t.langLabel}</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => {
                              const newProfile = { ...profile, language: 'fr' as const };
                              setProfile(newProfile);
                              storageService.saveProfile(newProfile);
                            }}
                            className={`p-4 rounded-2xl font-bold transition-all border-2 ${profile.language === 'fr' ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-slate-100'}`}
                          >
                            Français
                          </button>
                          <button 
                            onClick={() => {
                              const newProfile = { ...profile, language: 'ar' as const };
                              setProfile(newProfile);
                              storageService.saveProfile(newProfile);
                            }}
                            className={`p-4 rounded-2xl font-bold transition-all border-2 ${profile.language === 'ar' ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-slate-100'}`}
                          >
                            العربية
                          </button>
                        </div>
                      </div>

                      <div className="text-left" dir={isRtl ? 'rtl' : 'ltr'}>
                        <label className="block text-sm font-black uppercase text-slate-400 mb-3 tracking-widest">{t.viewModeLabel}</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button 
                            onClick={() => setViewMode('pc')}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${viewMode === 'pc' ? 'border-sky-500 bg-sky-50' : 'border-slate-100'}`}
                          >
                            <Monitor size={20} /> <span className="text-[10px] font-bold uppercase">{t.pcView}</span>
                          </button>
                          <button 
                             onClick={() => setViewMode('mobile-p')}
                             className={`p-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${viewMode === 'mobile-p' ? 'border-sky-500 bg-sky-50' : 'border-slate-100'}`}
                          >
                            <Smartphone size={20} /> <span className="text-[10px] font-bold uppercase">{t.mobilePortrait}</span>
                          </button>
                          <button 
                             onClick={() => setViewMode('mobile-l')}
                             className={`p-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${viewMode === 'mobile-l' ? 'border-sky-500 bg-sky-50' : 'border-slate-100'}`}
                          >
                            <SmartphoneNfc size={20} /> <span className="text-[10px] font-bold uppercase">{t.mobileLandscape}</span>
                          </button>
                        </div>
                      </div>
                   </div>

                   <button 
                    onClick={() => setProfile(null)}
                    className="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest"
                   >
                     Reset Profile
                   </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
