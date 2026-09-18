import React, { useEffect, useState } from 'react';

interface TemplePillarsProps {
  parallaxX?: number; // Normalized -1 to 1
  parallaxY?: number; // Normalized -1 to 1
}

export const TemplePillars: React.FC<TemplePillarsProps> = ({ 
  parallaxX = 0, 
  parallaxY = 0 
}) => {
  const [internalX, setInternalX] = useState(0);
  const [internalY, setInternalY] = useState(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setInternalX(nx);
      setInternalY(ny);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const effectiveX = parallaxX || internalX;
  const effectiveY = parallaxY || internalY;

  // Left pillar shifts: shifts inward/outward and tilts slightly
  const leftTranslateX = effectiveX * -12;
  const leftRotateY = 12 + effectiveX * 8; // subtle 3D angle
  const leftTranslateY = effectiveY * -6;

  // Right pillar counter-shifts
  const rightTranslateX = effectiveX * -12;
  const rightRotateY = -12 + effectiveX * 8;
  const rightTranslateY = effectiveY * -6;

  const renderPillarSvg = (side: 'left' | 'right') => (
    <svg 
      viewBox="0 0 120 900" 
      className="h-full w-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] select-none"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        {/* Stone / Brass Pillar Gradient */}
        <linearGradient id={`pillarGrad-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="25%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="75%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        <linearGradient id={`goldShine-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <radialGradient id={`diyaGlow-${side}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="80%" stopColor="#ea580c" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Pillar Base (Padma Peeth) */}
      <path d="M10,870 L110,870 L118,900 L2,900 Z" fill={`url(#pillarGrad-${side})`} />
      <rect x="15" y="845" width="90" height="25" rx="4" fill={`url(#goldShine-${side})`} stroke="#451a03" strokeWidth="2" />
      <path d="M22,810 L98,810 L105,845 L15,845 Z" fill={`url(#pillarGrad-${side})`} />

      {/* Fluted Column Shaft */}
      <rect x="28" y="140" width="64" height="670" fill={`url(#pillarGrad-${side})`} />

      {/* Flutes / Carved vertical channels */}
      <line x1="36" y1="150" x2="36" y2="800" stroke="#451a03" strokeWidth="2" opacity="0.6" />
      <line x1="38" y1="150" x2="38" y2="800" stroke="#fef08a" strokeWidth="1.5" opacity="0.8" />

      <line x1="48" y1="150" x2="48" y2="800" stroke="#451a03" strokeWidth="2" opacity="0.6" />
      <line x1="50" y1="150" x2="50" y2="800" stroke="#fef08a" strokeWidth="1.5" opacity="0.8" />

      <line x1="60" y1="150" x2="60" y2="800" stroke="#fef3c7" strokeWidth="3" opacity="0.9" />

      <line x1="70" y1="150" x2="70" y2="800" stroke="#451a03" strokeWidth="2" opacity="0.6" />
      <line x1="72" y1="150" x2="72" y2="800" stroke="#fef08a" strokeWidth="1.5" opacity="0.8" />

      <line x1="82" y1="150" x2="82" y2="800" stroke="#451a03" strokeWidth="2" opacity="0.6" />
      <line x1="84" y1="150" x2="84" y2="800" stroke="#fef08a" strokeWidth="1.5" opacity="0.8" />

      {/* Decorative Jali / Rings at mid-height */}
      <rect x="25" y="470" width="70" height="22" rx="3" fill={`url(#goldShine-${side})`} stroke="#78350f" strokeWidth="2" />
      <circle cx="42" cy="481" r="5" fill="#78350f" />
      <circle cx="60" cy="481" r="6" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
      <circle cx="78" cy="481" r="5" fill="#78350f" />

      {/* Pillar Capital (Kalasha / Lotus top) */}
      <path d="M18,140 L102,140 L95,105 L25,105 Z" fill={`url(#pillarGrad-${side})`} />
      <rect x="12" y="85" width="96" height="20" rx="4" fill={`url(#goldShine-${side})`} stroke="#451a03" strokeWidth="2" />
      <path d="M2,45 L118,45 L110,85 L10,85 Z" fill={`url(#pillarGrad-${side})`} />
      <rect x="0" y="0" width="120" height="45" rx="3" fill={`url(#goldShine-${side})`} />

      {/* Hanging Brass Diya Lamp from Capital */}
      <g transform={side === 'left' ? "translate(80, 110)" : "translate(15, 110)"}>
        {/* Hanging chain */}
        <line x1="12" y1="0" x2="12" y2="90" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,3" />
        
        {/* Brass Diya Bowl */}
        <path d="M2,98 Q12,120 22,98 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
        <ellipse cx="12" cy="98" rx="10" ry="3" fill="#f59e0b" />

        {/* Diya Flame Ambient Halo */}
        <circle cx="12" cy="92" r="28" fill={`url(#diyaGlow-${side})`} className="animate-pulse" />

        {/* Flickering Golden-Red Flame */}
        <g className="animate-flame origin-bottom">
          <path d="M12,96 Q7,88 12,74 Q17,88 12,96 Z" fill="#ef4444" />
          <path d="M12,96 Q9,90 12,78 Q15,90 12,96 Z" fill="#f59e0b" />
          <path d="M12,96 Q10.5,92 12,84 Q13.5,92 12,96 Z" fill="#fffbeb" />
        </g>
      </g>
    </svg>
  );

  return (
    <>
      {/* Left Pillar Container */}
      <div 
        className="pointer-events-none fixed top-0 left-0 bottom-0 z-30 hidden lg:block w-20 xl:w-28 h-screen"
        style={{
          transform: `perspective(1000px) translateX(${leftTranslateX}px) translateY(${leftTranslateY}px) rotateY(${leftRotateY}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transformOrigin: 'left center',
        }}
        id="temple-pillar-left"
      >
        {renderPillarSvg('left')}
      </div>

      {/* Right Pillar Container */}
      <div 
        className="pointer-events-none fixed top-0 right-0 bottom-0 z-30 hidden lg:block w-20 xl:w-28 h-screen"
        style={{
          transform: `perspective(1000px) translateX(${rightTranslateX}px) translateY(${rightTranslateY}px) rotateY(${rightRotateY}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transformOrigin: 'right center',
        }}
        id="temple-pillar-right"
      >
        {renderPillarSvg('right')}
      </div>
    </>
  );
};
