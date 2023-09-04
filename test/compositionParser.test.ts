import { expect } from '@open-wc/testing'
import { parse, parseVibhags } from '../src/parser/compositionParser'

describe('CompositionParser', () => {
  it('should parse teen taal', async () => {
    const composition = `Dha Dhin Dhin Dha
    Dha Dhin Dhin Dha
    Dha Tin Tin Ta
    Ta Dhin Dhin Dha`
    const expected = [
      [
        { matra: 'Dha', number: 1 },
        { matra: 'Dhin', number: 2 },
        { matra: 'Dhin', number: 3 },
        { matra: 'Dha', number: 4 },
      ],
      [
        { matra: 'Dha', number: 5 },
        { matra: 'Dhin', number: 6 },
        { matra: 'Dhin', number: 7 },
        { matra: 'Dha', number: 8 },
      ],
      [
        { matra: 'Dha', number: 9 },
        { matra: 'Tin', number: 10 },
        { matra: 'Tin', number: 11 },
        { matra: 'Ta', number: 12 },
      ],
      [
        { matra: 'Ta', number: 13 },
        { matra: 'Dhin', number: 14 },
        { matra: 'Dhin', number: 15 },
        { matra: 'Dha', number: 16 },
      ],
    ]
    const result = parse(composition)
    expect(result).to.deep.equal(expected)
  })

  it('should parse rupaak taal', async () => {
    const composition = `Tin Tin Na
    Dhin Na
    Dhin Na`
    const expected = [
      [
        { matra: 'Tin', number: 1 },
        { matra: 'Tin', number: 2 },
        { matra: 'Na', number: 3 },
      ],
      [
        { matra: 'Dhin', number: 4 },
        { matra: 'Na', number: 5 },
      ],
      [
        { matra: 'Dhin', number: 6 },
        { matra: 'Na', number: 7 },
      ],
    ]
    const result = parse(composition)
    expect(result).to.deep.equal(expected)
  })

  it('should parse vibhags', async () => {
    const vibhags = '1 2 0 3'
    const expected = [1, 2, 0, 3]
    const result = parseVibhags(vibhags)
    expect(result).to.deep.equal(expected)
  })
})
