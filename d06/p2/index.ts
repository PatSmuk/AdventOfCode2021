import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split(',').map(x => parseInt(x))
}

// Create map from time left to number of fish.
const fishByTimer = new Map<number, bigint>()
for (let i = 0; i <= 8; i++) {
  fishByTimer.set(i, 0n)
}

// Initialize the count of fish by age using input data.
const inputs = readInputFileLines(__dirname, parseLine)[0]
for (const input of inputs) {
  fishByTimer.set(input, fishByTimer.get(input)! + 1n)
}

const DAYS = 256

// For each day...
for (let day = 0; day < DAYS; day++) {
  // Determine number of fish to spawn.
  let fishToSpawn = fishByTimer.get(0)!

  // Move all the fish down one key.
  for (let i = 0; i < 8; i++) {
    fishByTimer.set(i, fishByTimer.get(i + 1)!)
  }

  // Spawn new fish with a timer of 8, and add their parents back to the 6 timer bucket.
  fishByTimer.set(8, fishToSpawn)
  fishByTimer.set(6, fishByTimer.get(6)! + fishToSpawn)
}

// Count up all the values for the total.
console.log([...fishByTimer.values()].reduce((prev, curr) => prev + curr, 0n))
