'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Direction } from '../types/game';

interface ControlsProps {
  onMove: (direction: Direction) => void;
  onCapture: () => void;
  isIdle: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onMove,
  onCapture,
  isIdle
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div />
      <Button onClick={() => onMove('up')}>↑</Button>
      <div />
      <Button onClick={() => onMove('left')}>←</Button>
      <Button
        onClick={onCapture}
        disabled={!isIdle}
        className={`${!isIdle ? 'opacity-50' : ''} bg-green-600 hover:bg-green-700`}
      >
        捕獲
      </Button>
      <Button onClick={() => onMove('right')}>→</Button>
      <div />
      <Button onClick={() => onMove('down')}>↓</Button>
      <div />
    </div>
  );
};