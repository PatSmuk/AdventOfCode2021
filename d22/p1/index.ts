import { readInputFileLines } from '../../util'

const PATTERN = /(on|off) x=([-0-9]+)\.\.([-0-9]+),y=([-0-9]+)\.\.([-0-9]+),z=([-0-9]+)\.\.([-0-9]+)/

const onCubes = new Set<string>()

function parseLine(line: string): [string, number, number, number, number, number, number] {
  const result = PATTERN.exec(line)!
  return [
    result[1],
    parseInt(result[2]),
    parseInt(result[3]),
    parseInt(result[4]),
    parseInt(result[5]),
    parseInt(result[6]),
    parseInt(result[7])
  ]
}

const inputs = readInputFileLines(__dirname, parseLine)

for (let [onOrOff, x1, x2, y1, y2, z1, z2] of inputs) {
  x1 = Math.max(x1, -50)
  y1 = Math.max(y1, -50)
  z1 = Math.max(z1, -50)
  x2 = Math.min(x2, 50)
  y2 = Math.min(y2, 50)
  z2 = Math.min(z2, 50)

  if (onOrOff === 'on') {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          onCubes.add(`${x},${y},${z}`)
        }
      }
    }
  } else {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          onCubes.delete(`${x},${y},${z}`)
        }
      }
    }
  }

  console.log(onCubes.size)
}
