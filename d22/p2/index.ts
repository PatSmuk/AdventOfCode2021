import { readInputFileLines } from '../../util'
import boxIntersect from 'box-intersect'

const INPUT_PATTERN = /(on|off) x=([-0-9]+)\.\.([-0-9]+),y=([-0-9]+)\.\.([-0-9]+),z=([-0-9]+)\.\.([-0-9]+)/

function parseLine(line: string): [string, number, number, number, number, number, number] {
  const result = INPUT_PATTERN.exec(line)!
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

type Box = [
  /*x1*/ number,
  /*y1*/ number,
  /*z1*/ number,
  /*x2*/ number,
  /*y2*/ number,
  /*z2*/ number
]

/** Chops up `victim` such that each resulting piece does not overlap with any other piece nor `fresh`. */
function sliceAndDice(victim: Box, fresh: Box): Box[] {
  // Take the differences between the components such that they are
  //   positive if fresh's component is inside victim's.
  const x1d = fresh[0] - victim[0]
  const y1d = fresh[1] - victim[1]
  const z1d = fresh[2] - victim[2]
  const x2d = victim[3] - fresh[3]
  const y2d = victim[4] - fresh[4]
  const z2d = victim[5] - fresh[5]

  // Where we want to perform the cuts into victim.
  // By default just cut it where it ends normally.
  const xCuts = [victim[3]]
  const yCuts = [victim[4]]
  const zCuts = [victim[5]]

  // If any components of fresh are inside victim, perform cuts there.
  if (x1d > 0) xCuts.push(fresh[0])
  if (y1d > 0) yCuts.push(fresh[1])
  if (z1d > 0) zCuts.push(fresh[2])
  if (x2d > 0) xCuts.push(fresh[3])
  if (y2d > 0) yCuts.push(fresh[4])
  if (z2d > 0) zCuts.push(fresh[5])

  // Sort these so we perform the cuts from smallest value to largest.
  xCuts.sort((a, b) => a - b)
  yCuts.sort((a, b) => a - b)
  zCuts.sort((a, b) => a - b)

  // First perform cuts along the X axis from the left side of victim to the right.
  const xSlices: Box[] = []
  let x1 = victim[0]
  for (const x2 of xCuts) {
    // Skip any slices with 0 volume.
    if (x1 !== x2) {
      xSlices.push([x1, victim[1], victim[2], x2, victim[4], victim[5]])
      x1 = x2
    }
  }

  // Now take the slices we made from the last step and perform the
  //   cuts along the Y axis to each slice.
  const xySlices: Box[] = []
  let y1 = victim[1]
  for (const y2 of yCuts) {
    if (y1 !== y2) {
      for (const slice of xSlices) {
        xySlices.push([slice[0], y1, slice[2], slice[3], y2, slice[5]])
      }
      y1 = y2
    }
  }

  // Now take the slices we made from the last step and perform the
  //   cuts along the Z axis to get the final pieces.
  const xyzSlices: Box[] = []
  let z1 = victim[2]
  for (const z2 of zCuts) {
    if (z1 !== z2) {
      for (const slice of xySlices) {
        const piece: Box = [slice[0], slice[1], z1, slice[3], slice[4], z2]

        // Take the difference such that they are positive if the
        //   piece's component is inside fresh.
        const x1d = piece[0] - fresh[0]
        const y1d = piece[1] - fresh[1]
        const z1d = piece[2] - fresh[2]
        const x2d = fresh[3] - piece[3]
        const y2d = fresh[4] - piece[4]
        const z2d = fresh[5] - piece[5]

        // If any of these are negative then this piece is outside
        //   fresh, so it can be included.
        if (x1d < 0 || y1d < 0 || z1d < 0 || x2d < 0 || y2d < 0 || z2d < 0) {
          xyzSlices.push(piece)
        }
      }
      z1 = z2
    }
  }

  return xyzSlices
}

const inputs = readInputFileLines(__dirname, parseLine)
let onBoxes: Box[] = []

for (let [onOrOff, x1, x2, y1, y2, z1, z2] of inputs) {
  // Adjust bounds since the end given is inclusive.
  const fresh = [x1, y1, z1, x2 + 1, y2 + 1, z2 + 1] as Box

  // Check for intersection with existing boxes.
  const intersected = new Set(boxIntersect(onBoxes, [fresh]).map(x => x[0]))

  const newBoxes = []
  for (let i = 0; i < onBoxes.length; i++) {
    if (intersected.has(i)) {
      newBoxes.push(...sliceAndDice(onBoxes[i], fresh))
    } else {
      newBoxes.push(onBoxes[i])
    }
  }

  // None of the boxes in newBoxes overlap with fresh, so if fresh is "on" then
  //   just add it to the list.
  // If fresh is "off" then our job is already done, the volume is cleared.
  if (onOrOff === 'on') {
    newBoxes.push(fresh)
  }

  onBoxes = newBoxes
}

let volume = 0n
for (const [x1, y1, z1, x2, y2, z2] of onBoxes) {
  volume += BigInt(x2 - x1) * BigInt(y2 - y1) * BigInt(z2 - z1)
}
console.log(volume)
