import { readInputFileLines } from '../../util'

interface Amphipod {
  type: string
  row: number
  col: number
}

interface State {
  apods: Amphipod[]
  energy: number
  winning: boolean
}

const ENERGY_BY_TYPE: {[type: string]: number} = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000
}

const DESTINATION_BY_TYPE: {[type: string]: number} = {
  A: 2,
  B: 4,
  C: 6,
  D: 8
}

function parseLine(line: string, index: number) {
  if (index === 2 || index === 3) {
    return [line[3], line[5], line[7], line[9]]
  }
  return null
}

function checkForWin(apods: Amphipod[]): boolean {
  for (const apod of apods) {
    if (apod.col !== DESTINATION_BY_TYPE[apod.type]) {
      return false
    }
  }
  return true
}

function generateStates(state: State): State[] {
  const newStates = []
  const blockedPositions: string[][] = [[], [], [], [], []]
  for (const apod of state.apods) {
    blockedPositions[apod.row][apod.col] = apod.type
  }

  for (const apod of state.apods) {
    const otherApods = state.apods.filter(a => a !== apod)

    // Check if we're blocked in.
    if (apod.row === 2 && blockedPositions[1][apod.col]) {
      continue
    }
    if (apod.row === 3 && blockedPositions[2][apod.col]) {
      continue
    }
    if (apod.row === 4 && blockedPositions[3][apod.col]) {
      continue
    }

    // Check if we're already in the right place.
    if (apod.row === 1 && apod.col === DESTINATION_BY_TYPE[apod.type] && blockedPositions[2][apod.col] === apod.type && blockedPositions[3][apod.col] === apod.type && blockedPositions[4][apod.col] === apod.type) {
      continue
    }
    if (apod.row === 2 && apod.col === DESTINATION_BY_TYPE[apod.type] && blockedPositions[3][apod.col] === apod.type && blockedPositions[4][apod.col] === apod.type) {
      continue
    }
    if (apod.row === 3 && apod.col === DESTINATION_BY_TYPE[apod.type] && blockedPositions[4][apod.col] === apod.type) {
      continue
    }
    if (apod.row === 4 && apod.col === DESTINATION_BY_TYPE[apod.type]) {
      continue
    }

    if (apod.row !== 0) {
      for (let col = apod.col - 1; col >= 0; col--) {
        if (blockedPositions[0][col]) {
          break
        }
        if (col !== 2 && col !== 4 && col !== 6 && col !== 8) {
          newStates.push({
            apods: [...otherApods, { type: apod.type, row: 0, col }],
            energy: state.energy + ENERGY_BY_TYPE[apod.type] * (apod.row + apod.col - col),
            winning: false
          })
        }
      }
      for (let col = apod.col + 1; col <= 10; col++) {
        if (blockedPositions[0][col]) {
          break
        }
        if (col !== 2 && col !== 4 && col !== 6 && col !== 8) {
          newStates.push({
            apods: [...otherApods, { type: apod.type, row: 0, col }],
            energy: state.energy + ENERGY_BY_TYPE[apod.type] * (apod.row + col - apod.col),
            winning: false
          })
        }
      }
    } else {
      const destination = DESTINATION_BY_TYPE[apod.type]
      if (destination < apod.col) {
        for (let col = apod.col - 1; col >= 0; col--) {
          if (blockedPositions[0][col]) {
            break
          }
          if (col === DESTINATION_BY_TYPE[apod.type]) {
            for (let row = 4; row >= 1; row--) {
              const otherApodType = blockedPositions[row][col]
              if (!otherApodType) {
                const newApods = [...otherApods, { type: apod.type, row, col }]
                newStates.push({
                  apods: newApods,
                  energy: state.energy + ENERGY_BY_TYPE[apod.type] * (row + apod.col - col),
                  winning: checkForWin(newApods)
                })
                break
              }
              if (otherApodType !== apod.type) {
                break
              }
            }
            break
          }
        }
      } else {
        for (let col = apod.col + 1; col <= 10; col++) {
          if (blockedPositions[0][col]) {
            break
          }
          if (col === DESTINATION_BY_TYPE[apod.type]) {
            for (let row = 4; row >= 1; row--) {
              const otherApodType = blockedPositions[row][col]
              if (!otherApodType) {
                const newApods = [...otherApods, { type: apod.type, row, col }]
                newStates.push({
                  apods: newApods,
                  energy: state.energy + ENERGY_BY_TYPE[apod.type] * (row + col - apod.col),
                  winning: checkForWin(newApods)
                })
                break
              }
              if (otherApodType !== apod.type) {
                break
              }
            }
            break
          }
        }
      }
    }
  }

  return newStates
}

function findLeastEnergyWin(initialState: State): number {
  let leastEnergy = Number.POSITIVE_INFINITY

  const statesToCheck: State[] = [initialState]

  while (statesToCheck.length > 0) {
    const state = statesToCheck.pop()!
    if (state.energy > leastEnergy) {
      continue
    }

    for (const newState of generateStates(state)) {
      if (newState.winning) {
        if (newState.energy < leastEnergy) {
          console.log(newState.energy)
          leastEnergy = newState.energy
        }
      } else if (newState.energy < leastEnergy) {
        statesToCheck.push(newState)
      }
    }
  }

  return leastEnergy
}

const inputs = readInputFileLines(__dirname, parseLine).filter(l => l !== null)
inputs.splice(1, 0, ['D', 'C', 'B', 'A'], ['D', 'B', 'A', 'C'])

let apods: Amphipod[] = []
for (let row = 0; row < inputs.length; row++) {
  for (let col = 0; col < inputs[row]!.length; col++) {
    apods.push({ type: inputs[row]![col], row: row + 1, col: col * 2 + 2 })
  }
}

const initialState = {
  apods,
  energy: 0,
  winning: true
}

console.log(findLeastEnergyWin(initialState))
