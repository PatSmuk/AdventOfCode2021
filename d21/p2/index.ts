const winsByPosition = new Map<string, [bigint, bigint]>()
const startingPosition = '1,7,4,0,0'

// Chances of getting each roll result using the 3d3.
const rollChances: {[roll: number]: bigint} = {
  3: 1n,
  4: 3n,
  5: 6n,
  6: 7n,
  7: 6n,
  8: 3n,
  9: 1n
}

/** Calculate the number of universes where player one and two win from this game position. */
function calculateWinsForPosition(activePlayer: number, p1Pos: number, p2Pos: number, p1Score: number, p2Score: number): [bigint, bigint] {
  let p1Wins = 0n
  let p2Wins = 0n

  // Try each posible roll result.
  for (let roll = 3; roll <= 9; roll++) {
    const chances = rollChances[roll]

    if (activePlayer === 1) {
      // Calculate new position and score for P1.
      const newPos = (p1Pos + roll) % 10
      const newScore = p1Score + newPos + 1

      // If this is a winning position, add the number of ways we can roll this number to the wins.
      if (newScore >= 21) {
        p1Wins += chances
      } else {
        // Otherwise, lookup the wins for this position (with the other player as the active player)
        //   and add those wins multiplied by the chances we end up in this position.
        const newPosition = `2,${newPos},${p2Pos},${newScore},${p2Score}`
        const wins = winsByPosition.get(newPosition)!
        p1Wins += wins[0] * chances
        p2Wins += wins[1] * chances
      }
    } else {
      // Same thing but for the other player.
      const newPos = (p2Pos + roll) % 10
      const newScore = p2Score + newPos + 1

      if (newScore >= 21) {
        p2Wins += rollChances[roll]
      } else {
        const newPosition = `1,${p1Pos},${newPos},${p1Score},${newScore}`
        const wins = winsByPosition.get(newPosition)!
        p1Wins += wins[0] * chances
        p2Wins += wins[1] * chances
      }
    }
  }

  return [p1Wins, p2Wins]
}

// Going from high scores to low ensures that every time we lookup the
//   wins for a position, they're already known.
for (let p1Score = 20; p1Score >= 0; p1Score--) {
  for (let p2Score = 20; p2Score >= 0; p2Score--) {

    // Go through each board position for P1 and P2.
    for (let p1Pos = 0; p1Pos < 10; p1Pos++) {
      for (let p2Pos = 0; p2Pos < 10; p2Pos++) {

        // For each player in this board position...
        for (const activePlayer of [1, 2]) {
          const position = `${activePlayer},${p1Pos},${p2Pos},${p1Score},${p2Score}`
          const [p1Wins, p2Wins] = calculateWinsForPosition(activePlayer, p1Pos, p2Pos, p1Score, p2Score)

          // If we ended up in the original starting position then we are done,
          //   we know how many ways P1 and P2 can win from here.
          if (position === startingPosition) {
            console.log(p1Wins > p2Wins ? p1Wins : p2Wins)
            process.exit()
          }

          winsByPosition.set(position, [p1Wins, p2Wins])
        }
      }
    }
  }
}
