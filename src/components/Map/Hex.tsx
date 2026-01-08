import React from 'react';
import type { Hex as HexType } from '../../types/game';
import { HEX_WIDTH, HEX_HEIGHT, CENTER_X, CENTER_Y } from '../../constants/game';
import { getVertexPos } from '../../utils/game';
import { Ghost } from 'lucide-react';

interface HexProps {
  hex: HexType;
  isMovingRobber: boolean;
  robberHexId: number;
  onHexClick: (id: number) => void;
}

const Hex: React.FC<HexProps> = ({ hex, isMovingRobber, robberHexId, onHexClick }) => {
  const hx = HEX_WIDTH * (hex.q + hex.r / 2) + CENTER_X;
  const hy = HEX_HEIGHT * (3 / 4) * hex.r + CENTER_Y;
  
  const vertices = [0, 1, 2, 3, 4, 5].map(i => {
    const p = getVertexPos(hex.q, hex.r, i);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <g>
      <polygon 
        points={vertices} 
        fill={`url(#pattern-${hex.type})`} 
        stroke="#333" 
        strokeWidth="1.5" 
        onClick={() => onHexClick(hex.id)} 
        className={isMovingRobber ? 'cursor-pointer hover:opacity-80' : ''} 
      />
      {hex.number && (
        <g pointerEvents="none">
          <circle cx={hx} cy={hy} r="12" fill="white" stroke="#333" fillOpacity="0.8" />
          <text 
            x={hx} 
            y={hy} 
            textAnchor="middle" 
            alignmentBaseline="middle" 
            fontSize="10" 
            fontWeight="900" 
            fill={hex.number === 6 || hex.number === 8 ? 'red' : '#333'}
          >
            {hex.number}
          </text>
        </g>
      )}
      {hex.id === robberHexId && (
        <g pointerEvents="none">
          <circle cx={hx} cy={hy - 12} r="14" fill="#334155" stroke="#fff" strokeWidth="1.5" />
          <Ghost x={hx - 7} y={hy - 19} size={14} className="text-white" />
        </g>
      )}
    </g>
  );
};

export default Hex;
