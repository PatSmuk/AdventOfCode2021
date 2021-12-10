import { readInputFileLines } from '../../util'
import { BingoCard } from '../BingoCard'

function parseLine(line: string, i: number) {
  if (i === 0) {
    return line.split(',').map(x => parseInt(x))
  }
  return line.split(' ').map(x => parseInt(x)).filter(x => !isNaN(x))
}

const inputs = readInputFileLines(__dirname, parseLine)
const numbers = inputs[0]

// Construct the bingo cards
const cards: BingoCard[] = []
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

const nonWinningCards = new Set<BingoCard>(cards)

for (const number of numbers) {
  for (const card of cards) {
    card.mark(number)

    if (nonWinningCards.has(card) && card.checkForBingo()) {
      if (nonWinningCards.size === 1) {
        console.log(card.sumOfUnmarked() * number)
        process.exit(0)
      }

      nonWinningCards.delete(card)
    }
  }
}
