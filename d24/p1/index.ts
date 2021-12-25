import { readInputFileLines } from '../../util'
import assert from 'assert'

function parseLine(line: string) {
  return line.split(' ')
}

const program = readInputFileLines(__dirname, parseLine)
convertProgramToJS(program)

// const input = [] as any as [number, number, number, number, number, number, number, number, number, number, number, number, number, number]
// input[0] = 9
// input[1] = 2
// input[2] = 9
// input[3] = 1
// input[4] = 5
// input[5] = 9
// input[6] = 7
// input[7] = 9
// input[8] = 9
// input[9] = 9
// input[10] = 9
// input[11] = 4
// input[12] = 9
// input[13] = 8

// const interpretedResult = interpretProgram(program, input).toString()
// const translationResult = aluProgram(...input).toString()

// console.log(`${input.join('')} ${interpretedResult.padStart(10)} ${aluProgram.padStart(10)}`)

/** If the register is storing an immediate value then `value` is a number.
 *  If it is storing an input or temporary then it's a string.
 *
 *  Keep track of the min and max possible values to eliminate dead comparisons that will never succeed.
*/
type Register = {
  value: number | string,
  minValue: number,
  maxValue: number
}

/** Converts the submarine ALU program into JavaScript code using static single assignment.
 *
 * Eliminates any dead code/no-ops in the process.
*/
function convertProgramToJS(program: string[][]) {
  let registers: {[name: string]: Register} = {
    w: {
      value: 0,
      minValue: 0,
      maxValue: 0
    },
    x: {
      value: 0,
      minValue: 0,
      maxValue: 0
    },
    y: {
      value: 0,
      minValue: 0,
      maxValue: 0
    },
    z: {
      value: 0,
      minValue: 0,
      maxValue: 0
    }
  }
  let inputIndex = 0

  // Whenever an operation occurs on a input or temporary, a new temporary is created.
  // Operations between immediate values can be resolved immediately.
  const temporaries: string[] = []
  function createTemporary(value: string) {
    temporaries.push(value)
    return `temp${temporaries.length.toString().padStart(2, '0')}`
  }

  function parseIntOrReg(arg: string): [number | string, number, number] {
    let value: number | string = parseInt(arg)
    let maxValue = value
    let minValue = value

    if (isNaN(value)) {
      value = registers[arg].value
      minValue = registers[arg].minValue
      maxValue = registers[arg].maxValue
    }

    return [value, minValue, maxValue]
  }

  const isImmediate = (x: number | string): x is number => typeof x === 'number'

  for (const [op, reg, arg] of program) {
    const r = registers[reg]

    switch (op) {
      case 'inp': {
        r.value = `in${(inputIndex++).toString().padStart(2, '0')}`
        r.minValue = 1
        r.maxValue = 9
        break
      }
      case 'add': {
        const [value, minValue, maxValue] = parseIntOrReg(arg)

        // Adding 0 is a no-op.
        if (value === 0) {
          break
        }

        if (isImmediate(r.value)) {
          if (isImmediate(value)) {
            r.value += value
          } else {
            if (r.value === 0) {
              r.value = value
            } else {
              r.value = createTemporary(`${value} + ${r.value}`)
            }
          }
        } else {
          r.value = createTemporary(`${r.value} + ${value}`)
        }

        r.minValue += minValue
        r.maxValue += maxValue
        break
      }
      case 'mul': {
        const [value, minValue, maxValue] = parseIntOrReg(arg)

        // If either side is 0 then the result is 0.
        if (value === 0 || r.value === 0) {
          r.value = 0
          r.minValue = 0
          r.maxValue = 0
          break
        }

        // Multiplication by 1 is a no-op.
        if (value === 1) {
          break
        }

        if (isImmediate(r.value)) {
          if (isImmediate(value)) {
            r.value *= value
          } else {
            // If the register has 1 then just store the value directly.
            if (r.value === 1) {
              r.value = value
            } else {
              r.value = createTemporary(`${value} * ${r.value}`)
            }
          }
        } else {
          r.value = createTemporary(`${r.value} * ${value}`)
        }

        r.minValue *= minValue
        r.maxValue *= maxValue
        break
      }
      case 'div': {
        const [value, minValue, maxValue] = parseIntOrReg(arg)

        // Division by 1 is a no-op.
        if (value === 1) {
          break
        }

        assert(isImmediate(value), 'divide by register')

        if (isImmediate(r.value)) {
          r.value = ~~(r.value / value)
        } else {
          r.value = createTemporary(`~~(${r.value} / ${value})`)
        }

        r.minValue = ~~(r.minValue / minValue)
        r.maxValue = ~~(r.maxValue / maxValue)
        break
      }
      case 'mod': {
        const [value] = parseIntOrReg(arg)

        assert(isImmediate(value), 'modulus by register')

        if (isImmediate(r.value)) {
          r.value = r.value % value
        } else {
          // If max value is less than argument then this is a no-op.
          if (r.maxValue < value) {
            break
          }
          r.value = createTemporary(`${r.value} % ${value}`)
        }

        if (isImmediate(r.value)) {
          r.minValue = r.value
          r.maxValue = r.value
        } else {
          r.minValue = 0
          r.maxValue = value - 1
        }
        break
      }
      case 'eql': {
        const [value, minValue, maxValue] = parseIntOrReg(arg)

        if (isImmediate(r.value)) {
          if (isImmediate(value)) {
            r.value = +(r.value === value)
          } else {
            // If bounds check fails, set register to 0, since comparison can never pass.
            if (r.value > maxValue || r.value < minValue) {
              r.value = 0
            } else {
              r.value = createTemporary(`${value} === ${r.value} ? 1 : 0`)
            }
          }
        } else {
          if (isImmediate(value)) {
            if (value > r.maxValue || value < r.minValue) {
              r.value = 0
            } else {
              r.value = createTemporary(`${r.value} === ${value} ? 1 : 0`)
            }
          } else {
            if (maxValue < r.minValue || r.maxValue < minValue) {
              r.value = 0
            } else {
              r.value = createTemporary(`${value} === ${r.value} ? 1 : 0`)
            }
          }
        }

        if (isImmediate(r.value)) {
          r.minValue = r.value
          r.maxValue = r.value
        } else {
          r.minValue = 0
          r.maxValue = 1
        }
        break
      }
    }
  }

  // Log out the JS code for the program.
  console.log('function aluProgram(')
  for (let i = 0; i < inputIndex; i++) {
    console.log(`  in${i.toString().padStart(2, '0')}: number,`)
  }
  console.log(') {')
  for (let i = 0; i < temporaries.length; i++) {
    console.log(`  const temp${(i + 1).toString().padStart(2, '0')} = ${temporaries[i]}`)
  }
  console.log(`  return temp${temporaries.length}`)
  console.log('}')
}

function interpretProgram(program: string[][], inputs: number[]) {
  let registers: {[name: string]: number} = { w: 0, x: 0, y: 0, z: 0 }
  let inputIndex = 0

  const parseIntOrReg = (arg: string) => isNaN(parseInt(arg)) ? registers[arg] : parseInt(arg)

  for (const [op, reg, arg] of program) {
    switch (op) {
      case 'inp': {
        registers[reg] = inputs[inputIndex++]
        break
      }
      case 'add': {
        registers[reg] += parseIntOrReg(arg)
        break
      }
      case 'mul': {
        registers[reg] *= parseIntOrReg(arg)
        break
      }
      case 'div': {
        registers[reg] = ~~(registers[reg] / parseIntOrReg(arg))
        break
      }
      case 'mod': {
        registers[reg] %= parseIntOrReg(arg)
        break
      }
      case 'eql': {
        registers[reg] = +(registers[reg] === parseIntOrReg(arg))
        break
      }
    }
  }

  return registers[3]
}
