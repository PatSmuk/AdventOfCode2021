import { readInputFileLines } from '../../util'

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

for (let step = 1; true; step++) {
  let numFlashes = 0

  // Increase every octopus by one.
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      rows[i][j]++
    }
  }

  let keepSearching = true
  while (keepSearching) {
    // Assume we don't have to keep searching for a flashable octopus.
    keepSearching = false

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (rows[i][j] > 9) {
          flash(i, j)
          numFlashes++
          // If an octopus flashed then there might be others that can flash now.
          keepSearching = true
        }
      }
    }
  }

  // Stop as soon as the number of flashes === the number of octopi.
  if (numFlashes === numRows * numCols) {
    console.log(step)
    break
  }
}
