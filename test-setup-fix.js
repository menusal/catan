// Test script to verify the fixed setup phase logic
const numPlayers = 2;

console.log("Fixed Setup Phase Logic Test (2 players)");
console.log("========================================\n");

let currentPlayer = 0;
let currentStep = 0;

for (let step = 0; step < numPlayers * 4; step++) {
  const isSettlement = step % 2 === 0;
  const action = isSettlement ? "SETTLEMENT" : "ROAD";
  
  console.log(`Step ${step}: Player ${currentPlayer} places ${action}`);
  
  if (!isSettlement) {
    // After placing a road, calculate next player
    const nextStep = step + 1;
    if (nextStep >= numPlayers * 4) {
      currentPlayer = 0; // Setup ends, first player starts
      console.log(`  → Setup ends! Next player: ${currentPlayer} (starts game)\n`);
    } else {
      const turnIndex = Math.floor(nextStep / 2);
      currentPlayer = turnIndex < numPlayers 
        ? turnIndex 
        : numPlayers - 1 - (turnIndex - numPlayers);
      console.log(`  → After road, transition to Player ${currentPlayer}\n`);
    }
  } else {
    console.log(`  → After settlement, same player places road\n`);
  }
}
