import { readInputFileLines } from '../../util'
import { Operation, findConnectionsBetweenBeaconSets } from '../util'
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
const toVisit: [number, Operation[]][] = [...connectionsBySet.get(0)!].map(([k, v]) => [k, [v]])

while (toVisit.length > 0) {
  const [setId, ops] = toVisit.shift()!

  if (visitedSets.has(setId)) {
    continue
  }
  visitedSets.add(setId)

  const set = beaconSets[setId]

  for (const v of set) {
    // Apply operations to v to transform it into set 0's space.
    let v0 = math.matrix(v)
    for (const [rot, trans, reverse] of ops) {
      if (reverse) {
        // If applying the transformation in reverse, subtract the translation vector first, then apply the inverse rotation.
        v0 = math.multiply(math.subtract(v0, trans), math.transpose(rot)) as math.Matrix
      } else {
        // Otherwise apply the rotation first and then translate.
        v0 = math.add(math.multiply(v0, rot), trans) as math.Matrix
      }
    }

    allBeacons.add(`${v0.get([0])},${v0.get([1])},${v0.get([2])}`)
  }

  // Visit any sets connected to this one, adding the operation to get there to the front of ops.
  for (const [nextSetId, op] of connectionsBySet.get(setId)!) {
    toVisit.push([nextSetId, [op, ...ops]])
  }
}

console.log(allBeacons.size)
