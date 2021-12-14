import * as fs from 'fs'
import * as path from 'path'

export function readInputFileLines<T>(dirname: string, parser: (line: string, i: number) => T): T[] {
    const data = fs.readFileSync(
      path.join(dirname, '..', 'input.txt'),
      { encoding: 'utf8' }
    ).split('\n')

    return data.map(parser)
}

/** Increments the value associated with `key` in `map` by `value`. */
export function mapInc<K>(map: Map<K, number>, key: K, value: number) {
  const existing = map.get(key)
  if (existing) {
    map.set(key, existing + value)
  } else {
    map.set(key, value)
  }
}
