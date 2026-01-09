// Correct sequence for 2 players
const numPlayers = 2;

console.log("Correct Setup Sequence (2 players)");
console.log("===================================\n");

// First round: 0, 1
// Second round: 1, 0 (reverse)

let step = 0;
let currentPlayer = 0;

for (let i = 0; i < numPlayers * 4; i++) {
  const isSettlement = step % 2 === 0;
  const action = isSettlement ? "SETTLEMENT" : "ROAD";
  
  console.log(`Step ${step}: Player ${currentPlayer} places ${action}`);
  
  if (!isSettlement) {
    // After road, calculate next player
    const nextStep = step + 1;
    
    if (nextStep >= numPlayers * 4) {
      console.log(`  → Setup ends! Next player: 0\n`);
      break;
    }
    
    // Determine which player should place the next settlement
    // The next step is for a settlement, so we need to figure out which player
    const nextTurnIndex = Math.floor(nextStep / 2);
    
    let nextPlayer;
    if (nextTurnIndex < numPlayers) {
      // First round: 0, 1
      nextPlayer = nextTurnIndex;
    } else {
      // Second round: reverse order
      // After numPlayers turns, we go backwards
      // turnIndex 2 -> player 1, turnIndex 3 -> player 0
      nextPlayer = numPlayers - 1 - (nextTurnIndex - numPlayers);
    }
    
    console.log(`  → After road: nextStep=${nextStep}, nextTurnIndex=${nextTurnIndex}, nextPlayer=${nextPlayer}`);
    console.log(`  → Transition: Player ${currentPlayer} → Player ${nextPlayer}\n`);
    currentPlayer = nextPlayer;
  }
  
  step++;
}
