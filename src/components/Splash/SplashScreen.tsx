import React, { useState } from 'react';
import { Plus, LogIn } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface SplashProps {
  onCreateGame: (name: string) => void;
  onJoinGame: (code: string, name: string) => void;
  isLobby?: boolean;
  gameCode?: string;
  players?: any[];
  onStartGame?: () => void;
  isHost?: boolean;
}

const SplashScreen: React.FC<SplashProps> = ({ 
  onCreateGame, onJoinGame, isLobby, gameCode, players, onStartGame, isHost 
}) => {
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const { requestPermission } = useNotifications();

  if (isLobby) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
        <div className="bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl text-center border border-slate-700 max-w-sm w-full">
          <h2 className="text-3xl font-black text-yellow-500 mb-2 italic">SALA DE ESPERA</h2>
          <div className="bg-slate-900 p-4 rounded-2xl mb-6">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">CÓDIGO DE PARTIDA</p>
            <p className="text-4xl font-black text-white tracking-widest">{gameCode}</p>
          </div>
          
          <div className="space-y-3 mb-8 text-left">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-700 pb-1">JUGADORES ({players?.length}/4)</p>
            {players?.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-xl border border-slate-600/50">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span className="font-bold text-sm">
                  {p.name || `Jugador ${i + 1}`} {i === 0 ? '(Anfitrión)' : ''}
                </span>
              </div>
            ))}
            {Array.from({ length: 4 - (players?.length || 0) }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-900/30 p-3 rounded-xl border border-dashed border-slate-700">
                <div className="w-4 h-4 rounded-full bg-slate-800" />
                <span className="text-slate-600 text-sm italic font-medium">Esperando...</span>
              </div>
            ))}
          </div>

          {isHost ? (
            <button 
              onClick={() => {
                requestPermission();
                onStartGame && onStartGame();
              }}
              disabled={(players?.length || 0) < 2}
              className="w-full py-4 bg-yellow-500 text-slate-900 rounded-3xl font-black text-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
            >
              EMPEZAR PARTIDA
            </button>
          ) : (
            <p className="text-slate-500 text-xs italic animate-pulse">Esperando a que el anfitrión comience...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <div className="bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl text-center border border-slate-700 max-w-sm w-full">
        <h1 className="text-6xl font-black text-yellow-500 mb-2 italic tracking-tighter">CATAN</h1>
        <p className="text-slate-500 text-[10px] mb-8 uppercase font-bold tracking-widest italic">Multiplayer Online Edition</p>
        
        <div className="mb-8 text-left">
          <label className="text-[10px] uppercase font-black text-slate-500 italic tracking-widest mb-1.5 block ml-1 text-center">TU NOMBRE</label>
          <input 
            type="text" 
            placeholder="Introduce tu nombre" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.slice(0, 15))}
            className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl py-3 px-5 text-center text-lg font-black placeholder:text-slate-700 focus:outline-none focus:border-yellow-500 transition-colors uppercase tracking-tight"
          />
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => {
              requestPermission();
              onCreateGame(playerName);
            }}
            disabled={!playerName.trim()}
            className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black text-lg hover:bg-yellow-400 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-30 disabled:hover:scale-100 disabled:bg-white"
          >
            <Plus className="w-6 h-6" strokeWidth={3} /> CREAR PARTIDA
          </button>
          
          <div className="relative pt-4">
            <div className="absolute inset-0 flex items-center px-4" aria-hidden="true">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-800 px-4 text-[10px] uppercase font-black text-slate-500 italic tracking-widest">O ÚNETE A UNA</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <input 
              type="text" 
              placeholder="CÓDIGO" 
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="bg-slate-900 border-2 border-slate-700 rounded-2xl py-4 px-6 text-center text-xl font-black tracking-[0.5em] placeholder:tracking-normal placeholder:text-slate-700 focus:outline-none focus:border-yellow-500 transition-colors"
              maxLength={4}
            />
            <button 
              onClick={() => {
                requestPermission();
                onJoinGame(joinCode, playerName);
              }}
              disabled={joinCode.length < 4 || !playerName.trim()}
              className="w-full py-4 bg-slate-700 text-white rounded-2xl font-black text-sm hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <LogIn className="w-5 h-5" /> ENTRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
