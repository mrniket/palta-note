import { fixture, expect } from '@open-wc/testing'
import { PaltaNote } from '../src/PaltaNote'

describe('PaltaNote', () => {
  customElements.define('palta-note', PaltaNote)

  it('passes the a11y audit', async () => {
    const el = await fixture<PaltaNote>(
      `<palta-note>Dha Dhin Dhin Dha</palta-note>`
    )
    await expect(el).shadowDom.to.be.accessible()
  })

  it('should render the composition as a table', async () => {
    const element = await fixture<PaltaNote>(
      '<palta-note>Dha Dhin Dhin Dha</palta-note>'
    )
    const table = element.shadowRoot?.querySelector('table')
    expect(table).to.exist
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
    ).to.deep.equal(['X', '2', '0', '3', 'X'])
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
    expect(vibhagRows).to.exist
    expect(vibhagRows?.length).to.equal(5)
    expect(
      Array.from(vibhagRows!).map(row => row.children.length)
    ).to.deep.equal([5, 5, 5, 5, 5])
  })
})
