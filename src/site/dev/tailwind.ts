const radiusScale = new Map([
  [0, 'none'],
  [2, 'xs'],
  [4, 'sm'],
  [6, 'md'],
  [8, 'lg'],
  [12, 'xl'],
  [16, '2xl'],
  [24, '3xl'],
  [32, '4xl'],
])

const borderScale = new Set([0, 2, 4, 8])

export function spacingClass(prefix: string, px: number | 'auto') {
  if (px === 'auto') return `${prefix}-auto`
  if (px === 0) return `${prefix}-0`
  if (px === 1) return `${prefix}-px`
  const units = px / 4
  if (px > 0 && units <= 96 && Number.isInteger(units * 2)) return `${prefix}-${units}`
  return `${prefix}-[${px}px]`
}

export function radiusClass(prefix: string, px: number) {
  if (px >= 9999) return `${prefix}-full`
  const name = radiusScale.get(px)
  return name ? `${prefix}-${name}` : `${prefix}-[${px}px]`
}

export function borderClass(px: number) {
  if (px === 1) return 'border'
  return borderScale.has(px) ? `border-${px}` : `border-[${px}px]`
}

export function textSizeClass(px: number) {
  return `text-[${Math.round(px * 10) / 10}px]`
}
