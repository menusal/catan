// Correct logic for setup phase
const numPlayers = 2;

console.log("Correct Setup Logic (2 players)");
console.log("=================================\n");

for (let step = 0; step < 8; step++) {
  const isSettlement = step % 2 === 0;
  const action = isSettlement ? "SETTLEMENT" : "ROAD";
  
  // Current player for this step
  const currentTurnIndex = Math.floor(step / 2);
  const currentPlayer = currentTurnIndex < numPlayers 
    ? currentTurnIndex 
    : numPlayers - 1 - (currentTurnIndex - numPlayers);
  
  console.log(`Step ${step}: Player ${currentPlayer} places ${action}`);
  
  if (!isSettlement) {
    // After road, calculate next player for NEXT step
    const nextStep = step + 1;
    
    if (nextStep >= numPlayers * 4) {
      console.log(`  → Setup ends! Next player: 0\n`);
    } else {
      const nextTurnIndex = Math.floor(nextStep / 2);
      let nextPlayer;
      
      if (nextTurnIndex < numPlayers) {
        // First round
        nextPlayer = nextTurnIndex;
      } else {
        // Second round (reverse)
        nextPlayer = numPlayers - 1 - (nextTurnIndex - numPlayers);
      }
      
      console.log(`  → After road: nextStep=${nextStep}, nextTurnIndex=${nextTurnIndex}, nextPlayer=${nextPlayer}`);
      console.log(`  → Transition: Player ${currentPlayer} → Player ${nextPlayer}\n`);
    }
  }
}
