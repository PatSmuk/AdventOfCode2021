import { readInputFileLines } from '../../util'

const inputs = readInputFileLines(__dirname, l => parseInt(l))
let previousDepth = Number.POSITIVE_INFINITY
let increases = 0

for (let i = 0; i < inputs.length - 2; i++) {
  const depth = inputs[i + 0] + inputs[i + 1] + inputs[i + 2]
  if (depth > previousDepth) increases++
  previousDepth = depth
}

console.log(increases)
