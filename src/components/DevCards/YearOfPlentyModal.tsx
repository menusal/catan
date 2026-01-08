import React, { useState } from 'react';
import type { ResourceType } from '../../types/game';
import { RESOURCES } from '../../constants/game';

interface YearOfPlentyModalProps {
  onSelect: (r1: ResourceType, r2: ResourceType) => void;
}

const YearOfPlentyModal: React.FC<YearOfPlentyModalProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<ResourceType[]>([]);
  const resourceTypes: ResourceType[] = ['Trigo', 'Lana', 'Madera', 'Arcilla', 'Mineral'];

  const toggle = (res: ResourceType) => {
    if (selected.includes(res)) {
      setSelected(selected.filter(r => r !== res));
    } else if (selected.length < 2) {
      setSelected([...selected, res]);
    }
  };

  return (
    <div className="w-full h-full md:w-[95%] md:max-w-xl bg-white p-6 md:p-10 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl border-0 md:border-4 border-white text-center relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">AÑO DE ABUNDANCIA</h2>
      <p className="text-slate-500 font-medium mb-10">Elige 2 materiales cualesquiera de la banca.</p>

      <div className="grid grid-cols-5 gap-3 w-full mb-10">
        {resourceTypes.map(res => {
          const k = Object.keys(RESOURCES).find(key => RESOURCES[key].name === res)!;
          const isSelected = selected.includes(res);
          const count = selected.filter(r => r === res).length;
          
          return (
            <div key={res} className="relative flex flex-col items-center gap-2">
              <button 
                onClick={() => toggle(res)}
                className={`w-full aspect-[4/5] rounded-xl border-2 overflow-hidden relative transition-all shadow-sm ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-100 hover:border-slate-300'}`}
              >
                {RESOURCES[k].img && (
                  <img 
                    src={RESOURCES[k].img} 
                    alt={res} 
                    className="absolute inset-0 w-full h-full object-cover opacity-90" 
                  />
                )}
                {count > 0 && (
                  <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center z-10">
                    <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                      +{count}
                    </span>
                  </div>
                )}
              </button>
              <span className="text-[10px] font-black uppercase text-slate-500">{res}</span>
              
              <div className="flex gap-1">
                 <button onClick={() => setSelected([...selected, res])} disabled={selected.length >= 2} className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-black disabled:opacity-20">+</button>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => onSelect(selected[0], selected[1])}
        disabled={selected.length !== 2}
        className={`w-full py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${selected.length === 2 ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95' : 'bg-slate-100 text-slate-300 pointer-events-none'}`}
      >
        TOMAR MATERIALES
      </button>
    </div>
  );
};

export default YearOfPlentyModal;
