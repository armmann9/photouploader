import React, { useState } from 'react';
import { Flame, Sparkles, Volume2, Check } from 'lucide-react';
import { playTempleBell, playSitarPluck } from '../utils/audio';
import { triggerPhoolBarsao } from '../utils/confetti';

interface InteractiveDiyaLightingProps {
  onLitChange?: (isLit: boolean) => void;
}

export const InteractiveDiyaLighting: React.FC<InteractiveDiyaLightingProps> = ({ onLitChange }) => {
  const [isLit, setIsLit] = useState<boolean>(true);
  const [blessingMessage, setBlessingMessage] = useState<string>('तमसो मा ज्योतिर्गमय • May the light of festivals bring peace & prosperity');

  const handleToggleDiya = () => {
    const nextState = !isLit;
    setIsLit(nextState);
    onLitChange?.(nextState);

    if (nextState) {
      playTempleBell(960);
      triggerPhoolBarsao();
      setBlessingMessage('✨ शुभ दीपावली / उत्सव की हार्दिक शुभकामनाएं! Diya is lit!');
    } else {
      playSitarPluck('Sa');
      setBlessingMessage('Tap to light the sacred society diya again');
    }
  };

  return (
    <div 
      className="relative rounded-2xl bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-emerald-950/90 border border-amber-400/30 p-4 sm:p-5 shadow-xl backdrop-blur-sm max-w-xl mx-auto my-6"
      id="interactive-diya-container"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        {/* Interactive Clickable Brass Diya */}
        <button
          id="toggle-sacred-diya-btn"
          onClick={handleToggleDiya}
          title={isLit ? 'Tap to extinguish' : 'Tap to light the diya (दीप प्रज्वलन)'}
          className="group relative p-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-amber-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          {/* Flame Halo when lit */}
          {isLit && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-14 bg-amber-400/20 rounded-full blur-md animate-pulse" />
          )}

          <svg viewBox="0 0 80 60" className="w-16 h-12">
            <defs>
              <linearGradient id="brassDiyaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              <radialGradient id="sacredFlameGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </radialGradient>
            </defs>

            {/* Diya Base Pedestal */}
            <path d="M25,52 L55,52 L50,56 L30,56 Z" fill="#78350f" />
            <rect x="32" y="49" width="16" height="3" fill="#fbbf24" rx="1" />

            {/* Traditional Terracotta/Brass Diya Bowl */}
            <path 
              d="M15,36 Q40,54 65,36 Q70,30 65,30 Q40,32 15,30 Q10,30 15,36 Z" 
              fill="url(#brassDiyaGrad)" 
              stroke="#92400e" 
              strokeWidth="1.5"
            />
            {/* Diya rim oil pool */}
            <ellipse cx="40" cy="32" rx="22" ry="4" fill="#92400e" opacity="0.8" />
            <ellipse cx="40" cy="32" rx="18" ry="2.5" fill="#f59e0b" opacity="0.6" />

            {/* Cotton Wick (Baati) */}
            <line x1="40" y1="33" x2="40" y2="24" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />

            {/* Flame (renders when isLit is true) */}
            {isLit ? (
              <g className="animate-flame origin-bottom">
                {/* Outer flame */}
                <path d="M40,26 Q32,16 40,2 Q48,16 40,26 Z" fill="url(#sacredFlameGrad)" />
                {/* Inner white-hot core */}
                <path d="M40,25 Q36,18 40,8 Q44,18 40,25 Z" fill="#ffffff" opacity="0.9" />
              </g>
            ) : (
              <circle cx="40" cy="24" r="2" fill="#78350f" />
            )}
          </svg>

          <span className="text-[10px] font-bold text-amber-300 block mt-1">
            {isLit ? 'दीप प्रज्वलित ✓' : 'दीप जलाएं (Light)'}
          </span>
        </button>

        {/* Text and blessing */}
        <div className="flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              शुभ दीप प्रज्वलन (Colony Auspicious Diya)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Interactive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 font-serif italic mb-2">
            "{blessingMessage}"
          </p>
          <span className="text-[11px] text-emerald-300/80 block">
            Click the diya anytime to ring the temple bell & shower flowers for good fortune.
          </span>
        </div>
      </div>
    </div>
  );
};
