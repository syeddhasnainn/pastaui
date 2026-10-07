export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type Shade = (typeof SHADES)[number]

export const tailwindPalette: { name: string; shades: Record<Shade, string> }[] = [
  {
    name: 'red',
    shades: {
      50: '#fef2f2',
      100: '#ffe2e2',
      200: '#ffc9c9',
      300: '#ffa2a2',
      400: '#ff6467',
      500: '#fb2c36',
      600: '#e7000b',
      700: '#c10007',
      800: '#9f0712',
      900: '#82181a',
      950: '#460809',
    },
  },
  {
    name: 'orange',
    shades: {
      50: '#fff7ed',
      100: '#ffedd4',
      200: '#ffd6a7',
      300: '#ffb86a',
      400: '#ff8904',
      500: '#ff6900',
      600: '#f54900',
      700: '#ca3500',
      800: '#9f2d00',
      900: '#7e2a0c',
      950: '#441306',
    },
  },
  {
    name: 'amber',
    shades: {
      50: '#fffbeb',
      100: '#fef3c6',
      200: '#fee685',
      300: '#ffd230',
      400: '#ffb900',
      500: '#fe9a00',
      600: '#e17100',
      700: '#bb4d00',
      800: '#973c00',
      900: '#7b3306',
      950: '#461901',
    },
  },
  {
    name: 'yellow',
    shades: {
      50: '#fefce8',
      100: '#fef9c2',
      200: '#fff085',
      300: '#ffdf20',
      400: '#fdc700',
      500: '#f0b100',
      600: '#d08700',
      700: '#a65f00',
      800: '#894b00',
      900: '#733e0a',
      950: '#432004',
    },
  },
  {
    name: 'lime',
    shades: {
      50: '#f7fee7',
      100: '#ecfcca',
      200: '#d8f999',
      300: '#bbf451',
      400: '#9ae600',
      500: '#7ccf00',
      600: '#5ea500',
      700: '#497d00',
      800: '#3c6300',
      900: '#35530e',
      950: '#192e03',
    },
  },
  {
    name: 'green',
    shades: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#b9f8cf',
      300: '#7bf1a8',
      400: '#05df72',
      500: '#00c950',
      600: '#00a63e',
      700: '#008236',
      800: '#016630',
      900: '#0d542b',
      950: '#032e15',
    },
  },
  {
    name: 'emerald',
    shades: {
      50: '#ecfdf5',
      100: '#d0fae5',
      200: '#a4f4cf',
      300: '#5ee9b5',
      400: '#00d492',
      500: '#00bc7d',
      600: '#009966',
      700: '#007a55',
      800: '#006045',
      900: '#004f3b',
      950: '#002c22',
    },
  },
  {
    name: 'teal',
    shades: {
      50: '#f0fdfa',
      100: '#cbfbf1',
      200: '#96f7e4',
      300: '#46ecd5',
      400: '#00d5be',
      500: '#00bba7',
      600: '#009689',
      700: '#00786f',
      800: '#005f5a',
      900: '#0b4f4a',
      950: '#022f2e',
    },
  },
  {
    name: 'cyan',
    shades: {
      50: '#ecfeff',
      100: '#cefafe',
      200: '#a2f4fd',
      300: '#53eafd',
      400: '#00d3f2',
      500: '#00b8db',
      600: '#0092b8',
      700: '#007595',
      800: '#005f78',
      900: '#104e64',
      950: '#053345',
    },
  },
  {
    name: 'sky',
    shades: {
      50: '#f0f9ff',
      100: '#dff2fe',
      200: '#b8e6fe',
      300: '#74d4ff',
      400: '#00bcff',
      500: '#00a6f4',
      600: '#0084d1',
      700: '#0069a8',
      800: '#00598a',
      900: '#024a70',
      950: '#052f4a',
    },
  },
  {
    name: 'blue',
    shades: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bedbff',
      300: '#8ec5ff',
      400: '#51a2ff',
      500: '#2b7fff',
      600: '#155dfc',
      700: '#1447e6',
      800: '#193cb8',
      900: '#1c398e',
      950: '#162456',
    },
  },
  {
    name: 'indigo',
    shades: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c6d2ff',
      300: '#a3b3ff',
      400: '#7c86ff',
      500: '#615fff',
      600: '#4f39f6',
      700: '#432dd7',
      800: '#372aac',
      900: '#312c85',
      950: '#1e1a4d',
    },
  },
  {
    name: 'violet',
    shades: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6ff',
      300: '#c4b4ff',
      400: '#a684ff',
      500: '#8e51ff',
      600: '#7f22fe',
      700: '#7008e7',
      800: '#5d0ec0',
      900: '#4d179a',
      950: '#2f0d68',
    },
  },
  {
    name: 'purple',
    shades: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d4ff',
      300: '#dab2ff',
      400: '#c27aff',
      500: '#ad46ff',
      600: '#9810fa',
      700: '#8200db',
      800: '#6e11b0',
      900: '#59168b',
      950: '#3c0366',
    },
  },
  {
    name: 'fuchsia',
    shades: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f6cfff',
      300: '#f4a8ff',
      400: '#ed6aff',
      500: '#e12afb',
      600: '#c800de',
      700: '#a800b7',
      800: '#8a0194',
      900: '#721378',
      950: '#4b004f',
    },
  },
  {
    name: 'pink',
    shades: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fccee8',
      300: '#fda5d5',
      400: '#fb64b6',
      500: '#f6339a',
      600: '#e60076',
      700: '#c6005c',
      800: '#a3004c',
      900: '#861043',
      950: '#510424',
    },
  },
  {
    name: 'rose',
    shades: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#ffccd3',
      300: '#ffa1ad',
      400: '#ff637e',
      500: '#ff2056',
      600: '#ec003f',
      700: '#c70036',
      800: '#a50036',
      900: '#8b0836',
      950: '#4d0218',
    },
  },
  {
    name: 'slate',
    shades: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cad5e2',
      400: '#90a1b9',
      500: '#62748e',
      600: '#45556c',
      700: '#314158',
      800: '#1d293d',
      900: '#0f172b',
      950: '#020618',
    },
  },
  {
    name: 'gray',
    shades: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5dc',
      400: '#99a1af',
      500: '#6a7282',
      600: '#4a5565',
      700: '#364153',
      800: '#1e2939',
      900: '#101828',
      950: '#030712',
    },
  },
  {
    name: 'zinc',
    shades: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#9f9fa9',
      500: '#71717b',
      600: '#52525c',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
  },
  {
    name: 'neutral',
    shades: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a1a1a1',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },
  {
    name: 'stone',
    shades: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a6a09b',
      500: '#79716b',
      600: '#57534d',
      700: '#44403b',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },
  },
  {
    name: 'taupe',
    shades: {
      50: '#fbfaf9',
      100: '#f3f1f1',
      200: '#e8e4e3',
      300: '#d8d2d0',
      400: '#aba09c',
      500: '#7c6d67',
      600: '#5b4f4b',
      700: '#473c39',
      800: '#2b2422',
      900: '#1d1816',
      950: '#0c0a09',
    },
  },
  {
    name: 'mauve',
    shades: {
      50: '#fafafa',
      100: '#f3f1f3',
      200: '#e7e4e7',
      300: '#d7d0d7',
      400: '#a89ea9',
      500: '#79697b',
      600: '#594c5b',
      700: '#463947',
      800: '#2a212c',
      900: '#1d161e',
      950: '#0c090c',
    },
  },
  {
    name: 'mist',
    shades: {
      50: '#f9fbfb',
      100: '#f1f3f3',
      200: '#e3e7e8',
      300: '#d0d6d8',
      400: '#9ca8ab',
      500: '#67787c',
      600: '#4b585b',
      700: '#394447',
      800: '#22292b',
      900: '#161b1d',
      950: '#090b0c',
    },
  },
  {
    name: 'olive',
    shades: {
      50: '#fbfbf9',
      100: '#f4f4f0',
      200: '#e8e8e3',
      300: '#d8d8d0',
      400: '#abab9c',
      500: '#7c7c67',
      600: '#5b5b4b',
      700: '#474739',
      800: '#2b2b22',
      900: '#1d1d16',
      950: '#0c0c09',
    },
  },
]

