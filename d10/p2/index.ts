import { readInputFileLines } from '../../util'

const inputs = readInputFileLines(__dirname, x => x)

const PAIRS = ["()", "{}", "[]", "<>"]
const POINTS = {")": 1, "]": 2, "}": 3, ">": 4} as {[x: string]: number}

let pointsByLine =  []

for (const line of inputs) {
  const expectedChars = []
  let invalid = false

eachChar:
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
          invalid = true
          break eachChar
        }
      }
    }
  }

  // Skip invalid lines.
  if (invalid) continue

  expectedChars.reverse()
  let points = 0
  for (const char of expectedChars) {
    points *= 5
    points += POINTS[char]
  }

  pointsByLine.push(points)
}

// Sort them and take the middle one.
pointsByLine.sort((a, b) => a - b)
console.log(pointsByLine[Math.floor(pointsByLine.length / 2)])
