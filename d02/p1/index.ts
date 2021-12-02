import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  const [direction, amount] = line.split(' ')
  return { direction, amount: parseInt(amount) }
}

const inputs = readInputFileLines(__dirname, parseLine)

let x = 0
let y = 0

for (const { direction, amount } of inputs) {
  if (direction === 'forward') {
    x += amount
  }
  if (direction === 'down') {
    y += amount
  }
  if (direction === 'up') {
    y -= amount
  }
}

console.log(x, y, x * y)
