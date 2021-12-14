import { readInputFileLines, mapInc } from '../../util'

const STEPS = 40

function parseLine(line: string, i: number) {
  if (i === 0) {
    return line.split('')
  } else if (i >= 2) {
    return line.split(' -> ')
  }
  return null
}

const inputs = readInputFileLines(__dirname, parseLine).filter(x => !!x) as string[][]

let polymer = new Map<string, number>()
const startPolymer = inputs[0]
for (let i = 0; i < startPolymer.length - 1; i++) {
  const pair = startPolymer[i + 0] + startPolymer[i + 1]
  mapInc(polymer, pair, 1)
}

// Create map from pairs of chars to the one to insert in between.
const insertedCharByPair = new Map<string, string>()
for (let i = 1; i < inputs.length; i++) {
  const [pair, inserted] = inputs[i]
  insertedCharByPair.set(pair, inserted)
}

// For each step...
for (let step = 1; step <= STEPS; step++) {
  const newPolymer = new Map()

  for (const [pair, count] of polymer) {
    const inserted = insertedCharByPair.get(pair)!
    mapInc(newPolymer, pair[0] + inserted, count)
    mapInc(newPolymer, inserted + pair[1], count)
  }

  polymer = newPolymer
}

// Count the letters.
const lastChar = startPolymer[startPolymer.length - 1]
const letterCount = new Map<string, number>([[lastChar, 1]])
for (const [pair, count] of polymer) {
   mapInc(letterCount, pair[0], count)
}

// Find the most and least common letters.
let most = Number.NEGATIVE_INFINITY
let least = Number.POSITIVE_INFINITY
for (const value of letterCount.values()) {
  if (value > most) most = value
  if (value < least) least = value
}

console.log(most - least)
