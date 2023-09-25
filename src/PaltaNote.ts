import { FONT_FACES, FONT_FACES_ID } from './constants'
import { MatraInfo, parse, parseVibhags } from './parser/compositionParser'
import { TAALS, TaalMetadata, Taal } from './taalMetadata'

const rawStyles = `
:host {
  display: inline-block;
  color: black;
  font-family: 'Mooli', sans-serif;
  font-size: clamp(0.56rem, 0.09rem + 2.00vw, 1.38rem);
  filter: invert(1);
  mix-blend-mode: difference;
  width: 100%;
}

table {
  border-spacing: clamp(0.31rem, -0.05rem + 1.54vw, 0.94rem) clamp(0.63rem, 0.44rem + 0.77vw, 0.94rem);
}

@media (max-width: 600px) {
  table {
    margin-left: auto;
    margin-right: auto;
  }
}

th {
  vertical-align: baseline;
  font-family: 'Handlee', sans-serif;
  padding-right: 2px;
}

td {
  text-align: center;
  vertical-align: baseline;
}

td > div {
  display: inline-block;
}

.matra::after {
  content: '';
  margin-left: auto;
  margin-right: auto;
  padding-right: 0.1em;
  display: block;
  position: relative;
  left: 0;
  right: clamp(0.31rem, 0.18rem + 0.58vw, 0.63rem);
  top: -0.3em;
  width: 70%;
  height: clamp(0.31rem, 0.18rem + 0.58vw, 0.63rem);
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

  public taal?: string

  private taalMetadata?: TaalMetadata
  private rendered: boolean = false

  public static get observedAttributes(): string[] {
    return ['vibhags', 'taal']
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'vibhags') {
      this.vibhags = newValue
    } else if (name === 'taal') {
      this.taal = newValue.toLowerCase()
      if (this.taal in TAALS) {
        this.taalMetadata = TAALS[this.taal as Taal]
      }
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
    if (!this.rendered) {
      const matras = parse(this.textContent || '', { taal: this.taalMetadata })
      const vibhags = this.vibhags ?? this.taalMetadata?.vibhagMarkers
      const container = document.createElement('div')
      container.innerHTML = PaltaNote.render(matras, vibhags)
      this.shadowRoot?.append(container.children[0])
      this.rendered = true
    }
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
    matras: MatraInfo[][],
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
