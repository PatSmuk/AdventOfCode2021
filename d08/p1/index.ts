import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  const [digitSignals, finalSignals] = line.split(' | ')
  return [digitSignals.split(' ').map(x => x.split('').sort().join('')), finalSignals.split(' ').map(x => x.split('').sort().join(''))]
}

const inputs = readInputFileLines(__dirname, parseLine)
let count = 0
for (const [digitSignals, finalSignals] of inputs) {
  const one = digitSignals.find(x => x.length === 2)!
  const four = digitSignals.find(x => x.length === 4)!
  const seven = digitSignals.find(x => x.length === 3)!
  const eight = digitSignals.find(x => x.length === 7)!

  for (const signal of finalSignals) {
    if (signal === one || signal === four || signal === seven || signal === eight) {
      count++
    }
  }
}
console.log(count)
