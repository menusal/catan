import { useState, useEffect } from 'react';
import { useFirestoreGame } from './hooks/useFirestoreGame';
import { useGameState } from './hooks/useGameState';
import { PLAYER_COLORS } from './constants/game';
import GameBoard from './components/Map/GameBoard';
import Sidebar from './components/Sidebar/Sidebar';
import TradePanel from './components/Trade/TradePanel';
import SplashScreen from './components/Splash/SplashScreen';
import { Trophy, Home, Map as MapIcon, ArrowRightLeft, ChevronRight } from 'lucide-react';

import Store from './components/Store/Store';
import VictimSelection from './components/Robber/VictimSelection';
import DiscardModal from './components/Discard/DiscardModal';
import CostsPanel from './components/Costs/CostsPanel';
import DevCardHand from './components/DevCards/DevCardHand';
import MonopolyModal from './components/DevCards/MonopolyModal';
import YearOfPlentyModal from './components/DevCards/YearOfPlentyModal';
import Confetti from './components/Effects/Confetti';
import Notification from './components/UI/Notification';
import { ScrollText, PartyPopper } from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const {
    gameSession,
    playerId,
    createGame,
    joinGame,
    startGameRemote,
    updateState,
    subscribeToGame
  } = useFirestoreGame();

  const {
    activeView, setActiveView,
    selectedAction, setSelectedAction,
    isMovingRobber,
    players, board, buildings, roads, dice, logs, setupPhase, currentPlayerIdx,
    isMyTurn,
    handleVertexClick,
    handleRoadClick,
    handleHexClick,
    handleTrade,
    getTradeRate,
    rollDice,
    nextTurn,
    rollInitialDice,
    hasRolledInitial,
    buyDevCard,
    devDeckCount,
    stealCandidates,
    stealFromPlayer,
    waitingForDiscards,
    discardCards,
    playDevCard,
    canPlayDevCard,
    notification,
    notify,
    clearNotification
  } = useGameState(gameSession, updateState, playerId);

  const [showingDevHand, setShowingDevHand] = useState(false);
  const [monopolyCard, setMonopolyCard] = useState<string | null>(null);
  const [yearOfPlentyCard, setYearOfPlentyCard] = useState<string | null>(null);
  const { sendTurnNotification, requestPermission } = useNotifications();

  const [error, setError] = useState<string | null>(null);
  const [activeCode, setActiveCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('game');
    if (code) setActiveCode(code);
  }, []);

  useEffect(() => {
    if (activeCode) {
      const unsubscribe = subscribeToGame(activeCode);
      return () => unsubscribe();
    }
  }, [activeCode, subscribeToGame]);

  // Victory safety net
  useEffect(() => {
    if (gameSession?.gameState === 'PLAYING' && isMyTurn) {
        const winner = gameSession.players.find(p => p.points >= 10);
        if (winner) {
          updateState({ gameState: 'WON' });
        }
    }
  }, [gameSession?.players, gameSession?.gameState, isMyTurn, updateState]);

  // Turn Notification
  useEffect(() => {
    if (isMyTurn && document.hidden) {
      sendTurnNotification();
    }
  }, [isMyTurn, sendTurnNotification]);

  // Ask for permission on first interaction or game start
  useEffect(() => {
    if (gameSession?.gameState === 'PLAYING') {
      requestPermission();
    }
  }, [gameSession?.gameState, requestPermission]);

  const handleCreate = async (name: string) => {
    try {
      const code = await createGame(name);
      window.history.pushState({}, '', `?game=${code}`);
      setActiveCode(code);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleJoin = async (code: string, name: string) => {
    try {
      await joinGame(code, name);
      window.history.pushState({}, '', `?game=${code}`);
      setActiveCode(code);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStart = async () => {
    if (gameSession) {
      await startGameRemote(gameSession.gameCode);
    }
  };

  if (!gameSession || gameSession.gameState === 'LOBBY' || gameSession.gameState === 'STARTING') {
    return (
      <>
        {gameSession?.gameState === 'STARTING' ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
            <div className="bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl text-center border border-slate-700 max-w-sm w-full">
              <h2 className="text-4xl font-black text-yellow-500 mb-6 italic uppercase">Orden de Juego</h2>
              <p className="text-slate-400 text-sm mb-8">Todos los jugadores deben tirar los dados para decidir quién empieza.</p>
              
              <div className="space-y-4 mb-8">
                {gameSession.players.map((p, i) => {
                  const roll = gameSession.initialRolls?.[p.playerId!];
                  return (
                    <div key={i} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLAYER_COLORS[i] }} />
                        <span className="font-bold">{p.name || `Jugador ${i + 1}`}</span>
                      </div>
                      {roll ? (
                        <span className="text-yellow-500 font-black text-2xl">{roll}</span>
                      ) : (
                        <span className="text-slate-600 italic text-xs">Esperando...</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {!hasRolledInitial ? (
                <button 
                  onClick={rollInitialDice}
                  className="w-full py-5 bg-yellow-500 text-slate-900 rounded-3xl font-black text-lg hover:bg-yellow-400 transition-all shadow-xl"
                >
                  TIRAR DADOS
                </button>
              ) : (
                <div className="py-4 text-slate-500 italic animate-pulse text-sm">
                  {gameSession.hostId === playerId ? "Esperando al resto para calcular el orden..." : "Esperando al anfitrión..."}
                </div>
              )}
            </div>
          </div>
        ) : (
          <SplashScreen 
            onCreateGame={handleCreate} 
            onJoinGame={handleJoin}
            isLobby={!!gameSession}
            gameCode={gameSession?.gameCode}
            players={gameSession?.players}
            onStartGame={handleStart}
            isHost={gameSession?.hostId === playerId}
          />
        )}
        {error && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50">
            {error}
            <button onClick={() => setError(null)} className="ml-4 opacity-50">✕</button>
          </div>
        )}
      </>
    );
  }

  if (gameSession.gameState === 'WON') {
    const winnerIdx = gameSession.players.findIndex(p => p.points >= 10);
    const winnerColor = PLAYER_COLORS[winnerIdx] || '#fbbf24';
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 text-center">
        <Confetti />
        <div className="relative">
          <PartyPopper size={120} className="text-yellow-500 mb-6 animate-bounce" />
          <Trophy size={60} className="absolute -top-4 -right-4 text-white animate-pulse" />
        </div>
        
        <h1 className="text-7xl font-black mb-4 uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-2xl">
          ¡VICTORIA!
        </h1>
        
        <div className="bg-slate-800 p-8 rounded-[3rem] shadow-2xl border-4 border-yellow-500/30 mb-10 scale-110">
          <p className="text-3xl font-black mb-2 uppercase tracking-tight">
            {gameSession.players[winnerIdx]?.name || `Jugador ${winnerIdx + 1}`}
          </p>
          <div className="w-24 h-2 mx-auto rounded-full mb-4" style={{ backgroundColor: winnerColor }} />
          <p className="text-slate-400 font-bold italic">Ha colonizado Catan con éxito.</p>
        </div>

        <button 
          onClick={() => window.location.href = '/'} 
          className="px-12 py-5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-full font-black text-xl shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all hover:scale-105 active:scale-95"
        >
          SALIR AL MENÚ PRINCIPAL
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
      <div className="bg-white border-b px-2 py-1.5 flex flex-col md:flex-row items-center justify-between shadow-sm z-30">
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-2 mb-2 md:mb-0 px-2 md:px-0">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(gameSession.gameCode);
              notify("Código copiado al portapapeles", "info");
            }}
            className="font-black text-slate-800 italic text-sm uppercase tracking-tighter hover:text-indigo-600 transition-colors cursor-copy active:scale-95"
          >
            CATAN ONLINE - {gameSession.gameCode}
          </button>
          <button onClick={() => window.location.href = '/'} className="md:hidden p-1 text-slate-300 hover:text-red-500"><Home size={18} /></button>
        </div>
        <div className="flex bg-slate-100 p-0.5 rounded-xl w-[95%] md:w-auto shadow-inner">
          <button 
            onClick={() => setActiveView('board')} 
            className={`flex-1 md:flex-none px-4 py-3 md:py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeView === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            <MapIcon size={14} /> <span className="hidden xs:inline">MAPA</span>
          </button>
          <button 
            onClick={() => setActiveView('trade')} 
            className={`flex-1 md:flex-none px-4 py-3 md:py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeView === 'trade' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            <ArrowRightLeft size={14} /> <span className="hidden xs:inline">BANCA</span>
          </button>
          <button 
            onClick={() => setActiveView('costs')} 
            className={`flex-1 md:flex-none px-4 py-3 md:py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeView === 'costs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            <ScrollText size={14} /> <span className="hidden xs:inline">COSTES</span>
          </button>
        </div>
        <button onClick={() => window.location.href = '/'} className="hidden md:block p-1 text-slate-300 ml-4 hover:text-red-500"><Home size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-100 flex flex-col">
        {/* Board Area */}
        <main className={`relative h-[calc(100vh-5rem)] shrink-0 bg-slate-200 border-b border-slate-300 shadow-inner flex flex-col items-center justify-center p-4 z-10 ${activeView === 'board' ? 'block' : 'hidden'}`}>
          {!isMyTurn && (
            <div className="absolute inset-0 bg-slate-900/10 z-10 flex items-start justify-center pt-24 pointer-events-none">
              <span className="bg-slate-900 text-white px-6 py-4 rounded-full text-base font-black shadow-2xl uppercase tracking-widest border border-white/20">Esperando tu turno...</span>
            </div>
          )}
          
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-6 py-2 rounded-full shadow-2xl border border-white z-10 flex items-center gap-3 max-w-[90%] scale-110">
             <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.2)]" style={{ backgroundColor: PLAYER_COLORS[currentPlayerIdx] }}></div>
              <span className={`text-xs font-black uppercase truncate tracking-wider ${isMovingRobber ? 'text-red-600' : 'text-slate-800'}`}>
               {waitingForDiscards.length > 0 ? "ESPERANDO DESCARTES..." : isMovingRobber ? "¡MUEVE AL LADRÓN!" : setupPhase ? `Setup: ${players[currentPlayerIdx]?.name || `J${currentPlayerIdx+1}`}` : `Turno ${players[currentPlayerIdx]?.name || `J${currentPlayerIdx+1}`}`}
             </span>
          </div>

          <GameBoard 
            board={board}
            buildings={buildings}
            roads={roads}
            isMovingRobber={isMovingRobber}
            robberHexId={gameSession.robberHexId}
            onHexClick={handleHexClick} 
            onVertexClick={isMyTurn ? handleVertexClick : () => {}}
            onRoadClick={isMyTurn ? handleRoadClick : () => {}} 
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
            dice={dice}
            onRollDice={rollDice}
            isMyTurn={!!isMyTurn}
            hasRolled={(gameSession as any).hasRolled}
            setupPhase={setupPhase}
            inventory={players.find(p => p.playerId === playerId)?.inventory}
          />
        </main>

        {/* Floating/Fixed Actions below the board */}
        <div className="w-full max-w-screen-md mx-auto px-4 md:px-8 -mt-8 mb-4 relative z-20">
          <button 
            onClick={nextTurn} 
            disabled={(!(gameSession as any).hasRolled && !setupPhase) || isMovingRobber || !isMyTurn}
            className={`w-full py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.2)] border-4 border-white ${(!(gameSession as any).hasRolled && !setupPhase) || isMovingRobber || !isMyTurn ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-orange-500 text-white hover:bg-orange-600 animate-in fade-in slide-in-from-bottom-2'}`}
          >
            {isMyTurn ? "PASAR TURNO" : "ESPERANDO TURNO"} <ChevronRight size={20} />
          </button>
        </div>

        {/* Global Sidebar/Info Content - Now centered in a card below the board */}
        <div className="flex-1 w-full max-w-screen-md mx-auto p-4 md:p-8">
          <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">
            <Sidebar 
              players={players}
              currentPlayer={currentPlayerIdx}
              longestRoadPlayer={gameSession.longestRoadPlayer}
              largestArmyPlayer={gameSession.largestArmyPlayer}
              logs={logs}
              onBuyDevCard={() => setActiveView('store')} 
              onPlayDevCard={(idx) => {
                const p = players[idx];
                if (p.playerId === playerId) setShowingDevHand(true);
              }} 
              hasRolled={(gameSession as any).hasRolled}
              setupPhase={setupPhase}
              myPlayerId={playerId}
              isMyTurn={!!isMyTurn}
            />
          </div>
        </div>

        {activeView === 'trade' && (
          <div className="absolute inset-0 bg-white md:bg-slate-900/40 md:backdrop-blur-md z-40 flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <TradePanel 
              player={players[players.findIndex(p => p.playerId === playerId)]}
              onTrade={handleTrade}
              getTradeRate={getTradeRate}
              onClose={() => setActiveView('board')}
            />
          </div>
        )}


        {activeView === 'store' && (
          <div className="absolute inset-0 bg-white md:bg-slate-900/40 md:backdrop-blur-md z-40 flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <Store 
              player={players[players.findIndex(p => p.playerId === playerId)]}
              onBuy={buyDevCard}
              devDeckCount={devDeckCount}
              isMyTurn={!!isMyTurn}
              hasRolled={!!(gameSession as any).hasRolled}
              setupPhase={setupPhase}
              onClose={() => setActiveView('board')}
            />
          </div>
        )}

        {activeView === 'costs' && (
          <div className="absolute inset-0 bg-white md:bg-slate-900/40 md:backdrop-blur-md z-40 flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <CostsPanel onClose={() => setActiveView('board')} />
          </div>
        )}
        {stealCandidates.length > 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <VictimSelection 
              candidates={stealCandidates}
              players={players}
              onSelect={stealFromPlayer}
            />
          </div>
        )}

        {waitingForDiscards.includes(players.findIndex(p => p.playerId === playerId)) && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
            <DiscardModal 
              player={players[players.findIndex(p => p.playerId === playerId)]}
              onDiscard={(discards) => discardCards(players.findIndex(p => p.playerId === playerId), discards)}
            />
          </div>
        )}

        {showingDevHand && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
            <DevCardHand 
              hand={players.find(p => p.playerId === playerId)?.devCardsHand || []}
              boughtRecently={players.find(p => p.playerId === playerId)?.devCardsBoughtThisTurn || []}
              onClose={() => setShowingDevHand(false)}
              canPlay={canPlayDevCard}
              onPlay={(id) => {
                if (id === 'monopoly') {
                  setMonopolyCard(id);
                  setShowingDevHand(false);
                } else if (id === 'year_of_plenty') {
                  setYearOfPlentyCard(id);
                  setShowingDevHand(false);
                } else {
                  playDevCard(id);
                  setShowingDevHand(false);
                }
              }}
            />
          </div>
        )}

        {monopolyCard && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
            <MonopolyModal onSelect={(res) => {
              playDevCard('monopoly', { resource: res });
              setMonopolyCard(null);
            }} />
          </div>
        )}

        {yearOfPlentyCard && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
            <YearOfPlentyModal onSelect={(r1, r2) => {
              playDevCard('year_of_plenty', { res1: r1, res2: r2 });
              setYearOfPlentyCard(null);
            }} />
          </div>
        )}
      </div>
      
      <footer className="bg-white border-t px-4 py-3 flex justify-between items-center text-xs font-black text-slate-400 uppercase md:hidden shadow-inner">
         <span>TURNO: <span className="text-slate-900 font-bold">J{currentPlayerIdx + 1}</span></span>
         <span className={setupPhase ? 'text-orange-500 font-black' : 'text-green-500 font-black'}>{setupPhase ? 'SETUP' : 'JUEGO'}</span>
      </footer>

      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </div>
  );
}

export default App;
