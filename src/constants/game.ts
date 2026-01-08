import type { HexType, ResourceType, Harbor } from '../types/game';

export const RESOURCES: Record<string, { name: string; color: string; key: string; code: string; img: string }> = {
  FOREST: { name: 'Madera', color: '#228B22', key: 'Madera', code: 'MAD', img: '/assets/resources/wood.png' }, 
  HILLS: { name: 'Arcilla', color: '#8B4513', key: 'Arcilla', code: 'ARC', img: '/assets/resources/brick.png' },   
  PASTURE: { name: 'Lana', color: '#7CFC00', key: 'Lana', code: 'LAN', img: '/assets/resources/sheep.png' },   
  FIELDS: { name: 'Trigo', color: '#FFD700', key: 'Trigo', code: 'TRI', img: '/assets/resources/wheat.png' },   
  MOUNTAINS: { name: 'Mineral', color: '#808080', key: 'Mineral', code: 'MIN', img: '/assets/resources/ore.png' }, 
  DESERT: { name: 'Desierto', color: '#F5DEB3', key: 'Desierto', code: 'DES', img: '' },  
};

export const COSTS: Record<string, Partial<Record<ResourceType, number>>> = {
  road: { Madera: 1, Arcilla: 1 },
  settlement: { Madera: 1, Arcilla: 1, Lana: 1, Trigo: 1 },
  city: { Trigo: 2, Mineral: 3 },
  devCard: { Lana: 1, Trigo: 1, Mineral: 1 }
};

export const HEX_TYPES: HexType[] = [
  'FOREST', 'FOREST', 'FOREST', 'FOREST', 'HILLS', 'HILLS', 'HILLS',
  'PASTURE', 'PASTURE', 'PASTURE', 'PASTURE', 'FIELDS', 'FIELDS', 'FIELDS', 'FIELDS',
  'MOUNTAINS', 'MOUNTAINS', 'MOUNTAINS', 'DESERT'
];

export const NUMBERS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

export const DEV_CARD_TYPES = [
  { id: 'knight', name: 'Caballero', description: 'Mueve al ladrón y roba una carta.' },
  { id: 'vp', name: 'Punto de Victoria', description: 'Te otorga 1 punto de victoria (no se juega).' },
  { id: 'road_building', name: 'Construcción de Rutas', description: 'Coloca 2 carreteras gratis.' },
  { id: 'monopoly', name: 'Monopolio', description: 'Elige un recurso y toma todos los que tengan los rivales.' },
  { id: 'year_of_plenty', name: 'Año de Abundancia', description: 'Toma 2 recursos cualesquiera de la banca.' },
];

// --- GEOMETRÍA DEL TABLERO ---
export const HEX_SIZE = 48;
export const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
export const HEX_HEIGHT = 2 * HEX_SIZE;
export const CENTER_X = 300;
export const CENTER_Y = 300;

export const HEX_COORDS = [
  { q: 0, r: -2 }, { q: 1, r: -2 }, { q: 2, r: -2 },
  { q: -1, r: -1 }, { q: 0, r: -1 }, { q: 1, r: -1 }, { q: 2, r: -1 },
  { q: -2, r: 0 }, { q: -1, r: 0 }, { q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 },
  { q: -2, r: 1 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 1 },
  { q: -2, r: 2 }, { q: -1, r: 2 }, { q: 0, r: 2 }
];

export const HARBORS_CONFIG: Harbor[] = [
  { q: 0, r: -2, v: [4, 5], type: "3:1", label: "3:1" },
  { q: 1, r: -2, v: [5, 0], type: "Trigo", label: "TRI" },
  { q: 2, r: -1, v: [5, 0], type: "Mineral", label: "MIN" },
  { q: 2, r: 0, v: [0, 1], type: "3:1", label: "3:1" },
  { q: 1, r: 1, v: [1, 2], type: "Lana", label: "LAN" },
  { q: 0, r: 2, v: [1, 2], type: "3:1", label: "3:1" },
  { q: -1, r: 2, v: [2, 3], type: "Arcilla", label: "ARC" },
  { q: -2, r: 1, v: [3, 4], type: "3:1", label: "3:1" },
  { q: -1, r: -1, v: [4, 5], type: "Madera", label: "MAD" },
];

export const PLAYER_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'];
