export type Matra = { matra: string; number: number }

export function parse(composition: string): Array<Array<Matra>> {
  const matras = composition
    .trim()
    .split('\n')
    .map(line => line.trim().split(' '))

  const result = []
  let matraCounter = 1

  for (let i = 0; i < matras.length; i += 1) {
    const matraRow = []
    for (let j = 0; j < matras[i].length; j += 1) {
      const matra = matras[i][j]
      if (matra !== '') {
        matraRow.push({ matra, number: matraCounter })
        matraCounter += 1
      }
    }
    result.push(matraRow)
  }

  return result
}

export function parseVibhags(
  vibhags: string | undefined
): Array<string> | undefined {
  if (!vibhags) return undefined
  return vibhags.trim().split(' ')
}
