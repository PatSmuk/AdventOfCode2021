import { readInputFileLines } from '../../util'

const DOT_PATTERN = /(\d+),(\d+)/
const FOLD_PATTERN = /fold along (y|x)=(\d+)/

function parseLine(line: string): [number|string, number] | null {
  let match = DOT_PATTERN.exec(line)
  if (match) {
    return [parseInt(match[1]), parseInt(match[2])]
  }

  match = FOLD_PATTERN.exec(line)
  if (match) {
    return [match[1], parseInt(match[2])]
  }

  return null
}

const X = 0
const Y = 1

const inputs = readInputFileLines(__dirname, parseLine).filter(x => x !== null) as [number|string, number][]
let dots: [number, number][] = []

function draw() {
  // Figure out which coords have a dot and
  //   what the biggest X and Y values are.
  const coordsWithDot = new Set(dots.map(d => `${d[X]},${d[Y]}`))
  let maxX = Math.max(...dots.map(d => d[X]))
  let maxY = Math.max(...dots.map(d => d[Y]))

  let line = ''
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      line += coordsWithDot.has(`${x},${y}`) ? '#' : ' '
    }
    line += '\n'
  }

  console.log(line)
}

for (const input of inputs) {
  if (typeof input[0] === 'number') {
    dots.push(input as [number, number])

  } else {
    const [axis, foldValue] = input
    const xOrY = axis === 'x' ? X : Y

    for (const dot of dots) {
      const dotValue = dot[xOrY]

      // If the dot is on the fold line, remove it.
      if (dotValue === foldValue) {
        dots = dots.filter(x => x !== dot)

      } else if (dotValue > foldValue) {
        // If the dot is on the far side of the fold, adjust the coord so
        //   it's on the near side at the same distance from the fold.
        dot[xOrY] -= (dotValue - foldValue) * 2
      }
    }
  }
}

draw()
