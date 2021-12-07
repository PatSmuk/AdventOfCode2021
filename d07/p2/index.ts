import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split(',').map(x => parseInt(x))
}

const startPositions = readInputFileLines(__dirname, parseLine)[0]
const maxPosition = Math.max(...startPositions)

// Pre-compute the fuel required for each possible position difference.
const fuelByDifference = [0]
let fuelRequired = 1
for (let i = 1; i < maxPosition; i++) {
  fuelByDifference.push(fuelByDifference[i - 1] + fuelRequired)
  fuelRequired++
}

let smallestDiff = Number.POSITIVE_INFINITY
// Try each position to find the smallest diff
for (let position = 0; position <= maxPosition; position++) {
  let diffs = 0

  for (const input of startPositions) {
    diffs += fuelByDifference[Math.abs(input - position)]
  }

  if (diffs < smallestDiff) {
    smallestDiff = diffs
  }
}

console.log(smallestDiff)
