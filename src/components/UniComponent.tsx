'use client'

import React from 'react';

export const UniComponent: React.FC = () => {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      {/* ウニの本体 */}
      <circle cx="12" cy="12" r="8" fill="#7C3AED" />

      {/* 主要なトゲ（長め） */}
      {Array.from({ length: 48 }).map((_, i) => {
        const angle = (i * 360 / 48) * (Math.PI / 180);
        const innerRadius = 8;
        const outerRadius = 12;
        const randomLength = outerRadius - Math.random() * 1.5;
        const x1 = 12 + innerRadius * Math.cos(angle);
        const y1 = 12 + innerRadius * Math.sin(angle);
        const x2 = 12 + randomLength * Math.cos(angle);
        const y2 = 12 + randomLength * Math.sin(angle);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6D28D9"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        );
      })}

      {/* 中長のトゲ */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = ((i * 360 / 36) + 5) * (Math.PI / 180);
        const innerRadius = 8;
        const randomLength = 10 - Math.random();
        const x1 = 12 + innerRadius * Math.cos(angle);
        const y1 = 12 + innerRadius * Math.sin(angle);
        const x2 = 12 + randomLength * Math.cos(angle);
        const y2 = 12 + randomLength * Math.sin(angle);

        return (
          <line
            key={`mid-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6D28D9"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        );
      })}

      {/* 短いトゲ（密度を上げる） */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = ((i * 360 / 24) + 7.5) * (Math.PI / 180);
        const innerRadius = 8;
        const randomLength = 9 - Math.random();
        const x1 = 12 + innerRadius * Math.cos(angle);
        const y1 = 12 + innerRadius * Math.sin(angle);
        const x2 = 12 + randomLength * Math.cos(angle);
        const y2 = 12 + randomLength * Math.sin(angle);

        return (
          <line
            key={`short-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6D28D9"
            strokeWidth="0.4"
            strokeLinecap="round"
          />
        );
      })}

      {/* 内側の短いトゲ */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = ((i * 360 / 16) + 11.25) * (Math.PI / 180);
        const innerRadius = 7;
        const randomLength = 8 - Math.random() * 0.5;
        const x1 = 12 + innerRadius * Math.cos(angle);
        const y1 = 12 + innerRadius * Math.sin(angle);
        const x2 = 12 + randomLength * Math.cos(angle);
        const y2 = 12 + randomLength * Math.sin(angle);

        return (
          <line
            key={`inner-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6D28D9"
            strokeWidth="0.3"
            strokeLinecap="round"
          />
        );
      })}

      {/* ハイライト効果 */}
      <circle
        cx="10"
        cy="10"
        r="3"
        fill="white"
        fillOpacity="0.2"
      />
    </svg>
  );
};