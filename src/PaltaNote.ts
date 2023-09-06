import { FONT_FACES, FONT_FACES_ID } from './constants'
import { Matra, parse, parseVibhags } from './parser/compositionParser'

const rawStyles = `
:host {
  display: block;
  color: black;
  font-family: sans-serif;
  filter: invert(1);
  mix-blend-mode: difference;
}

table {
  border-spacing: 0 15px;
}

tr {
  padding: 100px;
}

th {
  vertical-align: baseline;
  font-family: 'Caveat', sans-serif;
}

td {
  min-width: 100px;
  text-align: center;
}

td > div {
  display: inline-block;
}

.matra::after {
  content: '';
  margin-left: auto;
  margin-right: auto;
  /* margin-left: calc(15% + 0.2em);
    margin-right: calc(15% - 0.2em); */
  padding-right: 0.1em;
  display: block;
  position: relative;
  left: 0;
  right: 10px;
  top: -0.5em;
  width: 70%;
  height: 10px;
  border-radius: 50%;
  border-bottom: 2px solid black;
}

.matra sub {
  position: relative;
  top: 0.5em;
  font-size: 0.5em;
  right: 0.2em;
}

`

export class PaltaNote extends HTMLElement {
  public vibhags?: string

  public static get observedAttributes(): string[] {
    return ['vibhags']
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'vibhags') {
      this.vibhags = newValue
    }
  }

  static loadFontFaces() {
    if (document.querySelector(`style[data-description="${FONT_FACES_ID}"]`)) {
      return
    }
    const style = document.createElement('style')
    style.dataset.description = FONT_FACES_ID
    style.append(document.createTextNode(FONT_FACES))
    document.head.append(style)
  }

  loadStyles() {
    PaltaNote.loadFontFaces()
    const style = document.createElement('style')
    style.innerHTML = rawStyles
    this.shadowRoot?.append(style)
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.loadStyles()
  }

  connectedCallback(): void {
    const matras = parse(this.textContent || '')
    const container = document.createElement('div')
    container.innerHTML = PaltaNote.render(matras, this.vibhags)
    this.shadowRoot?.append(container.children[0])
  }

  public static renderVibhagMarker(
    vibhags: Array<string> | undefined,
    rowIndex: number
  ): string {
    if (vibhags === undefined) {
      return ''
    }
    const vibhagIndex = rowIndex % vibhags.length
    return `<th>${vibhags[vibhagIndex]}</th>`
  }

  public static render(
    matras: Array<Array<Matra>>,
    vibhags: string | undefined
  ): string {
    const vibhagMarkers = parseVibhags(vibhags)
    // Display the composition as a table
    return `<table>
            ${matras
              .map(
                (matraRow, i) =>
                  `
                <tr>
                  ${this.renderVibhagMarker(vibhagMarkers, i)}
                  ${matraRow
                    .map(matra => {
                      if (matra !== undefined) {
                        return `<td>
                        <div class="matra" data-matra="${matra.matra}">
                          ${matra.matra}
                        </div>
                      </td>`
                      }
                      return ''
                    })
                    .join('')}
                </tr>
              `
              )
              .join('')}
            </table>
        `
  }
}
