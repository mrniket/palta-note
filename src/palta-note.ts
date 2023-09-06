import { PaltaNote } from './PaltaNote'
import { parse, parseVibhags } from './parser/compositionParser'

customElements.define('palta-note', PaltaNote)
export default { PaltaNote, parse, parseVibhags }
