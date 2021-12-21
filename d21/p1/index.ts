/** Yields 1..100 forever. */
function* createDeterministicDie(): Generator<number, number, unknown> {
  let i = 0
  for (;;) {
    yield (i % 100) + 1
    i++
  }
}

const die = createDeterministicDie()
let p1Pos = 7
let p2Pos = 4
let p1Score = 0
let p2Score = 0
let dieRolls = 0

for (;;) {
  // Do player one's turn.
  p1Pos += die.next().value + die.next().value + die.next().value
  dieRolls += 3
  p1Pos %= 10
  p1Score += p1Pos + 1

  // If player one wins...
  if (p1Score >= 1000) {
    console.log(p2Score * dieRolls)
    process.exit()
  }

  // Do player two's turn.
  p2Pos += die.next().value + die.next().value + die.next().value
  dieRolls += 3
  p2Pos %= 10
  p2Score += p2Pos + 1

  // If player two wins...
  if (p2Score >= 1000) {
    console.log(p1Score * dieRolls)
    process.exit()
  }
}
