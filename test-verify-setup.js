// Verify setup logic step by step
const numPlayers = 2;

console.log("Verifying Setup Logic (2 players)");
console.log("==================================\n");

let currentPlayer = 0;
let currentStep = 0;

for (let step = 0; step < 4; step++) {
  const isSettlement = step % 2 === 0;
  const action = isSettlement ? "SETTLEMENT" : "ROAD";
  
  console.log(`Step ${step}: Player ${currentPlayer} places ${action}`);
  
  if (!isSettlement) {
    // After road, calculate next player
    const nextStep = step + 1;
    if (nextStep >= numPlayers * 4) {
      currentPlayer = 0;
      console.log(`  → Setup ends! Next player: ${currentPlayer}\n`);
    } else {
      const turnIndex = Math.floor(nextStep / 2);
      let nextPlayer;
      if (turnIndex < numPlayers) {
        nextPlayer = turnIndex;
      } else {
        nextPlayer = numPlayers - 1 - (turnIndex - numPlayers);
      }
      console.log(`  → After road: nextStep=${nextStep}, turnIndex=${turnIndex}, nextPlayer=${nextPlayer}`);
      console.log(`  → Current player was ${currentPlayer}, should transition to ${nextPlayer}\n`);
      currentPlayer = nextPlayer;
    }
  }
}
