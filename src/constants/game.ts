// constants/game.ts
export const GAME_CONSTANTS = {
  INITIAL_ECOSYSTEM_HEALTH: 100,
  ROBOT_STEP: 10,
  FISH_MOVEMENT_SPEED: 1,
  SEAWEED_GROWTH_STEP: 0.1,
  MESSAGE_DISPLAY_TIME: 5000,

  // ゲームバランス用の定数
  IDEAL_SEAWEED_COUNT: 8,
  IDEAL_FISH_COUNT: 4,
  MAX_UNI_COUNT: 2,
} as const;

export const EDUCATIONAL_MESSAGES = [
  "ウニを減らすことで、海藻が育ちやすくなります",
  "海藻が増えると、魚たちが戻ってきます",
  "バランスの取れた海の環境を目指しましょう",
  "ウニを適切に駆除して海の環境を守ります",
  "海藻が増えることで生態系が回復していきます"
] as const;

export const INITIAL_CREATURES = [
  { id: 1, type: 'uni' as const, x: 20 },
  { id: 2, type: 'uni' as const, x: 40 },
  { id: 3, type: 'uni' as const, x: 60 },
  { id: 4, type: 'uni' as const, x: 80 },
  { id: 5, type: 'uni' as const, x: 30 },
  { id: 6, type: 'fish' as const, x: 20, y: 20, direction: 1, colorVariant: 'blue' },
  { id: 7, type: 'fish' as const, x: 80, y: 40, direction: -1, colorVariant: 'yellow' },
  { id: 8, type: 'seaweed' as const, x: 70, height: 40, scale: 1 },
  { id: 9, type: 'seaweed' as const, x: 15, height: 35, scale: 1 },
  { id: 10, type: 'seaweed' as const, x: 85, height: 38, scale: 1 },
];