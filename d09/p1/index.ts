import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split('').map(x => parseInt(x))
}

const heightMap = readInputFileLines(__dirname, parseLine)

function getNeighbours(r: number, c: number) {
  const neighbours = [] as [number, number, number][]
  if (r > 0) {
    neighbours.push([heightMap[r - 1][c], r - 1, c])
  }
  if (r < (heightMap.length - 1)) {
    neighbours.push([heightMap[r + 1][c], r + 1, c])
  }
  if (c > 0) {
    neighbours.push([heightMap[r][c - 1], r, c - 1])
  }
  if (c < (heightMap[0].length - 1)) {
    neighbours.push([heightMap[r][c + 1], r, c + 1])
  }
  return neighbours
}

let riskLevels = 0
for (let i = 0; i < heightMap.length; i++) {
  for (let j = 0; j < heightMap[i].length; j++) {
    const value = heightMap[i][j]

    // Determine if value is a local minima.
    if (getNeighbours(i, j).every(([h]) => h > value)) {
      riskLevels += value + 1
    }
  }
}

console.log(riskLevels)
