// types/game.ts
export type Position = {
  x: number;
  y: number;
};

export type ArmState = 'idle' | 'grabbing' | 'catching';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type CreatureType = 'uni' | 'fish' | 'seaweed';

export interface BaseCreature {
  id: number;
  type: CreatureType;
  x: number;
  y: number;
}

export interface UniCreature extends BaseCreature {
  type: 'uni';
}

export interface FishCreature extends BaseCreature {
  type: 'fish';
  direction: number;
}

export interface SeaweedCreature extends BaseCreature {
  type: 'seaweed';
  scale: number;
  height: number;
}

export type SeaCreature = UniCreature | FishCreature | SeaweedCreature;

export type Particle = {
  id: number;
  x: number;
  y: number;
  angle: number;
  life: number;
};

export interface GameState {

  robotPosition: Position;
  armState: ArmState;
  seaCreatures: SeaCreature[];
  particles: Particle[];
  showWarning: boolean;
  warningMessage: string;
  ecosystemHealth: number;
  seaweedHealth: Record<number, number>;
  gameTimer: number;
  isPlaying: boolean;
  capturedUni: number;
  missionMessages: string[];
  gameCleared: boolean;
}