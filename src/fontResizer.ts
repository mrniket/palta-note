import TextMetrics from 'text-metrics'

export function shrinkFontIfNeeded(
  shadowRoot: ShadowRoot,
  elements: HTMLElement[]
) {
  if (!isCanvasSupported()) {
    return
  }

  // find element with longest text
  let longestElement: HTMLElement | undefined
  for (const element of elements) {
    if (!longestElement) {
      longestElement = element
      continue
    } else {
      if (element.textContent!.length > longestElement.textContent!.length) {
        longestElement = element
      }
    }
  }

  if (!longestElement) {
    return
  }
  const metrics = TextMetrics.init(longestElement)
  const maxFontSize = parseInt(
    metrics.maxFontSize(
      longestElement.textContent!,
      {},
      { 'white-space': 'nowrap' }
    )!
  )
  const currentFontSize = parseInt(
    window.getComputedStyle(longestElement).getPropertyValue('font-size')
  )

  if (maxFontSize && maxFontSize < currentFontSize) {
    const newRule = `
    table {font-size: ${maxFontSize > 9 ? maxFontSize : maxFontSize + 1}px; }`
    shadowRoot.styleSheets[0].insertRule(newRule)
  }
}

function isCanvasSupported() {
  var elem = document.createElement('canvas')
  return !!(elem.getContext && elem.getContext('2d'))
}
