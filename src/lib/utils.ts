import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const THEMES = {
  space: {
    bg: 'bg-slate-900',
    header: 'bg-slate-800/80',
    card: 'bg-slate-800',
    text: 'text-slate-100',
    accent: 'text-indigo-400',
    button: 'bg-indigo-600 hover:bg-indigo-500',
    border: 'border-slate-700',
    gradient: 'from-slate-900 via-indigo-950 to-slate-900'
  },
  forest: {
    bg: 'bg-emerald-50',
    header: 'bg-emerald-100/80',
    card: 'bg-white',
    text: 'text-emerald-900',
    accent: 'text-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-500',
    border: 'border-emerald-100',
    gradient: 'from-emerald-50 via-teal-50 to-emerald-50'
  },
  ocean: {
    bg: 'bg-sky-50',
    header: 'bg-sky-100/80',
    card: 'bg-white',
    text: 'text-sky-900',
    accent: 'text-sky-600',
    button: 'bg-sky-600 hover:bg-sky-500',
    border: 'border-sky-100',
    gradient: 'from-sky-50 via-blue-50 to-sky-50'
  },
  vibrant: {
    bg: 'bg-[#F0F9FF]',
    header: 'bg-white/80 backdrop-blur-md',
    card: 'bg-white',
    text: 'text-slate-800',
    accent: 'text-sky-600',
    button: 'bg-sky-500 hover:bg-sky-600',
    border: 'border-slate-200 border-b-4',
    gradient: 'from-sky-100 via-white to-orange-50',
    sidebar: 'bg-white border-sky-100 border-r-4',
    whiteboard: 'border-amber-100 border-8',
    title: 'text-sky-600 font-black tracking-tight'
  }
};
