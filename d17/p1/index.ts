import { readInputFileLines } from '../../util'

const PATTERN = /target area: x=(.+), y=(.+)/

function parseLine(line: string) {
  const match = PATTERN.exec(line)!
  const x = match[1].split('..').map(x => parseInt(x))
  const y = match[2].split('..').map(x => parseInt(x))
  return [x, y]
}

const [, yRange] = readInputFileLines(__dirname, parseLine)[0]

function simulateY(dy: number): [boolean, number] {
  let y = 0
  let maxY = Number.NEGATIVE_INFINITY

  for (;;) {
    y += dy
    dy--

    if (y > maxY) {
      maxY = y
    }

    if (y >= yRange[0] && y <= yRange[1]) {
      return [true, maxY]
    }

    if (y < yRange[0]) {
      return [false, maxY]
    }
  }
}

let maxY = Number.NEGATIVE_INFINITY
for (let dy = 1; dy <= 1000; dy++) {
  const [result, y] = simulateY(dy)
  if (result && y > maxY) {
    maxY = y
  }
}

console.log(maxY)
