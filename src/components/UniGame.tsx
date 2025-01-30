'use client'
// components/UniGame.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GameBoard } from './GameBoard';
import { Controls } from './Controls';
import { GameStatus } from './GameStatus';
import { useGame } from '../hooks/useGame';

const UniGame: React.FC = () => {
  const {
    gameState,
    moveRobot,
    attemptCapture,
    resetGame,
  } = useGame();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <GameStatus
          gameState={gameState}
          onReset={resetGame}
        />

        <GameBoard
          gameState={gameState}
        />

        <Controls
          onMove={moveRobot}
          onCapture={attemptCapture}
          isIdle={gameState.armState === 'idle'}
        />
      </CardContent>
    </Card>
  );
};

export default UniGame;