import { readInputFileLines, mapInc } from '../../util'
import * as it from 'iter-tools'

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
const insertedCharByPair = new Map<string, string>(inputs.slice(1) as [string, string][])

// For each step...
for (const _ of it.range(STEPS)) {
  // Construct new polymer.
  const newPolymer = [polymer[0]]

  // For each pair of chars in old polymer...
  for (const [a, b] of it.window(2, polymer)) {
    const inserted = insertedCharByPair.get(a + b)!
    newPolymer.push(inserted, b)
  }

  polymer = newPolymer
}

// Count the letters.
const letterCount = new Map<string, number>()
for (const letter of polymer) {
  mapInc(letterCount, letter, 1)
}

// Find the most and least common letters.
const most = Math.max(...letterCount.values())
const least = Math.min(...letterCount.values())
console.log(most - least)
