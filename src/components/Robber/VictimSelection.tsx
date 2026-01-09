import React from 'react';
import { User, ShieldAlert } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants/game';
import type { Player } from '../../types/game';

interface VictimSelectionProps {
  candidates: number[];
  players: Player[];
  onSelect: (idx: number) => void;
}

const VictimSelection: React.FC<VictimSelectionProps> = ({ candidates, players, onSelect }) => {
  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-white text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldAlert size={32} className="text-red-500" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">
        ROBAR RECURSO
      </h2>
      <p className="text-slate-500 text-sm font-bold mb-8 uppercase tracking-widest">
        ELIGE A UNA VÍCTIMA
      </p>

      <div className="space-y-3 mb-2">
        {candidates.map((idx) => {
          const player = players[idx];
          const totalCards = Object.values(player.resources).reduce((a, b) => a + b, 0);
          
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border-2 border-slate-100 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: PLAYER_COLORS[idx] }}
                >
                  <User size={20} />
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-800 text-sm italic uppercase">{player.name || `Jugador ${idx + 1}`}</div>
                  <div className="text-[14px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {totalCards} CARTAS DISPONIBLES
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                <div className="w-2 h-2 rounded-full bg-current" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VictimSelection;
