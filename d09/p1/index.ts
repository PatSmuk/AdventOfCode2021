import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split('').map(x => parseInt(x))
}

const heightMap = readInputFileLines(__dirname, parseLine)

let riskLevels = 0
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

    riskLevels += value + 1
  }
}

console.log(riskLevels)
