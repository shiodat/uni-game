'use client'

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { GameState } from '../types/game';

interface GameStatusProps {
  gameState: GameState;
  onReset: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({ gameState, onReset }) => {
  const getHealthColor = (health: number) => {
    if (health > 70) return 'bg-green-500';
    if (health > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
    {/* 生態系の健康度ゲージ */}
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span>海の健康度</span>
        <span>{gameState.ecosystemHealth}%</span>
      </div>
      {/* <Progress
        value={gameState.ecosystemHealth}
      /> */}
    <div
      className={`h-2 rounded-full transition-all duration-500 -mt-2 bg-gray-200`}
      style={{ width: `100%` }}
    />
    <div
      className={`h-2 rounded-full transition-all duration-500 -mt-2 ${getHealthColor(gameState.ecosystemHealth)}`}
      style={{ width: `${gameState.ecosystemHealth}%` }}
    />
    </div>

    {/* 統計情報 */}
    <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-green-600">海藻: </span>
        {gameState.seaCreatures.filter(c => c.type === 'seaweed').length}本
      </div>
      <div>
        <span className="text-blue-600">魚: </span>
        {gameState.seaCreatures.filter(c => c.type === 'fish').length}匹
      </div>
      <div>
        <span className="text-purple-600">ウニ: </span>
        {gameState.seaCreatures.filter(c => c.type === 'uni').length}個
      </div>
    </div>

      {gameState.gameCleared ? (
        <div className="text-center mb-6">
          <div className="text font-bold text-green-600 mb-4">
            ゲームクリア！生態系が回復しました！
          </div>
          <Button
            onClick={onReset}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
          >
            もう一度プレイ
          </Button>
        </div>
      ) : (
        <>
          {/* ミッションメッセージ */}
          <div className="relative h-16 mb-4">  {/* h-8 から h-16 に変更 */}
            <div className="grid grid-rows-2 gap-1 text-center text-sm">  {/* 2行グリッドを追加 */}
              {gameState.missionMessages.map((message, index) => (
                <div
                  key={`${message}-${index}`}
                  className="text-blue-600 transition-opacity duration-500"
                >
                  {message}
                </div>
              ))}
            </div>
          </div>

          {/* 警告メッセージ */}
          {gameState.showWarning && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{gameState.warningMessage}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </>
  );
};