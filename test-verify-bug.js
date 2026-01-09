// Verify the bug from the logs
const numPlayers = 2;

console.log("Verifying Bug from Logs");
console.log("=======================\n");

// From the logs: Player 1 placed road at step 1
const currentStep = 1;
const currentPlayer = 1; // Player 1 placed the road

console.log(`Current: Step ${currentStep}, Player ${currentPlayer} placed ROAD`);

const nextStep = currentStep + 1; // = 2
const nextTurnIndex = Math.floor(nextStep / 2); // = Math.floor(2/2) = 1

console.log(`nextStep = ${nextStep}`);
console.log(`nextTurnIndex = Math.floor(${nextStep}/2) = ${nextTurnIndex}`);

let nextPlayerIdx;
if (nextTurnIndex < numPlayers) {
  nextPlayerIdx = nextTurnIndex; // = 1
  console.log(`nextTurnIndex (${nextTurnIndex}) < numPlayers (${numPlayers}), so nextPlayerIdx = ${nextPlayerIdx}`);
} else {
  nextPlayerIdx = numPlayers - 1 - (nextTurnIndex - numPlayers);
  console.log(`nextTurnIndex (${nextTurnIndex}) >= numPlayers (${numPlayers}), so nextPlayerIdx = ${nextPlayerIdx}`);
}

console.log(`\nResult: Transitioning from Player ${currentPlayer} to Player ${nextPlayerIdx}`);
console.log(`\nThis is WRONG! After Player 1 places road at step 1, the next player should be Player 0 (for second round)`);
console.log(`The issue is that step 2 is for Player 1's second settlement, not Player 0's.`);
