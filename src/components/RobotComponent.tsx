'use client'

import React from 'react';
import { ArmState } from '../types/game';

interface RobotComponentProps {
  armState: ArmState;
}

export const RobotComponent: React.FC<RobotComponentProps> = ({ armState }) => {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      {/* ROVのボディ */}
      <rect
        x="10"
        y="12"
        width="20"
        height="16"
        fill="#2563EB"
        stroke="#1E40AF"
        strokeWidth="1"
      />

      {/* カメラレンズ */}
      <circle
        cx="20"
        cy="16"
        r="3"
        fill="#1E40AF"
        stroke="#1D4ED8"
      />

      {/* グリッパーアーム */}
      <g
        className="transition-transform duration-500"
        style={{
          transform: armState === 'catching' ? 'scale(1.2)' : 'scale(1)',
          transformOrigin: 'center'
        }}
      >
        {/* 左のグリッパー */}
        <g
          className="transition-transform duration-300"
          style={{
            transform: `rotate(${armState === 'catching' ? -30 : -10}deg)`,
            transformOrigin: '20px 28px'
          }}
        >
          {/* 網状の部分を表現 */}
          {Array.from({ length: 4 }).map((_, i) => (
            <line
              key={`left-grip-${i}`}
              x1={16 + i}
              y1={28}
              x2={16 + i}
              y2={34}
              stroke="#4B5563"
              strokeWidth="0.5"
            />
          ))}
          <path
            d="M15 28 L20 28 L20 34 L15 34 Z"
            fill="none"
            stroke="#4B5563"
            strokeWidth="1"
          />
        </g>

        {/* 右のグリッパー */}
        <g
          className="transition-transform duration-300"
          style={{
            transform: `rotate(${armState === 'catching' ? 30 : 10}deg)`,
            transformOrigin: '20px 28px'
          }}
        >
          {/* 網状の部分を表現 */}
          {Array.from({ length: 4 }).map((_, i) => (
            <line
              key={`right-grip-${i}`}
              x1={20 + i}
              y1={28}
              x2={20 + i}
              y2={34}
              stroke="#4B5563"
              strokeWidth="0.5"
            />
          ))}
          <path
            d="M20 28 L25 28 L25 34 L20 34 Z"
            fill="none"
            stroke="#4B5563"
            strokeWidth="1"
          />
        </g>
      </g>

      {/* ライト */}
      <circle
        cx="14"
        cy="16"
        r="2"
        fill="#FCD34D"
        stroke="#F59E0B"
        style={{
          filter: 'drop-shadow(0 0 2px #FCD34D)'
        }}
      />
      <circle
        cx="26"
        cy="16"
        r="2"
        fill="#FCD34D"
        stroke="#F59E0B"
        style={{
          filter: 'drop-shadow(0 0 2px #FCD34D)'
        }}
      />
    </svg>
  );
};