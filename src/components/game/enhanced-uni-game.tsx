"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const UniGame = () => {
  const [score, setScore] = useState(0);
  const [robotPosition, setRobotPosition] = useState({ x: 50, y: 50 });
  const [armState, setArmState] = useState('idle');
  const [seaCreatures, setSeaCreatures] = useState([]);
  const [particles, setParticles] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // 新しい状態
  const [ecosystemHealth, setEcosystemHealth] = useState(100);
  const [seaweedHealth, setSeaweedHealth] = useState({});
  const [gameTimer, setGameTimer] = useState(180); // 3分
  const [isPlaying, setIsPlaying] = useState(true);
  const [capturedUni, setCapturedUni] = useState(0);
  const [missionMessages, setMissionMessages] = useState([]);
  const [gameCleared, setGameCleared] = useState(false);

  // 初期化用のuseEffect
  useEffect(() => {
    initializeGame();
  }, []);

  // ゲームの初期化
  const resetGame = () => {
    setScore(0);
    setRobotPosition({ x: 50, y: 50 });
    setArmState('idle');
    setParticles([]);
    setShowWarning(false);
    setWarningMessage('');
    setCapturedUni(0);
    setMissionMessages([]);
    setGameCleared(false);

    // 生物の初期配置を再設定
    const initialCreatures = [
      { id: 1, type: 'uni', x: 30, y: getSeabedY(30) },
      { id: 2, type: 'uni', x: 70, y: getSeabedY(70) },
      { id: 3, type: 'fish', x: 20, y: 20, direction: 1 },
      { id: 4, type: 'fish', x: 80, y: 40, direction: -1 },
      { id: 5, type: 'seaweed', x: 80, y: getSeabedY(80), scale: 1, height: 40 },
      { id: 6, type: 'uni', x: 40, y: getSeabedY(40) },
      { id: 7, type: 'seaweed', x: 20, y: getSeabedY(20), scale: 1, height: 35 },
    ];
    setSeaCreatures(initialCreatures);
  };

  // クリア判定
  useEffect(() => {
    const remainingUni = seaCreatures.filter(creature => creature.type === 'uni').length;
    if (remainingUni === 0 && isPlaying && seaCreatures.length > 0) {
      setGameCleared(true);
      setIsPlaying(false);
      setMissionMessages(['おめでとう！すべてのウニを駆除しました！']);
    }
  }, [seaCreatures, isPlaying]);

  // 海藻コンポーネント
  const SeaweedComponent = ({ x, y, height, scale = 1 }) => {
    const angle = getTerrainAngle(x);
    return (
      <svg viewBox="0 0 20 40" className="absolute bottom-0 w-full h-full">
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
        </g>
      </svg>
    );
  };

  // アニメーションスタイルの設定
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 教育的メッセージ
  const educationalMessages = [
    "ウニを減らすことで、海藻が育ちやすくなります",
    "海藻が増えると、魚たちが戻ってきます",
    "バランスの取れた海の環境を目指しましょう",
    "実際のロボットと協力して、海の環境を守っています！"
  ];

  // 地形の傾斜を計算
  const getTerrainAngle = (x) => {
    const dx = 5;
    const y1 = getSeabedY(x - dx);
    const y2 = getSeabedY(x + dx);
    return Math.atan2(y2 - y1, 2 * dx) * (180 / Math.PI);
  };

  // 海底のY座標を計算
  const getSeabedY = (x) => {
    return 70 + Math.sin(x / 15) * 5;
  };

  // 新しい海藻を追加
  const addNewSeaweed = (x, y) => {
    const newSeaweed = {
      id: Date.now(),
      type: 'seaweed',
      x,
      y,
      scale: 0,
      height: 30 + Math.random() * 20
    };

    setSeaCreatures(prev => [...prev, newSeaweed]);
    setSeaweedHealth(prev => ({...prev, [newSeaweed.id]: 100}));

    let scale = 0;
    const growInterval = setInterval(() => {
      scale += 0.1;
      if (scale >= 1) {
        clearInterval(growInterval);
        return;
      }
      setSeaCreatures(prev =>
        prev.map(creature =>
          creature.id === newSeaweed.id
            ? { ...creature, scale }
            : creature
        )
      );
    }, 50);
  };

  // パーティクルエフェクトを作成
  const createCaptureEffect = (x, y) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x, y,
      angle: (i * 45 * Math.PI) / 180,
      life: 1
    }));
    setParticles(prev => [...prev, ...newParticles]);

    const animate = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + Math.cos(p.angle) * 2,
            y: p.y + Math.sin(p.angle) * 2,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0)
      );
    };

    const interval = setInterval(animate, 50);
    setTimeout(() => clearInterval(interval), 1000);
  };

  // ロボットの移動
  const moveRobot = (direction) => {
    if (armState !== 'idle') return;

    setRobotPosition(prev => {
      const newPos = { ...prev };
      const step = 10;
      switch(direction) {
        case 'up':
          newPos.y = Math.max(0, prev.y - step);
          break;
        case 'down':
          newPos.y = Math.min(90, prev.y + step);
          break;
        case 'left':
          newPos.x = Math.max(0, prev.x - step);
          break;
        case 'right':
          newPos.x = Math.min(90, prev.x + step);
          break;
      }
      return newPos;
    });
  };

  // 捕獲試行
  const attemptCapture = async () => {
    if (armState !== 'idle' || !isPlaying) return;

    setArmState('grabbing');
    await new Promise(resolve => setTimeout(resolve, 500));

    setSeaCreatures(prev => {
      const nearbyCreature = prev.find(creature =>
        Math.abs(creature.x - robotPosition.x) < 15 &&
        Math.abs(creature.y - robotPosition.y) < 15
      );

      if (nearbyCreature) {
        if (nearbyCreature.type === 'uni') {
          setCapturedUni(prev => prev + 1);
          setScore(s => s + 100);
          setArmState('catching');
          createCaptureEffect(nearbyCreature.x, nearbyCreature.y);

          // 教育的メッセージを表示
          const message = educationalMessages[Math.floor(Math.random() * educationalMessages.length)];
          setMissionMessages(prev => [...prev, message]);
          setTimeout(() => {
            setMissionMessages(prev => prev.slice(1));
          }, 5000);

          // 捕獲数の2乗に応じて生態系を回復
          setTimeout(() => {
            const nextCaptureCount = capturedUni + 1;
            const newLifeCount = Math.floor(Math.pow(nextCaptureCount, 2));

            // 海藻を増やす
            for(let i = 0; i < newLifeCount; i++) {
              const newX = Math.random() * 80 + 10; // 10-90の範囲
              addNewSeaweed(newX, getSeabedY(newX));
            }

            // 魚を増やす
            setSeaCreatures(prev => [
              ...prev,
              ...Array(Math.floor(newLifeCount / 2)).fill(null).map(() => ({
                id: Date.now() + Math.random(),
                type: 'fish',
                x: Math.random() * 60 + 20, // 20-80の範囲
                y: Math.random() * 30 + 10, // 10-40の範囲
                direction: Math.random() < 0.5 ? 1 : -1
              }))
            ]);

            // 教育的メッセージを更新
            setMissionMessages([
              `ウニを${nextCaptureCount}匹駆除しました！`,
              `海藻が${newLifeCount}本、魚が${Math.floor(newLifeCount/2)}匹増えました！`
            ]);
          }, 1000);

          setTimeout(() => setArmState('idle'), 1000);
          return prev.filter(c => c.id !== nearbyCreature.id);
        } else if (nearbyCreature.type === 'fish') {
          setWarningMessage('魚は捕獲できません！海の生態系を守りましょう。');
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 3000);
          setArmState('idle');
          return prev;
        }
      }

      setArmState('idle');
      return prev;
    });
  };

  // 海洋生物の初期配置
  useEffect(() => {
    const initialCreatures = [
      { id: 1, type: 'uni', x: 30, y: getSeabedY(30) },
      { id: 2, type: 'uni', x: 70, y: getSeabedY(70) },
      { id: 3, type: 'fish', x: 20, y: 20, direction: 1 },
      { id: 4, type: 'fish', x: 80, y: 40, direction: -1 },
      { id: 5, type: 'seaweed', x: 80, y: getSeabedY(80), scale: 1, height: 40 },
      { id: 6, type: 'uni', x: 40, y: getSeabedY(40) },
      { id: 7, type: 'seaweed', x: 20, y: getSeabedY(20), scale: 1, height: 35 },
    ];

    setSeaCreatures(initialCreatures);

    // 魚の動きのアニメーション
    const interval = setInterval(() => {
      setSeaCreatures(prev =>
        prev.map(creature => {
          if (creature.type === 'fish') {
            let newX = creature.x + (creature.direction * 1);
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
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        {gameCleared ? (
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-green-600 mb-4">ゲームクリア！</div>
            <div className="text-xl mb-4">最終スコア: {score}</div>
            <Button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
            >
              もう一度プレイ
            </Button>
          </div>
        ) : (
          <div className="mb-4">
            <div className="text-2xl font-bold">スコア: {score}</div>
          </div>
        )}

        {/* 生態系の健康度ゲージ */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">海の健康度</div>
          <Progress
            value={ecosystemHealth}
            className={`h-2 ${
              ecosystemHealth > 70 ? 'bg-green-500' :
              ecosystemHealth > 40 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
          />
        </div>

        {/* ミッションメッセージ */}
        <div className="relative h-8 mb-4">
          {missionMessages.map((message, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-full text-center text-sm text-blue-600 animate-fade-in-out"
            >
              {message}
            </div>
          ))}
        </div>

        {/* 警告メッセージ */}
        {showWarning && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{warningMessage}</AlertDescription>
          </Alert>
        )}

        {/* ゲームエリア */}
        <div className="relative w-full h-96 bg-blue-100 rounded-lg overflow-hidden mb-4">
          {/* 海底の地形 */}
          <svg className="absolute bottom-0 w-full" height="100" viewBox="0 0 100 20" preserveAspectRatio="none">
            {/* 光の反射効果 */}
            <defs>
              <radialGradient id="waterLight" cx="50%" cy="0%" r="70%" fx="50%" fy="0%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
              </radialGradient>
              <pattern id="sandTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="#F59E0B" fillOpacity="0.3" />
              </pattern>
            </defs>

            {/* 水中の光 */}
            <rect x="0" y="0" width="100" height="20" fill="url(#waterLight)" />

            {/* 砂地の基本層 */}
            <path
              d="M0,20 L0,8 Q25,12 50,7 Q75,2 100,9 L100,20 Z"
              fill="#FCD34D"
            />
            {/* 砂地のテクスチャ */}
            <path
              d="M0,20 L0,8 Q25,12 50,7 Q75,2 100,9 L100,20 Z"
              fill="url(#sandTexture)"
            />
          </svg>

          {/* 水中の浮遊粒子 */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
                  animation: `float-particle ${3 + Math.random() * 4}s infinite ease-in-out`,
                  animationDelay: `${-Math.random() * 4}s`
                }}
              />
            ))}
          </div>

          {/* ロボット */}
          <div
            className="absolute w-16 h-16 transition-all duration-300 flex items-center justify-center"
            style={{
              left: `${robotPosition.x}%`,
              top: `${robotPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="20" r="18" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2"/>

              {/* アーム */}
              <g className="transition-transform duration-500"
                style={{
                  transform: armState === 'catching' ? 'rotate(-45deg)' : 'rotate(-20deg)',
                  transformOrigin: '20px 20px'
                }}>
                <line x1="20" y1="20" x2="35" y2="15" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="35" cy="15" r="2" fill="#4B5563"/>
              </g>
              <g className="transition-transform duration-500"
                style={{
                  transform: armState === 'catching' ? 'rotate(45deg)' : 'rotate(20deg)',
                  transformOrigin: '20px 20px'
                }}>
                <line x1="20" y1="20" x2="35" y2="25" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="35" cy="25" r="2" fill="#4B5563"/>
              </g>
              <g className="transition-transform duration-500"
                style={{
                  transform: armState === 'catching' ? 'rotate(-90deg)' : 'rotate(-70deg)',
                  transformOrigin: '20px 20px'
                }}>
                <line x1="20" y1="20" x2="5" y2="20" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="5" cy="20" r="2" fill="#4B5563"/>
              </g>
            </svg>
          </div>

          {/* 海洋生物 */}
          {seaCreatures.map(creature => (
            <div
              key={creature.id}
              className="absolute flex items-center justify-center transition-transform"
              style={{
                left: `${creature.x}%`,
                top: `${creature.y}%`,
                transform: `translate(-50%, -50%) scale(${creature.scale || 1})`,
                width: creature.type === 'seaweed' ? '20px' : '32px',
                height: creature.type === 'seaweed' ? '40px' : '32px'
              }}
            >
              {creature.type === 'uni' && (
                <svg viewBox="0 0 24 24" className="w-8 h-8">
                  {/* ウニの本体 */}
                  <circle cx="12" cy="12" r="8" fill="#7C3AED" />

                  {/* トゲトゲ（16本） */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i * 360 / 16) * (Math.PI / 180);
                    const innerRadius = 8;
                    const outerRadius = 11;
                    const x1 = 12 + innerRadius * Math.cos(angle);
                    const y1 = 12 + innerRadius * Math.sin(angle);
                    const x2 = 12 + outerRadius * Math.cos(angle);
                    const y2 = 12 + outerRadius * Math.sin(angle);

                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#6D28D9"
                        strokeWidth="1.5"
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
                    fillOpacity="0.3"
                  />
                </svg>
              )}
              {creature.type === 'fish' && (
                <svg viewBox="0 0 24 24" className="w-8 h-8"
                  style={{ transform: `scaleX(${creature.direction})` }}>
                  <path
                    d="M 20,12 C 20,8 18,4 12,4 14,8 14,16 12,20 18,20 20,16 20,12 Z"
                    fill="#3B82F6"
                  />
                  <circle cx="8" cy="12" r="2" fill="#1D4ED8"/>
                  <path
                    d="M 12,8 L 14,12 L 12,16"
                    stroke="#1D4ED8"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              )}
              {creature.type === 'seaweed' && (
                <SeaweedComponent
                  x={creature.x}
                  y={creature.y}
                  height={creature.height}
                  scale={creature.scale}
                />
              )}
            </div>
          ))}

          {/* パーティクル */}
          {particles.map(particle => (
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
        </div>

        {/* コントロールパネル */}
        <div className="grid grid-cols-3 gap-4">
          <div></div>
          <Button onClick={() => moveRobot('up')}>↑</Button>
          <div></div>
          <Button onClick={() => moveRobot('left')}>←</Button>
          <Button
            onClick={attemptCapture}
            disabled={armState !== 'idle'}
            className={`${armState !== 'idle' ? 'opacity-50' : ''} bg-green-600 hover:bg-green-700`}
          >
            捕獲
          </Button>
          <Button onClick={() => moveRobot('right')}>→</Button>
          <div></div>
          <Button onClick={() => moveRobot('down')}>↓</Button>
          <div></div>
        </div>

        {/* 捕獲統計 */}
        <div className="mt-4 text-sm">
          <div>捕獲したウニ: {capturedUni}</div>
          <div>残存する海藻: {seaCreatures.filter(c => c.type === 'seaweed').length}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UniGame;