import * as math from 'mathjs'

// Rotations about each axis.
const rX = math.matrix([
  [1, 0,  0],
  [0, 0, -1],
  [0, 1,  0]
])
const rY = math.matrix([
  [ 0, 0, 1],
  [ 0, 1, 0],
  [-1, 0, 0]
])
const rZ = math.matrix([
  [0, -1, 0],
  [1,  0, 0],
  [0,  0, 1]
])

// Same thing but in the reverse direction.
const rXR = math.transpose(rX)
const rYR = math.transpose(rY)
const rZR = math.transpose(rZ)

// Every possible orientation.
const rotationSets = [
  [math.identity(3, 3)],
  [rX],
  [rX, rX],
  [rXR],
  [rY],
  [rY, rZ],
  [rY, rZ, rZ],
  [rY, rZR],
  [rY, rY],
  [rY, rY, rX],
  [rY, rY, rX, rX],
  [rY, rY, rXR],
  [rYR],
  [rYR, rZ],
  [rYR, rZ, rZ],
  [rYR, rZR],
  [rZ],
  [rZ, rY],
  [rZ, rY, rY],
  [rZ, rYR],
  [rZR],
  [rZR, rY],
  [rZR, rY, rY],
  [rZR, rYR],
]

// Create rotations by multiplying the matrices together.
const rotations: math.Matrix[] = rotationSets.map(s => {
  return s.reduce((prev, curr) => math.multiply(curr, prev) as math.Matrix, math.identity(3, 3)) as math.Matrix
})

type RotAndTrans = [/* rotation matrix */math.Matrix, /* translation vector */number[]]
export type Operation = [...RotAndTrans, /* reverse? */boolean]

export function findConnectionsBetweenBeaconSets(beaconSets: number[][][]): Map<number, Map<number, Operation>> {
  const connectionsBySet = new Map<number, Map<number, Operation>>(beaconSets.map((_, i) => [i, new Map()]))
  for (let i = 0; i < beaconSets.length - 1; i++) {
    for (let j = i + 1; j < beaconSets.length; j++) {
      const result = findConnection(beaconSets[i], beaconSets[j])

      // If a connection was found, add A to B as a forward connection and
      //   B to A as a reverse connection.
      if (result) {
        if (!connectionsBySet.get(i)!.get(j)) {
          connectionsBySet.get(i)!.set(j, [...result, false])
        }
        if (!connectionsBySet.get(j)!.get(i)) {
          connectionsBySet.get(j)!.set(i, [...result, true])
        }
      }
    }
  }

  return connectionsBySet
}

function findConnection(setA: number[][], setB: number[][]): RotAndTrans | undefined {
  for (const rotation of rotations) {
    // Apply a rotation to set B.
    const rotatedSetB = []
    for (let i = 0; i < setB.length; i++) {
      rotatedSetB.push(math.multiply(setB[i], rotation) as any as math.Matrix)
    }

    // Calculate deltas between each point of A and rotated B.
    // If any twelve of these deltas are the same then we are
    //   a translation away from overlapping the sets.
    const deltas = new Map<string, number>()
    for (const pointA of setA) {
      for (const pointB of rotatedSetB) {
        const delta = [
          pointA[0] - pointB.get([0]),
          pointA[1] - pointB.get([1]),
          pointA[2] - pointB.get([2])
        ]
        const key = `${delta[0]},${delta[1]},${delta[2]}`
        const prev = deltas.get(key) || 0

        // If this is the 12th point with the same delta, we found a connection!
        // Return the rotation and translation to get from A to B.
        if (prev === 11) {
          return [rotation, delta]
        }

        deltas.set(key, prev + 1)
      }
    }
  }
}
