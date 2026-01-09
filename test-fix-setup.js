// Test to verify the correct calculation
const numPlayers = 2;

console.log("Testing Setup Calculation Fix");
console.log("==============================\n");

for (let step = 0; step < 4; step++) {
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
    const nextTurnIndex = Math.floor(nextStep / 2);
    let nextPlayer;
    
    if (nextStep >= numPlayers * 4) {
      nextPlayer = 0; // Setup ends
      console.log(`  → Setup ends! Next player: ${nextPlayer}\n`);
    } else {
      if (nextTurnIndex < numPlayers) {
        nextPlayer = nextTurnIndex;
      } else {
        nextPlayer = numPlayers - 1 - (nextTurnIndex - numPlayers);
      }
      console.log(`  → After road: nextStep=${nextStep}, nextTurnIndex=${nextTurnIndex}, nextPlayer=${nextPlayer}`);
      console.log(`  → Should transition from Player ${currentPlayer} to Player ${nextPlayer}\n`);
    }
  }
}
