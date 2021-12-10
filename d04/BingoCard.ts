export class BingoCard {
  // 2D array of these objects
  private rows: { num: number, isMarked: boolean }[][] = []

  constructor(rows: number[][]) {
    for (const row of rows) {
      this.rows.push(
        row.map(x => ({ num: x, isMarked: false }))
      )
    }
  }

  mark(num: number) {
    for (const row of this.rows) {
      for (const square of row) {
        if (square.num === num) {
          square.isMarked = true
        }
      }
    }
  }

  sumOfUnmarked(): number {
    let unmarkedSum = 0
    for (const row of this.rows) {
      for (const { num, isMarked } of row) {
        if (!isMarked) {
          unmarkedSum += num
        }
      }
    }
    return unmarkedSum
  }

  checkForBingo(): boolean {
    // Check if each row is a bingo
    for (const row of this.rows) {
      let bingo = true

      // If any numbers in the row are unmarked, not a bingo
      for (const square of row) {
        if (!square.isMarked) {
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
      for (const row of this.rows) {
        if (!row[col].isMarked) {
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
