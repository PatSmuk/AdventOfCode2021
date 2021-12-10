import { readInputFileLines } from '../../util'
import { BingoCard } from '../BingoCard'

function parseLine(line: string, i: number) {
  if (i === 0) {
    return line.split(',').map(x => parseInt(x))
  }
  return line.split(' ').map(x => parseInt(x)).filter(x => !isNaN(x))
}

const inputs = readInputFileLines(__dirname, parseLine)
const calledNumbers = inputs[0]

// Construct the bingo cards
const cards: BingoCard[] = []
{
  let rows: number[][] = []
  for (let i = 2; i < inputs.length; i++) {
    const row = inputs[i]
    if (row.length === 0) {
      cards.push(new BingoCard(rows))
      rows = []
    } else {
      rows.push(row)
    }
  }
  if (rows.length > 0) {
    cards.push(new BingoCard(rows))
  }
}

for (const number of calledNumbers) {
  for (const card of cards) {
    card.mark(number)

    if (card.checkForBingo()) {
      console.log(card.sumOfUnmarked() * number)
      process.exit(0)
    }
  }
}
