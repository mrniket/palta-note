import { html, css, LitElement, TemplateResult } from 'lit'
import { property } from 'lit/decorators/property.js'
import { parse, parseVibhags } from './parser/compositionParser'
import { FONT_FACES, FONT_FACES_ID } from './constants'

export class PaltasNote extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--paltas-note-text-color, #000);
      font-family: sans-serif;
    }

    table {
      padding: 20px;
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

  @property({ type: String })
  vibhags?: string

  renderVibhagMarker(
    vibhags: Array<number> | undefined,
    rowIndex: number
  ): TemplateResult<1> | string {
    if (vibhags === undefined) {
      return ''
    } else {
      const vibhagIndex = rowIndex % vibhags.length
      return html`<th>${vibhags[vibhagIndex]}</th>`
    }
  }

  loadFontFaces() {
    if (document.querySelector(`style[data-description="${FONT_FACES_ID}"]`)) {
      return
    }
    const style = document.createElement('style')
    style.dataset.description = FONT_FACES_ID
    style.append(document.createTextNode(FONT_FACES))
    document.head.append(style)
  }

  render() {
    this.loadFontFaces()
    const matras = parse(this.textContent || '')
    const vibhags = parseVibhags(this.vibhags)
    // Display the composition as a table
    return html`
      <table>
        ${matras.map((matraRow, i) => {
          return html`
            <tr>
              ${this.renderVibhagMarker(vibhags, i)}
              ${matraRow.map((matra, j) => {
                if (matra !== undefined) {
                  return html`<td>
                    <div class="matra" data-matra="${matra.matra}">
                      ${matra.matra}
                    </div>
                  </td>`
                }
              })}
            </tr>
          `
        })}
      </table>
    `
  }
}
