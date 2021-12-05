import { readInputFileLines } from '../../util'

const INPUT_PATTERN = /^(\d+),(\d+) -> (\d+),(\d+)$/

function parseLine(line: string) {
  const match = INPUT_PATTERN.exec(line)
  if (!match) throw new Error(`failed to match ${line}`)

  return [
    parseInt(match[1]),
    parseInt(match[2]),
    parseInt(match[3]),
    parseInt(match[4])
  ] as [number, number, number, number]
}

const inputs = readInputFileLines(__dirname, parseLine)

const hits = new Map<string, number>()

function markHit(x: number, y: number) {
  const value = hits.get(`${x},${y}`)
  hits.set(`${x},${y}`, value ? value + 1 : 1)
}

const UP = -1
const DOWN = 1
const LEFT = -1
const RIGHT = 1

for (const [x1, y1, x2, y2] of inputs) {
  // Calculate number of steps and how to move relative to (x1,y1)
  let steps: number, dx: number, dy: number

  // Diagonal line
  if (x1 !== x2 && y1 !== y2) {
    steps = Math.abs(x1 - x2)
    dx = x2 > x1 ? RIGHT : LEFT
    dy = y2 > y1 ? DOWN : UP

  } else if (x1 !== x2) {
    // Horizontal line
    steps = Math.abs(x1 - x2)
    dx = x2 > x1 ? RIGHT : LEFT
    dy = 0

  } else {
    // Vertical line
    steps = Math.abs(y1 - y2)
    dx = 0
    dy = y2 > y1 ? DOWN : UP
  }

  for (let i = 0; i <= steps; i++) {
    const x = x1 + (dx * i)
    const y = y1 + (dy * i)
    markHit(x, y)
  }
}

// Print count of values that are 2 or higher.
console.log([...hits.values()].filter(x => x >= 2).length)
