import { spacingClass } from '#/site/dev/tailwind'
import type { Values } from '#/site/dev/values'

export type SizingMode = 'hug' | 'fixed' | 'fill'
export type Axis = 'x' | 'y'

export interface Sizing {
  padding: string
  x: SizingMode
  y: SizingMode
}

const fixedPattern: Record<Axis, RegExp> = {
  x: /^(w|min-w|size)-(?!auto$|full$|fit$|max$|min$|screen$)/,
  y: /^(h|min-h|size)-(?!auto$|full$|fit$|max$|min$|screen$)/,
}

const fillClass: Record<Axis, string> = { x: 'w-full', y: 'h-full' }

function utilities(classes: string) {
  return classes
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name.slice(name.lastIndexOf(':') + 1))
}

export function sizeClasses(classes: string, axis: Axis) {
  return utilities(classes).filter((name) => fixedPattern[axis].test(name))
}

export function detectMode(element: HTMLElement, value: Values['width'], axis: Axis): SizingMode {
  if (value === 'auto') return 'hug'
  if (value === 'fill') return 'fill'
  const inline = element.style.getPropertyValue(axis === 'x' ? 'width' : 'height')
  if (inline === 'auto') return 'hug'
  if (inline === '100%') return 'fill'
  if (inline) return 'fixed'
  const names = utilities(element.getAttribute('class') ?? '')
  if (names.some((name) => fixedPattern[axis].test(name))) return 'fixed'
  if (names.includes(fillClass[axis])) return 'fill'
  return 'hug'
}

export function isButtonLike(element: HTMLElement) {
  if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') return true
  if (element.tagName === 'INPUT')
    return ['button', 'submit', 'reset'].includes((element as HTMLInputElement).type)
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (!style || !['A', 'SPAN', 'DIV', 'LABEL'].includes(element.tagName)) return false
  const boxy = ['inline-flex', 'flex', 'inline-block', 'inline-grid'].includes(style.display)
  const padded = Number.parseFloat(style.paddingLeft) > 0
  const painted =
    !/rgba?\(0, 0, 0, 0\)|transparent/.test(style.backgroundColor) ||
    Number.parseFloat(style.borderTopWidth) > 0
  return boxy && padded && painted && element.childElementCount < 6
}

export function canFillHeight(element: HTMLElement) {
  const parent = element.parentElement
  if (!parent) return false
  const display = element.ownerDocument.defaultView?.getComputedStyle(parent).display ?? ''
  return display.includes('flex') || display.includes('grid')
}

export function paddingClasses(values: Values) {
  const { paddingTop: top, paddingRight: right, paddingBottom: bottom, paddingLeft: left } = values
  if (top === right && right === bottom && bottom === left) return spacingClass('p', top)
  if (left === right && top === bottom)
    return `${spacingClass('px', left)} ${spacingClass('py', top)}`
  return [
    spacingClass('pt', top),
    spacingClass('pr', right),
    spacingClass('pb', bottom),
    spacingClass('pl', left),
  ].join(' ')
}

export function sizingLine(sizing: Sizing, classes: string) {
  const axes = (['x', 'y'] as const).filter((axis) => sizing[axis] === 'hug')
  if (!axes.length) return null
  const names = utilities(classes)
  const removed = axes.flatMap((axis) => [
    ...sizeClasses(classes, axis),
    ...names.filter((name) => name === fillClass[axis]),
  ])
  const originalPadding = names.filter((name) => /^p[xytrbl]?-/.test(name))
  const autos = axes.map((axis) => (axis === 'x' ? 'w-auto' : 'h-auto'))
  const before = [...removed, ...originalPadding].join(' ') || 'auto size'
  return `   - Size this element by padding, not a fixed width/height: ${removed.length ? `remove ${removed.join('/')}, ` : ''}use ${sizing.padding} (${before} → ${[...autos, sizing.padding].join(' ')}, size from padding).`
}

export function currentSizing(element: HTMLElement, values: Values, logged?: Sizing) {
  return {
    x: logged?.x ?? detectMode(element, values.width, 'x'),
    y: logged?.y ?? detectMode(element, values.height, 'y'),
  }
}
