import { TaalMetadata } from '../taalMetadata'

export type Matra = { matra: string; number: number }

interface AdditionalInfo {
  taal?: TaalMetadata
}

function parseVerbatim(composition: string): Array<Array<Matra>> {
  const matras = composition
    .trim()
    .replace(/-/g, '–')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
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

function parseWithTaal(
  composition: string,
  taalMetadata: TaalMetadata
): Array<Array<Matra>> {
  const matras = composition
    .replace(/-/g, '–')
    .replace(/\s+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .split(' ')
    .entries()

  const result = []
  let currentVibhagIndex = 0
  let matraIndexInVibhag = 0
  let currentMatraRow = []

  for (const [matraNumber, matra] of matras) {
    // 2 cases, first: matra can be pushed to current vibhag
    // second: matra can be pushed to next vibhag
    // assume indexes are within first case, then make sure they are updated to be within bounds for next iteration
    currentMatraRow.push({ matra, number: matraNumber + 1 })
    matraIndexInVibhag += 1

    if (
      matraIndexInVibhag === taalMetadata.matrasPerVibhag[currentVibhagIndex]
    ) {
      result.push(currentMatraRow)
      currentMatraRow = []
      matraIndexInVibhag = 0
      currentVibhagIndex =
        (currentVibhagIndex + 1) % taalMetadata.matrasPerVibhag.length
    }
  }

  return result
}

export function parse(
  composition: string,
  additionalInfo?: AdditionalInfo
): Array<Array<Matra>> {
  if (additionalInfo?.taal !== undefined) {
    return parseWithTaal(composition, additionalInfo.taal)
  }
  return parseVerbatim(composition)
}

export function parseVibhags(
  vibhags: string | undefined
): Array<string> | undefined {
  if (!vibhags) return undefined
  return vibhags.trim().split(' ')
}
