import { readInputFileLines } from '../../util'

enum PacketType {
  SUM, PRODUCT, MIN, MAX, LITERAL, GREATER, LESS, EQUAL
}

interface Packet {
  value: number
  version: number
  type: PacketType
  subpackets: Packet[]
}

function parseLine(line: string) {
  return line.split('').map(x => parseInt(x, 16).toString(2).padStart(4, '0')).join('')
}

const input = readInputFileLines(__dirname, parseLine)[0]
console.log(parsePacket(input)[0].value)

function parsePacket(data: string): [Packet, number] {
  const packet: Packet = {
    version: parseInt(data.slice(0, 3), 2),
    type: parseInt(data.slice(3, 6), 2),
    value: NaN,
    subpackets: []
  }
  let offset = 6

  if (packet.type === PacketType.LITERAL) {
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

  const lengthTypeId = data[offset++]

  if (lengthTypeId === '0') {
    const payloadLength = parseInt(data.slice(offset, offset + 15), 2)
    offset += 15

    let payload = data.slice(offset, offset + payloadLength)
    offset += payloadLength

    while (payload.length > 0) {
      const [innerPacket, innerOffset] = parsePacket(payload)
      packet.subpackets.push(innerPacket)
      payload = payload.slice(innerOffset)
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

  switch (packet.type) {
    case PacketType.SUM: {
      packet.value = packet.subpackets.reduce((prev, p) => prev + p.value, 0)
      break
    }
    case PacketType.PRODUCT: {
      packet.value = packet.subpackets.reduce((prev, p) => prev * p.value, 1)
      break
    }
    case PacketType.MIN: {
      packet.value = Math.min(...packet.subpackets.map(p => p.value))
      break
    }
    case PacketType.MAX: {
      packet.value = Math.max(...packet.subpackets.map(p => p.value))
      break
    }
    case PacketType.GREATER: {
      packet.value = packet.subpackets[0].value > packet.subpackets[1].value ? 1 : 0
      break
    }
    case PacketType.LESS: {
      packet.value = packet.subpackets[0].value < packet.subpackets[1].value ? 1 : 0
      break
    }
    case PacketType.EQUAL: {
      packet.value = packet.subpackets[0].value === packet.subpackets[1].value ? 1 : 0
      break
    }
  }

  return [packet, offset]
}
