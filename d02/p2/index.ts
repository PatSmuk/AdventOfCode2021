import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  const [direction, amount] = line.split(' ')
  return { direction, amount: parseInt(amount) }
}


const inputs = readInputFileLines(__dirname, parseLine)

let x = 0
let y = 0
let aim = 0

for (const { direction, amount } of inputs) {
  if (direction === 'forward') {
    x += amount
    y += aim * amount
  }
  if (direction === 'down') {
    aim += amount
  }
  if (direction === 'up') {
    aim -= amount
  }
}

console.log(x, y, x * y)
