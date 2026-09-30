import type { CascadeMode } from '#/site/dev/cascade'
import type { GridMeaning } from '#/site/dev/grid'
import type { ElementMeta } from '#/site/dev/inspect'
import { sizingLine, type Sizing } from '#/site/dev/sizing'
import { radiusClass, spacingClass, textSizeClass } from '#/site/dev/tailwind'
import { paddingKeys, radiusKeys, type Key } from '#/site/dev/values'

export interface LoggedChange {
  key: Key
  property: string
  before: string
  beforeRaw: string
  after: string
  tailwind: string
}

export interface Moved {
  dx: number
  dy: number
  grid: GridMeaning | null
}

export interface CascadeChild {
  label: string
  selector: string
  before: string
  after: string
}

export interface LoggedCascade {
  key: Key
  property: string
  mode: CascadeMode
  label: string
  before: string
  after: string
  ratio: number | null
  tailwind: string
  count: number
  skipped: number
  file: string | null
  owner: string | null
  children: CascadeChild[]
}

export interface LoggedElement extends ElementMeta {
  cascades?: LoggedCascade[]
  changes: LoggedChange[]
  moved?: Moved
  removed?: boolean
  sizing?: Sizing
}

function keep(entry: LoggedElement) {
  return (
    entry.changes.length > 0 ||
    Boolean(entry.cascades?.length) ||
    Boolean(entry.removed) ||
    Boolean(entry.moved) ||
    Boolean(entry.sizing)
  )
}

function update(
  log: LoggedElement[],
  meta: ElementMeta,
  change: (entry: LoggedElement) => LoggedElement,
) {
  const existing = log.find((entry) => entry.id === meta.id)
  const next = change(existing ?? { ...meta, changes: [] })
  if (!existing) return keep(next) ? [...log, next] : log
  return log.flatMap((entry) => {
    if (entry.id !== meta.id) return [entry]
    return keep(next) ? [next] : []
  })
}

export function upsertChange(log: LoggedElement[], meta: ElementMeta, change: LoggedChange) {
  return update(log, meta, (entry) => {
    const previous = entry.changes.find((item) => item.key === change.key)
    return {
      ...entry,
      changes: previous
        ? entry.changes.map((item) =>
            item.key === change.key
              ? { ...change, before: previous.before, beforeRaw: previous.beforeRaw }
              : item,
          )
        : [...entry.changes, change],
    }
  })
}

export function dropChange(log: LoggedElement[], meta: ElementMeta, key: Key) {
  return update(log, meta, (entry) => ({
    ...entry,
    changes: entry.changes.filter((item) => item.key !== key),
  }))
}

export function upsertCascade(log: LoggedElement[], meta: ElementMeta, cascade: LoggedCascade) {
  return update(log, meta, (entry) => {
    const others = (entry.cascades ?? []).filter((item) => item.key !== cascade.key)
    return { ...entry, cascades: [...others, cascade] }
  })
}

export function dropCascade(log: LoggedElement[], meta: ElementMeta, key: Key) {
  return update(log, meta, (entry) => {
    const cascades = (entry.cascades ?? []).filter((item) => item.key !== key)
    return { ...entry, cascades: cascades.length ? cascades : undefined }
  })
}

export function setRemoved(log: LoggedElement[], meta: ElementMeta, removed: boolean) {
  return update(log, meta, (entry) => ({ ...entry, removed: removed || undefined }))
}

export function setMoved(log: LoggedElement[], meta: ElementMeta, moved: Moved | null) {
  return update(log, meta, (entry) => ({ ...entry, moved: moved ?? undefined }))
}

export function withSizing(log: LoggedElement[], meta: ElementMeta, sizing: Sizing | null) {
  return update(log, meta, (entry) => ({ ...entry, sizing: sizing ?? undefined }))
}

export function refreshPadding(log: LoggedElement[], id: string, padding: string) {
  return log.map((entry) =>
    entry.id === id && entry.sizing ? { ...entry, sizing: { ...entry.sizing, padding } } : entry,
  )
}

export function replaceEntry(log: LoggedElement[], id: string, entry: LoggedElement | undefined) {
  if (!log.some((item) => item.id === id)) return entry ? [...log, entry] : log
  return log.flatMap((item) => (item.id !== id ? [item] : entry ? [entry] : []))
}

