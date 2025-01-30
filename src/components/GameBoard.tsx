'use client'

import React, { useEffect } from 'react';
import { SeaweedComponent } from './SeaweedComponent';
import { RobotComponent } from './RobotComponent';
import { UniComponent } from './UniComponent';
import { FishComponent } from './FishComponent';
import { GameState, SeaCreature } from '../types/game';
import { createSeaweedStyles } from '../utils/gameUtils';

interface GameBoardProps {
  gameState: GameState;
}

// 浮遊粒子の位置を事前に計算
const FLOATING_PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  left: `${(i * 3.33) % 100}%`,
  top: `${(i * 3.33 + 50) % 100}%`,
  delay: `${-(i * 0.13)}s`,
  duration: `${3 + (i % 4)}s`
}));

export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  // スタイルの初期化
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = createSeaweedStyles();
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const renderCreature = (creature: SeaCreature) => {
    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${creature.x}%`,
      top: `${creature.y}%`,
      transform: `translate(-50%, -50%) scale(${
        'scale' in creature ? creature.scale : 1
      })`,
      width: creature.type === 'seaweed' ? '20px' : '32px',
      height: creature.type === 'seaweed' ? '40px' : '32px',
    };

    switch (creature.type) {
      case 'uni':
        return (
          <div key={creature.id} style={commonStyle}>
            <UniComponent />
          </div>
        );
      case 'fish':
        return (
          <div key={creature.id} style={commonStyle}>
            <FishComponent direction={creature.direction} />
          </div>
        );
      case 'seaweed':
        return (
          <div key={creature.id} style={commonStyle}>
            <SeaweedComponent
              x={creature.x}
              height={creature.height}
              scale={creature.scale}
            />
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-96 bg-blue-100 rounded-lg overflow-hidden">
      {/* 海底の地形 */}
      <svg className="absolute bottom-0 w-full" height="100" viewBox="0 0 100 20" preserveAspectRatio="none">
        <defs>
          <radialGradient id="waterLight" cx="50%" cy="0%" r="70%" fx="50%" fy="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
          </radialGradient>
          <pattern id="sandTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="#F59E0B" fillOpacity="0.3" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="100" height="20" fill="url(#waterLight)" />
        <path
          d="M0,20 L0,8 Q25,12 50,7 Q75,2 100,9 L100,20 Z"
          fill="#FCD34D"
        />
        <path
          d="M0,20 L0,8 Q25,12 50,7 Q75,2 100,9 L100,20 Z"
          fill="url(#sandTexture)"
        />
      </svg>

      {/* ロボット */}
      <div
        className="absolute w-16 h-16 transition-all duration-300 flex items-center justify-center"
        style={{
          left: `${gameState.robotPosition.x}%`,
          top: `${gameState.robotPosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <RobotComponent armState={gameState.armState} />

        {/* 捕獲可能エリアのデバッグ表示（開発時のみ） */}
        {process.env.NODE_ENV === 'development' && (
          <div
            className="absolute border border-red-500 opacity-30"
            style={{
              left: '-8%',
              width: '16%',
              top: '5%',
              height: '10%',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      {/* 海洋生物 */}
      {gameState.seaCreatures.map(renderCreature)}

      {/* パーティクル */}
      {gameState.particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full transition-all duration-50"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: particle.life
          }}
        />
      ))}

      {/* 水中の浮遊粒子 */}
      {FLOATING_PARTICLES.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
            animation: `float-particle ${particle.duration} infinite ease-in-out`,
            animationDelay: particle.delay
          }}
        />
      ))}
    </div>
  );
};