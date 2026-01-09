// Test to verify who should start after setup
const numPlayers = 4;

console.log("WHO STARTS AFTER SETUP?");
console.log("=======================\n");

console.log("Setup sequence:");
let currentPlayer = 0;

for (let step = 0; step < numPlayers * 4; step++) {
  const isSettlement = step % 2 === 0;
  const action = isSettlement ? "Settlement" : "Road";
  
  console.log(`Step ${step}: Player ${currentPlayer} places ${action}`);
  
  // After placing a road (odd steps), calculate next player
  if (!isSettlement && step < numPlayers * 4 - 1) {
    const nextStep = step + 1;
    const turnIndex = Math.floor(nextStep / 2);
    currentPlayer = turnIndex < numPlayers 
      ? turnIndex 
      : numPlayers - 1 - (turnIndex - numPlayers);
  }
}

console.log(`\nAfter setup ends (step ${numPlayers * 4}), current player is: ${currentPlayer}`);
console.log("\nAccording to Catan rules, Player 0 (first player) should start the game.");
console.log("This is because they placed the last road in the setup phase.");
