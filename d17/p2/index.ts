import { readInputFileLines } from '../../util'

const PATTERN = /target area: x=(.+), y=(.+)/

function parseLine(line: string) {
  const match = PATTERN.exec(line)!
  const x = match[1].split('..').map(x => parseInt(x))
  const y = match[2].split('..').map(x => parseInt(x))
  return [x, y]
}

const [xRange, yRange] = readInputFileLines(__dirname, parseLine)[0]

function simulateXAndY(dx: number, dy: number): boolean {
  let x = 0
  let y = 0

  for (;;) {
    x += dx
    y += dy

    if (dx > 0) {
      dx--
    }

    dy--

    if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
      return true
    }

    if (y < yRange[0]) {
      return false
    }
  }
}

function simulateX(dx: number): boolean {
  let x = 0

  for (;;) {
    x += dx

    if (dx > 0) {
      dx--
    }

    if (x >= xRange[0] && x <= xRange[1]) {
      return true
    }

    if (x > xRange[1] || dx === 0) {
      return false
    }
  }
}

const validVelocities = []
for (let dx = 1; dx <= 1000; dx++) {
  if (simulateX(dx)) {
    for (let dy = -1000; dy <= 1000; dy++) {
      if (simulateXAndY(dx, dy)) {
        validVelocities.push([dx, dy])
      }
    }
  }
}

console.log(validVelocities.length)
