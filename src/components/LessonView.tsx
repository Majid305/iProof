import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mascot } from './Mascot';
import { Layout, BookOpen, GraduationCap, Calendar, Settings, LogOut, Upload, Loader2, Sparkles, Volume2, VolumeX, Lightbulb, CheckCircle2 } from 'lucide-react';
import { UserProfile, LessonContent, Quiz } from '../types';
import { THEMES } from '../lib/utils';
import { pdfService } from '../services/pdfService';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { QuizModal } from './QuizModal';

import { translations } from '../services/translations';

interface LessonViewProps {
  profile: UserProfile;
  lessons: LessonContent[];
  onNewLesson: (lesson: LessonContent) => void;
  onQuizComplete: (quiz: Quiz) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ profile, lessons, onNewLesson, onQuizComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(lessons[0] || null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'speaking' | 'excited'>('happy');
  const [showQuiz, setShowQuiz] = useState(false);

  const theme = THEMES[profile.theme];
  const t = translations[profile.language || 'fr'];
  const isRtl = (profile.language || 'fr') === 'ar';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMascotMood('thinking');

    try {
      const text = await pdfService.extractText(file);
      const simplified = await aiService.simplifyContent(text, profile.grade);
      
      const newLesson: LessonContent = {
        id: Date.now().toString(),
        title: simplified.title || (isRtl ? 'درس جديد' : 'Nouveau cours'),
        originalText: text,
        simplifiedText: simplified.simplifiedText || '',
        keywords: simplified.keywords || [],
        summary: simplified.summary || '',
        gradeLevel: profile.grade,
        timestamp: Date.now()
      };

      onNewLesson(newLesson);
      setSelectedLesson(newLesson);
      setMascotMood('excited');
      setTimeout(() => setMascotMood('happy'), 3000);
    } catch (err) {
      console.error(err);
      setMascotMood('happy');
      alert(isRtl ? "عذراً، حدث خطأ أثناء معالجة الملف." : "Désolé, une erreur est survenue lors de l'analyse du document.");
    } finally {
      setIsUploading(false);
      // Reset input value to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  const handleSpeak = () => {
    if (!selectedLesson) return;
    
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      setMascotMood('happy');
    } else {
      setIsSpeaking(true);
      setMascotMood('speaking');
      const utterance = speechService.speak(selectedLesson.simplifiedText);
      utterance.onend = () => {
        setIsSpeaking(false);
        setMascotMood('happy');
      };
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header section with Upload */}
      <div className={`p-6 flex items-center justify-between border-b ${theme.card} ${theme.header || ''} shadow-sm ${theme.border || ''}`}>
        <div className="flex items-center gap-3">
          <Sparkles className={theme.accent} size={28} />
          <h2 className={`text-2xl ${theme.title || 'font-bold ' + theme.text}`}>{t.myCourses}</h2>
        </div>

        <div className="flex gap-4">
          <label className={`flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer transition-all active:scale-95 text-white font-bold shadow-md ${theme.button}`}>
            {isUploading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Upload size={20} />
            )}
            <span>{t.addCourse}</span>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Course content / Mascot Dialogue (Left in design) */}
        <div className={`w-full lg:w-[450px] p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto border-b lg:border-b-0 lg:border-r ${profile.theme === 'vibrant' ? 'bg-white' : ''}`}>
           <div className={`bg-white rounded-[40px] p-6 lg:p-8 flex flex-col items-center justify-center border-4 border-white shadow-xl ${profile.theme === 'vibrant' ? 'flex-1' : ''}`}>
              <div className={isRtl ? 'scale-x-[-1]' : ''}>
                <Mascot mood={mascotMood} size={200} />
              </div>
              <div className={`mt-8 bg-sky-50 p-6 rounded-3xl rounded-tl-none border-2 border-sky-100 w-full relative`}>
                <p className={`text-lg font-medium leading-relaxed italic ${theme.text}`}>
                   {isUploading 
                   ? (isRtl ? '"أنا أقرأ درسك، لحظة واحدة..."' : '"Je lis ton cours, un instant..."') 
                   : mascotMood === 'excited' 
                     ? (isRtl ? '"رائع! درسك جاهز، هل نبدأ معا؟"' : '"Génial ! Ton cours est prêt, on l’étudie ensemble ?"')
                     : (isRtl ? `"مرحباً ${profile.name}! هل أنت مستعد لدرسنا؟"` : `"Coucou ${profile.name} ! Prêt pour notre séance d'étude ?"`)}
                </p>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={handleSpeak}
                    className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-sky-600 transition-colors"
                  >
                    <Volume2 size={16} /> {isRtl ? 'استماع' : 'ÉCOUTER'}
                  </button>
                  <button className="flex items-center gap-2 bg-white text-sky-500 border-2 border-sky-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-50 transition-colors">
                    {isRtl ? 'أبطأ' : 'PLUS LENT'}
                  </button>
                </div>
              </div>
           </div>

           {/* UPLOAD PANEL EXTRA (Design version) */}
           <div className="bg-emerald-400 p-6 rounded-[32px] shadow-lg flex items-center justify-between text-white">
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight">{isRtl ? 'اختبر معلوماتك!' : 'Vite un quiz !'}</h3>
                <p className="text-xs opacity-80">{isRtl ? 'هل أنت مستعد لهذه التجربة؟' : 'Prêt à tester tes connaissances ?'}</p>
              </div>
              <button 
                onClick={() => setShowQuiz(true)}
                disabled={!selectedLesson}
                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/50 hover:bg-white/30 transition-all disabled:opacity-30"
              >
                <Sparkles size={28} />
              </button>
           </div>
        </div>

        {/* Whiteboard content (Right in design) */}
        <div className={`flex-1 overflow-y-auto p-4 lg:p-12 bg-black/5 flex flex-col`}>
          {selectedLesson ? (
            <motion.div 
               key={selectedLesson.id}
               initial={{ opacity: 0, scale: 0.98 }} 
               animate={{ opacity: 1, scale: 1 }}
               className={`flex-1 overflow-visible max-w-4xl w-full mx-auto p-6 lg:p-12 rounded-[40px] shadow-2xl relative ${theme.card} ${theme.whiteboard || 'border-8 border-amber-100'}`}
            >
               <div className="absolute top-6 right-8 flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>

               <header className="mb-10">
                 <h2 className={`text-4xl font-black underline decoration-amber-300 decoration-8 underline-offset-4 uppercase tracking-tighter ${theme.text}`}>{t.whiteboard}</h2>
                 <p className="text-xs font-black text-slate-400 mt-4 tracking-widest uppercase">{isRtl ? 'الدرس' : 'LEÇON'} : {selectedLesson.title}</p>
               </header>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {selectedLesson.keywords.slice(0, 2).map((kw, i) => (
                    <div key={i} className={`p-6 rounded-3xl border-2 ${i % 2 === 0 ? 'bg-yellow-50 border-yellow-100 rotate-1' : 'bg-sky-50 border-sky-100 -rotate-1'}`}>
                      <span className={`text-[10px] font-black tracking-widest uppercase mb-1 block ${i % 2 === 0 ? 'text-yellow-600' : 'text-sky-600'}`}>{t.keywords}</span>
                      <h4 className={`text-2xl font-black uppercase ${i % 2 === 0 ? 'text-yellow-700' : 'text-sky-700'}`}>{kw}</h4>
                    </div>
                  ))}
               </div>

               <div className={`prose prose-xl max-w-none ${theme.text} leading-relaxed text-slate-700 mb-12 font-medium bg-slate-50/50 p-8 rounded-3xl border-2 border-dashed border-slate-200`}>
                 {selectedLesson.simplifiedText.split('\n').map((para, i) => (
                   <p key={i} className="mb-6">{para}</p>
                 ))}
               </div>

               <div className="mt-auto p-6 bg-purple-50 rounded-3xl border-2 border-purple-100 flex items-center gap-6">
                 <div className="bg-purple-500 text-white p-4 rounded-2xl font-black text-3xl shadow-lg">?</div>
                 <div className="flex-1">
                   <p className="text-xs font-black text-purple-600 uppercase tracking-widest">{isRtl ? 'اختبار صغير' : 'Mini Quiz prêt !'}</p>
                   <p className="text-lg font-bold text-slate-700">{isRtl ? 'هل نتحقق مما تعلمته؟' : 'On vérifie si tu as tout compris ?'}</p>
                 </div>
                 <button 
                  onClick={() => setShowQuiz(true)}
                  className="bg-purple-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-md hover:scale-105 transition-transform"
                 >
                   {t.startQuiz}
                 </button>
               </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <BookOpen size={80} className="mb-4 text-sky-400" />
              <h2 className="text-3xl font-black text-slate-700 uppercase">{t.appName}</h2>
              <p className="mt-2 text-slate-500">{t.noCourseSub}</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showQuiz && selectedLesson && (
          <QuizModal 
            profile={profile}
            lesson={selectedLesson}
            onClose={() => setShowQuiz(false)}
            onComplete={(quiz) => {
              onQuizComplete(quiz);
              setShowQuiz(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
