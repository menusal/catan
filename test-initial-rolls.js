// Test to verify initial roll logic
const players = [
  { playerId: 'p1', name: 'Jugador 1' },
  { playerId: 'p2', name: 'Jugador 2' },
  { playerId: 'p3', name: 'Jugador 3' },
  { playerId: 'p4', name: 'Jugador 4' }
];

// Test case 1: Clear winner
const rolls1 = { p1: 3, p2: 5, p3: 2, p4: 6 };
let highestRoll = -1;
let starterIdx = 0;

players.forEach((p, i) => {
  const roll = rolls1[p.playerId] || 0;
  if (roll > highestRoll) {
    highestRoll = roll;
    starterIdx = i;
  }
});

console.log("Test 1 - Clear winner:");
console.log(`Rolls: ${JSON.stringify(rolls1)}`);
console.log(`Highest roll: ${highestRoll}, Starter: ${players[starterIdx].name} (index ${starterIdx})`);
console.log(`Expected: Jugador 4 (index 3) with roll 6`);
console.log(`Result: ${starterIdx === 3 && highestRoll === 6 ? 'PASS' : 'FAIL'}\n`);

// Test case 2: Ties
const rolls2 = { p1: 5, p2: 5, p3: 3, p4: 2 };
highestRoll = -1;
starterIdx = 0;

players.forEach((p, i) => {
  const roll = rolls2[p.playerId] || 0;
  if (roll > highestRoll) {
    highestRoll = roll;
    starterIdx = i;
  }
});

console.log("Test 2 - Ties:");
console.log(`Rolls: ${JSON.stringify(rolls2)}`);
console.log(`Highest roll: ${highestRoll}, Starter: ${players[starterIdx].name} (index ${starterIdx})`);
console.log(`Current logic picks first player with highest roll (index 0)`);
console.log(`Problem: Should handle ties by re-rolling or picking fairly\n`);
