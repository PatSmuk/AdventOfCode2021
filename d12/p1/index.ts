import { readInputFileLines } from '../../util'

function parseLine(line: string) {
  return line.split('-') as [string, string]
}

const inputs = readInputFileLines(__dirname, parseLine)

const connectionsByNode = new Map<string, string[]>()
const smallCaves = new Set<string>()

// Build connections map and set of small caves.
for (const [a, b] of inputs) {
  // Only make the connection if it's not going to start.
  if (b !== "start") connectionsByNode.set(a, [...connectionsByNode.get(a) || [], b])
  if (a !== "start") connectionsByNode.set(b, [...connectionsByNode.get(b) || [], a])

  for (const node of [a, b]) {
    if (node !== "start" && node !== "end" && node.toLowerCase() === node) {
      smallCaves.add(node)
    }
  }
}

let completePathCount = 0
const pathsToVisit = connectionsByNode.get("start")!.map(node => ["start", node])

while (pathsToVisit.length > 0) {
  const path = pathsToVisit.pop()!
  const connections = connectionsByNode.get(path[path.length - 1])!

  for (const node of connections) {
    if (node === "end") {
      completePathCount++
    } else if (!smallCaves.has(node) || !path.includes(node)) {
      pathsToVisit.push([...path, node])
    }
  }
}

console.log(completePathCount)
