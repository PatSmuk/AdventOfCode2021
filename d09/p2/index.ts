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

function measureBasin(r: number, c: number): number {
  let basinSize = 1
  // Keep track of locations we already visited so we don't visit them twice.
  const alreadyVisited = new Set<string>([`${r},${c}`])
  // Keep track of locations to explore, initialized to neighbours around (r, c).
  const frontier: [number, number, number][] = getNeighbours(r, c)

  // While there is still locations to explore in the frontier...
  while (frontier.length > 0) {
    // Get next location.
    const [value, r, c] = frontier.shift()!

    // Make sure we haven't already been here.
    if (alreadyVisited.has(`${r},${c}`)) continue
    alreadyVisited.add(`${r},${c}`)

    // If it's off the grid or the max height, skip it.
    if (value === 9) continue

    // Add it to the basin.
    basinSize++

    // Add all its neighbours to the frontier.
    frontier.push(...getNeighbours(r, c))
  }

  return basinSize
}

const basins: number[] = []
for (let i = 0; i < heightMap.length; i++) {
  for (let j = 0; j < heightMap[i].length; j++) {
    const value = heightMap[i][j]

    // Determine if value is a local minima.
    if (getNeighbours(i, j).every(([h]) => h > value)) {
      basins.push(measureBasin(i, j))
    }
  }
}

// Sort by numeric value in descending order and multiply top 3 together.
basins.sort((a, b) => b - a)
console.log(basins[0] * basins[1] * basins[2])
