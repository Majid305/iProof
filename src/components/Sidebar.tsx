import React from 'react';
import { UserProfile } from '../types';
import { THEMES } from '../lib/utils';
import { translations } from '../services/translations';
import { BookOpen, TrendingUp, Calendar, Settings, LogOut, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  profile: UserProfile;
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ profile, activeView, onViewChange, onLogout, onClose }) => {
  const theme = THEMES[profile.theme];
  const t = translations[profile.language || 'fr'];
  const isRtl = (profile.language || 'fr') === 'ar';

  const menuItems = [
    { id: 'lessons', label: t.navStudy, icon: BookOpen },
    { id: 'dashboard', label: t.navProgress, icon: TrendingUp },
    { id: 'planning', label: t.navAgenda, icon: Calendar },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <div className={`w-72 flex flex-col h-full border-r ${theme.sidebar || theme.card} ${theme.border || ''} transition-colors duration-500 z-20 relative`}>
      {onClose && (
        <button 
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-xl bg-black/5 lg:hidden`}
        >
          <X size={20} />
        </button>
      )}
      <div className="p-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-400 flex items-center justify-center text-white shadow-lg">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className={`font-black text-xl leading-none ${profile.theme === 'vibrant' ? 'text-sky-600' : theme.text}`}>{t.appName}</h1>
          <span className="text-[10px] uppercase tracking-widest font-black opacity-30">{t.slogan}</span>
        </div>
      </div>

      <div className="p-6">
        <div className={`p-4 rounded-3xl flex items-center gap-4 mb-8 bg-sky-50 border-2 border-sky-100 shadow-sm`}>
          <div className="w-12 h-12 bg-amber-300 rounded-full flex items-center justify-center text-3xl shadow-sm border-2 border-white">
            {profile.avatar}
          </div>
          <div>
            <h3 className={`font-black tracking-tight leading-none ${theme.text}`}>{profile.name}</h3>
            <span className="text-[10px] font-black uppercase opacity-50">{profile.grade}</span>
          </div>
        </div>

        <nav className="space-y-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 font-black text-xs tracking-widest uppercase transition-all ${
                activeView === item.id 
                  ? `${theme.button} text-white shadow-xl scale-105` 
                  : `text-slate-400 hover:bg-slate-50 hover:text-slate-600`
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="bg-slate-100 h-2 w-full rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-green-400 rounded-full shadow-inner animate-pulse" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase text-center">Apprenti Expert</p>
        
        <button 
          onClick={onLogout}
          className="w-full p-4 rounded-2xl flex items-center gap-3 font-black text-xs tracking-widest uppercase text-red-400 hover:bg-red-50 transition-all border-2 border-transparent hover:border-red-100"
        >
          <LogOut size={20} />
          <span>Quitter</span>
        </button>
      </div>
    </div>
  );
};
