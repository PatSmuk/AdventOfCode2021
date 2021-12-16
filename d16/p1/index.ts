import { readInputFileLines } from '../../util'

interface Packet {
  value: number
  version: number
  type: number
  subpackets: Packet[]
}

function parseLine(line: string) {
  return line.split('').map(x => parseInt(x, 16).toString(2).padStart(4, '0')).join('')
}

const input = readInputFileLines(__dirname, parseLine)[0]

let versionSum = 0
parsePacket(input)
console.log(versionSum)

function parsePacket(data: string): [any, number] {
  const packet: Packet = {
    version: parseInt(data.slice(0, 3), 2),
    type: parseInt(data.slice(3, 6), 2),
    value: NaN,
    subpackets: []
  }
  let offset = 6
  versionSum += packet.version

  if (packet.type === 4) {
    let bits = ''
    let piece
    do {
      piece = data.slice(offset, offset + 5)
      offset += 5
      bits += piece.slice(1)
    } while (piece[0] === '1')

    packet.value = parseInt(bits, 2)
    return [packet, offset]
  }

  packet.subpackets = []
  const lengthTypeId = data[offset++]

  if (lengthTypeId === '0') {
    const payloadLength = parseInt(data.slice(offset, offset + 15), 2)
    offset += 15

    let payload = data.slice(offset, offset + payloadLength)
    offset += payloadLength

    while (payload.length > 0) {
      const [packet, offset] = parsePacket(payload)
      packet.subpackets.push(packet)
      payload = payload.slice(offset)
    }
  } else {
    let numSubpackets = parseInt(data.slice(offset, offset + 11), 2)
    offset += 11

    while (numSubpackets > 0) {
      const [innerPacket, innerOffset] = parsePacket(data.slice(offset))
      packet.subpackets.push(innerPacket)
      offset += innerOffset
      numSubpackets--
    }
  }

  return [packet, offset]
}
