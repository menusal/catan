// Understanding the bug
const numPlayers = 2;

console.log("Understanding the Bug");
console.log("=====================\n");

// From logs: Player 1 placed road at step 1
const step = 1;
const currentPlayer = 1;

console.log(`Step ${step}: Player ${currentPlayer} places ROAD`);

const nextStep = step + 1; // = 2
const nextTurnIndex = Math.floor(nextStep / 2); // = Math.floor(2/2) = 1

console.log(`nextStep = ${nextStep}`);
console.log(`nextTurnIndex = Math.floor(${nextStep}/2) = ${nextTurnIndex}`);

// Current logic:
if (nextTurnIndex < numPlayers) {
  const nextPlayerIdx = nextTurnIndex; // = 1
  console.log(`Current logic: nextTurnIndex (${nextTurnIndex}) < numPlayers (${numPlayers}), so nextPlayerIdx = ${nextPlayerIdx}`);
  console.log(`Result: Player ${currentPlayer} → Player ${nextPlayerIdx} (WRONG! Same player)`);
} else {
  const nextPlayerIdx = numPlayers - 1 - (nextTurnIndex - numPlayers);
  console.log(`Current logic: nextTurnIndex (${nextTurnIndex}) >= numPlayers (${numPlayers}), so nextPlayerIdx = ${nextPlayerIdx}`);
}

console.log("\nThe problem:");
console.log("After Player 1 places road at step 1, we're moving to step 2.");
console.log("Step 2 should be Player 1's SECOND settlement (second round).");
console.log("But the calculation thinks step 2 is still in the first round!");
console.log("\nCorrect sequence:");
console.log("Step 0: Player 0 settlement (first round)");
console.log("Step 1: Player 0 road → nextStep=2, should be Player 1");
console.log("Step 2: Player 1 settlement (first round)");
console.log("Step 3: Player 1 road → nextStep=4, should be Player 1 (second round starts)");
console.log("Step 4: Player 1 settlement (second round)");
console.log("Step 5: Player 1 road → nextStep=6, should be Player 0");
console.log("Step 6: Player 0 settlement (second round)");
console.log("Step 7: Player 0 road → setup ends");
