export type Pair = [Pair | number, Pair | number]

/** Reduces the pair in-place according to snailfish number reduction rules. */
export function reducePair(pair: Pair): void {
  // Continue doing operations until the pair stops changing.
  for (;;) {
    // Use JSON string as quick and dirty value comparison.
    const pairString = JSON.stringify(pair)

    // Try to do any explosions first.
    doExplosions(pair, 1)

    // Only split if nothing exploded, otherwise we might be able to explode again.
    if (JSON.stringify(pair) === pairString) {
      doSplits(pair)

      // If split also did nothing then we must be done.
      if (JSON.stringify(pair) === pairString) {
        break
      }
    }
  }
}

type Carryover = [number, number]

function doExplosions(pair: Pair, level: number): Carryover | null {
  for (const i of [0, 1]) {
    const member = pair[i]

    // Numbers can't explode so skip them.
    if (typeof member === 'number') {
      continue
    }

    function handleCarryover(carryover: Carryover) {
      // If there is carryover going left and the member was on the right...
      if (!isNaN(carryover[0]) && i === 1) {
        if (typeof pair[0] === 'number') {
          pair[0] += carryover[0]
        } else {
          // Dig into the pair on the left until we hit a pair that contains a number on the right.
          let leftNeighbour = pair[0]
          while (typeof leftNeighbour[1] !== 'number') {
            leftNeighbour = leftNeighbour[1]
          }
          // Update that number with the carryover.
          leftNeighbour[1] += carryover[0]
        }

        carryover[0] = NaN
      }

      // If there is carryover going right and the member was on the left...
      if (!isNaN(carryover[1]) && i === 0) {
        if (typeof pair[1] === 'number') {
          pair[1] += carryover[1]
        } else {
          // Dig into the pair on the right until we hit a pair that contains a number on the left.
          let rightNeighbour = pair[1]
          while (typeof rightNeighbour[0] !== 'number') {
            rightNeighbour = rightNeighbour[0]
          }
          // Update that number with the carryover.
          rightNeighbour[0] += carryover[1]
        }

        carryover[1] = NaN
      }
    }

    // Check if this is a Pair that can explode (i.e. deep enough and contains only numbers).
    if (level >= 4 && typeof member[0] === 'number' && typeof member[1] === 'number') {
      pair[i] = 0

      const carryover = [member[0], member[1]] as Carryover
      handleCarryover(carryover)
      return carryover
    }

    // Try to explode any Pairs inside member.
    const carryover = doExplosions(member, level + 1)

    // If something exploded...
    if (carryover) {
      handleCarryover(carryover)

      // There might still be unhandled carryover so return it to our parent.
      return carryover
    }
  }

  return null
}

function doSplits(pair: Pair): boolean {
  for (const i of [0, 1]) {
    const member = pair[i]

    if (typeof member === 'number') {
      if (member >= 10) {
        pair[i] = [Math.floor(member / 2), Math.ceil(member / 2)]
        return true
      }
    } else if (doSplits(member)) {
      return true
    }
  }

  return false
}

export function calculateMagnitude([left, right]: Pair): number {
  if (typeof left !== 'number') {
    left = calculateMagnitude(left)
  }

  if (typeof right !== 'number') {
    right = calculateMagnitude(right)
  }

  return left * 3 + right * 2
}
