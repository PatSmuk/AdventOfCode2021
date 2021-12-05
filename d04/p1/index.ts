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
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].length; j++) {
        if (this.rows[i][j].num === num) {
          this.rows[i][j].isMarked = true
        }
      }
    }
  }

  unmarkedSum(): number {
    let unmarkedSum = 0
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].length; j++) {
        if (!this.rows[i][j].isMarked) {
          unmarkedSum += this.rows[i][j].num
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

      if (bingo) {
        return true
      }
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

      if (bingo) {
        return true
      }
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

for (const number of numbers) {
  for (const card of cards) {
    card.mark(number)

    if (card.checkForBingo()) {
      const unmarkedSum = card.unmarkedSum()
      console.log(unmarkedSum, number, unmarkedSum * number)
      process.exit(0)
    }
  }
}
