import { html } from 'lit'
import { fixture, expect } from '@open-wc/testing'
import { PaltasNote } from '../src/PaltasNote.js'
import '../src/paltas-note.js'

describe('PaltasNote', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<PaltasNote>(
      html`<paltas-note>Dha Dhin Dhin Dha</paltas-note>`
    )

    await expect(el).shadowDom.to.be.accessible()
  })

  it('should render the composition as a table', async () => {
    const el = await fixture<PaltasNote>(
      html`<paltas-note>Dha Dhin Dhin Dha</paltas-note>`
    )

    const table = el.shadowRoot?.querySelector('table')
    expect(table).to.exist
  })

  it('should render the composition with vibhag markers', async () => {
    const el = await fixture<PaltasNote>(
      // prettier-ignore
      html`<paltas-note vibhags="1 2 0 3">
        Dha Dhin Dhin Dha
        Dha Dhin Dhin Dha
        Dha Tin Tin Ta
        Ta Dhin Dhin Dha
        Dha Dhin Dhin Dha
      </paltas-note>`
    )

    const vibhagMarkers = el.shadowRoot?.querySelectorAll('th')
    expect(
      Array.from(vibhagMarkers || []).map(
        vibhagMarker => vibhagMarker.textContent
      )
    ).to.deep.equal(['1', '2', '0', '3', '1'])
  })
})
