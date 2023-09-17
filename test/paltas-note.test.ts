/// <reference lib="dom" />

import { expect, describe, it } from 'bun:test'
import { PaltaNote } from '../src/PaltaNote'

describe('PaltaNote', () => {
  customElements.define('palta-note', PaltaNote)

  function fixture<T extends HTMLElement>(html: string): T {
    const el = document.createElement('div')
    el.innerHTML = html
    document.body.append(el)
    return el.children[0] as T
  }

  it('should render the composition as a table', async () => {
    const element = await fixture<PaltaNote>(
      '<palta-note>Dha Dhin Dhin Dha</palta-note>'
    )
    const table = element.shadowRoot?.querySelector('table')
    expect(table).not.toBeNull()
    expect(table).not.toBeUndefined()
  })

  it('should render the composition with vibhag markers', async () => {
    const el = await fixture<PaltaNote>(
      // prettier-ignore
      `<palta-note vibhags="X 2 0 3">
        Dha Dhin Dhin Dha
        Dha Dhin Dhin Dha
        Dha Tin Tin Ta
        Ta Dhin Dhin Dha
        Dha Dhin Dhin Dha
      </palta-note>`
    )

    const vibhagMarkers = el.shadowRoot?.querySelectorAll('th')
    expect(
      Array.from(vibhagMarkers || []).map(
        vibhagMarker => vibhagMarker.textContent
      )
    ).toStrictEqual(['X', '2', '0', '3', 'X'])
  })

  it('it should reflow the matra structure if the taal is specified', async () => {
    const el = await fixture<PaltaNote>(
      // prettier-ignore
      `<palta-note taal="teental">
        Dha Dhin Dhin Dha Dha Dhin Dhin Dha
        Dha Tin Tin Ta
        Ta Dhin Dhin Dha
        Dha Dhin Dhin Dha
      </palta-note>`
    )

    // get all the vibhag rows
    const vibhagRows = el.shadowRoot?.querySelectorAll('tr')
    expect(vibhagRows).not.toBeUndefined()
    expect(vibhagRows?.length).toBe(5)
    expect(
      Array.from(vibhagRows!).map(row => row.children.length)
    ).toStrictEqual([5, 5, 5, 5, 5])
  })

  it('should render compositions with repetitions', async () => {
    const el = await fixture<PaltaNote>(
      // prettier-ignore
      `<palta-note">
        (Tin)x2 Na
        Dhin Na x2
      </palta-note>`
    )

    const vibhagRows = el.shadowRoot?.querySelectorAll('tr')
    expect(vibhagRows).not.toBeUndefined()
    expect(vibhagRows?.length).toBe(3)

    // get matras in first row
    const firstRowMatras = Array.from(vibhagRows![0].querySelectorAll('.matra'))
    expect(firstRowMatras.length).toBe(3)
    expect(
      firstRowMatras.map(matra => matra.textContent?.trim())
    ).toStrictEqual(['Tin', 'Tin', 'Na'])
  })
})
