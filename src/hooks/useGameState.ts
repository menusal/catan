import { useState, useCallback, useEffect, useRef } from 'react';
import type { Building, ResourceType, ActionType, GameSession, BuildingType, ViewType } from '../types/game';
import { 
  COSTS, RESOURCES, HARBORS_CONFIG,
  HEX_WIDTH, HEX_HEIGHT, CENTER_X, CENTER_Y, HEX_SIZE
} from '../constants/game';
import { useGameLogic } from './useGameLogic';
import { getVertexPos, calculateLongestPath } from '../utils/game';
import type { NotificationType } from '../components/UI/Notification';

export const useGameState = (remoteSession: GameSession | null, onUpdate: (updates: Partial<GameSession>) => Promise<void>, currentPlayerId: string) => {
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [selectedAction, setSelectedAction] = useState<ActionType>('settlement');
  const [isMovingRobber, setIsMovingRobber] = useState(false);
  const [stealCandidates, setStealCandidates] = useState<number[]>([]);
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
  }, []);

  const players = remoteSession?.players || [];
  const board = remoteSession?.board || [];
  const buildings = remoteSession?.buildings || {};
  const roads = remoteSession?.roads || {};
  const devDeck = remoteSession?.devDeck || [];
  const freeRoads = (remoteSession as any)?.freeRoads || 0;
  const dice = remoteSession?.dice || [1, 1];
  const logs = remoteSession?.logs || [];
  const setupPhase = remoteSession?.setupPhase ?? true;
  const setupStep = remoteSession?.setupStep ?? 0;
  const currentPlayerIdx = remoteSession?.currentPlayer ?? 0;
  const remoteHasRolled = (remoteSession as any)?.hasRolled ?? false;

  const isMyTurn = remoteSession?.players[currentPlayerIdx] && (remoteSession.players[currentPlayerIdx] as any).playerId === currentPlayerId;

  const { canBuildSettlement, canBuildRoad, canBuildCity } = useGameLogic();
  const player = players[currentPlayerIdx];

  const currentTurnRef = useRef(currentPlayerIdx);
  useEffect(() => {
    if (currentTurnRef.current !== currentPlayerIdx) {
      const prevIdx = currentTurnRef.current;
      const prevPlayer = players[prevIdx];
      if (prevPlayer && !setupPhase) {
        const name = prevPlayer.name || `J${prevIdx + 1}`;
        notify(`¡${name} ha terminado su turno!`, "info");
      }
      currentTurnRef.current = currentPlayerIdx;
    }
  }, [currentPlayerIdx, players, setupPhase, notify]);
  
  // Sync robber state
  useEffect(() => {
    if (isMyTurn && remoteSession?.robberMovePending) {
        const waiting = remoteSession.waitingForDiscards || [];
        if (waiting.length === 0 && !isMovingRobber) {
             setIsMovingRobber(true);
             notify("¡Coloca el ladrón!", "info");
        }
    }
  }, [isMyTurn, remoteSession?.robberMovePending, remoteSession?.waitingForDiscards, isMovingRobber, notify]);


  const handleVertexClick = async (vId: string) => {
    if (!remoteSession || isMovingRobber || !isMyTurn) return;

    if (setupPhase) {
      const currentSetupStep = Number(setupStep); // Ensure number type
      if (currentSetupStep % 2 !== 0) return notify("Debes poner una carretera.", "error");

      const settlementCount = 5 - (player.inventory.settlements || 5);
      if (settlementCount >= 2) return notify("Ya has puesto tus 2 poblados iniciales.", "error");
      
      const check = canBuildSettlement(vId, buildings, roads, player, true);
      if (!check.success) return notify(check.message!, "error");

      const newBuildings: Record<string, Building> = { ...buildings, [vId]: { playerId: currentPlayerIdx, type: 'settlement' as BuildingType } };
      let updates: Partial<GameSession> = { buildings: newBuildings };

      const numPlayers = players.length;
      const nextStep = currentSetupStep + 1;
      
      let newRes = { ...player.resources };
      // Give resources on the SECOND settlement (Snake order round 2)
      const turnIndex = Math.floor(nextStep / 2);
      if (turnIndex >= numPlayers && nextStep % 2 === 1) {
        board.forEach(hex => {
          if (hex.type === 'DESERT') return;
          const [vx, vy] = vId.split('-').map(Number);
          const hx = HEX_WIDTH * (hex.q + hex.r / 2) + CENTER_X;
          const hy = HEX_HEIGHT * (3 / 4) * hex.r + CENTER_Y;
          if (Math.sqrt((vx - hx)**2 + (vy - hy)**2) < HEX_SIZE + 5) {
            const resName = RESOURCES[hex.type].name as ResourceType;
            newRes[resName] = (newRes[resName] || 0) + 1;
          }
        });
      }

      updates.players = players.map((p, i) => {
        if (i !== currentPlayerIdx) return p;
        return { ...p, resources: newRes, points: (p.points || 0) + 1, inventory: { ...p.inventory, settlements: p.inventory.settlements - 1 } };
      });

      updates.setupStep = nextStep;
      // DO NOT update currentPlayer here, keep the same player for the road
      
      await onUpdate(updates);
      notify("¡Poblado construido!", "success");
      setSelectedAction('road');
      return;
    }

    if (!remoteHasRolled) return notify("Debes lanzar los dados primero.", "error");

    if (selectedAction === 'settlement') {
      const check = canBuildSettlement(vId, buildings, roads, player, false);
      if (!check.success) return notify(check.message!, "error");

      const newBuildings: Record<string, Building> = { ...buildings, [vId]: { playerId: currentPlayerIdx, type: 'settlement' as BuildingType } };
      const cost = COSTS.settlement;
      let finalPlayers = players.map((p, i) => {
        if (i !== currentPlayerIdx) return p;
        const newRes = { ...p.resources };
        Object.entries(cost).forEach(([res, val]) => { newRes[res as ResourceType] -= (val || 0); });
        return { ...p, resources: newRes, points: (p.points || 0) + 1, inventory: { ...p.inventory, settlements: p.inventory.settlements - 1 } };
      });

      // Recalculate longest road for EVERYONE because this settlement might have broken a road
      let newHolderIdx = remoteSession.longestRoadPlayer;
      
      // First, update everyone's cached Max Length
      finalPlayers = finalPlayers.map((p, idx) => {
        const len = calculateLongestPath(roads, newBuildings, idx);
        return { ...p, maxRoadLength: len };
      });

      // Now determine who actually holds the card
      // Logic:
      // 1. If someone holds it (Idx != -1), check if they still have >= 5 AND strictly more than anyone else (or equal to challengers if they already held it).
      // Actually simpler: iterate all players, find max. 
      // Rule: Current holder keeps it on ties. New holder needs > current.
      
      let currentMax = 4;
      if (newHolderIdx !== -1) {
         currentMax = finalPlayers[newHolderIdx].maxRoadLength;
         // If holder drops below 5, they lose it immediately
         if (currentMax < 5) {
             finalPlayers[newHolderIdx].points -= 2;
             newHolderIdx = -1;
             currentMax = 4;
         }
      }

      // See if anyone beats the current standard
      finalPlayers.forEach((p, idx) => {
          if (p.maxRoadLength > currentMax && p.maxRoadLength >= 5) {
              // Becomes new holder
              if (newHolderIdx !== -1) {
                  finalPlayers[newHolderIdx].points -= 2;
              }
              newHolderIdx = idx;
              currentMax = p.maxRoadLength;
              finalPlayers[idx].points += 2;
          }
      });
      
      const hasWinner = finalPlayers.some(p => p.points >= 10);
      const updates: Partial<GameSession> = { 
          buildings: newBuildings, 
          players: finalPlayers,
          longestRoadPlayer: newHolderIdx 
      };
      if (hasWinner) updates.gameState = 'WON';
      
      await onUpdate(updates);
      notify("¡Poblado construido!", "success");
    } else if (selectedAction === 'city') {
      const check = canBuildCity(vId, buildings, player);
      if (!check.success) return notify(check.message!, "error");

      const newBuildings: Record<string, Building> = { ...buildings, [vId]: { ...buildings[vId], type: 'city' as BuildingType } };
      const cost = COSTS.city;
      const newPlayers = players.map((p, i) => {
        if (i !== currentPlayerIdx) return p;
        const newRes = { ...p.resources };
        Object.entries(cost).forEach(([res, val]) => { newRes[res as ResourceType] -= (val || 0); });
        return { ...p, resources: newRes, points: (p.points || 0) + 1, inventory: { ...p.inventory, cities: p.inventory.cities - 1, settlements: p.inventory.settlements + 1 } };
      });
      const hasWinner = newPlayers.some(p => (p.points || 0) >= 10);
      const updates: any = { buildings: newBuildings, players: newPlayers };
      if (hasWinner) updates.gameState = 'WON';
      await onUpdate(updates);
      notify("¡Ciudad construida!", "success");
    }
  };

  const rollDice = async () => {
    if (!remoteSession || setupPhase || remoteHasRolled || isMovingRobber || !isMyTurn) return;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;
    
    let updates: Partial<GameSession> = { 
      dice: [d1, d2], 
      logs: [`Dados: ${sum}`, ...logs].slice(0, 8),
      // @ts-ignore
      hasRolled: true 
    };

    if (sum === 7) {
      const discardsRequired: number[] = [];
      players.forEach((p, i) => {
        const total = Object.values(p.resources).reduce((a, b) => a + b, 0);
        if (total > 7) discardsRequired.push(i);
      });

      if (discardsRequired.length > 0) {
        updates.waitingForDiscards = discardsRequired;
        updates.robberMovePending = true;
      } else {
        setIsMovingRobber(true);
        updates.robberMovePending = true;
      }
    } else {
      let gainedResources: Partial<Record<ResourceType, number>> = {};
      const newPlayers = players.map((p, pIdx) => {
        const newRes = { ...p.resources };
        board.forEach(hex => {
          if (hex.number === sum && hex.id !== remoteSession.robberHexId) {
            Object.entries(buildings).forEach(([vId, b]) => {
              if (b.playerId !== p.id) return;
              const [vx, vy] = vId.split('-').map(Number);
              const hx = HEX_WIDTH * (hex.q + hex.r / 2) + CENTER_X;
              const hy = HEX_HEIGHT * (3 / 4) * hex.r + CENTER_Y;
              if (Math.sqrt((vx - hx)**2 + (vy - hy)**2) < HEX_SIZE + 5) {
                const resName = RESOURCES[hex.type].name as ResourceType;
                const amount = (b.type === 'city' ? 2 : 1);
                newRes[resName] += amount;
                if (pIdx === currentPlayerIdx) {
                  gainedResources[resName] = (gainedResources[resName] || 0) + amount;
                }
              }
            });
          }
        });
        return { ...p, resources: newRes };
      });
      updates.players = newPlayers;

      const gains = Object.entries(gainedResources);
      if (gains.length > 0) {
        const msg = gains.map(([res, val]) => `${val} ${res}`).join(', ');
        notify(`Has obtenido: ${msg}`, "success");
      }
    }
    await onUpdate(updates);
  };

  const nextTurn = async () => {
    if (!remoteSession || setupPhase || !remoteHasRolled || isMovingRobber || !isMyTurn) return;
    const nextPlayer = (currentPlayerIdx + 1) % players.length;
    await onUpdate({
      currentPlayer: nextPlayer,
      // @ts-ignore
      hasRolled: false,
      logs: [`Turno de J${nextPlayer + 1}`, ...logs].slice(0, 8),
      // @ts-ignore
      hasPlayedDevCard: false,
      players: players.map((p, i) => {
        if (i !== currentPlayerIdx) return p;
        // Move cards bought this turn to the playable hand
        const newlyPlayable = [...p.devCardsHand, ...(p.devCardsBoughtThisTurn || [])];
        return { ...p, devCardsHand: newlyPlayable, devCardsBoughtThisTurn: [] };
      })
    });
  };

  const handleRoadClick = async (eId: string) => {
    if (!remoteSession || isMovingRobber || !isMyTurn) return;

    if (setupPhase) {
      const currentSetupStep = Number(setupStep); // Ensure number type
      if (currentSetupStep % 2 === 0) return notify("Debes poner un poblado.", "error");

      // During setup, roads are free, so we skip the cost check BUT we should check limits if desired
      // Max 2 roads in setup
      const roadCount = 15 - (player.inventory.roads || 15);
      if (roadCount >= 2) return notify("Ya has puesto tus 2 carreteras iniciales.", "error");
      
      const check = canBuildRoad(eId, roads, buildings, player, true, false);
      if (!check.success) return notify(check.message!, "error");

      const newRoads = { ...roads, [eId]: currentPlayerIdx };
      const nextStep = currentSetupStep + 1;
      const numPlayers = players.length;
      
      let updates: Partial<GameSession> = { roads: newRoads, setupStep: nextStep };
      
      // Update inventory for road (it's free but consumes a piece)
      updates.players = players.map((p, i) => {
          if (i !== currentPlayerIdx) return p;
          return { ...p, inventory: { ...p.inventory, roads: p.inventory.roads - 1 } };
      });

      if (nextStep >= numPlayers * 4) {
        updates.setupPhase = false;
        // @ts-ignore
        updates.hasRolled = false; // Reset so first player can roll dice
        updates.logs = ["¡Setup terminado! Tira los dados.", ...logs].slice(0, 8);
      } else {
        const turnIndex = Math.floor(nextStep / 2);
        let nextPlayerIdx = turnIndex < numPlayers ? turnIndex : numPlayers - 1 - (turnIndex - numPlayers);
        updates.currentPlayer = nextPlayerIdx;
      }

      await onUpdate(updates);
      notify("¡Carretera construida!", "success");
      setSelectedAction('settlement');
      return;
    }

    if (!remoteHasRolled) return notify("Debes lanzar los dados primero.", "error");
    if (selectedAction !== 'road') return;

    const isFree = freeRoads > 0;
    const check = canBuildRoad(eId, roads, buildings, player, setupPhase, isFree);
    if (!check.success) return notify(check.message!, "error");

    const newRoads = { ...roads, [eId]: currentPlayerIdx };
    let updates: Partial<GameSession> = { roads: newRoads };
    let finalPlayers = [...players];

    if (!setupPhase) {
      finalPlayers = players.map((p, i) => {
        if (i !== currentPlayerIdx) return p;
        if (isFree) return { ...p, inventory: { ...p.inventory, roads: p.inventory.roads - 1 } };
        
        const newRes = { ...p.resources };
        Object.entries(COSTS.road).forEach(([res, val]) => { newRes[res as ResourceType] -= (val || 0); });
        return { ...p, resources: newRes, inventory: { ...p.inventory, roads: p.inventory.roads - 1 } };
      });
      
      if (isFree) {
        // @ts-ignore
        updates.freeRoads = freeRoads - 1;
      }

      // Check for Longest Road
      const playerRoadLength = calculateLongestPath(newRoads, buildings, currentPlayerIdx);
      const currentHolderIdx = remoteSession.longestRoadPlayer;
      const currentMaxLength = currentHolderIdx === -1 ? 4 : players[currentHolderIdx].maxRoadLength || 4;
      
      if (playerRoadLength > currentMaxLength && playerRoadLength >= 5) {
        // Only transfer points if holder CHANGES
        if (currentHolderIdx !== currentPlayerIdx) {
          updates.longestRoadPlayer = currentPlayerIdx;
          const name = players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`;
          updates.logs = [`¡${name} tiene la Gran Ruta! (${playerRoadLength})`, ...logs].slice(0, 8);
          
          finalPlayers = finalPlayers.map((p, i) => {
            if (i === currentPlayerIdx) return { ...p, points: (p.points || 0) + 2, maxRoadLength: playerRoadLength };
            if (i === currentHolderIdx) return { ...p, points: (p.points || 0) - 2 };
            return p;
          });
        } else {
          // Just update road length stat
          finalPlayers = finalPlayers.map((p, i) => 
            i === currentPlayerIdx ? { ...p, maxRoadLength: playerRoadLength } : p
          );
        }
      } else {
        finalPlayers = finalPlayers.map((p, i) => 
          i === currentPlayerIdx ? { ...p, maxRoadLength: Math.max(p.maxRoadLength || 0, playerRoadLength) } : p
        );
      }
    }

    const hasWinner = finalPlayers.some(p => p.points >= 10);
    if (hasWinner) updates.gameState = 'WON';

    updates.players = finalPlayers;
    await onUpdate(updates);
    notify("¡Carretera construida!", "success");
    setSelectedAction('settlement');
  };

  const handleHexClick = async (hexId: number) => {
    if (!isMovingRobber || !isMyTurn || !remoteSession) return;
    if (hexId === remoteSession.robberHexId) return notify("Elige otro hexágono.", "error");
    
    // Identify potential victims
    const hex = board.find(h => h.id === hexId);
    if (!hex) return;

    const candidates: Set<number> = new Set();
    const hx = HEX_WIDTH * (hex.q + hex.r / 2) + CENTER_X;
    const hy = HEX_HEIGHT * (3 / 4) * hex.r + CENTER_Y;

    Object.entries(buildings).forEach(([vId, b]) => {
      // Don't steal from yourself
      if (b.playerId === currentPlayerIdx) return;
      
      const [vx, vy] = vId.split('-').map(Number);
      if (Math.sqrt((vx - hx)**2 + (vy - hy)**2) < HEX_SIZE + 5) {
        // Opponent has a building here. Check if they have cards.
        const player = players[b.playerId];
        const totalCards = Object.values(player.resources).reduce((a, b) => a + b, 0);
        if (totalCards > 0) {
          candidates.add(b.playerId);
        }
      }
    });

    const candidateList = Array.from(candidates);
    
    await onUpdate({ 
      robberHexId: hexId, 
      logs: [`Ladrón movido al hex ${hexId}.`, ...logs].slice(0, 8),
      robberMovePending: false 
    });
    setIsMovingRobber(false);

    if (candidateList.length === 0) {
      notify("No hay a quien robar.", "info");
    } else if (candidateList.length === 1) {
      // Auto-steal
      await stealFromPlayer(candidateList[0]);
    } else {
      // Wait for player to choose
      setStealCandidates(candidateList);
    }
  };

  const stealFromPlayer = async (victimIdx: number) => {
    if (!remoteSession || !isMyTurn) return;
    const victim = players[victimIdx];
    const cards: ResourceType[] = [];
    Object.entries(victim.resources).forEach(([res, count]) => {
      for (let i = 0; i < count; i++) cards.push(res as ResourceType);
    });

    if (cards.length === 0) return notify("El rival no tiene cartas.", "info");

    const stolenRes = cards[Math.floor(Math.random() * cards.length)];
    
    const newPlayers = players.map((p, i) => {
      if (i === currentPlayerIdx) {
        return {
          ...p,
          resources: { ...p.resources, [stolenRes]: p.resources[stolenRes] + 1 }
        };
      }
      if (i === victimIdx) {
        return {
          ...p,
          resources: { ...p.resources, [stolenRes]: p.resources[stolenRes] - 1 }
        };
      }
      return p;
    });

    await onUpdate({ 
      players: newPlayers, 
      logs: [`${players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`} ha robado 1 carta a ${players[victimIdx]?.name || `J${victimIdx + 1}`}`, ...logs].slice(0, 8) 
    });
    setStealCandidates([]);
    notify(`Has robado una carta a ${players[victimIdx]?.name || `J${victimIdx + 1}`}`, "success");
  };

  const rollInitialDice = async () => {
    if (!remoteSession || remoteSession.gameState !== 'STARTING') return;
    const rolls = (remoteSession as any).initialRolls || {};
    if (rolls[currentPlayerId]) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    const playerIdx = players.findIndex(p => p.playerId === currentPlayerId);
    await onUpdate({
      [`initialRolls.${currentPlayerId}`]: roll,
      logs: [`${players[playerIdx]?.name || `J${playerIdx + 1}`} ha sacado un ${roll}`, ...logs]
    } as any);
  };

  useEffect(() => {
    if (remoteSession?.gameState === 'STARTING' && remoteSession.hostId === currentPlayerId) {
      const rolls = (remoteSession as any).initialRolls || {};
      if (Object.keys(rolls).length === remoteSession.players.length && remoteSession.players.length > 0) {
        const playersList = remoteSession.players;
        let highestRoll = -1;
        let starterIdx = 0;
        
        playersList.forEach((p, i) => {
          const roll = rolls[p.playerId!] || 0;
          if (roll > highestRoll) {
            highestRoll = roll;
            starterIdx = i;
          }
        });

        onUpdate({
          gameState: 'PLAYING',
          setupPhase: true,
          setupStep: 0,
          currentPlayer: starterIdx,
          logs: ["¡Dados tirados!", `${playersList[starterIdx]?.name || `J${starterIdx + 1}`} empieza con un ${highestRoll}.`, ...logs].slice(0, 8)
        });
      }
    }
  }, [remoteSession?.initialRolls, remoteSession?.gameState, remoteSession?.hostId, currentPlayerId]);

  const getTradeRate = (res: ResourceType): number => {
    let rate = 4;
    
    // Check all harbors
    HARBORS_CONFIG.forEach(h => {
      const v1 = getVertexPos(h.q, h.r, h.v[0]);
      const v2 = getVertexPos(h.q, h.r, h.v[1]);
      const vId1 = `${v1.x}-${v1.y}`;
      const vId2 = `${v2.x}-${v2.y}`;

      // If player has a building on either vertex of the harbor
      if (buildings[vId1]?.playerId === currentPlayerIdx || buildings[vId2]?.playerId === currentPlayerIdx) {
        if (h.type === "3:1") {
          if (rate > 3) rate = 3;
        } else if (h.type === res) {
          rate = 2; // Specific resource harbor always gives 2:1
        }
      }
    });

    return rate;
  };

  const handleTrade = async (give: ResourceType, get: ResourceType, rate: number) => {
    if (!remoteSession || !isMyTurn) return;
    if (!remoteHasRolled) return notify("Debes lanzar los dados primero.", "error");
    const player = players[currentPlayerIdx];
    if (player.resources[give] < rate) return notify(`No tienes suficiente ${give}.`, "error");

    const newPlayers = players.map((p, i) => {
      if (i !== currentPlayerIdx) return p;
      return {
        ...p,
        resources: {
          ...p.resources,
          [give]: p.resources[give] - rate,
          [get]: p.resources[get] + 1
        }
      };
    });

    await onUpdate({ players: newPlayers, logs: [`${players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`} cambia ${rate} ${give} por 1 ${get}`, ...logs].slice(0, 8) });
    notify(`Cambio realizado: ${rate} ${give} por 1 ${get}`, "success");
  };

  const buyDevCard = useCallback(async () => {
    if (!remoteSession) return;
    if (!isMyTurn) return notify("No es tu turno.", "error");
    if (setupPhase) return notify("No puedes hacer esto en el setup.", "error");
    if (!(remoteSession as any).hasRolled) return notify("Debes lanzar los dados primero.", "error");
    if (devDeck.length === 0) return notify("No quedan cartas en el mazo.", "error");
    
    const player = players[currentPlayerIdx];
    const cost = COSTS.devCard;
    const hasRes = Object.entries(cost).every(([res, val]) => player.resources[res as ResourceType] >= (val || 0));
    if (!hasRes) return notify("Sin recursos.", "error");

    const newDeck = [...devDeck];
    const card = newDeck.pop()!;
    
    const newPlayers = players.map((p, i) => {
      if (i !== currentPlayerIdx) return p;
      const newRes = { ...p.resources };
      Object.entries(cost).forEach(([res, val]) => { newRes[res as ResourceType] -= (val || 0); });
      const newBought = [...(p.devCardsBoughtThisTurn || []), card];
      const newPoints = card === 'vp' ? (p.points || 0) + 1 : p.points;
      return { ...p, resources: newRes, devCardsBoughtThisTurn: newBought, points: newPoints };
    });

    const hasWinner = newPlayers.some(p => p.points >= 10);
    
    const updates: Partial<GameSession> = { 
      players: newPlayers, 
      devDeck: newDeck, 
      logs: [`${players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`} ha comprado una carta.`, ...logs].slice(0, 8) 
    };

    if (hasWinner) updates.gameState = 'WON';

    try {
      await onUpdate(updates);
      setActiveView('board');
      notify("¡Carta comprada con éxito!", "success");
    } catch (err) {
      console.error("buyDevCard error:", err);
      notify("Error al comprar la carta.", "error");
    }
  }, [remoteSession, isMyTurn, setupPhase, devDeck, players, currentPlayerIdx, onUpdate, logs]);

  const discardCards = async (playerIdx: number, discards: Record<ResourceType, number>) => {
    if (!remoteSession) return;
    
    const newPlayers = players.map((p, i) => {
      if (i !== playerIdx) return p;
      const newRes = { ...p.resources };
      Object.entries(discards).forEach(([res, val]) => {
        newRes[res as ResourceType] -= val;
      });
      return { ...p, resources: newRes };
    });

    const newWaiting = (remoteSession.waitingForDiscards || []).filter(idx => idx !== playerIdx);
    
    let updates: Partial<GameSession> = {
      players: newPlayers,
      waitingForDiscards: newWaiting
    };

    if (newWaiting.length === 0) {
      // All discards done, the current player will be triggered via useEffect
    }

    await onUpdate(updates);
  };

  const playDevCard = async (cardId: string, extras?: any) => {
    if (!remoteSession || !isMyTurn || (remoteSession as any).hasPlayedDevCard) return;
    
    const player = players[currentPlayerIdx];
    const cardIdx = player.devCardsHand.indexOf(cardId);
    if (cardIdx === -1) return;

    let newPlayers = [...players];
    let newSessionUpdates: Partial<GameSession> = {
      // @ts-ignore
      hasPlayedDevCard: true
    };

    const newHand = [...player.devCardsHand];
    newHand.splice(cardIdx, 1);
    
    const p = newPlayers[currentPlayerIdx];

    if (cardId === 'knight') {
      const knightCount = (p.knightsPlayed || 0) + 1;
      const currentHolderIdx = remoteSession.largestArmyPlayer;
      const currentMaxArmy = currentHolderIdx === -1 ? 2 : players[currentHolderIdx].knightsPlayed || 2;
      
      if (knightCount > currentMaxArmy && knightCount >= 3) {
        // Only transfer points if holder CHANGES
        if (currentHolderIdx !== currentPlayerIdx) {
          newSessionUpdates.largestArmyPlayer = currentPlayerIdx;
          const name = players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`;
          newSessionUpdates.logs = [`¡${name} tiene el Gran Ejército! (${knightCount})`, ...logs].slice(0, 8);
          
          newPlayers = players.map((other, i) => {
              if (i === currentPlayerIdx) {
                  return { ...other, devCardsHand: newHand, knightsPlayed: knightCount, points: (other.points || 0) + 2 };
              }
              if (i === currentHolderIdx) {
                  return { ...other, points: (other.points || 0) - 2 };
              }
              return other;
          });
        } else {
          // Just update stats
          newPlayers = players.map((other, i) => {
            if (i === currentPlayerIdx) return { ...other, devCardsHand: newHand, knightsPlayed: knightCount };
            return other;
          });
          const name = players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`;
          newSessionUpdates.logs = [`${name} ha jugado un Caballero. (${knightCount})`, ...logs].slice(0, 8);
        }
      } else {
        newPlayers = players.map((other, i) => {
          if (i === currentPlayerIdx) return { ...other, devCardsHand: newHand, knightsPlayed: knightCount };
          return other;
        });
        const name = players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`;
        newSessionUpdates.logs = [`${name} ha jugado un Caballero.`, ...logs].slice(0, 8);
      }
      setIsMovingRobber(true);
    } else if (cardId === 'monopoly') {
      const resource = extras.resource as ResourceType;
      let totalStolen = 0;
      newPlayers = players.map((other, i) => {
        if (i === currentPlayerIdx) return other;
        const count = other.resources[resource];
        totalStolen += count;
        return { ...other, resources: { ...other.resources, [resource]: 0 } };
      });
      newPlayers[currentPlayerIdx] = { 
        ...newPlayers[currentPlayerIdx], 
        devCardsHand: newHand,
        resources: { ...newPlayers[currentPlayerIdx].resources, [resource]: newPlayers[currentPlayerIdx].resources[resource] + totalStolen }
      };
      const name = players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`;
      newSessionUpdates.logs = [`Monopolio: ${name} ha quitado ${totalStolen} de ${resource}.`, ...logs].slice(0, 8);
    } else if (cardId === 'year_of_plenty') {
      const { res1, res2 } = extras as { res1: ResourceType, res2: ResourceType };
      const newRes = { ...p.resources };
      newRes[res1]++;
      newRes[res2]++;
      newPlayers[currentPlayerIdx] = { ...p, devCardsHand: newHand, resources: newRes };
      const name = players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`;
      newSessionUpdates.logs = [`Año de Abundancia: ${name} toma 2 recursos.`, ...logs].slice(0, 8);
    } else if (cardId === 'road_building') {
      newPlayers[currentPlayerIdx] = { ...p, devCardsHand: newHand };
      (newSessionUpdates as any).freeRoads = 2;
      const name = players[currentPlayerIdx]?.name || `J${currentPlayerIdx + 1}`;
      newSessionUpdates.logs = [`Construcción de Rutas: ${name} puede poner 2 caminos.`, ...logs].slice(0, 8);
      setSelectedAction('road');
    }

    newSessionUpdates.players = newPlayers;
    const hasWinner = newPlayers.some(p => p.points >= 10);
    if (hasWinner) newSessionUpdates.gameState = 'WON';
    
    await onUpdate(newSessionUpdates);
    notify(`Has usado la carta: ${cardId.toUpperCase()}`, "info");
  };

  return {
    activeView, setActiveView,
    selectedAction, setSelectedAction,
    isMovingRobber, setIsMovingRobber,
    players, board, buildings, roads, dice, logs, setupPhase, currentPlayerIdx,
    isMyTurn,
    handleVertexClick,
    handleRoadClick,
    handleHexClick,
    rollDice,
    nextTurn,
    rollInitialDice,
    hasRolledInitial: (remoteSession as any)?.initialRolls?.[currentPlayerId] !== undefined,
    handleTrade,
    getTradeRate,
    buyDevCard,
    devDeckCount: devDeck.length,
    stealCandidates,
    stealFromPlayer,
    waitingForDiscards: remoteSession?.waitingForDiscards || [],
    discardCards,
    playDevCard,
    canPlayDevCard: (cardId: string) => {
      if (!isMyTurn || (remoteSession as any).hasPlayedDevCard) return false;
      const player = players[currentPlayerIdx];
      return player.devCardsHand.includes(cardId); 
    },
    freeRoads,
    notification,
    notify,
    clearNotification: () => setNotification(null)
  };
};
