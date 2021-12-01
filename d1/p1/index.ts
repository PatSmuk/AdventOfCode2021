import { readInputFileLines } from '../../util'

const inputs = readInputFileLines(__dirname, l => parseInt(l))
let lastInput = Number.POSITIVE_INFINITY
let increases = 0

for (const input of inputs) {
  if (input > lastInput) increases++
  lastInput = input
}

console.log(increases)
