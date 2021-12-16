import { readInputFileLines, aStarSearch } from '../../util'

function parseLine(line: string) {
  return line.split('').map(x => parseInt(x))
}

const inputs = readInputFileLines(__dirname, parseLine)
const rows = inputs.length
const cols = inputs[0].length
const start = 0
const end = (rows * cols) - 1

function splitKey(key: number) {
  const col = key % cols
  const row = (key - col) / cols
  return [row, col]
}

function manhattan(key: number) {
  const [row, col] = splitKey(key)
  return (rows - row - 1) + (cols - col - 1)
}

function getWeight(key: number) {
  const [row, col] = splitKey(key)
  return inputs[row][col]
}

function getNeighbours(key: number) {
  const [row, col] = splitKey(key)
  const neighbours = []
  if (row > 0)        neighbours.push((row - 1) * cols + col)
  if (row < rows - 1) neighbours.push((row + 1) * cols + col)
  if (col > 0)        neighbours.push(row  * cols + col - 1)
  if (col < cols - 1) neighbours.push(row  * cols + col + 1)
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
