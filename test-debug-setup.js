// Debug script to verify setup transition logic
const numPlayers = 2;

console.log("Debug Setup Transition (2 players)");
console.log("====================================\n");

for (let step = 0; step <= 3; step++) {
  const isSettlement = step % 2 === 0;
  const action = isSettlement ? "SETTLEMENT" : "ROAD";
  
  // Current player calculation
  const turnIndex = Math.floor(step / 2);
  const currentPlayer = turnIndex < numPlayers 
    ? turnIndex 
    : numPlayers - 1 - (turnIndex - numPlayers);
  
  console.log(`Step ${step}: Player ${currentPlayer} places ${action}`);
  
  if (!isSettlement) {
    // After road, calculate next player
    const nextStep = step + 1;
    if (nextStep >= numPlayers * 4) {
      console.log(`  → Setup ends! Next player: 0\n`);
    } else {
      const nextTurnIndex = Math.floor(nextStep / 2);
      let nextPlayer;
      if (nextTurnIndex < numPlayers) {
        nextPlayer = nextTurnIndex;
      } else {
        nextPlayer = numPlayers - 1 - (nextTurnIndex - numPlayers);
      }
      console.log(`  → After road (step ${step}), nextStep=${nextStep}, turnIndex=${nextTurnIndex}, nextPlayer=${nextPlayer}\n`);
    }
  }
}
