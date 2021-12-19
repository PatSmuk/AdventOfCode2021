import { readInputFileLines } from '../../util'
import { Operation, findConnectionsBetweenBeaconSets } from '../util'
import * as math from 'mathjs'

function parseLine(line: string) {
  if (line.startsWith('---')) {
    return parseInt(line.split(' ')[2])
  }
  if (line.length === 0) {
    return null
  }
  return line.split(',').map(x => parseInt(x))
}

const inputs = readInputFileLines(__dirname, parseLine).filter(l => l !== null)

const beaconSets = []
let currentSet: number[][] = []
for (const line of inputs) {
  if (typeof line === 'number') {
    currentSet = []
    beaconSets[line] = currentSet
  } else {
    currentSet.push(line!)
  }
}

const connectionsBySet = findConnectionsBetweenBeaconSets(beaconSets)
const visitedSets = new Set<number>([0])
const toVisit: [number, Operation[]][] = [...connectionsBySet.get(0)!].map(([k, v]) => [k, [v]])
const absolutePositions: [number, number, number][] = [[0, 0, 0]]

while (toVisit.length > 0) {
  const [setId, ops] = toVisit.shift()!
  if (visitedSets.has(setId)) {
    continue
  }
  visitedSets.add(setId)

  // Transform the origin of this sensor into sensor 0's space.
  let v2 = math.matrix([0, 0, 0])
  for (const [rot, trans, reverse] of ops) {
    if (reverse) {
      v2 = math.multiply(math.subtract(v2, trans), math.transpose(rot)) as math.Matrix
    } else {
      v2 = math.add(math.multiply(v2, rot), trans) as math.Matrix
    }
  }
  absolutePositions.push([v2.get([0]), v2.get([1]), v2.get([2])])

  // Visit any sets connected to this one, adding the operation to get there to the front of ops.
  for (const [nextSetId, op] of connectionsBySet.get(setId)!) {
    toVisit.push([nextSetId, [op, ...ops]])
  }
}

const distances = []
for (let i = 0; i < absolutePositions.length - 1; i++) {
  const left = absolutePositions[i]

  for (let j = i + 1; j < absolutePositions.length; j++) {
    const right = absolutePositions[j]
    const distance = Math.abs(left[0] - right[0]) + Math.abs(left[1] - right[1]) + Math.abs(left[2] - right[2])
    distances.push(distance)
  }
}

console.log(Math.max(...distances))
