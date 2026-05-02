import React, { useState } from 'react';
import { UserProfile, GradeLevel, ThemeType, Language } from '../types';
import { Mascot } from './Mascot';
import { storageService } from '../services/storageService';
import { THEMES } from '../lib/utils';
import { translations } from '../services/translations';
import { motion } from 'motion/react';

const GRADES: GradeLevel[] = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6eme', '5eme', '4eme', '3eme'];
const AVATARS = ['🦉', '🦊', '🐻', '🦁', '🐨', '🐼'];
const THEME_OPTIONS: { id: ThemeType; label: string; icon: string }[] = [
  { id: 'vibrant', label: '🎨', icon: '' },
  { id: 'forest', label: '🌳', icon: '' },
  { id: 'space', label: '🌌', icon: '' },
  { id: 'ocean', label: '🌊', icon: '' }
];

export const ProfileSetup: React.FC<{ onComplete: (profile: UserProfile) => void }> = ({ onComplete }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    grade: 'CP',
    avatar: '🦉',
    theme: 'vibrant',
    language: 'fr'
  });

  const theme = THEMES[profile.theme];
  const t = translations[profile.language || 'fr'];
  const isRtl = (profile.language || 'fr') === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name.trim()) {
      storageService.saveProfile(profile);
      onComplete(profile);
    }
  };

  return (
    <div className={`h-screen w-screen flex items-center justify-center p-4 transition-colors duration-500 ${theme.bg}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${theme.card}`}
      >
        <div className="flex flex-col items-center mb-8">
          <Mascot mood="happy" size={120} />
          <h1 className={`text-3xl font-bold mt-4 ${theme.text}`}>{t.welcome}</h1>
          <p className="text-gray-500 text-center mt-2">{t.ready}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 justify-center mb-6">
            <button 
              type="button"
              onClick={() => setProfile({...profile, language: 'fr'})}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${profile.language === 'fr' ? 'bg-sky-500 text-white' : 'bg-gray-100'}`}
            >
              Français
            </button>
            <button 
              type="button"
              onClick={() => setProfile({...profile, language: 'ar'})}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${profile.language === 'ar' ? 'bg-sky-500 text-white' : 'bg-gray-100'}`}
            >
              العربية
            </button>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>{t.nameLabel}</label>
            <input 
              type="text"
              required
              className={`w-full p-4 rounded-xl border-2 focus:ring-4 transition-all outline-none ${profile.theme === 'space' ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-100'}`}
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              placeholder="Ex: Léo / ليو"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>{t.gradeLabel}</label>
              <select 
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-100 outline-none"
                value={profile.grade}
                onChange={e => setProfile({ ...profile, grade: e.target.value as GradeLevel })}
              >
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>{t.avatarLabel}</label>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setProfile({ ...profile, avatar: a })}
                    className={`p-2 rounded-xl text-2xl transition-all ${profile.avatar === a ? 'bg-amber-100 scale-110' : 'hover:bg-gray-100'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
             <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>{t.themeLabel}</label>
             <div className="grid grid-cols-4 gap-2">
                {THEME_OPTIONS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, theme: t.id })}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${profile.theme === t.id ? 'border-amber-400 bg-amber-50' : 'border-gray-100'}`}
                  >
                    <span className="text-xl">{t.label}</span>
                  </button>
                ))}
             </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl shadow-lg transform active:scale-95 transition-all text-xl`}
          >
            {t.startButton}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
