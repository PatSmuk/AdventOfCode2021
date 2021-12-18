import { readInputFileLines } from '../../util'
import cloneDeep from 'clone-deep'
import { Pair, calculateMagnitude, reducePair } from '../util'

function parseLine(line: string): Pair {
  return JSON.parse(line)
}

const numbers = readInputFileLines(__dirname, parseLine)
let biggestMagnitude: number = Number.NEGATIVE_INFINITY

for (const left of numbers) {
  for (const right of numbers) {
    if (left === right) continue

    const pair = cloneDeep([left, right] as Pair)
    reducePair(pair)
    const magnitude = calculateMagnitude(pair)

    if (magnitude > biggestMagnitude) {
      biggestMagnitude = magnitude
    }
  }
}

console.log(biggestMagnitude)
