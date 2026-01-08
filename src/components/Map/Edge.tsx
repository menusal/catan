import React from 'react';
import { PLAYER_COLORS } from '../../constants/game';

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  owner?: number;
  onClick: (id: string) => void;
}

const Edge: React.FC<EdgeProps> = ({ x1, y1, x2, y2, id, owner, onClick }) => {
  return (
    <line 
      x1={x1} 
      y1={y1} 
      x2={x2} 
      y2={y2} 
      stroke={owner !== undefined ? PLAYER_COLORS[owner] : 'transparent'} 
      strokeWidth={owner !== undefined ? 6 : 14} 
      strokeLinecap="round" 
      className="hover:stroke-black/10 cursor-pointer"
      onClick={() => onClick(id)} 
    />
  );
};

export default Edge;
