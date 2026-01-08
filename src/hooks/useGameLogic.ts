import type { Building, ResourceType, Player } from '../types/game';
import { COSTS, HEX_SIZE } from '../constants/game';
import { getDistance } from '../utils/game';

export const useGameLogic = () => {
  const canBuildSettlement = (
    vId: string, 
    buildings: Record<string, Building>, 
    roads: Record<string, number>, 
    player: Player, 
    isSetup: boolean
  ) => {
    if (buildings[vId]) return { success: false, message: "Poblado ya existe." };
    if (player.inventory.settlements <= 0) return { success: false, message: "Sin piezas." };

    const [vx, vy] = vId.split('-').map(Number);
    const ruleMet = !Object.keys(buildings).some(otherId => {
      const [ox, oy] = otherId.split('-').map(Number);
      return getDistance(vx, vy, ox, oy) < (HEX_SIZE + 5);
    });
    if (!ruleMet) return { success: false, message: "Regla distancia." };

    if (!isSetup) {
      const isConnected = Object.keys(roads).some(eId => 
        roads[eId] === player.id && (eId.split('|')[0] === vId || eId.split('|')[1] === vId)
      );
      if (!isConnected) return { success: false, message: "Conecta al camino." };
      
      const hasResources = Object.entries(COSTS.settlement).every(([res, val]) => 
        player.resources[res as ResourceType] >= (val || 0)
      );
      if (!hasResources) return { success: false, message: "Sin recursos." };
    }

    return { success: true };
  };

  const canBuildRoad = (
    eId: string, 
    roads: Record<string, number>, 
    buildings: Record<string, Building>, 
    player: Player, 
    isSetup: boolean,
    isFree: boolean = false
  ) => {
    if (roads[eId] !== undefined) return { success: false, message: "Ya hay camino." };
    if (player.inventory.roads <= 0) return { success: false, message: "Sin piezas." };

    const [v1, v2] = eId.split('|');
    const connects = (buildings[v1]?.playerId === player.id) || 
                     (buildings[v2]?.playerId === player.id) || 
                     Object.keys(roads).some(rid => {
                       const [rv1, rv2] = rid.split('|');
                       return roads[rid] === player.id && (rv1 === v1 || rv1 === v2 || rv2 === v1 || rv2 === v2);
                     });

    if (!connects) return { success: false, message: "Conecta la ruta." };

    if (!isSetup && !isFree) {
      const hasResources = Object.entries(COSTS.road).every(([res, val]) => 
        player.resources[res as ResourceType] >= (val || 0)
      );
      if (!hasResources) return { success: false, message: "Sin recursos." };
    }

    return { success: true };
  };

  const canBuildCity = (
    vId: string, 
    buildings: Record<string, Building>, 
    player: Player
  ) => {
    const b = buildings[vId];
    if (!b || b.playerId !== player.id || b.type !== 'settlement') return { success: false, message: "Poblado no válido." };
    if (player.inventory.cities <= 0) return { success: false, message: "Sin piezas." };

    const hasResources = Object.entries(COSTS.city).every(([res, val]) => 
      player.resources[res as ResourceType] >= (val || 0)
    );
    if (!hasResources) return { success: false, message: "Sin recursos." };

    return { success: true };
  };

  return { canBuildSettlement, canBuildRoad, canBuildCity };
};
