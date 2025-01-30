'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, SeaCreature, Direction, Position, FishCreature } from '../types/game';
import { GAME_CONSTANTS, EDUCATIONAL_MESSAGES, INITIAL_CREATURES } from '../constants/game';
import { getSeabedY, createCaptureEffect } from '../utils/gameUtils';

const initialState: GameState = {

  robotPosition: { x: 50, y: 50 },
  armState: 'idle',
  seaCreatures: [],
  particles: [],
  showWarning: false,
  warningMessage: '',
  ecosystemHealth: GAME_CONSTANTS.INITIAL_ECOSYSTEM_HEALTH,
  seaweedHealth: {},
  gameTimer: GAME_CONSTANTS.INITIAL_GAME_TIMER,
  isPlaying: true,
  capturedUni: 0,
  missionMessages: [],
  gameCleared: false,
};

const createSeededRandom = (seed: number) => {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [random] = useState(() => createSeededRandom(Date.now()));
  const animationFrameRef = useRef<number>();

  const updateFishPositions = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      seaCreatures: prev.seaCreatures.map(creature => {
        if (creature.type === 'fish') {
          let newX = creature.x + (creature.direction * GAME_CONSTANTS.FISH_MOVEMENT_SPEED);
          if (newX > 90 || newX < 10) {
            return {
              ...creature,
              direction: -creature.direction,
              x: newX > 90 ? 90 : 10
            };
          }
          return { ...creature, x: newX };
        }
        return creature;
      })
    }));

    animationFrameRef.current = requestAnimationFrame(updateFishPositions);
  }, []);

  const resetGame = useCallback(() => {
    const initialCreatures = INITIAL_CREATURES.map(creature => ({
      ...creature,
      y: creature.y ?? getSeabedY(creature.x),
    }));

    setGameState({
      ...initialState,
      seaCreatures: initialCreatures,
    });

    // 魚のアニメーションを開始
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateFishPositions);
  }, [updateFishPositions]);

  const addNewLife = useCallback((captureCount: number) => {
    // 新しい海藻を追加
    const newSeaweedCount = Math.floor(Math.pow(captureCount, 1.5));
    const newSeaweeds: SeaCreature[] = Array.from({ length: newSeaweedCount }).map(() => ({
      id: Date.now() + Math.random(),
      type: 'seaweed' as const,
      x: 10 + random() * 80,
      y: 0,
      scale: 0,
      height: 30 + random() * 20
    })).map(seaweed => ({
      ...seaweed,
      y: getSeabedY(seaweed.x)
    }));

    // 新しい魚を追加
    const newFishCount = Math.floor(newSeaweedCount / 2);
    const newFish: FishCreature[] = Array.from({ length: newFishCount }).map(() => ({
      id: Date.now() + Math.random(),
      type: 'fish' as const,
      x: 20 + random() * 60,
      y: 10 + random() * 30,
      direction: random() < 0.5 ? 1 : -1
    }));

    // まず海藻を scale: 0 で追加

    const educationalMessageIndex = Math.floor(random() * EDUCATIONAL_MESSAGES.length);
    const educationalMessage = EDUCATIONAL_MESSAGES[educationalMessageIndex];
    setGameState(prev => ({
      ...prev,
      seaCreatures: [...prev.seaCreatures, ...newSeaweeds, ...newFish],
      missionMessages: [
        `ウニを${captureCount}匹駆除しました！`,
        `海藻が${newSeaweedCount}本、魚が${newFishCount}匹増えました！`,
        educationalMessage
      ]
    }));

    // 海藻の成長アニメーション
    const growSeaweed = () => {
      setGameState(prev => ({
        ...prev,
        seaCreatures: prev.seaCreatures.map(creature => {
          if (creature.type === 'seaweed' && creature.scale < 1) {
            return {
              ...creature,
              scale: Math.min(1, creature.scale + 0.1)
            };
          }
          return creature;
        })
      }));
    };

    // 50msごとに成長を更新
    const growthInterval = setInterval(growSeaweed, 50);

    // 1秒後にインターバルをクリア
    setTimeout(() => {
      clearInterval(growthInterval);
      // 最終的に全ての海藻のscaleを1に設定
      setGameState(prev => ({
        ...prev,
        seaCreatures: prev.seaCreatures.map(creature => {
          if (creature.type === 'seaweed') {
            return {
              ...creature,
              scale: 1
            };
          }
          return creature;
        })
      }));
    }, 1000);
  }, [random]);

  const moveRobot = useCallback((direction: Direction) => {
    if (gameState.armState !== 'idle') return;

    setGameState(prev => {
      const newPos: Position = { ...prev.robotPosition };
      const step = GAME_CONSTANTS.ROBOT_STEP;

      switch (direction) {
        case 'up':
          newPos.y = Math.max(0, prev.robotPosition.y - step);
          break;
        case 'down':
          newPos.y = Math.min(90, prev.robotPosition.y + step);
          break;
        case 'left':
          newPos.x = Math.max(0, prev.robotPosition.x - step);
          break;
        case 'right':
          newPos.x = Math.min(90, prev.robotPosition.x + step);
          break;
      }

      return { ...prev, robotPosition: newPos };
    });
  }, [gameState.armState]);

  const attemptCapture = useCallback(async () => {
    if (gameState.armState !== 'idle' || !gameState.isPlaying) return;

    setGameState(prev => ({ ...prev, armState: 'grabbing' }));
    await new Promise(resolve => setTimeout(resolve, 500));

    setGameState(prev => {
      // グリッパーの捕獲可能エリアを計算
      const gripperArea = {
        minX: prev.robotPosition.x - 8,  // グリッパーの幅に合わせて調整
        maxX: prev.robotPosition.x + 8,
        minY: prev.robotPosition.y + 5,  // グリッパーの位置（ROVの下部）
        maxY: prev.robotPosition.y + 15  // グリッパーの到達範囲
      };

      // グリッパー内にいる生物を探す
      const nearbyCreature = prev.seaCreatures.find(creature =>
        creature.x >= gripperArea.minX &&
        creature.x <= gripperArea.maxX &&
        creature.y >= gripperArea.minY &&
        creature.y <= gripperArea.maxY
      );

      if (!nearbyCreature) {
        return { ...prev, armState: 'idle' };
      }

      if (nearbyCreature.type === 'uni') {
        const particles = createCaptureEffect(nearbyCreature.x, nearbyCreature.y);
        // const messageIndex = Math.floor(random() * EDUCATIONAL_MESSAGES.length);
        // const message = EDUCATIONAL_MESSAGES[messageIndex];
        const newCaptureCount = prev.capturedUni + 1;
        const remainingUni = gameState.seaCreatures.filter(creature => creature.type === 'uni').length;
        const newEcosystemHealth = newCaptureCount / (prev.capturedUni + remainingUni) * 100;

        // 少し遅延して新しい生物を追加
        setTimeout(() => {
          addNewLife(newCaptureCount);
        }, 1000);

        return {
          ...prev,
          armState: 'catching',

          ecosystemHealth: newEcosystemHealth,
          capturedUni: newCaptureCount,
          particles: [...prev.particles, ...particles],
          missionMessages: ["ウニをつかみました！"],
          seaCreatures: prev.seaCreatures.filter(c => c.id !== nearbyCreature.id),
        };
      }

      if (nearbyCreature.type === 'fish') {
        return {
          ...prev,
          armState: 'idle',
          showWarning: true,
          warningMessage: '魚は捕獲できません！海の生態系を守りましょう。',
        };
      }

      return { ...prev, armState: 'idle' };
    });

    // armStateを'idle'に戻す
    setTimeout(() => {
      setGameState(prev => ({ ...prev, armState: 'idle' }));
    }, 1000);
  }, [gameState.armState, gameState.isPlaying, random, addNewLife]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 初期化
  useEffect(() => {
    resetGame();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [resetGame]);

  // 警告メッセージのクリア
  useEffect(() => {
    if (gameState.showWarning) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, showWarning: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.showWarning]);

  // ゲームクリア判定
  useEffect(() => {
    const remainingUni = gameState.seaCreatures.filter(creature => creature.type === 'uni').length;
    const seaweedCount = gameState.seaCreatures.filter(c => c.type === 'seaweed').length;

    if (remainingUni === 0 && gameState.isPlaying && seaweedCount >= 8) {
      setGameState(prev => ({
        ...prev,
        gameCleared: true,
        isPlaying: false,
        missionMessages: ['おめでとう！海の生態系が回復しました！'],
      }));
    }
  }, [gameState.seaCreatures, gameState.isPlaying]);

  return {
    gameState,
    moveRobot,
    attemptCapture,
    resetGame,
  };
};