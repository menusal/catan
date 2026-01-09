import React from 'react';
import { X, Trophy, Swords, Zap, Repeat, Search } from 'lucide-react';
import { DEV_CARD_TYPES } from '../../constants/game';

interface DevCardHandProps {
  hand: string[];
  boughtRecently?: string[];
  onPlay: (cardId: string) => void;
  onClose: () => void;
  canPlay: (cardId: string) => boolean;
}

const DevCardHand: React.FC<DevCardHandProps> = ({ hand, boughtRecently = [], onPlay, onClose, canPlay }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'knight': return <Swords className="text-blue-500" size={32} />;
      case 'vp': return <Trophy className="text-yellow-500" size={32} />;
      case 'road_building': return <Zap className="text-orange-500" size={32} />;
      case 'monopoly': return <Repeat className="text-purple-500" size={32} />;
      case 'year_of_plenty': return <Search className="text-emerald-500" size={32} />;
      default: return null;
    }
  };

  const getCardData = (id: string) => DEV_CARD_TYPES.find(t => t.id === id);

  return (
    <div className="w-full h-full md:w-[95%] md:max-w-3xl bg-white p-6 md:p-10 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl border-0 md:border-4 border-white text-center relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center overflow-y-auto">
      <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
        <X size={32} />
      </button>

      <h2 className="text-3xl font-black text-slate-800 mb-10 uppercase tracking-tight">Mis Cartas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {/* Playable Hand */}
          {hand.map((cardId, i) => {
            const data = getCardData(cardId);
            const playable = canPlay(cardId) && cardId !== 'vp';
            
            return (
              <div 
                key={`hand-${i}`} 
                className={`bg-slate-50 border-2 rounded-[2.5rem] p-6 flex flex-col items-center transition-all ${playable ? 'border-slate-100 hover:border-slate-300 hover:bg-white cursor-pointer active:scale-95' : 'border-slate-100 opacity-60'}`}
                onClick={() => playable && onPlay(cardId)}
              >
                <div className="mb-4 bg-white w-16 h-16 rounded-full shadow-sm flex items-center justify-center border-2 border-slate-50">
                  {getIcon(cardId)}
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase mb-2">{data?.name}</h3>
                <p className="text-sm text-slate-500 font-medium leading-tight mb-6">{data?.description}</p>
                
                {cardId !== 'vp' && (
                  <button 
                    disabled={!playable}
                    className={`mt-auto w-full py-3 rounded-2xl font-black text-[14px] md:text-xs uppercase tracking-widest transition-all ${playable ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}
                  >
                    {playable ? 'USAR AHORA' : (cardId === 'vp' ? 'PUNTO DE VICTORIA' : 'BLOQUEADA')}
                  </button>
                )}
                {cardId === 'vp' && (
                  <div className="mt-auto bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-[14px] md:text-[10px] font-black uppercase">
                    Punto de Victoria (+1)
                  </div>
                )}
              </div>
            );
          })}

          {/* Recently Bought (Unplayable this turn) */}
          {boughtRecently.map((cardId, i) => {
            const data = getCardData(cardId);
            return (
              <div 
                key={`recent-${i}`} 
                className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-[2.5rem] p-6 flex flex-col items-center opacity-70 relative overflow-hidden"
              >
                <div className="absolute top-4 right-6 bg-indigo-600 text-white text-[14px] md:text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">NUEVA</div>
                <div className="mb-4 bg-white w-16 h-16 rounded-full shadow-sm flex items-center justify-center border-2 border-indigo-50">
                  {getIcon(cardId)}
                </div>
                <h3 className="text-xl font-black text-slate-400 uppercase mb-2">{data?.name}</h3>
                <p className="text-[14px] md:text-xs text-slate-400 font-medium leading-tight mb-2">{data?.description}</p>
                <p className="text-[14px] md:text-[10px] text-indigo-400 font-black uppercase tracking-tighter mb-6 italic">No se puede usar en el mismo turno</p>
                
                <div className="mt-auto w-full py-3 bg-slate-200 text-slate-400 rounded-2xl font-black text-[14px] md:text-xs uppercase tracking-widest text-center">
                  ESPERANDO TURNO
                </div>
              </div>
            );
          })}
        </div>
      {hand.length === 0 && boughtRecently.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
           <Zap size={64} className="mb-4 opacity-20" />
           <p className="text-xl font-bold italic">No tienes cartas de desarrollo</p>
        </div>
      )}
    </div>
  );
};

export default DevCardHand;
