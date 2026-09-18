'use client';

import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  depth: number; // 0 (background), 1 (midground), 2 (foreground)
  size: number;
  speedX: number;
  speedY: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  type: 'marigold' | 'rose';
  opacity: number;
}

interface PetalCanvasProps {
  mode?: 'few' | 'normal' | 'off';
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ mode = 'few' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    if (mode === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const vx = e.clientX - mouseRef.current.lastX;
      const vy = e.clientY - mouseRef.current.lastY;
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        vx: Math.max(-15, Math.min(15, vx)),
        vy: Math.max(-15, Math.min(15, vy)),
        lastX: e.clientX,
        lastY: e.clientY,
      };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Reduced petal count as requested: few (8/14) or normal (12/22)
    const countMobile = mode === 'few' ? 8 : 12;
    const countDesktop = mode === 'few' ? 14 : 22;
    const petalCount = window.innerWidth < 768 ? countMobile : countDesktop;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      const depth = Math.random() < 0.2 ? 2 : Math.random() < 0.7 ? 1 : 0;
      const sizeMultiplier = depth === 2 ? 1.6 : depth === 1 ? 1.0 : 0.65;
      const baseSpeed = depth === 2 ? 1.1 : depth === 1 ? 0.7 : 0.45;

      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        depth,
        size: (5 + Math.random() * 5) * sizeMultiplier,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (0.4 + Math.random() * 0.7) * baseSpeed,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        type: Math.random() < 0.6 ? 'marigold' : 'rose',
        opacity: depth === 2 ? 0.4 : depth === 1 ? 0.55 : 0.3,
      });
    }

    // A small number of very subtle twinkling golden night stars (10 on mobile, 16 on desktop)
    const starCount = window.innerWidth < 768 ? 10 : 16;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.75,
      size: 0.8 + Math.random() * 1.5,
      baseOpacity: 0.2 + Math.random() * 0.4,
      pulseSpeed: 0.015 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      // Simulate 3D rotation projection
      const scaleX = Math.cos(p.rotY);
      const scaleY = Math.cos(p.rotX);
      ctx.rotate(p.rotZ);
      ctx.scale(scaleX, scaleY);

      ctx.globalAlpha = p.opacity;

      if (p.depth === 2) {
        // Foreground bokeh blur
        ctx.filter = 'blur(1.5px)';
      }

      ctx.beginPath();
      if (p.type === 'marigold') {
        // Elongated marigold petal shape with serrated tip
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.5, p.size * 0.7, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.5, -p.size * 0.7, -p.size * 0.5, 0, -p.size);

        // Gradient fill for marigold
        const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.4, '#f59e0b');
        grad.addColorStop(1, '#d97706');
        ctx.fillStyle = grad;
      } else {
        // Round heart/tear rose petal shape
        ctx.moveTo(0, -p.size * 0.8);
        ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.8, p.size * 0.9, p.size * 0.6, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.6, -p.size * 0.9, -p.size * 0.8, 0, -p.size * 0.8);

        // Rose gradient
        const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
        grad.addColorStop(0, '#fca5a5');
        grad.addColorStop(0.5, '#ef4444');
        grad.addColorStop(1, '#991b1b');
        ctx.fillStyle = grad;
      }

      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render the subtle, gentle night sky stars (very sparse & calm)
      for (let s = 0; s < stars.length; s++) {
        const star = stars[s];
        star.phase += star.pulseSpeed;
        const currentOpacity = star.baseOpacity + Math.sin(star.phase) * 0.15;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0.05, Math.min(0.65, currentOpacity));
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Mouse draft effect decay
      mouseRef.current.vx *= 0.92;
      mouseRef.current.vy *= 0.92;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Natural sway
        p.rotX += p.rotSpeedX;
        p.rotY += p.rotSpeedY;
        p.rotZ += p.rotSpeedZ;

        // Base fall
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.4;

        // Interactive wind push from cursor
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 160;

        if (dist < radius && dist > 1) {
          const force = (1 - dist / radius) * 2;
          p.x += (dx / dist) * force * 3 + mouseRef.current.vx * 0.2;
          p.y += (dy / dist) * force * 2 + mouseRef.current.vy * 0.2;
          p.rotSpeedZ += 0.02;
        }

        // Wrap around borders
        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;

        drawPetal(p);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode]);

  if (mode === 'off') return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none fixed inset-0 z-25 w-full h-full"
      id="petals-floating-canvas"
    />
  );
};
