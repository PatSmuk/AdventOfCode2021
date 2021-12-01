import * as fs from 'fs'
import * as path from 'path'

export function readInputFileLines<T>(dirname: string, parser: (line: string) => T): T[] {
    const data = fs.readFileSync(
      path.join(dirname, '..', 'input.txt'),
      { encoding: 'utf8' }
    ).split('\n')

    return data.map(parser)
}
