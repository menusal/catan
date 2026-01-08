import React from 'react';
import type { Harbor as HarborType, Building } from '../../types/game';
import { PLAYER_COLORS, HEX_WIDTH, HEX_HEIGHT, CENTER_X, CENTER_Y } from '../../constants/game';
import { getVertexPos } from '../../utils/game';

interface HarborProps {
  harbor: HarborType;
  buildings: Record<string, Building>;
}

const Harbor: React.FC<HarborProps> = ({ harbor, buildings }) => {
  const v1 = getVertexPos(harbor.q, harbor.r, harbor.v[0]);
  const v2 = getVertexPos(harbor.q, harbor.r, harbor.v[1]);
  const b1 = buildings[`${v1.x}-${v1.y}`];
  const b2 = buildings[`${v2.x}-${v2.y}`];
  const owner = b1 || b2;

  const hx = HEX_WIDTH * (harbor.q + harbor.r / 2) + CENTER_X;
  const hy = HEX_HEIGHT * (3 / 4) * harbor.r + CENTER_Y;
  const midX = (v1.x + v2.x) / 2;
  const midY = (v1.y + v2.y) / 2;
  const px = midX + (midX - hx) * 0.75;
  const py = midY + (midY - hy) * 0.75;

  return (
    <g>
      <line x1={px} y1={py} x2={v1.x} y2={v1.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={px} y1={py} x2={v2.x} y2={v2.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
      <circle 
        cx={px} 
        cy={py} 
        r="15" 
        fill={owner ? PLAYER_COLORS[owner.playerId] : "#f8fafc"} 
        stroke="#475569" 
        strokeWidth="1.2" 
      />
      <text 
        x={px} 
        y={py} 
        textAnchor="middle" 
        alignmentBaseline="middle" 
        fontSize="8" 
        fontWeight="900" 
        fill={owner ? "white" : "#1e293b"}
      >
        {harbor.label}
      </text>
    </g>
  );
};

export default Harbor;
