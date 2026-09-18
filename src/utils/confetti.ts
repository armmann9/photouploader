import confetti from 'canvas-confetti';
import { playTempleBell } from './audio';

/**
 * Trigger authentic Marigold & Rose petal burst ("Phool Barsao")
 */
export function triggerPhoolBarsao(): void {
  if (typeof window === 'undefined') return;

  try {
    playTempleBell(920);
  } catch {
    // audio fallback
  }

  const colors = [
    '#f59e0b', // vibrant marigold yellow
    '#ea580c', // deep genda saffron
    '#dc2626', // gulab red
    '#e11d48', // rose crimson
    '#fbbf24', // golden yellow
    '#16a34a', // auspicious mango leaf green
  ];

  try {
    // Center celebration cannon
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.25, x: 0.5 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
      gravity: 0.8,
      drift: 0.1,
      ticks: 200,
    });

    // Left and Right festive fountains
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 60,
        origin: { x: 0.08, y: 0.35 },
        colors: colors,
        scalar: 1.1,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 60,
        origin: { x: 0.92, y: 0.35 },
        colors: colors,
        scalar: 1.1,
      });
    }, 180);
  } catch (err) {
    console.warn('Confetti trigger error:', err);
  }
}