export const baseColors = [
  { name: 'white', hex: '#ffffff' },
  { name: 'black', hex: '#000000' },
] as const

const byHex = new Map<string, string>()
for (const f of tailwindPalette)
  for (const s of SHADES) byHex.set(f.shades[s].toLowerCase(), `${f.name}-${s}`)
for (const c of baseColors) byHex.set(c.hex, c.name)

export function paletteName(hex: string | undefined | null) {
  return hex ? byHex.get(hex.toLowerCase()) : undefined
}

export function resolvePaletteName(name: string) {
  const n = name.trim().toLowerCase()
  const base = baseColors.find((c) => c.name === n)
  if (base) return base.hex
  const m = /^([a-z]+)-(\d{2,3})$/.exec(n)
  const family = m && tailwindPalette.find((f) => f.name === m[1])
  const shade = m ? (Number(m[2]) as Shade) : null
  return family && shade && SHADES.includes(shade) ? family.shades[shade] : null
}

export type GradientKind = 'linear' | 'radial' | 'conic'
export type GradientStop = { color: string; alpha: number; pos: number }
export type Gradient = {
  kind: GradientKind
  angle: number
  cx: number
  cy: number
  stops: GradientStop[]
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const round = (n: number, places = 1) => Math.round(n * 10 ** places) / 10 ** places
const hex2 = (n: number) =>
  Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, '0')

export function parseColor(
  input: string | undefined | null,
): { hex: string; alpha: number } | null {
  if (!input) return null
  const s = input.trim().toLowerCase()
  const h = /^#([0-9a-f]{3,8})$/.exec(s)
  if (h) {
    let v = h[1]
    if (v.length === 3 || v.length === 4)
      v = v
        .split('')
        .map((c) => c + c)
        .join('')
    if (v.length === 6) return { hex: `#${v}`, alpha: 1 }
    if (v.length === 8)
      return { hex: `#${v.slice(0, 6)}`, alpha: round(parseInt(v.slice(6), 16) / 255, 3) }
    return null
  }
  const r =
    /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/.exec(s)
  if (r) {
    const a =
      r[4] === undefined ? 1 : r[4].endsWith('%') ? parseFloat(r[4]) / 100 : parseFloat(r[4])
    return { hex: `#${hex2(+r[1])}${hex2(+r[2])}${hex2(+r[3])}`, alpha: clamp(a, 0, 1) }
  }
  return null
}

