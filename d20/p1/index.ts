import { readInputFileLines } from '../../util'

function parseLine(line: string, index: number) {
  if (index === 0) {
    return line.split('')
  }
  if (index > 1) {
    return line.split('')
  }
  return null
}

const inputs = readInputFileLines(__dirname, parseLine).filter(l => l !== null) as string[][]
const table = inputs[0]
const gridLines = inputs.slice(1)

let minRow = 0
let minCol = 0
let maxRow = gridLines.length - 1
let maxCol = gridLines[0]!.length - 1
let lit = new Set<string>()

for (let row = 0; row <= maxRow; row++) {
  for (let col = 0; col <= maxCol; col++) {
    if (gridLines[row][col] === '#') {
      lit.add(`${row},${col}`)
    }
  }
}

function stepTwice() {
  const unlit = new Set<string>()

  for (let r = minRow - 1; r <= maxRow + 1; r++) {
    for (let c = minCol - 1; c <= maxCol + 1; c++) {
      const bits = [
        lit.has(`${r-1},${c-1}`) ? 1 : 0,
        lit.has(`${r-1},${c+0}`) ? 1 : 0,
        lit.has(`${r-1},${c+1}`) ? 1 : 0,
        lit.has(`${r+0},${c-1}`) ? 1 : 0,
        lit.has(`${r+0},${c+0}`) ? 1 : 0,
        lit.has(`${r+0},${c+1}`) ? 1 : 0,
        lit.has(`${r+1},${c-1}`) ? 1 : 0,
        lit.has(`${r+1},${c+0}`) ? 1 : 0,
        lit.has(`${r+1},${c+1}`) ? 1 : 0,
      ]
      const index = parseInt(bits.join(''), 2)

      if (table[index] === '.') {
        unlit.add(`${r},${c}`)
      }
    }
  }

  minRow -= 1
  minCol -= 1
  maxRow += 1
  maxCol += 1

  const newLit = new Set<string>()

  for (let r = minRow - 1; r <= maxRow + 1; r++) {
    for (let c = minCol - 1; c <= maxCol + 1; c++) {
      const bits = [
        unlit.has(`${r-1},${c-1}`) ? 0 : 1,
        unlit.has(`${r-1},${c+0}`) ? 0 : 1,
        unlit.has(`${r-1},${c+1}`) ? 0 : 1,
        unlit.has(`${r+0},${c-1}`) ? 0 : 1,
        unlit.has(`${r+0},${c+0}`) ? 0 : 1,
        unlit.has(`${r+0},${c+1}`) ? 0 : 1,
        unlit.has(`${r+1},${c-1}`) ? 0 : 1,
        unlit.has(`${r+1},${c+0}`) ? 0 : 1,
        unlit.has(`${r+1},${c+1}`) ? 0 : 1,
      ]
      const index = parseInt(bits.join(''), 2)

      if (table[index] === '#') {
        newLit.add(`${r},${c}`)
      }
    }
  }

  lit = newLit
  minRow -= 1
  minCol -= 1
  maxRow += 1
  maxCol += 1
}

stepTwice()
console.log(lit.size)
