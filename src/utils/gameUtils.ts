// utils/gameUtils.ts
import { Particle } from '../types/game';
import { GAME_CONSTANTS } from '../constants/game';

export const getSeabedY = (x: number): number => {
  return 70 + Math.sin(x / 15) * 5;
};

export const getTerrainAngle = (x: number): number => {
  const dx = 5;
  const y1 = getSeabedY(x - dx);
  const y2 = getSeabedY(x + dx);
  return Math.atan2(y2 - y1, 2 * dx) * (180 / Math.PI);
};

export const createCaptureEffect = (x: number, y: number): Particle[] => {
  return Array.from({ length: GAME_CONSTANTS.PARTICLE_COUNT }, (_, i) => ({
    id: Date.now() + i,
    x,
    y,
    angle: (i * 45 * Math.PI) / 180,
    life: 1
  }));
};

export const createSeaweedStyles = (): string => `
  @keyframes sway-slow {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(2deg); }
  }
  @keyframes sway-medium {
    0%, 100% { transform: rotate(-1deg); }
    50% { transform: rotate(1deg); }
  }
  @keyframes sway-fast {
    0%, 100% { transform: rotate(1deg); }
    50% { transform: rotate(-1deg); }
  }
  .animate-sway-slow {
    animation: sway-slow 4s ease-in-out infinite;
    transform-origin: bottom;
  }
  .animate-sway-medium {
    animation: sway-medium 3s ease-in-out infinite;
    transform-origin: bottom;
  }
  .animate-sway-fast {
    animation: sway-fast 2s ease-in-out infinite;
    transform-origin: bottom;
  }
`;