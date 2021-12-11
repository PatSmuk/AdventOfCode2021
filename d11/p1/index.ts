import { readInputFileLines } from '../../util'

const STEPS = 100

function parseLine(line: string) {
  return line.split('').map(x => parseInt(x))
}

const rows = readInputFileLines(__dirname, parseLine)
const numRows = rows.length
const numCols = rows[0].length

function flash(r: number, c: number) {
  if (r > 0) {
    // If the value is truthy then it is neither
    //   undefined (invalid) nor 0 (already flashed this step).
    rows[r - 1][c - 1] && rows[r - 1][c - 1]++
    rows[r - 1][c + 0] && rows[r - 1][c + 0]++
    rows[r - 1][c + 1] && rows[r - 1][c + 1]++
  }

  rows[r + 0][c - 1] && rows[r + 0][c - 1]++
  rows[r + 0][c + 0] = 0
  rows[r + 0][c + 1] && rows[r + 0][c + 1]++

  if (r < numRows - 1) {
    rows[r + 1][c - 1] && rows[r + 1][c - 1]++
    rows[r + 1][c + 0] && rows[r + 1][c + 0]++
    rows[r + 1][c + 1] && rows[r + 1][c + 1]++
  }
}

let numFlashes = 0
for (let step = 0; step < STEPS; step++) {
  // Increase every octopus by one.
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      rows[r][c]++
    }
  }

  let keepSearching = true
  while (keepSearching) {
    // Assume we don't have to keep searching for a flashable octopus.
    keepSearching = false

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        // If the octopus is > 9 then flash it.
        if (rows[r][c] > 9) {
          flash(r, c)
          numFlashes++
          // If an octopus flashed then there might be others that can flash now.
          keepSearching = true
        }
      }
    }
  }
}

console.log(numFlashes)
