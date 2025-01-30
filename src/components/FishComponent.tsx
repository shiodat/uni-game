import React from 'react';

interface FishComponentProps {
  direction: number;
  colorVariant?: 'blue' | 'yellow' | 'orange' | 'green';
}

export const FishComponent: React.FC<FishComponentProps> = ({
  direction,
  colorVariant = 'blue'
}) => {
  // 色の設定
  const colors = {
    blue: {
      body: '#3B82F6',
      accent: '#1D4ED8'
    },
    yellow: {
      body: '#FBBF24',
      accent: '#B45309'
    },
    orange: {
      body: '#FB923C',
      accent: '#C2410C'
    },
    green: {
      body: '#4ADE80',
      accent: '#16A34A'
    }
  };

  const { body, accent } = colors[colorVariant];

  return (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8"
      style={{ transform: `scaleX(${direction})` }}
    >
      <path
        d="M 20,12 C 20,8 18,4 12,4 14,8 14,16 12,20 18,20 20,16 20,12 Z"
        fill={body}
      />
      <circle cx="8" cy="12" r="2" fill={accent}/>
      <path
        d="M 12,8 L 14,12 L 12,16"
        stroke={accent}
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
};