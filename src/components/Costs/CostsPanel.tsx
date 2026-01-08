import React from 'react';
import { ScrollText, HardHat, Home, Building2, ShoppingBag } from 'lucide-react';
import type { ResourceType } from '../../types/game';
import { COSTS, RESOURCES } from '../../constants/game';

interface CostsPanelProps {
  onClose: () => void;
}

const CostsPanel: React.FC<CostsPanelProps> = ({ onClose }) => {
  const buildingTypes = [
    { id: 'road', name: 'Carretera', icon: <HardHat className="text-orange-500" />, cost: COSTS.road },
    { id: 'settlement', name: 'Poblado', icon: <Home className="text-emerald-500" />, cost: COSTS.settlement },
    { id: 'city', name: 'Ciudad', icon: <Building2 className="text-indigo-500" />, cost: COSTS.city },
    { id: 'devCard', name: 'Carta de Desarrollo', icon: <ShoppingBag className="text-purple-500" />, cost: COSTS.devCard },
  ];

  return (
    <div className="w-full h-full md:w-[95%] md:max-w-3xl bg-white p-6 md:p-10 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl border-0 md:border-4 border-white text-center relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-start md:justify-center overflow-y-auto pt-16 md:pt-8">
      <button 
        onClick={onClose}
        className="absolute top-4 right-6 md:top-8 md:right-10 p-4 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all active:scale-90"
      >
        <div className="text-xl font-black">✕</div>
      </button>

      <h2 className="text-3xl font-black text-slate-800 mb-8 md:mb-12 flex items-center gap-3 justify-center uppercase tracking-tight">
        <ScrollText size={32} className="text-slate-600" /> COSTES
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-2xl">
        {buildingTypes.map((b) => (
          <div key={b.id} className="bg-slate-50 rounded-[2rem] p-6 border-2 border-slate-100 flex flex-col items-center group hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              {b.icon}
              <span className="text-xl font-black text-slate-700 tracking-tight uppercase">{b.name}</span>
            </div>
            
            <div className="flex gap-3">
              {Object.entries(b.cost).map(([res, val]) => {
                const resourceName = res as ResourceType;
                const resourceConfig = Object.values(RESOURCES).find(r => r.name === resourceName);
                
                return (
                  <div key={res} className="relative flex flex-col items-center">
                    <div className="w-14 h-18 md:w-16 md:h-20 aspect-[4/5] rounded-xl border-2 border-slate-200 overflow-hidden relative group shadow-sm">
                      {resourceConfig?.img && (
                        <img 
                          src={resourceConfig.img} 
                          alt={res} 
                          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="text-2xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,1)]">
                          {val}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CostsPanel;
