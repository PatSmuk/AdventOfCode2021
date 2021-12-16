import { readInputFileLines, mapInc } from '../../util'
import * as it from 'iter-tools'

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
for (const [a, b] of it.window(2, startPolymer)) {
  mapInc(polymer, a + b, 1)
}

// Create map from pairs of chars to the one to insert in between.
const insertedCharByPair = new Map<string, string>(inputs.slice(1) as [string, string][])

// For each step...
for (const _ of it.range(STEPS)) {
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
const most = Math.max(...letterCount.values())
const least = Math.min(...letterCount.values())
console.log(most - least)
