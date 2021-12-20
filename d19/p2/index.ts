import { readInputFileLines } from '../../util'
import { findConnectionsBetweenBeaconSets } from '../util'
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

const beaconSets = []
{
  const inputs = readInputFileLines(__dirname, parseLine).filter(l => l !== null)
  let currentSet: number[][] = []
  for (const line of inputs) {
    if (typeof line === 'number') {
      currentSet = []
      beaconSets[line] = currentSet
    } else {
      currentSet.push(line!)
    }
  }
}

const connectionsBySet = findConnectionsBetweenBeaconSets(beaconSets)
const visitedSets = new Set<number>([0])
const toVisit: [number, math.Matrix][] = [...connectionsBySet.get(0)!]
const absolutePositions: [number, number, number][] = [[0, 0, 0]]

while (toVisit.length > 0) {
  const [setId, transform] = toVisit.shift()!
  if (visitedSets.has(setId)) {
    continue
  }
  visitedSets.add(setId)

  // Transform the origin of this sensor into sensor 0's space.
  const v2 = math.multiply(math.matrix([0, 0, 0, 1]), transform)
  absolutePositions.push([v2.get([0]), v2.get([1]), v2.get([2])])

  // Visit any sets connected to this one, adding the operation to get there to the front of ops.
  for (const [nextSetId, nextTransform] of connectionsBySet.get(setId)!) {
    toVisit.push([nextSetId, math.multiply(nextTransform, transform)])
  }
}

const distances = []
for (const left of absolutePositions) {
  for (const right of absolutePositions) {
    if (left === right) continue
    const distance = Math.abs(left[0] - right[0]) + Math.abs(left[1] - right[1]) + Math.abs(left[2] - right[2])
    distances.push(distance)
  }
}

console.log(Math.max(...distances))
