import * as fsPromises from 'node:fs/promises'
import * as Path from 'node:path'

export async function readData() {
  return await fsPromises
    .readFile(Path.resolve('./server/data/data.json'))
    .then((data) => JSON.parse(data))
}

export async function writeData(newData) {
  const newFile = JSON.stringify(newData, null, 2)
  return await fsPromises.writeFile('./server/data/data.json', newFile)
}
