import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'speaking' | 'excited';
  size?: number;
}

export const Mascot: React.FC<MascotProps> = ({ mood = 'happy', size = 200 }) => {
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const blinkingAnimation = {
    scaleY: [1, 0.1, 1],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatDelay: 4,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div 
      animate={floatingAnimation}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center pointer-events-none"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        {/* Body */}
        <ellipse cx="100" cy="110" rx="60" ry="70" fill="#a16207" />
        <ellipse cx="100" cy="120" rx="45" ry="55" fill="#fef08a" opacity="0.3" />
        
        {/* Wings */}
        <motion.path 
          d="M40,110 Q10,100 20,150" 
          stroke="#a16207" strokeWidth="25" strokeLinecap="round" fill="none"
          animate={mood === 'speaking' ? { rotate: [0, -5, 0] } : {}}
        />
        <motion.path 
          d="M160,110 Q190,100 180,150" 
          stroke="#a16207" strokeWidth="25" strokeLinecap="round" fill="none"
          animate={mood === 'speaking' ? { rotate: [0, 5, 0] } : {}}
        />

        {/* Face */}
        <circle cx="75" cy="80" rx="30" ry="30" fill="white" />
        <circle cx="125" cy="80" rx="30" ry="30" fill="white" />
        
        {/* Pupils */}
        <motion.circle 
          cx="75" cy="80" r="10" fill="#422006" 
          animate={blinkingAnimation}
        />
        <motion.circle 
          cx="125" cy="80" r="10" fill="#422006" 
          animate={blinkingAnimation}
        />

        {/* Beak */}
        <motion.path 
          d="M90,95 L110,95 L100,115 Z" fill="#fbbf24"
          animate={mood === 'speaking' ? { scaleY: [1, 1.3, 1] } : {}}
        />

        {/* Ears/Tufts */}
        <path d="M50,55 L40,30 L70,50 Z" fill="#a16207" />
        <path d="M150,55 L160,30 L130,50 Z" fill="#a16207" />
      </svg>

      {/* Thinking Bubble */}
      {mood === 'thinking' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-10 -right-5 bg-white p-3 rounded-full shadow-lg border-2 border-amber-200"
        >
          <div className="flex gap-1">
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-amber-400 rounded-full" />
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-amber-400 rounded-full" />
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-amber-400 rounded-full" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
