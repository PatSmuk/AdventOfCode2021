import { readInputFileLines } from '../../util'

function parseLine(line: string, i: number) {
  if (i === 0) {
    return line.split(',').map(x => parseInt(x))
  }
  return line.split(' ').map(x => parseInt(x)).filter(x => !isNaN(x)).map(x => ({ num: x, isMarked: false }))
}

class BingoCard {
  private rows: {num: number, isMarked: boolean}[][]

  constructor(rows: {num: number, isMarked: boolean}[][]) {
    this.rows = rows
  }

  mark(num: number) {
    for (let row = 0; row < this.rows.length; row++) {
      for (let col = 0; col < this.rows[row].length; col++) {
        if (this.rows[row][col].num === num) {
          this.rows[row][col].isMarked = true
        }
      }
    }
  }

  unmarkedSum(): number {
    let unmarkedSum = 0
    for (let row = 0; row < this.rows.length; row++) {
      for (let col = 0; col < this.rows[row].length; col++) {
        if (!this.rows[row][col].isMarked) {
          unmarkedSum += this.rows[row][col].num
        }
      }
    }
    return unmarkedSum
  }

  checkForBingo(): boolean {
    // Check if each row is a bingo
    for (let row = 0; row < this.rows.length; row++) {
      let bingo = true

      // If any numbers in the row are unmarked, not a bingo
      for (let col = 0; col < this.rows[row].length; col++) {
        if (!this.rows[row][col].isMarked) {
          bingo = false
          break
        }
      }

      if (bingo) return true
    }

    // Check if each column is a bingo
    for (let col = 0; col < this.rows[0].length; col++) {
      let bingo = true

      // If any numbers in the column are unmarked, not a bingo
      for (let row = 0; row < this.rows.length; row++) {
        if (!this.rows[row][col].isMarked) {
          bingo = false
          break
        }
      }

      if (bingo) return true
    }

    return false
  }
}

const inputs = readInputFileLines(__dirname, parseLine)
const numbers = inputs[0] as number[]

// Construct the bingo cards
const cards: BingoCard[] = []
let rows: {num: number, isMarked: boolean}[][] = []

for (let i = 2; i < inputs.length; i++) {
  const row = inputs[i] as {num: number, isMarked: boolean}[]
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
      if (nonWinningCards.size > 1) {
        nonWinningCards.delete(card)
        continue
      }

      const unmarkedSum = card.unmarkedSum()
      console.log(unmarkedSum, number, unmarkedSum * (number as number))
      process.exit(0)
    }
  }
}
