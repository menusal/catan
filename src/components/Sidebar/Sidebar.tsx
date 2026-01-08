import React from 'react';
import type { Player } from '../../types/game';
import { PLAYER_COLORS, RESOURCES } from '../../constants/game';
import { Zap, Shield, Box, Info, ChevronRight } from 'lucide-react';

interface SidebarProps {
  players: Player[];
  currentPlayer: number;
  longestRoadPlayer: number;
  largestArmyPlayer: number;
  logs: string[];
  onBuyDevCard: () => void;
  onPlayDevCard: (idx: number) => void;
  hasRolled: boolean;
  setupPhase: boolean;
  myPlayerId: string;
  isMyTurn: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  players, currentPlayer, longestRoadPlayer, largestArmyPlayer,
  logs, onBuyDevCard, onPlayDevCard,
  hasRolled, setupPhase, myPlayerId, isMyTurn
}) => {
  const sortedPlayers = [...players]
    .map((p, originalIndex) => ({ ...p, originalIndex }))
    .sort((a, b) => {
      if (a.playerId === myPlayerId) return -1;
      if (b.playerId === myPlayerId) return 1;
      return 0;
    });

  return (
    <aside className="w-full bg-white flex flex-col transition-all">
      <div className="p-8 space-y-8 bg-slate-50/50">
        {sortedPlayers.map((p) => {
          const i = p.originalIndex;
          const isMe = p.playerId === myPlayerId;
          return (
            <div key={i} className={`p-4 rounded-[2rem] border-2 transition-all ${currentPlayer === i ? 'border-orange-500 bg-white shadow-lg' : 'border-slate-100 opacity-60'}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg shadow-sm" style={{ backgroundColor: PLAYER_COLORS[i] }}></div>
                  <span className="font-black text-[10px] text-slate-700 uppercase">{p.name || `J${i+1}`}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-slate-800 text-white px-2 py-1 rounded-full text-[9px] font-black">
                    {p.points} PV
                  </div>
                </div>
              </div>

              {/* Achievements & Stats */}
              <div className="flex flex-wrap gap-2 mb-3">
                {longestRoadPlayer === i && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ring-1 ring-orange-200">
                    <Zap size={10} /> Gran Ruta
                  </div>
                )}
                {largestArmyPlayer === i && (
                  <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ring-1 ring-indigo-200">
                    <Shield size={10} /> Gran Ejército
                  </div>
                )}
                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500 bg-slate-100/50 px-3 py-1 rounded-xl">
                  <div className="flex items-center gap-1">
                    <ChevronRight size={10} className="text-slate-400" /> {p.maxRoadLength || 0} Carreteras
                  </div>
                  <div className="flex items-center gap-1 border-l pl-3 border-slate-200">
                    <Shield size={10} className="text-slate-400" /> {p.knightsPlayed || 0} Caballeros
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {(['Trigo', 'Lana', 'Madera', 'Arcilla', 'Mineral'] as const).map((res) => {
                  const count = p.resources[res];
                  const resourceConfig = Object.values(RESOURCES).find(r => r.name === res);
                  return (
                    <div key={res} className="aspect-[4/5] bg-white rounded-xl flex flex-col items-center justify-center border border-slate-200 overflow-hidden relative group shadow-sm hover:scale-105 transition-transform">
                      {resourceConfig?.img && (
                        <img 
                          src={resourceConfig.img} 
                          alt={res} 
                          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                        />
                      )}
                      <div className="relative z-10">
                        <div className="text-xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,1)]">
                          {isMe ? count : (Object.values(p.resources).reduce((a, b) => a + b, 0))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isMe && (
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-1">
                  Total cartas: {Object.values(p.resources).reduce((a, b) => a + b, 0)}
                </div>
              )}
              {currentPlayer === i && isMe && (
                <div className="pt-3 border-t mt-3">
                  <button 
                    onClick={() => onPlayDevCard(i)} 
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    CARTAS DE DESARROLLO
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {/* ... rest of sidebar ... */}
        
        <div className="p-4 bg-white rounded-[2rem] border border-slate-200 shadow-sm mt-2">
          <button 
            onClick={onBuyDevCard} 
            disabled={!hasRolled || setupPhase || !isMyTurn}
            className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl text-[10px] font-black mb-3 flex items-center justify-center gap-2 uppercase tracking-tighter disabled:opacity-30"
          >
            <Box size={14} /> COMPRAR CARTA DE DESARROLLO
          </button>
          <div className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest border-b pb-1 font-sans">
            <Info size={12} /> Sucesos
          </div>
          <div className="h-24 overflow-hidden pt-1 text-left text-[10px] space-y-1">
            {logs.map((log, i) => (
              <div key={i} className={i === 0 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                {i === 0 ? "→ " : ""}{log}
              </div>
            ))}
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