export function withAlpha(hex: string, alpha: number) {
  const base = /^#[0-9a-f]{6}/i.exec(hex)?.[0] ?? '#000000'
  const a = clamp(alpha, 0, 1)
  return a >= 0.999 ? base : `${base}${hex2(a * 255)}`
}

export const isGradient = (v: string | undefined | null): v is string =>
  !!v && /^(linear|radial|conic)-gradient\(/i.test(v.trim())

const stopsCss = (stops: GradientStop[]) =>
  [...stops]
    .sort((a, b) => a.pos - b.pos)
    .map((s) => `${withAlpha(s.color, s.alpha)} ${round(s.pos)}%`)
    .join(', ')

export function stringifyGradient(g: Gradient) {
  const stops = stopsCss(g.stops)
  if (g.kind === 'linear') return `linear-gradient(${round(g.angle)}deg, ${stops})`
  if (g.kind === 'radial')
    return `radial-gradient(ellipse at ${round(g.cx)}% ${round(g.cy)}%, ${stops})`
  return `conic-gradient(from ${round(g.angle)}deg at ${round(g.cx)}% ${round(g.cy)}%, ${stops})`
}

function splitTopLevel(s: string) {
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of s) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

function parseStops(body: string): GradientStop[] | null {
  const parts = splitTopLevel(body)
  const stops: GradientStop[] = []
  for (const part of parts) {
    const m = /^(#[0-9a-f]{3,8}|rgba?\([^)]*\))\s+(-?[\d.]+)%$/i.exec(part)
    const c = m && parseColor(m[1])
    if (!m || !c) return null
    stops.push({ color: c.hex, alpha: c.alpha, pos: parseFloat(m[2]) })
  }
  return stops.length >= 2 ? stops.sort((x, y) => x.pos - y.pos) : null
}

export function parseGradient(css: string | undefined | null): Gradient | null {
  if (!isGradient(css)) return null
  const s = css.trim()
  let m = /^linear-gradient\(\s*(-?[\d.]+)deg\s*,\s*([\s\S]*)\)$/i.exec(s)
  if (m) {
    const stops = parseStops(m[2])
    return stops ? { kind: 'linear', angle: parseFloat(m[1]), cx: 50, cy: 50, stops } : null
  }
  m =
    /^radial-gradient\(\s*(?:ellipse|circle)?\s*at\s+([\d.]+)%\s+([\d.]+)%\s*,\s*([\s\S]*)\)$/i.exec(
      s,
    )
  if (m) {
    const stops = parseStops(m[3])
    return stops
      ? { kind: 'radial', angle: 0, cx: parseFloat(m[1]), cy: parseFloat(m[2]), stops }
      : null
  }
  m =
    /^conic-gradient\(\s*from\s+(-?[\d.]+)deg\s+at\s+([\d.]+)%\s+([\d.]+)%\s*,\s*([\s\S]*)\)$/i.exec(
      s,
    )
  if (m) {
    const stops = parseStops(m[4])
    return stops
      ? {
          kind: 'conic',
          angle: parseFloat(m[1]),
          cx: parseFloat(m[2]),
          cy: parseFloat(m[3]),
          stops,
        }
      : null
  }
  return null
}

export function defaultGradient(kind: GradientKind, from?: string): Gradient {
  const c = parseColor(from) ?? { hex: '#18181b', alpha: 1 }
  return {
    kind,
    angle: kind === 'conic' ? 0 : 135,
    cx: 50,
    cy: 50,
    stops: [
      { color: c.hex, alpha: c.alpha, pos: 0 },
      { color: c.hex === '#ffffff' ? '#3b82f6' : '#ffffff', alpha: 1, pos: 100 },
    ],
  }
}

export function colorAt(stops: GradientStop[], pos: number): { color: string; alpha: number } {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos)
  if (pos <= sorted[0].pos) return { color: sorted[0].color, alpha: sorted[0].alpha }
  const last = sorted[sorted.length - 1]
  if (pos >= last.pos) return { color: last.color, alpha: last.alpha }
  const i = sorted.findIndex((s) => s.pos >= pos)
  const a = sorted[i - 1]
  const b = sorted[i]
  const t = (pos - a.pos) / Math.max(0.0001, b.pos - a.pos)
  const ca = parseColor(a.color)!
  const cb = parseColor(b.color)!
  const mix = (x: number, y: number) => x + (y - x) * t
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16)
  return {
    color: `#${[0, 1, 2].map((k) => hex2(mix(ch(ca.hex, k), ch(cb.hex, k)))).join('')}`,
    alpha: round(mix(a.alpha, b.alpha), 3),
  }
}
