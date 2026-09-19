'use client';

import React, { useEffect, useState } from 'react';

interface ToranGarlandProps {
  interactive?: boolean;
}

export const ToranGarland: React.FC<ToranGarlandProps> = ({ interactive = true }) => {
  const [swayOffset, setSwayOffset] = useState(0);

  useEffect(() => {
    if (!interactive) return;
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized X from center (-1 to 1)
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      setSwayOffset(normX * 4);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  return (
    <div 
      className="pointer-events-none fixed top-0 left-0 right-0 z-40 w-full overflow-hidden select-none"
      style={{
        transform: `rotate(${swayOffset * 0.15}deg) translateY(${Math.abs(swayOffset) * 0.5}px)`,
        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      id="toran-header-garland"
    >
      {/* Top golden auspicious band */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-md shadow-amber-900/50" />

      {/* SVG Toran Arch directly inspired by traditional Indian Genda Phool & Gulab Toran */}
      <div className="relative w-full">
        <svg 
          viewBox="0 0 1440 120" 
          className="w-full h-auto max-h-16 sm:max-h-24 md:max-h-28 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            {/* Radial gradients for textured Marigold Flowers */}
            <radialGradient id="marigoldYellow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <radialGradient id="marigoldOrange" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </radialGradient>

            <radialGradient id="gulabRed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="35%" stopColor="#ef4444" />
              <stop offset="75%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>

            <linearGradient id="mangoLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="40%" stopColor="#22c55e" />
              <stop offset="80%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            {/* Reusable Mango Leaf Cluster */}
            <g id="leafTrio">
              {/* Center Leaf */}
              <path d="M0,0 Q-4,18 0,32 Q4,18 0,0" fill="url(#mangoLeaf)" />
              {/* Left Leaf */}
              <path d="M-1,2 Q-14,14 -10,26 Q-3,18 -1,2" fill="url(#mangoLeaf)" opacity="0.95" />
              {/* Right Leaf */}
              <path d="M1,2 Q14,14 10,26 Q3,18 1,2" fill="url(#mangoLeaf)" opacity="0.95" />
            </g>

            {/* Reusable Scallop Arc */}
            <g id="marigoldScallop">
              {/* Thick curved marigold band */}
              <path
                d="M0,0 Q60,65 120,0"
                stroke="url(#marigoldOrange)"
                strokeWidth="22"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M0,0 Q60,65 120,0"
                stroke="url(#marigoldYellow)"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray="8,5"
                fill="none"
              />
              {/* Center Rose medallion */}
              <circle cx="60" cy="36" r="14" fill="url(#gulabRed)" />
              <circle cx="60" cy="36" r="9" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="60" cy="36" r="4" fill="#fbbf24" />
            </g>
          </defs>

          {/* Render 12 connected scallop arches across 1440 width */}
          {[...Array(12)].map((_, i) => {
            const x = i * 120;
            return (
              <g key={i} transform={`translate(${x}, 0)`}>
                <use href="#marigoldScallop" />
                {/* Mango leaves hanging at each joint between scallops */}
                <use href="#leafTrio" transform="translate(120, 0) scale(1.1)" />
                {/* Joint flower medallion */}
                <circle cx="120" cy="4" r="10" fill="url(#marigoldOrange)" />
                <circle cx="120" cy="4" r="6" fill="url(#gulabRed)" />
              </g>
            );
          })}
        </svg>

        {/* Left Side Hanging Garlands (Ladi/Tassels) */}
        <div 
          className="absolute top-0 left-3 md:left-8 flex gap-3 md:gap-5 animate-gentle-sway origin-top"
          style={{ animationDuration: '4.5s' }}
        >
          {/* Hanging string 1 (Long) */}
          <div className="flex flex-col items-center">
            {[...Array(9)].map((_, idx) => (
              <div 
                key={idx} 
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full shadow-sm ${
                  idx % 3 === 0 
                    ? 'bg-amber-500 ring-1 ring-amber-300' 
                    : idx % 3 === 1 
                      ? 'bg-yellow-400 ring-1 ring-yellow-200' 
                      : 'bg-red-600 ring-1 ring-red-400'
                }`}
                style={{ marginTop: '-4px' }}
              />
            ))}
            {/* Hanging mango leaf tassel at bottom */}
            <div className="mt-1 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-red-700 ring-1 ring-amber-400" />
              <svg width="24" height="28" viewBox="0 0 24 28" className="mt-[-2px]">
                <use href="#leafTrio" transform="translate(12, 0) scale(0.9)" />
              </svg>
            </div>
          </div>

          {/* Hanging string 2 (Shorter) */}
          <div className="hidden sm:flex flex-col items-center">
            {[...Array(6)].map((_, idx) => (
              <div 
                key={idx} 
                className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full shadow-sm ${
                  idx % 2 === 0 ? 'bg-yellow-400' : 'bg-red-600'
                }`}
                style={{ marginTop: '-3px' }}
              />
            ))}
            <div className="mt-0.5 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-amber-500" />
              <svg width="20" height="24" viewBox="0 0 20 24" className="mt-[-2px]">
                <use href="#leafTrio" transform="translate(10, 0) scale(0.75)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side Hanging Garlands (Ladi/Tassels) */}
        <div 
          className="absolute top-0 right-3 md:right-8 flex gap-3 md:gap-5 animate-gentle-sway origin-top"
          style={{ animationDuration: '5.2s', animationDelay: '0.8s' }}
        >
          {/* Hanging string 2 (Shorter) */}
          <div className="hidden sm:flex flex-col items-center">
            {[...Array(6)].map((_, idx) => (
              <div 
                key={idx} 
                className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full shadow-sm ${
                  idx % 2 === 0 ? 'bg-yellow-400' : 'bg-red-600'
                }`}
                style={{ marginTop: '-3px' }}
              />
            ))}
            <div className="mt-0.5 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-amber-500" />
              <svg width="20" height="24" viewBox="0 0 20 24" className="mt-[-2px]">
                <use href="#leafTrio" transform="translate(10, 0) scale(0.75)" />
              </svg>
            </div>
          </div>

          {/* Hanging string 1 (Long) */}
          <div className="flex flex-col items-center">
            {[...Array(9)].map((_, idx) => (
              <div 
                key={idx} 
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full shadow-sm ${
                  idx % 3 === 0 
                    ? 'bg-amber-500 ring-1 ring-amber-300' 
                    : idx % 3 === 1 
                      ? 'bg-yellow-400 ring-1 ring-yellow-200' 
                      : 'bg-red-600 ring-1 ring-red-400'
                }`}
                style={{ marginTop: '-4px' }}
              />
            ))}
            <div className="mt-1 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-red-700 ring-1 ring-amber-400" />
              <svg width="24" height="28" viewBox="0 0 24 28" className="mt-[-2px]">
                <use href="#leafTrio" transform="translate(12, 0) scale(0.9)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
