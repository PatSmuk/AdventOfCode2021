import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line
}

const inputs = readInputFileLines(__dirname, parseLine)

let gammaString = ''
let ones = '' // will be ('1' * inputs[0].length)

// For each character position...
for (let i = 0; i < inputs[0].length; i++) {
  // Count the zeros
  let zeros = 0
  for (const line of inputs) {
    if (line[i] === '0') zeros++
  }

  // Check if zeros are more common
  gammaString += (zeros > inputs.length / 2) ? '0' : '1'
  ones += '1'
}

const gamma = parseInt(gammaString, 2)
// Epsilon is just gamma with the bits flipped
const epsilon = gamma ^ parseInt(ones, 2)
console.log(gamma, epsilon, gamma * epsilon)
