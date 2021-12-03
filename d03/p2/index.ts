import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line
}

const inputs = readInputFileLines(__dirname, parseLine)

let numbers = inputs
// For each character position...
for (let i = 0; i < numbers[0].length && numbers.length > 1; i++) {
  // Count the zeros
  let zeros = 0
  for (const line of numbers) {
    if (line[i] === '0') zeros++
  }

  // Check if zeros are more common
  const wanted = (zeros > numbers.length / 2) ? '0' : '1'
  numbers = numbers.filter(n => n[i] === wanted)
}
const a = parseInt(numbers[0], 2)

numbers = inputs
// For each character position...
for (let i = 0; i < numbers[0].length && numbers.length > 1; i++) {
  // Count the zeros
  let zeros = 0
  for (const line of numbers) {
    if (line[i] === '0') zeros++
  }

  // Check if zeros are more common
  const wanted = (zeros > numbers.length / 2) ? '1' : '0'
  numbers = numbers.filter(n => n[i] === wanted)
}
const b = parseInt(numbers[0], 2)

console.log(a, b, a * b)