const groups = [
  { keys: [...paddingKeys], label: 'padding', tailwind: (px: number) => spacingClass('p', px) },
  {
    keys: ['paddingLeft', 'paddingRight'],
    label: 'padding-left/right',
    tailwind: (px: number) => spacingClass('px', px),
  },
  {
    keys: ['paddingTop', 'paddingBottom'],
    label: 'padding-top/bottom',
    tailwind: (px: number) => spacingClass('py', px),
  },
  {
    keys: [...radiusKeys],
    label: 'border-radius',
    tailwind: (px: number) => radiusClass('rounded', px),
  },
]

function changeLine(property: string, before: string, after: string, tailwind: string) {
  return `   - ${property}: ${before} → ${after} (Tailwind: ${tailwind})`
}

function changeLines(changes: LoggedChange[]) {
  const remaining = new Map(changes.map((change) => [change.key, change]))
  const lines: string[] = []
  for (const group of groups) {
    const members = group.keys.map((key) => remaining.get(key as Key))
    const [first] = members
    const same = members.every(
      (member) => member && member.before === first?.before && member.after === first?.after,
    )
    if (!first || !same) continue
    lines.push(
      changeLine(
        group.label,
        first.before,
        first.after,
        group.tailwind(Number.parseFloat(first.after)),
      ),
    )
    for (const key of group.keys) remaining.delete(key as Key)
  }
  return [
    ...lines,
    ...[...remaining.values()].map((change) =>
      changeLine(change.property, change.before, change.after, change.tailwind),
    ),
  ]
}

function plural(total: number, word: string) {
  return `${total} ${word}${total === 1 ? '' : 's'}`
}

export function cascadeSummary(cascade: LoggedCascade) {
  const on = `on ${plural(cascade.count, 'element')}`
  const detail =
    cascade.key === 'size' || cascade.key === 'leading'
      ? `${cascade.mode === 'exact' ? '=' : `×${cascade.ratio ?? 1}`} (${cascade.before} → ${cascade.after} ${on})`
      : `${cascade.before} → ${cascade.after} (${on})`
  return `${cascade.label} → all text inside: ${cascade.property} ${detail}`
}

function sizeExamples(cascade: LoggedCascade) {
  const pairs = new Map<string, string>()
  for (const item of [{ before: cascade.before, after: cascade.after }, ...cascade.children]) {
    const from = textSizeClass(Number.parseFloat(item.before))
    const to = textSizeClass(Number.parseFloat(item.after))
    if (from !== to) pairs.set(from, to)
  }
  return [...pairs]
    .slice(0, 3)
    .map(([from, to]) => `${from} → ${to}`)
    .join(', ')
}

const noun: Partial<Record<Key, string>> = {
  family: 'font family',
  weight: 'font weight',
  tracking: 'letter spacing',
  leading: 'line height',
  transform: 'text transform',
  color: 'text colour',
}

function sizeIntent(cascade: LoggedCascade, target: string) {
  const grow = Number.parseFloat(cascade.after) > Number.parseFloat(cascade.before)
  const range = `(${cascade.before} → ${cascade.after})`
  const examples = sizeExamples(cascade)
  const classes = `Update the component's text classes${examples ? ` (e.g. ${examples})` : ''} rather than adding per-element overrides.`
  if (cascade.mode === 'exact')
    return `Set all text in ${target} to ${cascade.after} (container was ${cascade.before}). ${classes}`
  return `${grow ? 'Increase' : 'Decrease'} all text in ${target} by ×${cascade.ratio ?? 1} ${range}, keeping each element's relative size. ${classes}`
}

export function cascadeIntent(cascade: LoggedCascade) {
  const target = `the ${cascade.label}`
  if (cascade.key === 'size') return sizeIntent(cascade, target)
  const what = noun[cascade.key] ?? cascade.property
  const classes = `Update the component's text classes (e.g. ${cascade.tailwind}) rather than adding per-element overrides.`
  if (cascade.key === 'leading' && cascade.mode === 'proportional')
    return `Scale the ${what} of all text in ${target} by ×${cascade.ratio ?? 1} (container ${cascade.before} → ${cascade.after}, unitless so it follows each element's font size). ${classes}`
  return `Set the ${what} of all text in ${target} to ${cascade.after} (container was ${cascade.before}). ${classes}`
}

