import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split(',').map(x => parseInt(x))
}

const startPositions = readInputFileLines(__dirname, parseLine)[0]
const maxPosition = Math.max(...startPositions)

let smallestDiff = Number.POSITIVE_INFINITY
// Try each position to find the smallest diff
for (let position = 0; position <= maxPosition; position++) {
  let diffs = 0

  for (const input of startPositions) {
    diffs += Math.abs(input - position)
  }

  if (diffs < smallestDiff) {
    smallestDiff = diffs
  }
}

console.log(smallestDiff)
