import type { Box } from '#/site/dev/documents'

export type GridColor = 'blue' | 'red' | 'neutral'

export interface GridSettings {
  color: GridColor
  columns: number
  enabled: boolean
  golden: boolean
  gutter: number
  margin: number
  maxWidth: number
  numbers: boolean
  opacity: number
  preset: string
  rowHeight: number
  rows: number
  threshold: number
}

export interface GridLayout {
  baseline: number
  columns: { end: number; start: number }[]
  height: number
  width: number
  xLines: number[]
  yLines: number[]
}

export interface GridMeaning {
  baselineRow?: number
  columns?: number
  span?: number
  startColumn?: number
  text: string
  wasColumn?: number
}

const storageKey = 'pastaui-design-inspector-grid'

const layoutDefaults = {
  columns: 0,
  golden: false,
  gutter: 0,
  margin: 0,
  maxWidth: 0,
  rowHeight: 0,
  rows: 0,
}

export const gridPresets: { name: string; settings: Partial<GridSettings> }[] = [
  { name: '12 columns · 24px gutter', settings: { columns: 12, gutter: 24, margin: 24 } },
  {
    name: '12 columns · 1200 container',
    settings: { columns: 12, gutter: 24, margin: 24, maxWidth: 1200 },
  },
  { name: '16 columns', settings: { columns: 16, gutter: 16, margin: 24 } },
  { name: '8 columns · tablet', settings: { columns: 8, gutter: 16, margin: 24 } },
  { name: '4 columns · mobile', settings: { columns: 4, gutter: 16, margin: 16 } },
  { name: '6 columns', settings: { columns: 6, gutter: 24, margin: 24 } },
  { name: '8pt baseline', settings: { rowHeight: 8 } },
  { name: '4pt baseline', settings: { rowHeight: 4 } },
  { name: 'Rule of thirds', settings: { columns: 3, rows: 3 } },
  { name: 'Golden ratio', settings: { golden: true } },
  { name: '960 grid · 12 columns', settings: { columns: 12, gutter: 20, maxWidth: 960 } },
  { name: '960 grid · 16 columns', settings: { columns: 16, gutter: 20, maxWidth: 960 } },
]

export const defaultGrid: GridSettings = {
  ...layoutDefaults,
  ...gridPresets[0]?.settings,
  color: 'blue',
  enabled: false,
  numbers: true,
  opacity: 1,
  preset: gridPresets[0]?.name ?? 'Custom',
  threshold: 8,
}

export function applyPreset(settings: GridSettings, name: string): GridSettings {
  const preset = gridPresets.find((item) => item.name === name)
  if (!preset) return { ...settings, preset: 'Custom' }
  return { ...settings, ...layoutDefaults, ...preset.settings, preset: name, enabled: true }
}

export function loadGrid(): GridSettings {
  try {
    const stored = window.localStorage.getItem(storageKey)
    return stored
      ? { ...defaultGrid, ...(JSON.parse(stored) as Partial<GridSettings>) }
      : defaultGrid
  } catch {
    return defaultGrid
  }
}

export function saveGrid(settings: GridSettings) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings))
  } catch {
    return
  }
}

export function gridLayout(
  settings: GridSettings,
  width = document.documentElement.clientWidth,
  height = window.innerHeight,
): GridLayout {
  const xLines: number[] = []
  const yLines: number[] = []
  const columns: GridLayout['columns'] = []
  if (settings.golden) {
    const minor = 1 / 1.618 ** 2
    xLines.push(width * minor, width * (1 - minor))
    yLines.push(height * minor, height * (1 - minor))
  }
  if (settings.columns > 0) {
    const available = Math.max(0, width - settings.margin * 2)
    const inner = settings.maxWidth ? Math.min(settings.maxWidth, available) : available
    const left = (width - inner) / 2
    const column = (inner - settings.gutter * (settings.columns - 1)) / settings.columns
    for (let index = 0; index < settings.columns; index++) {
      const start = left + index * (column + settings.gutter)
      columns.push({ start, end: start + column })
      xLines.push(start, start + column)
    }
    xLines.push(width / 2)
  }
  if (settings.rows > 0)
    for (let index = 0; index <= settings.rows; index++)
      yLines.push((height / settings.rows) * index)
  return { baseline: settings.rowHeight, columns, height, width, xLines, yLines }
}

export function columnPitch(settings: GridSettings, layout: GridLayout) {
  const [first, second] = layout.columns
  if (first && second) return second.start - first.start
  return settings.gutter + (first ? first.end - first.start : 0) || 8
}

export function rowPitch(settings: GridSettings, layout: GridLayout) {
  if (settings.rowHeight) return settings.rowHeight
  if (settings.rows) return layout.height / settings.rows
  return 8
}

function nearestColumn(layout: GridLayout, position: number, edge: 'start' | 'end') {
  const index = layout.columns.findIndex((column) => Math.abs(column[edge] - position) <= 2)
  return index === -1 ? undefined : index + 1
}

export function gridMeaning(
  settings: GridSettings,
  layout: GridLayout,
  rect: Box,
  original: Box,
): GridMeaning | null {
  if (!settings.enabled) return null
  const parts: string[] = []
  const meaning: GridMeaning = { text: '' }
  const start = nearestColumn(layout, rect.left, 'start')
  const end = nearestColumn(layout, rect.right, 'end')
  if (start) {
    const was = nearestColumn(layout, original.left, 'start')
    const span = end && end >= start ? end - start + 1 : undefined
    Object.assign(meaning, {
      columns: layout.columns.length,
      span,
      startColumn: start,
      wasColumn: was,
    })
    parts.push(
      `now starts at column ${start}${span ? ` and spans ${span} column${span > 1 ? 's' : ''}` : ''} of the ${layout.columns.length}-col grid${was && was !== start ? ` (was column ${was})` : ''}`,
    )
  }
  if (settings.rowHeight) {
    const row = Math.round(rect.top / settings.rowHeight)
    if (Math.abs(row * settings.rowHeight - rect.top) <= 1) {
      meaning.baselineRow = row
      parts.push(`top aligned to baseline row ${row} (${settings.rowHeight}px grid)`)
    }
  }
  if (!parts.length) return null
  meaning.text = parts.join('; ')
  return meaning
}
