import { readInputFileLines } from '../../util'
import { findConnectionsBetweenBeaconSets } from '../util'
import * as math from 'mathjs'

function parseLine(line: string) {
  if (line.length === 0) {
    return null
  }
  if (line.startsWith('---')) {
    return parseInt(line.split(' ')[2])
  }
  return line.split(',').map(x => parseInt(x))
}

const beaconSets: number[][][] = []
{
  const lines = readInputFileLines(__dirname, parseLine).filter(l => l !== null)
  let currentSet: number[][] = []
  for (const line of lines) {
    // Numbers are the start of a new set.
    if (typeof line === 'number') {
      currentSet = []
      beaconSets[line] = currentSet
    } else {
      currentSet.push(line!)
    }
  }
}

const connectionsBySet = findConnectionsBetweenBeaconSets(beaconSets)
const allBeacons = new Set<string>(beaconSets[0].map(v => `${v[0]},${v[1]},${v[2]}`))
const visitedSets = new Set<number>([0])
// List of sets to visit and the list of operations to get from that set to set 0.
const toVisit: [number, math.Matrix][] = [...connectionsBySet.get(0)!]

while (toVisit.length > 0) {
  const [setId, transform] = toVisit.shift()!

  if (visitedSets.has(setId)) {
    continue
  }
  visitedSets.add(setId)

  const set = beaconSets[setId]

  for (const v of set) {
    // Apply operations to v to transform it into set 0's space.
    const v0 = math.multiply(math.matrix([v[0], v[1], v[2], 1]), transform)
    allBeacons.add(`${v0.get([0])},${v0.get([1])},${v0.get([2])}`)
  }

  // Visit any sets connected to this one, adding the operation to get there to the front of ops.
  for (const [nextSetId, nextTransform] of connectionsBySet.get(setId)!) {
    toVisit.push([nextSetId, math.multiply(nextTransform, transform)])
  }
}

console.log(allBeacons.size)
