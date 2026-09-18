import React from 'react';

interface FestiveFairyLightsProps {
  enabled?: boolean;
}

export const FestiveFairyLights: React.FC<FestiveFairyLightsProps> = ({ enabled = true }) => {
  if (!enabled) return null;

  // 18 delicate warm fairy bulbs across the width
  const bulbCount = 18;

  return (
    <div 
      className="pointer-events-none fixed top-10 md:top-12 left-0 right-0 z-35 w-full flex justify-between px-4 sm:px-8 select-none"
      id="festive-fairy-lights"
    >
      {[...Array(bulbCount)].map((_, i) => {
        // Vary drop length slightly for an organic draped look
        const dropHeight = 12 + Math.sin(i * 0.8) * 8;
        const delay = (i * 0.25) % 2.5;
        const colorVariant = i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#fbbf24' : '#f59e0b';

        return (
          <div 
            key={i} 
            className="flex flex-col items-center"
            style={{
              height: `${dropHeight + 20}px`,
            }}
          >
            {/* Fine copper wire */}
            <div 
              className="w-px bg-amber-600/60"
              style={{ height: `${dropHeight}px` }}
            />
            {/* Tiny golden bulb cap */}
            <div className="w-1.5 h-1 bg-amber-800 rounded-t-sm" />
            {/* Glowing teardrop fairy bulb */}
            <div 
              className="w-2.5 h-3 rounded-b-full shadow-sm animate-pulse"
              style={{
                backgroundColor: colorVariant,
                boxShadow: `0 0 8px ${colorVariant}, 0 0 14px ${colorVariant}88`,
                animationDuration: `${1.8 + (i % 4) * 0.4}s`,
                animationDelay: `${delay}s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
