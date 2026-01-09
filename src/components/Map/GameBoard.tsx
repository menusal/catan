import { useState, useRef, useCallback } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import type { Hex as HexType, Building, ActionType } from '../../types/game';
import { HARBORS_CONFIG, RESOURCES } from '../../constants/game';
import { getVertexPos } from '../../utils/game';
import Hex from './Hex';
import Harbor from './Harbor';
import Edge from './Edge';
import Vertex from './Vertex';
import { Triangle, Waypoints, Landmark, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface GameBoardProps {
  board: HexType[];
  buildings: Record<string, Building>;
  roads: Record<string, number>;
  isMovingRobber: boolean;
  robberHexId: number;
  onHexClick: (id: number) => void;
  onVertexClick: (id: string) => void;
  onRoadClick: (id: string) => void;
  selectedAction: ActionType;
  setSelectedAction: (action: ActionType) => void;
  dice: [number, number];
  onRollDice: () => void;
  isMyTurn: boolean;
  hasRolled: boolean;
  setupPhase: boolean;
  inventory?: {
    settlements: number;
    roads: number;
    cities: number;
  };
}

const GameBoard: React.FC<GameBoardProps> = ({
  board, buildings, roads, isMovingRobber, robberHexId,
  onHexClick, onVertexClick, onRoadClick,
  selectedAction, setSelectedAction, dice, inventory,
  onRollDice, isMyTurn, hasRolled, setupPhase
}) => {
  const [viewState, setViewState] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setViewState(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta))
    }));
  };

  const resetView = () => setViewState({ scale: 1, x: 0, y: 0 });

  const startPan = (x: number, y: number) => {
    setIsPanning(true);
    lastPos.current = { x, y };
  };

  const movePan = useCallback((x: number, y: number) => {
    if (!isPanning) return;
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    setViewState(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy
    }));
    lastPos.current = { x, y };
  }, [isPanning]);

  const endPan = () => setIsPanning(false);

  const onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) startPan(e.clientX, e.clientY);
  };

  const onMouseMove = (e: MouseEvent) => movePan(e.clientX, e.clientY);

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) startPan(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1) movePan(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full max-w-[600px] max-h-[600px] bg-white rounded-[2rem] shadow-xl flex items-center justify-center border-[4px] border-white relative overflow-hidden ${isMovingRobber ? 'ring-4 ring-red-500' : ''}`}
      style={{ transform: 'translateZ(0)' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endPan}
      onMouseLeave={endPan}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={endPan}
    >
      <svg 
        viewBox="0 0 600 600" 
        className="w-full h-full touch-none select-none"
        shapeRendering="geometricPrecision"
      >
        <defs>
          {Object.entries(RESOURCES).map(([key, config]) => (
            <pattern 
              key={`pattern-${key}`} 
              id={`pattern-${key}`} 
              patternUnits="objectBoundingBox" 
              patternContentUnits="objectBoundingBox"
              width="1" height="1"
            >
              <rect width="1" height="1" fill={config.color} />
              {config.img && (
                <image 
                  href={config.img} 
                  x="0" y="0" 
                  width="1" height="1" 
                  preserveAspectRatio="xMidYMid meet"
                  style={{ imageRendering: 'high-quality', WebkitImageRendering: '-webkit-optimize-contrast' } as any}
                />
              )}
            </pattern>
          ))}
        </defs>
        <g transform={`translate(${viewState.x}, ${viewState.y}) scale(${viewState.scale})`} style={{ transformOrigin: 'center', willChange: 'transform' }}>
          {HARBORS_CONFIG.map((h, i) => (
            <Harbor key={`harbor-${i}`} harbor={h} buildings={buildings} />
          ))}
          {board.map(hex => (
            <g key={hex.id}>
              <Hex 
                hex={hex} 
                isMovingRobber={isMovingRobber} 
                robberHexId={robberHexId} 
                onHexClick={onHexClick} 
              />
              {[0, 1, 2, 3, 4, 5].map(i => {
                const p1 = getVertexPos(hex.q, hex.r, i);
                const p2 = getVertexPos(hex.q, hex.r, (i + 1) % 6);
                const eId = [`${p1.x}-${p1.y}`, `${p2.x}-${p2.y}`].sort().join('|');
                return (
                  <Edge 
                    key={`e-${hex.id}-${i}`}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    id={eId}
                    owner={roads[eId]}
                    onClick={onRoadClick}
                  />
                );
              })}
              {[0, 1, 2, 3, 4, 5].map(i => {
                const p = getVertexPos(hex.q, hex.r, i);
                const vId = `${p.x}-${p.y}`;
                return (
                  <Vertex 
                    key={`v-${hex.id}-${i}`}
                    x={p.x} y={p.y}
                    id={vId}
                    building={buildings[vId]}
                    onClick={onVertexClick}
                  />
                );
              })}
            </g>
          ))}
        </g>
      </svg>
      
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
        <button 
          onClick={() => handleZoom(0.25)} 
          className="p-3 rounded-xl bg-white/80 backdrop-blur shadow-lg border border-slate-100 text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          onClick={() => handleZoom(-0.25)} 
          className="p-3 rounded-xl bg-white/80 backdrop-blur shadow-lg border border-slate-100 text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
        >
          <ZoomOut size={18} />
        </button>
        <button 
          onClick={resetView} 
          className="p-3 rounded-xl bg-white/80 backdrop-blur shadow-lg border border-slate-100 text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-40">
        <button 
          onClick={() => setSelectedAction('settlement')} 
          className={`p-3.5 rounded-2xl shadow-xl border-2 transition-all relative ${selectedAction === 'settlement' ? 'bg-slate-800 text-white border-slate-900 scale-110' : 'bg-white text-slate-400 border-slate-50'}`}
        >
          <Triangle size={20} />
          {inventory && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[14px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {inventory.settlements}
            </span>
          )}
        </button>
        <button 
          onClick={() => setSelectedAction('road')} 
          className={`p-3.5 rounded-2xl shadow-xl border-2 transition-all relative ${selectedAction === 'road' ? 'bg-slate-800 text-white border-slate-900 scale-110' : 'bg-white text-slate-400 border-slate-50'}`}
        >
          <Waypoints size={20} />
          {inventory && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-white text-[14px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {inventory.roads}
            </span>
          )}
        </button>
        <button 
          onClick={() => setSelectedAction('city')} 
          className={`p-3.5 rounded-2xl shadow-xl border-2 transition-all relative ${selectedAction === 'city' ? 'bg-slate-800 text-white border-slate-900 scale-110' : 'bg-white text-slate-400 border-slate-50'}`}
        >
          <Landmark size={20} />
          {inventory && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-500 text-white text-[14px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {inventory.cities}
            </span>
          )}
        </button>
      </div>

      {isMyTurn && !hasRolled && !setupPhase && !isMovingRobber && (
        <button 
          onClick={onRollDice}
          className="absolute bottom-20 right-4 bg-yellow-500 text-slate-900 px-6 py-4 rounded-2xl font-black shadow-2xl hover:bg-yellow-400 animate-bounce active:scale-95 transition-all z-50 border-4 border-slate-900"
        >
          LANZAR DADOS
        </button>
      )}

      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-3xl shadow-2xl z-40">
        <div className="flex gap-1.5 font-black text-lg">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dice[0] ? 'bg-yellow-500 text-slate-900' : 'bg-white/20'}`}>
            {dice[0] || '?'}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dice[1] ? 'bg-yellow-500 text-slate-900' : 'bg-white/20'}`}>
            {dice[1] || '?'}
          </div>
        </div>
        <div className="text-3xl font-black text-yellow-400 ml-2">{dice[0] + dice[1] || ''}</div>
      </div>
    </div>
  );
};

export default GameBoard;
