import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import type { ResourceType, Player } from '../../types/game';
import { RESOURCES } from '../../constants/game';

interface DiscardModalProps {
  player: Player;
  onDiscard: (discards: Record<ResourceType, number>) => void;
}

const DiscardModal: React.FC<DiscardModalProps> = ({ player, onDiscard }) => {
  const totalCards = Object.values(player.resources).reduce((a, b) => a + b, 0);
  const requiredDiscard = Math.floor(totalCards / 2);
  
  const [selected, setSelected] = useState<Record<ResourceType, number>>({
    Madera: 0,
    Arcilla: 0,
    Lana: 0,
    Trigo: 0,
    Mineral: 0,
  });

  const currentSelectedTotal = Object.values(selected).reduce((a, b) => a + b, 0);

  const toggleResource = (res: ResourceType, increment: boolean) => {
    const currentVal = selected[res];
    if (increment) {
      if (currentVal < player.resources[res] && currentSelectedTotal < requiredDiscard) {
        setSelected({ ...selected, [res]: currentVal + 1 });
      }
    } else {
      if (currentVal > 0) {
        setSelected({ ...selected, [res]: currentVal - 1 });
      }
    }
  };

  const resourceTypes: ResourceType[] = ['Trigo', 'Lana', 'Madera', 'Arcilla', 'Mineral'];

  return (
    <div className="w-full h-full md:w-[95%] md:max-w-2xl bg-white p-6 md:p-10 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl border-0 md:border-4 border-white text-center relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center overflow-y-auto">
      <div className="mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={32} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">DESCARTAR CARTAS</h2>
        <div className="flex items-center gap-2 justify-center text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 mb-4">
          <AlertTriangle size={16} />
          <span className="text-sm font-bold uppercase tracking-wide">¡Ha salido un 7!</span>
        </div>
        <p className="text-slate-500 font-medium">
          Tienes {totalCards} cartas. Debes descartar <span className="font-black text-red-500">{requiredDiscard}</span> cartas.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-10 w-full">
        {resourceTypes.map(res => {
          const k = Object.keys(RESOURCES).find(key => RESOURCES[key].name === res)!;
          const playerHas = player.resources[res];
          const isSelected = selected[res] > 0;
          
          return (
            <div key={res} className="flex flex-col items-center gap-2">
              <div 
                className={`w-full aspect-[4/5] rounded-xl border-2 transition-all relative overflow-hidden group ${isSelected ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-100'}`}
              >
                {RESOURCES[k].img && (
                  <img 
                    src={RESOURCES[k].img} 
                    alt={res} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity ${playerHas === 0 ? 'opacity-20 grayscale' : 'opacity-90 group-hover:opacity-100'}`} 
                  />
                )}
                <div className="absolute top-1 right-2 z-10 text-white font-black drop-shadow-[0_2px_3px_rgba(0,0,0,1)] text-xs">
                  {playerHas}
                </div>
                {selected[res] > 0 && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-10">
                    <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                      -{selected[res]}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toggleResource(res, false)}
                  disabled={selected[res] === 0}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black disabled:opacity-30"
                >
                  -
                </button>
                <button 
                  onClick={() => toggleResource(res, true)}
                  disabled={selected[res] === playerHas || currentSelectedTotal === requiredDiscard}
                  className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-black disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => onDiscard(selected)}
        disabled={currentSelectedTotal !== requiredDiscard}
        className={`w-full py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${currentSelectedTotal === requiredDiscard ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95' : 'bg-slate-100 text-slate-300 pointer-events-none'}`}
      >
        CONFIRMAR DESCARTE ({currentSelectedTotal}/{requiredDiscard})
      </button>
    </div>
  );
};

export default DiscardModal;
