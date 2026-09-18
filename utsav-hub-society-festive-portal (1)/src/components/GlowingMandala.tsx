import React from 'react';

interface GlowingMandalaProps {
  size?: number;
  className?: string;
  opacity?: number;
}

export const GlowingMandala: React.FC<GlowingMandalaProps> = ({ 
  size = 540,
  className = "",
  opacity = 1
}) => {
  return (
    <div 
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, opacity }}
      id="hero-glowing-mandala"
    >
      {/* Soft, delicate ambient warm halo - reduced brightness so text is crystal clear */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/8 via-yellow-400/10 to-orange-500/8 blur-3xl scale-105" 
      />
      <div 
        className="absolute inset-16 rounded-full bg-amber-400/6 blur-2xl" 
      />

      {/* Outer Counter-Rotating Delicate Sun Rays - reduced to 16 subtle rays with very light opacity */}
      <svg
        viewBox="0 0 500 500"
        className="absolute w-full h-full animate-spin-reverse-slow opacity-25"
        fill="none"
      >
        <defs>
          <linearGradient id="mandalaGoldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* 16 Delicate Rays of Celebration */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={i} transform={`rotate(${angle} 250 250)`}>
              <line
                x1="250"
                y1="30"
                x2="250"
                y2="75"
                stroke="url(#mandalaGoldOuter)"
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
              <circle cx="250" cy="26" r="2" fill="#fef08a" opacity="0.7" />
            </g>
          );
        })}

        {/* Outer Fine Circular Boundary */}
        <circle cx="250" cy="250" r="215" stroke="url(#mandalaGoldOuter)" strokeWidth="1.2" strokeDasharray="4,4" />
        <circle cx="250" cy="250" r="195" stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" />
      </svg>

      {/* Main Clockwise Rotating Sacred Lotus Mandala - delicate fine lines and soft opacity */}
      <svg
        viewBox="0 0 500 500"
        className="absolute w-[86%] h-[86%] animate-spin-slow opacity-30 drop-shadow-[0_0_10px_rgba(245,158,11,0.25)]"
        fill="none"
      >
        <defs>
          <linearGradient id="mandalaGoldInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* 12 Delicate Petals (Outer Tier) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <g key={`p12-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250,85 C270,135 266,175 250,205 C234,175 230,135 250,85 Z"
                fill="none"
                stroke="url(#mandalaGoldInner)"
                strokeWidth="1.2"
              />
              <circle cx="250" cy="120" r="2.5" fill="#fef08a" opacity="0.6" />
            </g>
          );
        })}

        {/* 8 Medium Petals (Middle Tier) */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8 + 22.5;
          return (
            <g key={`p8-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250,140 C264,170 260,195 250,215 C240,195 236,170 250,140 Z"
                fill="none"
                stroke="url(#mandalaGoldInner)"
                strokeWidth="1"
                opacity="0.8"
              />
            </g>
          );
        })}

        {/* Inner concentric fine rings */}
        <circle cx="250" cy="250" r="140" stroke="url(#mandalaGoldInner)" strokeWidth="1" opacity="0.6" />
        <circle cx="250" cy="250" r="90" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
        <circle cx="250" cy="250" r="45" stroke="url(#mandalaGoldInner)" strokeWidth="1" opacity="0.7" />
        <circle cx="250" cy="250" r="8" fill="#fef08a" opacity="0.6" />
      </svg>
    </div>
  );
};
