import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split('').map(x => parseInt(x))
}

const heightMap = readInputFileLines(__dirname, parseLine)

function measureBasin(r: number, c: number): number {
  let basinSize = 1
  // Keep track of locations we already visited so we don't visit them twice.
  const alreadyVisited = new Set<string>([`${r},${c}`])
  // Keep track of locations to explore, initialized to neighbours around (r, c).
  const frontier: [number | undefined, number, number][] = [
    [heightMap[r][c - 1], r, c - 1],
    [heightMap[r][c + 1], r, c + 1],
    [heightMap[r - 1] ? heightMap[r - 1][c] : undefined, r - 1, c],
    [heightMap[r + 1] ? heightMap[r + 1][c] : undefined, r + 1, c]
  ]

  // While there is still locations to explore in the frontier...
  while (frontier.length > 0) {
    // Get next location.
    const [value, r, c] = frontier.shift()!

    // Make sure we haven't already been here.
    if (alreadyVisited.has(`${r},${c}`)) continue
    alreadyVisited.add(`${r},${c}`)

    // If it's off the grid or the max height, skip it.
    if (value === undefined || value === 9) continue

    // Add it to the basin.
    basinSize++

    // Add all its neighbours to the frontier.
    frontier.push([heightMap[r][c - 1], r, c - 1])
    frontier.push([heightMap[r][c + 1], r, c + 1])
    frontier.push([heightMap[r - 1] ? heightMap[r - 1][c] : undefined, r - 1, c])
    frontier.push([heightMap[r + 1] ? heightMap[r + 1][c] : undefined, r + 1, c])
  }

  return basinSize
}

const basins: number[] = []
for (let i = 0; i < heightMap.length; i++) {
  const prevRow = heightMap[i - 1]
  const row = heightMap[i]
  const nextRow = heightMap[i + 1]

  for (let j = 0; j < row.length; j++) {
    const value = row[j]

    // Determine if value is a local minima.
    if (prevRow && prevRow[j] <= value) continue
    if (nextRow && nextRow[j] <= value) continue
    if (row[j - 1] !== undefined && row[j - 1] <= value) continue
    if (row[j + 1] !== undefined && row[j + 1] <= value) continue

    basins.push(measureBasin(i, j))
  }
}

// Sort by numeric value in descending order and multiply top 3 together.
basins.sort((a, b) => b - a)
console.log(basins[0] * basins[1] * basins[2])
