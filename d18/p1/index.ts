import { readInputFileLines } from '../../util'
import { Pair, calculateMagnitude, reducePair } from '../util'

function parseLine(line: string): Pair {
  return JSON.parse(line)
}

const numbers = readInputFileLines(__dirname, parseLine)

let pair: Pair = [numbers[0], numbers[1]]
reducePair(pair)

for (const number of numbers.slice(2)) {
  pair = [pair, number]
  reducePair(pair)
}

console.log(calculateMagnitude(pair))
