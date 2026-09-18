import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // Max tilt angle in degrees
  onClick?: () => void;
  id?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxRotation = 14,
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    // Invert normY so tilting toward mouse feels natural
    setRotation({
      x: -normY * maxRotation,
      y: normX * maxRotation,
    });

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl transition-transform duration-200 ease-out cursor-pointer ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.03, 1.03, 1.03)`
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      }}
    >
      {/* 3D Content Container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden transform-style-3d">
        {children}

        {/* Dynamic Specular Glare / Light Reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 mix-blend-overlay"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.7), transparent 70%)`,
          }}
        />

        {/* Traditional Gold Filigree Border on Hover */}
        <div 
          className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 transition-all duration-300 ${
            isHovered 
              ? 'ring-amber-400 shadow-[0_15px_35px_rgba(245,158,11,0.25)]' 
              : 'ring-emerald-800/60 shadow-[0_8px_20px_rgba(0,0,0,0.4)]'
          }`}
        />
      </div>
    </div>
  );
};
