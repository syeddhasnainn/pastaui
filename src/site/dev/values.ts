import { formatHsla, toHsla, type Hsla } from '#/site/dev/color'
import { borderClass, radiusClass, spacingClass, textSizeClass } from '#/site/dev/tailwind'

export interface Values {
  family: string
  size: number
  weight: number
  tracking: number
  leading: number
  transform: string
  color: Hsla
  background: Hsla
  width: number | 'auto' | 'fill'
  height: number | 'auto' | 'fill'
  minWidth: number
  minHeight: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  gap: number
  radiusTopLeft: number
  radiusTopRight: number
  radiusBottomRight: number
  radiusBottomLeft: number
  borderWidth: number
  display: string
}

export type Key = keyof Values

export type RawValues = Record<Key, string>

export const cssProperty: Record<Key, string> = {
  family: 'font-family',
  size: 'font-size',
  weight: 'font-weight',
  tracking: 'letter-spacing',
  leading: 'line-height',
  transform: 'text-transform',
  color: 'color',
  background: 'background-color',
  width: 'width',
  height: 'height',
  minWidth: 'min-width',
  minHeight: 'min-height',
  paddingTop: 'padding-top',
  paddingRight: 'padding-right',
  paddingBottom: 'padding-bottom',
  paddingLeft: 'padding-left',
  gap: 'gap',
  radiusTopLeft: 'border-top-left-radius',
  radiusTopRight: 'border-top-right-radius',
  radiusBottomRight: 'border-bottom-right-radius',
  radiusBottomLeft: 'border-bottom-left-radius',
  borderWidth: 'border-width',
  display: 'display',
}

export const keys = Object.keys(cssProperty) as Key[]

export const paddingKeys = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const
export const radiusKeys = [
  'radiusTopLeft',
  'radiusTopRight',
  'radiusBottomRight',
  'radiusBottomLeft',
] as const

const spacingPrefix: Partial<Record<Key, string>> = {
  width: 'w',
  height: 'h',
  minWidth: 'min-w',
  minHeight: 'min-h',
  paddingTop: 'pt',
  paddingRight: 'pr',
  paddingBottom: 'pb',
  paddingLeft: 'pl',
  gap: 'gap',
}

const radiusPrefix: Partial<Record<Key, string>> = {
  radiusTopLeft: 'rounded-tl',
  radiusTopRight: 'rounded-tr',
  radiusBottomRight: 'rounded-br',
  radiusBottomLeft: 'rounded-bl',
}

const transformClass: Record<string, string> = {
  none: 'normal-case',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
}

export const layoutDisplays = new Set(['flex', 'grid', 'inline-flex', 'inline-grid'])

export function round(value: number, digits = 0) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function cssValue(key: Key, values: Values): string {
  switch (key) {
    case 'family':
    case 'transform':
    case 'display':
      return values[key]
    case 'weight':
    case 'leading':
      return String(values[key])
    case 'tracking':
      return `${values.tracking}em`
    case 'color':
    case 'background':
      return formatHsla(values[key])
    default: {
      const value = values[key]
      if (value === 'fill') return '100%'
      return value === 'auto' ? 'auto' : `${value}px`
    }
  }
}

export function tailwindClass(key: Key, values: Values): string {
  switch (key) {
    case 'family':
      return `font-[family-name:${values.family.replaceAll('"', "'").replace(/,\s*/g, ',').replaceAll(' ', '_')}]`
    case 'size':
      return textSizeClass(values.size)
    case 'weight':
      return `font-[${values.weight}]`
    case 'tracking':
      return `tracking-[${values.tracking}em]`
    case 'leading':
      return `leading-[${values.leading}]`
    case 'transform':
      return transformClass[values.transform] ?? 'normal-case'
    case 'color':
      return `text-[${formatHsla(values.color, '_')}]`
    case 'background':
      return `bg-[${formatHsla(values.background, '_')}]`
    case 'borderWidth':
      return borderClass(values.borderWidth)
    case 'display':
      return values.display
    default: {
      const radius = radiusPrefix[key]
      if (radius) return radiusClass(radius, values[key] as number)
      const value = values[key] as number | 'auto' | 'fill'
      const prefix = spacingPrefix[key] ?? key
      return value === 'fill' ? `${prefix}-full` : spacingClass(prefix, value)
    }
  }
}

function px(value: string) {
  return round(Number.parseFloat(value) || 0, 2)
}

function radius(value: string, width: number, height: number) {
  const amount = value.endsWith('%')
    ? (Number.parseFloat(value) / 100) * Math.min(width, height)
    : Number.parseFloat(value) || 0
  return amount >= 9999 ? 9999 : round(amount, 2)
}

export function readValues(element: HTMLElement): { values: Values; raw: RawValues } {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  const read = (key: Key) =>
    style?.getPropertyValue(key === 'borderWidth' ? 'border-top-width' : cssProperty[key]) ?? ''
  const raw = Object.fromEntries(keys.map((key) => [key, read(key)])) as RawValues
  const rect = element.getBoundingClientRect()
  const size = round(Number.parseFloat(raw.size) || 16, 2)
  const width = round(Number.parseFloat(raw.width) || rect.width, 2)
  const height = round(Number.parseFloat(raw.height) || rect.height, 2)
  return {
    raw,
    values: {
      family: raw.family,
      size,
      weight: Number(raw.weight) || 400,
      tracking: raw.tracking === 'normal' ? 0 : round(Number.parseFloat(raw.tracking) / size, 3),
      leading:
        raw.leading === 'normal' ? 1.2 : round(Number.parseFloat(raw.leading) / size, 2) || 1.2,
      transform: raw.transform || 'none',
      color: toHsla(raw.color || 'rgb(0 0 0)'),
      background: toHsla(raw.background || 'rgba(0, 0, 0, 0)'),
      width,
      height,
      minWidth: px(raw.minWidth),
      minHeight: px(raw.minHeight),
      paddingTop: px(raw.paddingTop),
      paddingRight: px(raw.paddingRight),
      paddingBottom: px(raw.paddingBottom),
      paddingLeft: px(raw.paddingLeft),
      gap: px(raw.gap),
      radiusTopLeft: radius(raw.radiusTopLeft, width, height),
      radiusTopRight: radius(raw.radiusTopRight, width, height),
      radiusBottomRight: radius(raw.radiusBottomRight, width, height),
      radiusBottomLeft: radius(raw.radiusBottomLeft, width, height),
      borderWidth: px(raw.borderWidth),
      display: raw.display || 'inline',
    },
  }
}
