export interface EditorRect {
  height: number
  left: number
  top: number
  width: number
}

export interface EditorValues {
  color: string
  backgroundColor: string
  borderColor: string
  borderRadius: string
  fontFamily: string
  fontSize: string
  fontWeight: string
  gap: string
  height: string
  letterSpacing: string
  lineHeight: string
  padding: string
  width: string
}

export interface FontBaseline {
  elements: Array<{
    element: HTMLElement
    size: number
  }>
  referenceSize: number
}

export const emptyEditorValues: EditorValues = {
  color: '#171717',
  backgroundColor: 'transparent',
  borderColor: '#e5e5e5',
  borderRadius: '0',
  fontFamily: 'inter',
  fontSize: '16',
  fontWeight: '400',
  gap: '0',
  height: 'auto',
  letterSpacing: '0',
  lineHeight: 'normal',
  padding: '0',
  width: 'auto',
}

export function getEditableTarget(target: EventTarget | null) {
  if (!(target instanceof Element) || target.closest('[data-page-editor]')) {
    return null
  }

  const htmlElement = target instanceof HTMLElement ? target : target.parentElement

  if (!htmlElement || htmlElement === document.body || htmlElement === document.documentElement) {
    return null
  }

  return htmlElement
}

export function getEditorRect(element: HTMLElement): EditorRect {
  const rect = element.getBoundingClientRect()

  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  }
}

export function getElementLabel(element: HTMLElement) {
  const dataSlot = element.dataset.slot
  const id = element.id ? `#${element.id}` : ''
  const name = dataSlot ? `[${dataSlot}]` : id

  return `${element.tagName.toLowerCase()}${name}`
}

export function isContainerElement(element: HTMLElement) {
  return element.childElementCount > 0
}

export function getTypographyElements(element: HTMLElement) {
  if (!isContainerElement(element)) {
    return [element]
  }

  return [
    element,
    ...Array.from(element.querySelectorAll<HTMLElement>('*')).filter(
      (child) => !child.closest('[data-page-editor]'),
    ),
  ]
}

export function readEditorValues(element: HTMLElement): EditorValues {
  const style = getComputedStyle(element)
  const rect = element.getBoundingClientRect()
  const family = style.fontFamily.toLowerCase()

  return {
    color: style.color,
    backgroundColor: style.backgroundColor,
    borderColor: style.borderTopColor,
    borderRadius: formatNumber(style.borderRadius),
    fontFamily: family.includes('mono')
      ? 'mono'
      : family.includes('serif') && !family.includes('sans-serif')
        ? 'serif'
        : family.includes('system-ui')
          ? 'system'
          : 'inter',
    fontSize: formatNumber(style.fontSize),
    fontWeight: style.fontWeight,
    gap: formatNumber(style.gap === 'normal' ? '0' : style.gap),
    height: `${Math.round(rect.height)}px`,
    letterSpacing: formatNumber(style.letterSpacing === 'normal' ? '0' : style.letterSpacing),
    lineHeight: style.lineHeight === 'normal' ? 'normal' : formatNumber(style.lineHeight),
    padding: formatNumber(style.paddingTop),
    width: `${Math.round(rect.width)}px`,
  }
}

export function normalizeCssSize(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue || trimmedValue === 'auto') {
    return trimmedValue || 'auto'
  }

  return /^-?\d*\.?\d+$/.test(trimmedValue) ? `${trimmedValue}px` : trimmedValue
}

export function numberFromCss(value: string, fallback = 0) {
  const parsedValue = Number.parseFloat(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

function formatNumber(value: string) {
  const parsedValue = Number.parseFloat(value)

  if (!Number.isFinite(parsedValue)) {
    return value
  }

  return String(Math.round(parsedValue * 100) / 100)
}

export function colorToHex(value: string) {
  if (typeof document === 'undefined') return '#000000'
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return '#000000'
  context.fillStyle = value
  context.fillRect(0, 0, 1, 1)
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
  return '#' + [red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')
}
