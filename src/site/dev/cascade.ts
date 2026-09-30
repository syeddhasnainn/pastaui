import { formatHsla, toHsla, type Hsla } from '#/site/dev/color'
import type { TextNodes } from '#/site/dev/inspect'
import { cssValue, round, type Key, type Values } from '#/site/dev/values'

export type Scope = 'self' | 'proportional' | 'exact'
export type CascadeMode = Exclude<Scope, 'self'>
export type CascadeKey =
  | 'family'
  | 'size'
  | 'weight'
  | 'tracking'
  | 'leading'
  | 'transform'
  | 'color'

export const cascadeCap = 500

const cascadeKeys = new Set<Key>([
  'family',
  'size',
  'weight',
  'tracking',
  'leading',
  'transform',
  'color',
])
const skippedTags = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'LINK', 'META'])
const controls = new Set(['TEXTAREA', 'BUTTON', 'SELECT'])
const nonTextInputs = new Set(['checkbox', 'radio', 'range', 'color', 'file', 'image', 'hidden'])
const xhtml = 'http://www.w3.org/1999/xhtml'

export function isCascadeKey(key: Key): key is CascadeKey {
  return cascadeKeys.has(key)
}

function hasText(element: Element) {
  if (element.tagName === 'INPUT') return !nonTextInputs.has((element as HTMLInputElement).type)
  if (controls.has(element.tagName)) return true
  for (const node of element.childNodes)
    if (node.nodeType === 3 && /\S/.test(node.textContent ?? '')) return true
  return false
}

export function textDescendants(container: HTMLElement, cap = cascadeCap): TextNodes {
  const doc = container.ownerDocument
  const view = doc.defaultView
  const nodes: HTMLElement[] = []
  let total = 0
  if (!view || container.namespaceURI !== xhtml) return { nodes, total }
  const walker = doc.createTreeWalker(container, 1, {
    acceptNode(node) {
      const element = node as HTMLElement
      if (element.namespaceURI !== xhtml || skippedTags.has(element.tagName)) return 2
      if (element.hasAttribute('data-design-inspector')) return 2
      const style = view.getComputedStyle(element)
      if (style.display === 'none') return 2
      if (style.visibility !== 'visible') return 3
      return hasText(element) ? 1 : 3
    },
  })
  while (walker.nextNode()) {
    total++
    if (nodes.length < cap) nodes.push(walker.currentNode as HTMLElement)
  }
  return { nodes, total }
}

export function readKey<K extends CascadeKey>(element: HTMLElement, key: K): Values[K] {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  const size = Number.parseFloat(style?.fontSize ?? '') || 16
  const read = (): Values[CascadeKey] => {
    switch (key) {
      case 'size':
        return round(size, 2)
      case 'weight':
        return Number(style?.fontWeight) || 400
      case 'leading': {
        const value = style?.lineHeight ?? 'normal'
        return value === 'normal' ? 1.2 : round(Number.parseFloat(value) / size, 2) || 1.2
      }
      case 'tracking': {
        const value = style?.letterSpacing ?? 'normal'
        return value === 'normal' ? 0 : round(Number.parseFloat(value) / size, 3)
      }
      case 'color':
        return toHsla(style?.color || 'rgb(0 0 0)')
      case 'transform':
        return style?.textTransform || 'none'
      default:
        return style?.fontFamily ?? ''
    }
  }
  return read() as Values[K]
}

export function formatKey(key: CascadeKey, value: Values[CascadeKey]) {
  return cssValue(key, { [key]: value } as unknown as Values)
}

export function cascadeValue(
  key: CascadeKey,
  mode: CascadeMode,
  own: Values[CascadeKey],
  base: Values[CascadeKey],
  next: Values[CascadeKey],
) {
  if (mode === 'exact' || typeof own !== 'number' || typeof base !== 'number' || !base) return next
  if (typeof next !== 'number') return next
  if (key === 'size') return Math.max(1, Math.round(((own * next) / base) * 2) / 2)
  if (key === 'leading') return round((own * next) / base, 2)
  return next
}

export function sameValue(a: Values[CascadeKey], b: Values[CascadeKey]) {
  if (typeof a === 'object' && typeof b === 'object')
    return formatHsla(a as Hsla) === formatHsla(b as Hsla)
  return a === b
}
