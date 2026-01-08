import React from 'react';
import type { Building } from '../../types/game';
import { PLAYER_COLORS } from '../../constants/game';

interface VertexProps {
  x: number;
  y: number;
  id: string;
  building?: Building;
  onClick: (id: string) => void;
}

const Vertex: React.FC<VertexProps> = ({ x, y, id, building, onClick }) => {
  return (
    <circle 
      cx={x} 
      cy={y} 
      r={building ? (building.type === 'city' ? 12 : 9) : 8}
      fill={building ? PLAYER_COLORS[building.playerId] : 'transparent'} 
      stroke={building ? 'white' : 'transparent'}
      strokeWidth="2" 
      className="hover:fill-white/50 cursor-pointer shadow-sm" 
      onClick={() => onClick(id)} 
    />
  );
};

export default Vertex;
