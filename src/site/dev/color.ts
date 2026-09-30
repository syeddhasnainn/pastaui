export interface Hsla {
  h: number
  s: number
  l: number
  a: number
}

let context: CanvasRenderingContext2D | null = null

function round(value: number, digits = 0) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function parseRgb(value: string) {
  const match = value.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/,
  )
  if (!match) return null
  const alpha = match[4] === undefined ? 1 : Number(match[4]) / (match[5] ? 100 : 1)
  return [Number(match[1]), Number(match[2]), Number(match[3]), alpha] as const
}

function resolveRgb(value: string) {
  const direct = parseRgb(value.trim())
  if (direct) return direct
  context ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!context) return [0, 0, 0, 1] as const
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = '#000'
  context.fillStyle = value
  context.fillRect(0, 0, 1, 1)
  const [r = 0, g = 0, b = 0, a = 255] = context.getImageData(0, 0, 1, 1).data
  return [r, g, b, a / 255] as const
}

export function toHsla(value: string): Hsla {
  const [red, green, blue, alpha] = resolveRgb(value)
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h: round(h), s: round(s * 100), l: round(l * 100), a: round(alpha, 2) }
}

export function formatHsla({ h, s, l, a }: Hsla, separator = ' ') {
  const alpha = a < 1 ? `${separator}/${separator}${round(a, 2)}` : ''
  return `hsl(${h}${separator}${s}%${separator}${l}%${alpha})`
}

export function parseHsla(value: string): Hsla | null {
  const match = value
    .trim()
    .match(
      /^hsla?\(\s*(-?[\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/i,
    )
  if (!match) return null
  const h = ((Number(match[1]) % 360) + 360) % 360
  const s = Number(match[2])
  const l = Number(match[3])
  const a = match[4] === undefined ? 1 : Number(match[4]) / (match[5] ? 100 : 1)
  if ([h, s, l, a].some(Number.isNaN) || s > 100 || l > 100 || a > 1) return null
  return { h: round(h), s: round(s), l: round(l), a: round(a, 2) }
}
