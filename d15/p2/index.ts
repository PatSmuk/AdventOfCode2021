import { readInputFileLines, aStarSearch } from '../../util'

function parseLine(line: string) {
  return line.split('').map(x => parseInt(x))
}

const inputs = readInputFileLines(__dirname, parseLine)
let rows = inputs.length
let cols = inputs[0].length

// Virtual rows and columns, after 5x5 duplication.
const vRows = rows * 5
const vCols = cols * 5

const start = 0
const end = (vRows * vCols) - 1

function splitKey(key: number) {
  const col = key % vCols
  const row = (key - col) / vCols
  return [row, col]
}

function manhattan(key: number) {
  const [row, col] = splitKey(key)
  return (vRows - row - 1) + (vCols - col - 1)
}

function getWeight(key: number) {
  const [row, col] = splitKey(key)
  const vRowId = Math.floor(row / rows)
  const rRowId = row % rows
  const vColId = Math.floor(col / cols)
  const rColId = col % cols
  let weight = inputs[rRowId][rColId] + vRowId + vColId
  while (weight > 9) weight -= 9
  return weight
}

function getNeighbours(key: number) {
  const [row, col] = splitKey(key)
  const neighbours = []
  if (row > 0)          neighbours.push((row - 1) * vCols + col)
  if (row < vRows - 1)  neighbours.push((row + 1) * vCols + col)
  if (col > 0)          neighbours.push(row  * vCols + col - 1)
  if (col < vCols - 1)  neighbours.push(row  * vCols + col + 1)
  return neighbours
}

const shortestPath = aStarSearch({
  start,
  end,
  getDistance: manhattan,
  getWeight,
  getNeighbours
}).filter(node => node !== start)

const totalScore = shortestPath.map(node => getWeight(node)).reduce((prev, curr) => prev + curr, 0)
console.log(totalScore)
