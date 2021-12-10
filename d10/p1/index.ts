import { readInputFileLines } from '../../util'

const PAIRS = ["()", "{}", "[]", "<>"]
const POINTS_BY_CHAR: {[char: string]: number} = {")": 3, "]": 57, "}": 1197, ">": 25137}

const inputs = readInputFileLines(__dirname, x => x)
let points = 0

nextLine:
for (const line of inputs) {
  const expectedChars = []

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    for (const pair of PAIRS) {
      if (char === pair[0]) {
        // The next expected end char is the one that matches this one.
        expectedChars.push(pair[1])

      } else if (char === pair[1]) {
        // If this end char doesn't match the next expected end char,
        //   the line is invalid.
        if (char !== expectedChars.pop()) {
          points += POINTS_BY_CHAR[pair[1]]
          continue nextLine
        }
      }
    }
  }
}

console.log(points)
