'use client';

import React from 'react';

interface GlowingMandalaProps {
  size?: number;
  className?: string;
  opacity?: number;
}

export const GlowingMandala: React.FC<GlowingMandalaProps> = ({ 
  size = 560,
  className = "",
  opacity = 0.8
}) => {
  return (
    <div 
      className={`relative flex items-center justify-center pointer-events-none select-none max-w-[95vw] max-h-[95vw] ${className}`}
      style={{ width: size, height: size, opacity }}
      id="hero-glowing-mandala"
    >
      {/* Warm golden radial aura glow */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-orange-500/20 blur-3xl scale-110" 
      />
      <div 
        className="absolute inset-12 rounded-full bg-amber-400/20 blur-2xl" 
      />

      {/* Outer Counter-Rotating Sun Rays */}
      <svg
        viewBox="0 0 500 500"
        className="absolute w-full h-full animate-spin-reverse-slow opacity-80"
        fill="none"
      >
        <defs>
          <linearGradient id="mandalaGoldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* 24 Radiant Rays of Celebration */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <g key={i} transform={`rotate(${angle} 250 250)`}>
              <line
                x1="250"
                y1="18"
                x2="250"
                y2="75"
                stroke="url(#mandalaGoldOuter)"
                strokeWidth="1.8"
                strokeDasharray="3,2"
              />
              <circle cx="250" cy="14" r="3" fill="#fef08a" opacity="0.9" />
            </g>
          );
        })}

        {/* Outer Circular Boundaries */}
        <circle cx="250" cy="250" r="230" stroke="url(#mandalaGoldOuter)" strokeWidth="1.5" strokeDasharray="6,4" />
        <circle cx="250" cy="250" r="210" stroke="#f59e0b" strokeWidth="1.2" opacity="0.75" />
      </svg>

      {/* Main Clockwise Rotating Sacred Lotus Mandala */}
      <svg
        viewBox="0 0 500 500"
        className="absolute w-[88%] h-[88%] animate-spin-slow opacity-90 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        fill="none"
      >
        <defs>
          <linearGradient id="mandalaGoldInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
            <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* 16 Sacred Lotus Petals (Outer Tier) */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`p16-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250,70 C272,125 268,170 250,200 C232,170 228,125 250,70 Z"
                fill="none"
                stroke="url(#mandalaGoldInner)"
                strokeWidth="1.6"
              />
              <circle cx="250" cy="110" r="3.5" fill="#fef08a" opacity="0.85" />
            </g>
          );
        })}

        {/* 12 Medium Petals (Middle Tier) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12 + 15;
          return (
            <g key={`p12-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250,125 C266,160 262,190 250,212 C238,190 234,160 250,125 Z"
                fill="none"
                stroke="url(#mandalaGoldInner)"
                strokeWidth="1.4"
                opacity="0.9"
              />
            </g>
          );
        })}

        {/* Inner concentric fine rings & Sacred Center */}
        <circle cx="250" cy="250" r="145" stroke="url(#mandalaGoldInner)" strokeWidth="1.5" opacity="0.85" />
        <circle cx="250" cy="250" r="100" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.75" />
        <circle cx="250" cy="250" r="55" stroke="url(#mandalaGoldInner)" strokeWidth="1.5" opacity="0.9" />
        <circle cx="250" cy="250" r="12" fill="#fef08a" opacity="0.85" />
      </svg>
    </div>
  );
};
