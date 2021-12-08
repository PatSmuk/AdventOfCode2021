import { readInputFileLines } from '../../util'

function parseLine(line: string): [string[][], string[]] {
  const [digitSignals, finalSignals] = line.split(' | ')

  return [
    digitSignals.split(' ').map(x => x.split('').sort()),
    finalSignals.split(' ').map(x => x.split('').sort().join(''))
  ]
}

const ALL_SEGMENTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

const inputs = readInputFileLines(__dirname, parseLine)
let sum = 0

for (const [digitSignals, finalSignals] of inputs) {
  const one = digitSignals.find(x => x.length === 2)!
  const four = digitSignals.find(x => x.length === 4)!
  const seven = digitSignals.find(x => x.length === 3)!
  const eight = digitSignals.find(x => x.length === 7)!

  // 2, 3, 5
  const fiveSegments = digitSignals.filter(x => x.length === 5)
  // 0, 6, 9
  const sixSegments = digitSignals.filter(x => x.length === 6)

  // The top segment is the only part of 7 not in 1.
  const top = seven.filter(s => !one.includes(s))[0]
  // The bottom and middle are in all of (2, 3, 5).
  const bottomAndMiddle = ALL_SEGMENTS.filter(s => s !== top && fiveSegments.every(d => d.includes(s)))
  // ... but only the middle is part of 4.
  const middle = bottomAndMiddle.filter(s => four.includes(s))[0]
  // 3 is the only one that includes every part of 1.
  const three = fiveSegments.filter(d => d.includes(one[0]) && d.includes(one[1]))[0]

  // 0 does not have the middle segment.
  const zero = sixSegments.filter(d => !d.includes(middle))[0]
  // 9 includes every part of 1 but is not 0.
  const nine = sixSegments.filter(d => d.includes(one[0]) && d.includes(one[1]) && d !== zero)[0]
  // 6 is the one left over.
  const six = sixSegments.filter(d => d !== zero && d !== nine)[0]

  // The bottom left segment is the missing part of 9.
  const bottomLeft = ALL_SEGMENTS.filter(s => !nine.includes(s))[0]
  // 2 is the only one of (2, 3, 5) that includes the bottom left segment.
  const two = fiveSegments.filter(d => d.includes(bottomLeft))[0]
  // 5 is the one left over from (2, 3, 5).
  const five = fiveSegments.filter(d => d !== two && d !== three)[0]

  // Build the decoder table.
  const decoder = new Map(
    [zero, one, two, three, four, five, six, seven, eight, nine].map(
      (x, i) => [x.join(''), i]
    )
  )

  // Decode the signal.
  let output = ''
  for (const signal of finalSignals) {
    output += decoder.get(signal)!
  }
  sum += parseInt(output)
}

console.log(sum)
