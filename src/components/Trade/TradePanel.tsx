import React, { useState } from 'react';
import type { ResourceType, Player } from '../../types/game';
import { RESOURCES } from '../../constants/game';
import { ArrowRightLeft, ChevronRight } from 'lucide-react';

interface TradePanelProps {
  player: Player;
  onTrade: (give: ResourceType, get: ResourceType, rate: number) => void;
  getTradeRate: (res: ResourceType) => number;
  onClose: () => void;
}

const TradePanel: React.FC<TradePanelProps> = ({ player, onTrade, getTradeRate, onClose }) => {
  const [tradeGive, setTradeGive] = useState<ResourceType>('Madera');
  const [tradeGet, setTradeGet] = useState<ResourceType>('Arcilla');

  const handleTrade = () => {
    onTrade(tradeGive, tradeGet, getTradeRate(tradeGive));
  };

  return (
    <div className="w-full h-full md:w-[95%] md:max-w-2xl bg-white p-4 md:p-8 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl border-0 md:border-4 border-white text-center relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-start md:justify-center overflow-y-auto pt-6 md:pt-8">
      <button 
        onClick={onClose}
        className="absolute top-4 right-6 md:top-8 md:right-10 p-4 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all active:scale-90"
      >
        <div className="text-xl font-black">✕</div>
      </button>

      <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 md:mb-8 flex items-center gap-3 justify-center uppercase tracking-tight">
        <ArrowRightLeft size={24} className="text-orange-500" /> BANCA
      </h2>
      <div className="w-full max-w-md md:max-w-xl space-y-4 md:space-y-10">
        <div>
          <label className="text-[14px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 md:mb-6">ENTREGAR</label>
          <div className="grid grid-cols-5 gap-2 md:gap-3 justify-items-center">
            {(['Trigo', 'Lana', 'Madera', 'Arcilla', 'Mineral'] as const).map(res => {
              const k = Object.keys(RESOURCES).find(key => RESOURCES[key].name === res)!;
              const rate = getTradeRate(res);
              const isSelected = tradeGive === res;
              
              return (
                <button 
                  key={k} 
                  onClick={() => setTradeGive(res)} 
                  className={`w-full aspect-[4/5] flex flex-col items-center justify-center rounded-xl border-2 transition-all relative overflow-hidden group ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-100'}`}
                >
                  {RESOURCES[k].img && (
                    <img 
                      src={RESOURCES[k].img} 
                      alt={res} 
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-lg md:text-xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,1)]">{player.resources[res]}</span>
                    <span className="text-[14px] md:text-[10px] text-white font-black drop-shadow-[0_1px_2px_rgba(0,0,0,1)] uppercase">{rate}:1</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-center py-1 md:py-2"><ChevronRight size={24} className="rotate-90 text-slate-200" /></div>
        
        <div>
          <label className="text-[14px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 md:mb-6">RECIBIR 1</label>
          <div className="grid grid-cols-5 gap-2 md:gap-3 justify-items-center">
            {(['Trigo', 'Lana', 'Madera', 'Arcilla', 'Mineral'] as const).map(res => {
              const k = Object.keys(RESOURCES).find(key => RESOURCES[key].name === res)!;
              const isSelected = tradeGet === res;

              return (
                <button 
                  key={k} 
                  onClick={() => setTradeGet(res)} 
                  className={`w-full aspect-[4/5] flex flex-col items-center justify-center rounded-xl border-2 transition-all relative overflow-hidden group ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-100'}`}
                >
                  {RESOURCES[k].img && (
                    <img 
                      src={RESOURCES[k].img} 
                      alt={res} 
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                    />
                  )}
                  <div className="relative z-10">
                    <div className="w-2 h-2 rounded-full bg-white/50 shadow-sm"></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <button 
          onClick={handleTrade} 
          className="w-full py-4 md:py-5 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center gap-3 active:scale-95 shadow-2xl hover:bg-slate-800 transition-all mb-4 md:mb-0"
        >
          INTERCAMBIAR
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
