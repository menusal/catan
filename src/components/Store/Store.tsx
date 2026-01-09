import React from 'react';
import { Box, ShoppingCart, ShoppingBag } from 'lucide-react';
import type { Player, ResourceType } from '../../types/game';
import { COSTS } from '../../constants/game';

interface StoreProps {
  player: Player;
  onBuy: () => void;
  devDeckCount: number;
  isMyTurn: boolean;
  hasRolled: boolean;
  setupPhase: boolean;
  onClose: () => void;
}

const Store: React.FC<StoreProps> = ({ player, onBuy, devDeckCount, isMyTurn, hasRolled, setupPhase, onClose }) => {
  const cost = COSTS.devCard;
  const hasResources = Object.entries(cost).every(([res, val]) => player.resources[res as ResourceType] >= (val || 0));
  
  const canBuy = isMyTurn && hasRolled && !setupPhase && hasResources && devDeckCount > 0;
  
  let disabledReason = "";
  if (!isMyTurn) disabledReason = "No es tu turno";
  else if (!hasRolled) disabledReason = "Lanza los dados primero";
  else if (setupPhase) disabledReason = "No disponible en setup";
  else if (!hasResources) disabledReason = "Recursos insuficientes";
  else if (devDeckCount === 0) disabledReason = "Sin existencias";

  return (
    <div className="w-full h-full md:w-[95%] md:max-w-2xl bg-white p-6 md:p-10 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl border-0 md:border-4 border-white text-center relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-start md:justify-center overflow-y-auto pt-16 md:pt-8">
      <button 
        onClick={onClose}
        className="absolute top-4 right-6 md:top-8 md:right-10 p-4 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all active:scale-90"
      >
        <div className="text-xl font-black">✕</div>
      </button>

      <h2 className="text-3xl font-black text-slate-800 mb-8 md:mb-10 flex items-center gap-3 justify-center uppercase tracking-tight">
        <ShoppingCart size={32} className="text-indigo-600" /> TIENDA
      </h2>

      <div className="w-full max-w-md bg-slate-50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-32 bg-indigo-600 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer border-4 border-white">
            <Box size={40} className="text-white opacity-80" />
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-wide">CARTA DE DESARROLLO</h3>
        <p className="text-slate-400 text-sm font-bold mb-8 uppercase tracking-widest">{devDeckCount} DISPONIBLES</p>

        <div className="flex justify-center gap-4 mb-10">
          {Object.entries(cost).map(([res, val]) => {
            const resourceName = res as ResourceType;
            const hasEnough = player.resources[resourceName] >= (val || 0);
            return (
              <div key={res} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm border-2 flex flex-col items-center justify-center mb-2 transition-colors ${hasEnough ? 'border-indigo-100' : 'border-red-100'}`}>
                  <span className="text-xs font-black text-slate-800 leading-none">{val}</span>
                  <div className="w-full border-t border-slate-100 my-0.5" />
                  <span className={`text-[14px] md:text-[10px] font-bold ${hasEnough ? 'text-green-500' : 'text-red-500'}`}>{player.resources[resourceName]}</span>
                </div>
                <span className="text-[14px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">{res}</span>
              </div>
            );
          })}
        </div>

        <button 
          onClick={onBuy}
          disabled={!canBuy}
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl flex flex-col items-center justify-center gap-1 active:scale-95 shadow-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:bg-slate-400 disabled:shadow-none"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} /> 
            <span>COMPRAR</span>
          </div>
          {!canBuy && disabledReason && (
            <span className="text-[14px] md:text-[10px] uppercase tracking-tighter opacity-80">{disabledReason}</span>
          )}
        </button>
      </div>

      <p className="text-[14px] md:text-xs font-black text-slate-400 uppercase tracking-widest max-w-[80%] mx-auto leading-relaxed">
        Las cartas de desarrollo pueden darte Caballeros, Puntos de Victoria o Acciones Especiales.
      </p>
    </div>
  );
};

export default Store;
