import { readInputFileLines, mapInc } from '../../util'

const STEPS = 10

function parseLine(line: string, i: number) {
  if (i === 0) {
    return line.split('')
  } else if (i >= 2) {
    return line.split(' -> ')
  }
  return null
}

const inputs = readInputFileLines(__dirname, parseLine).filter(x => !!x) as string[][]

let polymer = inputs[0]

// Create map from pairs of chars to the one to insert in between.
const insertedCharByPair = new Map<string, string>()
for (let i = 1; i < inputs.length; i++) {
  const [pair, inserted] = inputs[i]
  insertedCharByPair.set(pair, inserted)
}

// For each step...
for (let step = 1; step <= STEPS; step++) {
  // Construct new polymer.
  const newPolymer = [polymer[0]]

  // For each pair of chars in old polymer...
  for (let i = 0; i < polymer.length - 1; i++) {
    const inserted = insertedCharByPair.get(polymer[i + 0] + polymer[i + 1])!
    newPolymer.push(inserted)
    newPolymer.push(polymer[i + 1])
  }

  polymer = newPolymer
}

// Count the letters.
const letterCount = new Map<string, number>()
for (const letter of polymer) {
  mapInc(letterCount, letter, 1)
}

// Find the most and least common letters.
let most = Number.NEGATIVE_INFINITY
let least = Number.POSITIVE_INFINITY
for (const value of letterCount.values()) {
  if (value > most) most = value
  if (value < least) least = value
}

console.log(most - least)
