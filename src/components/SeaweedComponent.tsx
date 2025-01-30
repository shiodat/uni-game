'use client'
// components/SeaweedComponent.tsx
import React from 'react';
import { getTerrainAngle } from '../utils/gameUtils';

interface SeaweedComponentProps {
  x: number;
  y: number;
  height: number;
  scale?: number;
}

export const SeaweedComponent: React.FC<SeaweedComponentProps> = ({
  x,
  y,
  height,
  scale = 1
}) => {
  const angle = getTerrainAngle(x);

  return (
    <svg
      viewBox="0 0 20 40"
      className="absolute bottom-0 w-full h-full"
      style={{ height: `${height}px` }}
    >
      <g transform={`translate(10, 40) rotate(${angle})`}>
        {/* 中央の茎 */}
        <path
          d="M0,0 Q5,-10 0,-20 Q-5,-30 0,-40"
          stroke="#15803D"
          strokeWidth="2"
          fill="none"
          className="animate-sway-slow"
          style={{ transform: `scale(${scale})` }}
        />

        {/* 左の茎 */}
        <path
          d="M-2,0 Q3,-10 -2,-15 Q-7,-25 -2,-35"
          stroke="#16A34A"
          strokeWidth="2"
          fill="none"
          className="animate-sway-medium"
          style={{ transform: `scale(${scale})` }}
        />

        {/* 右の茎 */}
        <path
          d="M2,0 Q7,-10 2,-15 Q-3,-25 2,-35"
          stroke="#22C55E"
          strokeWidth="2"
          fill="none"
          className="animate-sway-fast"
          style={{ transform: `scale(${scale})` }}
        />

        {/* 小さな葉 */}
        {Array.from({ length: 6 }).map((_, i) => {
          const yPos = -5 - (i * 6);
          const xOffset = (i % 2 === 0 ? 1 : -1) * (2 + Math.random());
          return (
            <path
              key={i}
              d={`M${xOffset},${yPos} Q${xOffset * 2},${yPos - 2} ${xOffset * 1.5},${yPos - 4}`}
              stroke="#22C55E"
              strokeWidth="1.5"
              fill="none"
              className={i % 2 === 0 ? "animate-sway-medium" : "animate-sway-fast"}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default SeaweedComponent;