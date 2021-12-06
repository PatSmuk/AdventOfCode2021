import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split(',').map(x => parseInt(x))
}

// Keep track of the age of each fish in an array.
const fishAges = readInputFileLines(__dirname, parseLine)[0]

const DAYS = 80

// For each day...
for (let day = 0; day < DAYS; day++) {
  let newFish = 0

  // Go through each existing fish.
  for (let i = 0; i < fishAges.length; i++) {
    fishAges[i]--

    // If the age was 0, reset it to 6 and increase spawn counter.
    if (fishAges[i] === -1) {
      fishAges[i] = 6
      newFish++
    }
  }

  // Spawn new fish with a timer of 8.
  for (let i = 0; i < newFish; i++) {
    fishAges.push(8)
  }
}

console.log(fishAges.length)
