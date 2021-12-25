import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split('')
}

let grid = readInputFileLines(__dirname, parseLine)
const numRows = grid.length
const numCols = grid[0].length

function step() {
  let newGrid: string[][] = []
  for (let r = 0; r < numRows; r++) {
    newGrid[r] = []
    for (let c = 0; c < numCols; c++) {
      newGrid[r][c] = grid[r][c]
    }
  }

  for (let r = 0; r < numRows; r++) {
    const row = grid[r]
    for (let c = 0; c < numCols; c++) {
      if (row[c] === '>' && (row[(c + 1) % numCols] === '.')) {
        newGrid[r][c] = '.'
        newGrid[r][(c + 1) % numCols] = '>'
        c++
      }
    }
  }

  grid = newGrid
  newGrid = []
  for (let r = 0; r < numRows; r++) {
    newGrid[r] = []
    for (let c = 0; c < numCols; c++) {
      newGrid[r][c] = grid[r][c]
    }
  }

  for (let c = 0; c < numCols; c++) {
    for (let r = 0; r < numRows; r++) {
      if (grid[r][c] === 'v' && (grid[(r + 1) % numRows][c] === '.')) {
        newGrid[r][c] = '.'
        newGrid[(r + 1) % numRows][c] = 'v'
        r++
      }
    }
  }

  grid = newGrid
}

function draw(): string {
  let string = ''
  for (let r = 0; r < numRows; r++) {
    let line = ''
    for (let c = 0; c < numCols; c++) {
      line += grid[r][c]
    }
    string += line + '\n'
  }
  return string
}

let lastDrawing = draw()
for (let s = 0;; s++) {
  step()
  const drawing = draw()
  // console.log(drawing)
  if (drawing === lastDrawing) {
    console.log(s + 1)
    break
  }
  lastDrawing = drawing
}
