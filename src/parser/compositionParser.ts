import { IterationNode, NonterminalNode } from 'ohm-js'
import { TaalMetadata } from '../taalMetadata'
// eslint-disable-next-line import/extensions
import grammar, { BhatkhandeSemantics } from './composition.ohm-bundle.js'

export type MatraInfo = { matra: string; number: number }

interface AdditionalInfo {
  taal?: TaalMetadata
}

declare global {
  interface Array<T> {
    repeat(numTimes: number): Array<T>
  }
}

/**
 * Returns an array with the elements of this array repeated `numTimes` times.
 */
Array.prototype.repeat = function (this: any[], numTimes: number) {
  return Array.from(
    { length: numTimes * this.length },
    (_, i) => this[i % this.length]
  )
}

const CompositionParser: BhatkhandeSemantics = grammar.createSemantics()
CompositionParser.addOperation<string>('eval()', {
  Composition(node: NonterminalNode) {
    return node.eval()
  },
  matra(bols: NonterminalNode, _space: NonterminalNode) {
    return bols.sourceString
  },
  repeatMatras(
    _leftBracket,
    matras: IterationNode,
    _rightBracket,
    _timesSymbol,
    times,
    _endOfLine
  ) {
    const numTimes = parseInt(times.sourceString)
    return matras.children
      .map(matra => matra.eval())
      .repeat(numTimes)
      .join(' ')
  },
  repeatMatraRow(matraRow, _timesSymbol, _maybeSpace, times, _endOfLine) {
    const numTimes = parseInt(times.sourceString)
    return `${matraRow.eval()}\n`.repeat(numTimes)
  },
  matraRow(matras, _endOfLine) {
    return matras.children.map(child => child.eval()).join(' ') + '\n'
  },
  _iter(...children) {
    return children.map(child => child.eval()).join(' ')
  },
})

function parseVerbatim(composition: string): Array<Array<MatraInfo>> {
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
): Array<Array<MatraInfo>> {
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

function expandComposition(composition: string): string {
  const result = grammar.match(composition)
  return CompositionParser(result).eval()
}

export function parse(
  composition: string,
  additionalInfo?: AdditionalInfo
): Array<Array<MatraInfo>> {
  const expandedComposition = expandComposition(composition)
  if (additionalInfo?.taal !== undefined) {
    return parseWithTaal(expandedComposition, additionalInfo.taal)
  }
  return parseVerbatim(expandedComposition)
}

export function parseVibhags(
  vibhags: string | undefined
): Array<string> | undefined {
  if (!vibhags) return undefined
  return vibhags.trim().split(' ')
}