export function cascadeFile(entry: ElementMeta, cascade: LoggedCascade) {
  if (cascade.file) return `${cascade.file}${cascade.owner ? ` (${cascade.owner})` : ''}`
  if (cascade.owner) return `component ${cascade.owner}`
  if (entry.sourceHint) return entry.sourceHint
  return `page ${entry.url}, selector ${entry.selector}`
}

function cascadeLines(entry: LoggedElement) {
  return (entry.cascades ?? []).flatMap((cascade) => [
    `   - ${cascadeIntent(cascade)}`,
    `     Where: ${cascadeFile(entry, cascade)}`,
    `     ${cascadeSummary(cascade)}${cascade.skipped ? `; ${cascade.skipped} more text elements were over the ${cascade.count}-element cap and left unchanged` : ''}:`,
    ...cascade.children
      .slice(0, 12)
      .map(
        (child) => `       - ${child.label} (${child.selector}): ${child.before} → ${child.after}`,
      ),
    ...(cascade.children.length > 12 ? [`       - …and ${cascade.children.length - 12} more`] : []),
  ])
}

export function moveSummary({ dx, dy }: Moved) {
  const horizontal = dx ? `${Math.abs(dx)}px ${dx > 0 ? 'right' : 'left'}` : ''
  const vertical = dy ? `${Math.abs(dy)}px ${dy > 0 ? 'down' : 'up'}` : ''
  return [horizontal, vertical].filter(Boolean).join(' and ')
}

function moveLine(moved: Moved) {
  const grid = moved.grid ? `${moved.grid.text}; ` : ''
  return `   - Move this element: ${grid}shift it ${moveSummary(moved)} (Δx ${moved.dx}px, Δy ${moved.dy}px). Implement with layout (grid/flex/margins/gap), not transforms.`
}

function describeLine(entry: LoggedElement, index: number) {
  const parts = [
    `${index}. ${entry.removed ? 'Remove this element' : 'Element'}: ${entry.tag}${entry.text ? ` "${entry.text}"` : ''}`,
    `selector: ${entry.selector}`,
  ]
  if (entry.classes)
    parts.push(
      `classes: ${entry.classes.length > 100 ? `${entry.classes.slice(0, 100)}…` : entry.classes}`,
    )
  if (entry.component)
    parts.push(`component: ${entry.component}${entry.sourceHint ? ` (${entry.sourceHint})` : ''}`)
  else if (entry.sourceHint) parts.push(`source: ${entry.sourceHint}`)
  if (entry.previewSlug) parts.push(`inside preview iframe /preview/${entry.previewSlug}`)
  if (entry.dataSlot) parts.push(`nearest ${entry.dataSlot}`)
  return parts.join(' — ')
}

export function toMarkdown(log: LoggedElement[]) {
  const pages = new Map<string, LoggedElement[]>()
  for (const entry of log) pages.set(entry.url, [...(pages.get(entry.url) ?? []), entry])
  const sections = [...pages].map(([url, entries]) =>
    [
      `Design changes (from dev inspector) on ${url}:`,
      ...entries.flatMap((entry, index) => [
        describeLine(entry, index + 1),
        ...(entry.removed
          ? []
          : [
              ...[entry.sizing ? sizingLine(entry.sizing, entry.classes) : null].filter(
                (line): line is string => Boolean(line),
              ),
              ...cascadeLines(entry),
              ...changeLines(entry.changes),
              ...(entry.moved ? [moveLine(entry.moved)] : []),
            ]),
      ]),
    ].join('\n'),
  )
  return `${sections.join('\n\n')}\n\nApply these to the source component so they persist; match the existing class style.`
}

export function toJson(log: LoggedElement[]) {
  return JSON.stringify(
    log.map((item) => {
      const { id: _id, cascades, changes, ...entry } = item
      return {
        ...entry,
        changes: changes.map(({ key: _key, ...change }) => change),
        ...(cascades?.length
          ? {
              cascades: cascades.map((cascade) => {
                const { key: _key, ...rest } = cascade
                return {
                  intent: cascadeIntent(cascade),
                  where: cascadeFile(item, cascade),
                  summary: cascadeSummary(cascade),
                  ...rest,
                }
              }),
            }
          : {}),
      }
    }),
    null,
    2,
  )
}
