export type ResourceType = 'Madera' | 'Arcilla' | 'Lana' | 'Trigo' | 'Mineral';

export interface ResourceInfo {
  name: string;
  color: string;
  key: string;
  code: string;
}

export type HexType = 'FOREST' | 'HILLS' | 'PASTURE' | 'FIELDS' | 'MOUNTAINS' | 'DESERT';

export interface Hex {
  q: number;
  r: number;
  type: HexType;
  number: number | null;
  id: number;
}

export interface Player {
  id: number;
  name: string;
  resources: Record<ResourceType, number>;
  inventory: {
    settlements: number;
    roads: number;
    cities: number;
  };
  devCardsHand: string[];
  devCardsBoughtThisTurn?: string[];
  knightsPlayed: number;
  maxRoadLength: number;
  points: number;
  playerId?: string;
}

export type BuildingType = 'settlement' | 'city';

export interface Building {
  playerId: number;
  type: BuildingType;
}

export type ActionType = 'settlement' | 'road' | 'city';
export type ViewType = 'board' | 'players' | 'trade' | 'store' | 'costs';

export type GameState = 'START' | 'LOBBY' | 'STARTING' | 'PLAYING' | 'WON';

export interface GameSession {
  gameCode: string;
  hostId: string;
  players: Player[];
  currentPlayer: number;
  gameState: GameState;
  board: Hex[];
  buildings: Record<string, Building>;
  roads: Record<string, number>;
  dice: [number, number];
  logs: string[];
  setupPhase: boolean;
  setupStep: number;
  robberHexId: number;
  devDeck: string[];
  longestRoadPlayer: number;
  largestArmyPlayer: number;
  lastUpdated: number;
  initialRolls?: Record<string, number>;
  waitingForDiscards?: number[]; // indices of players
}

export interface Harbor {
  q: number;
  r: number;
  v: [number, number];
  type: string;
  label: string;
}
