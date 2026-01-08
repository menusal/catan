import React from 'react';
import type { ResourceType } from '../../types/game';
import { RESOURCES } from '../../constants/game';

interface MonopolyModalProps {
  onSelect: (resource: ResourceType) => void;
}

const MonopolyModal: React.FC<MonopolyModalProps> = ({ onSelect }) => {
  const resourceTypes: ResourceType[] = ['Trigo', 'Lana', 'Madera', 'Arcilla', 'Mineral'];

  return (
    <div className="w-full h-full md:w-[95%] md:max-w-xl bg-white p-6 md:p-10 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl border-0 md:border-4 border-white text-center relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">MONOPOLIO</h2>
      <p className="text-slate-500 font-medium mb-10">Elige un recurso. Tomarás todos los que tengan los demás jugadores.</p>

      <div className="grid grid-cols-5 gap-3 w-full">
        {resourceTypes.map(res => {
          const k = Object.keys(RESOURCES).find(key => RESOURCES[key].name === res)!;
          return (
            <button 
              key={res} 
              onClick={() => onSelect(res)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-full aspect-[4/5] rounded-xl border-2 border-slate-100 overflow-hidden relative group-hover:border-indigo-500 transition-all shadow-sm">
                {RESOURCES[k].img && (
                  <img 
                    src={RESOURCES[k].img} 
                    alt={res} 
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  />
                )}
              </div>
              <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-indigo-600">{res}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonopolyModal;
