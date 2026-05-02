import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizQuestion, UserProfile, LessonContent, Quiz } from '../types';
import { aiService } from '../services/aiService';
import { THEMES } from '../lib/utils';
import { X, CheckCircle2, AlertCircle, Trophy, ArrowRight, Loader2 } from 'lucide-react';
import { Mascot } from './Mascot';

interface QuizModalProps {
  profile: UserProfile;
  lesson: LessonContent;
  onClose: () => void;
  onComplete: (quiz: Quiz) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ profile, lesson, onClose, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'excited'>('thinking');

  const theme = THEMES[profile.theme];

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const generated = await aiService.generateQuiz(lesson.simplifiedText, profile.grade);
        setQuestions(generated);
        setMascotMood('happy');
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [lesson, profile.grade]);

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const score = calculateScore(newAnswers);
      setShowResult(true);
      if (score >= 80) setMascotMood('excited');
    }
  };

  const calculateScore = (finalAnswers: number[]) => {
    let correct = 0;
    finalAnswers.forEach((ans, i) => {
      if (ans === questions[i].correctAnswer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const finishQuiz = () => {
    const score = calculateScore(answers);
    const completedQuiz: Quiz = {
      id: Date.now().toString(),
      title: lesson.title,
      questions,
      score,
      completedAt: Date.now()
    };
    onComplete(completedQuiz);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden ${theme.card} p-8`}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all">
          <X size={24} />
        </button>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-6">
            <Mascot mood="thinking" size={150} />
            <div className="flex items-center gap-3 text-xl font-bold">
              <Loader2 className="animate-spin" />
              <span>Je prépare tes questions...</span>
            </div>
          </div>
        ) : showResult ? (
          <div className="text-center space-y-8 py-8">
            <Mascot mood={mascotMood} size={150} />
            <div>
              <h2 className="text-4xl font-black mb-2">Quiz Terminé !</h2>
              <div className="text-6xl font-black text-amber-500 mb-4">{calculateScore(answers)}%</div>
              <p className="text-xl text-gray-500">
                {calculateScore(answers) >= 80 
                  ? "Incroyable ! Tu es un champion !" 
                  : "Pas mal ! Continue de t'entraîner !"}
              </p>
            </div>
            <button 
              onClick={finishQuiz}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl text-xl shadow-lg flex items-center justify-center gap-2"
            >
              Enregistrer mes progrès <ArrowRight />
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <span className="px-4 py-1 bg-amber-100 text-amber-700 rounded-full font-bold text-sm">
                Question {currentStep + 1} / {questions.length}
              </span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-amber-400" 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold leading-tight">{questions[currentStep].question}</h2>

            <div className="grid grid-cols-1 gap-4">
              {questions[currentStep].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="p-6 text-left border-2 border-gray-100 rounded-3xl hover:border-amber-400 hover:bg-amber-50 transition-all font-bold text-lg active:scale-[0.98]"
                >
                  <span className="inline-flex w-8 h-8 items-center justify-center bg-gray-100 rounded-full mr-4 text-sm">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <Mascot mood={mascotMood} size={100} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
