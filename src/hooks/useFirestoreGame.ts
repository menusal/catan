import { useState, useCallback } from 'react';
import { db } from '../firebase';
import { 
  doc, onSnapshot, setDoc, updateDoc, 
  collection, query, where, getDocs 
} from 'firebase/firestore';
import type { GameSession, Player, Hex } from '../types/game';
import { 
  HEX_COORDS, HEX_TYPES, NUMBERS, 
  DEV_CARD_TYPES 
} from '../constants/game';
import { shuffle } from '../utils/game';

export const useFirestoreGame = () => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [playerId] = useState<string>(() => {
    const saved = localStorage.getItem('catan_player_id');
    if (saved) return saved;
    const newId = Math.random().toString(36).substring(2, 9);
    localStorage.setItem('catan_player_id', newId);
    return newId;
  });

  const createGame = async (name: string) => {
    const gameCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const shuffledTypes = shuffle(HEX_TYPES);
    const shuffledNumbers = shuffle(NUMBERS);
    let numIdx = 0, desertId = -1;
    
    const initialBoard = HEX_COORDS.map((coord, i) => {
      const type = shuffledTypes[i];
      const number = type === 'DESERT' ? null : shuffledNumbers[numIdx++];
      if (type === 'DESERT') desertId = i;
      return { ...coord, type, number, id: i } as Hex;
    });

    let initialDeck: string[] = [];
    DEV_CARD_TYPES.forEach(t => {
      const count = t.id === 'knight' ? 14 : (t.id === 'vp' ? 5 : 2);
      for(let i=0; i<count; i++) initialDeck.push(t.id);
    });

    const newSession: GameSession = {
      gameCode,
      hostId: playerId,
      players: [{
        id: 0,
        playerId,
        name: name || "Jugador 1",
        resources: { Madera: 0, Arcilla: 0, Lana: 0, Trigo: 0, Mineral: 0 },
        inventory: { settlements: 5, roads: 15, cities: 4 },
        devCardsHand: [],
        knightsPlayed: 0,
        maxRoadLength: 0,
        points: 0,
      }],
      currentPlayer: 0,
      gameState: 'LOBBY',
      board: initialBoard,
      buildings: {},
      roads: {},
      dice: [1, 1],
      logs: ["¡Bienvenidos a Catán! Esperando jugadores..."],
      setupPhase: true,
      setupStep: 0,
      robberHexId: desertId,
      devDeck: shuffle(initialDeck),
      longestRoadPlayer: -1,
      largestArmyPlayer: -1,
      lastUpdated: Date.now(),
      // @ts-ignore
      initialRolls: {}
    };

    await setDoc(doc(db, 'games', gameCode), newSession);
    return gameCode;
  };

  const joinGame = async (gameCode: string, name: string) => {
    const q = query(collection(db, 'games'), where('gameCode', '==', gameCode.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) throw new Error("Juego no encontrado");
    
    const gameDoc = querySnapshot.docs[0];
    const session = gameDoc.data() as GameSession;
    if (session.gameState !== 'LOBBY') throw new Error("El juego ya ha comenzado");
    if (session.players.length >= 4) throw new Error("El juego está lleno");
    if (session.players.some((p: any) => p.playerId === playerId)) return; // Already in

    const newPlayer: Player = {
      id: session.players.length,
      name: name || `Jugador ${session.players.length + 1}`,
      resources: { Madera: 0, Arcilla: 0, Lana: 0, Trigo: 0, Mineral: 0 },
      inventory: { settlements: 5, roads: 15, cities: 4 },
      devCardsHand: [],
      knightsPlayed: 0,
      maxRoadLength: 0,
      points: 0,
    };
    (newPlayer as any).playerId = playerId;

    await updateDoc(doc(db, 'games', session.gameCode), {
      players: [...session.players, newPlayer],
      lastUpdated: Date.now()
    });
  };

  const startGameRemote = async (gameCode: string) => {
    const gameRef = doc(db, 'games', gameCode);
    await updateDoc(gameRef, {
      gameState: 'STARTING',
      logs: ["¡Tirad los dados para decidir el orden!", "El mayor número empieza."],
      lastUpdated: Date.now()
    });
  };

  const updateState = async (updates: Partial<GameSession>) => {
    if (!gameSession) return;
    const gameRef = doc(db, 'games', gameSession.gameCode);
    await updateDoc(gameRef, {
      ...updates,
      lastUpdated: Date.now()
    });
  };

  const subscribeToGame = useCallback((gameCode: string) => {
    return onSnapshot(doc(db, 'games', gameCode.toUpperCase()), (doc) => {
      if (doc.exists()) {
        setGameSession(doc.data() as GameSession);
      }
    });
  }, []);

  return {
    gameSession,
    playerId,
    createGame,
    joinGame,
    startGameRemote,
    updateState,
    subscribeToGame,
    setGameSession
  };
};
