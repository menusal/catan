import { HEX_WIDTH, HEX_HEIGHT, CENTER_X, CENTER_Y, HEX_SIZE } from '../constants/game';

export const getVertexPos = (q: number, r: number, index: number) => {
  const hx = HEX_WIDTH * (q + r / 2) + CENTER_X;
  const hy = HEX_HEIGHT * (3 / 4) * r + CENTER_Y;
  const angle = (Math.PI / 180) * (60 * index - 30);
  return {
    x: Math.round(hx + HEX_SIZE * Math.cos(angle)),
    y: Math.round(hy + HEX_SIZE * Math.sin(angle))
  };
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};
export const calculateLongestPath = (roads: Record<string, number>, playerId: number): number => {
  const playerRoads = Object.entries(roads)
    .filter(([_, owner]) => owner === playerId)
    .map(([id]) => id);

  if (playerRoads.length === 0) return 0;

  const adj: Record<string, string[]> = {};
  playerRoads.forEach(id => {
    const [v1, v2] = id.split('|');
    if (!adj[v1]) adj[v1] = [];
    if (!adj[v2]) adj[v2] = [];
    adj[v1].push(v2);
    adj[v2].push(v1);
  });

  let maxLen = 0;

  const dfs = (v: string, visitedEdges: Set<string>): number => {
    let best = 0;
    const neighbors = adj[v] || [];
    neighbors.forEach(nextV => {
      const edgeId = [v, nextV].sort().join('|');
      if (!visitedEdges.has(edgeId)) {
        visitedEdges.add(edgeId);
        best = Math.max(best, 1 + dfs(nextV, visitedEdges));
        visitedEdges.delete(edgeId);
      }
    });
    return best;
  };

  Object.keys(adj).forEach(startV => {
    maxLen = Math.max(maxLen, dfs(startV, new Set()));
  });

  return maxLen;
};
