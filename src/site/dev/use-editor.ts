import { useEffect, useEffectEvent, useRef, useState } from 'react'

import {
  cascadeValue,
  formatKey,
  isCascadeKey,
  readKey,
  sameValue,
  textDescendants,
  type CascadeKey,
  type CascadeMode,
  type Scope,
} from '#/site/dev/cascade'
import { isTyping, topRect, box } from '#/site/dev/documents'
import { columnPitch, gridLayout, gridMeaning, rowPitch, type GridSettings } from '#/site/dev/grid'
import {
  describe,
  fontOptions,
  isElement,
  layerLabel,
  protectedReason,
  readSession,
  relativeSelector,
  restoreElement,
  restoreProperty,
  sourceFile,
  writeSession,
  type ElementMeta,
  type Selection,
} from '#/site/dev/inspect'
import { paddingClasses, type Axis, type Sizing, type SizingMode } from '#/site/dev/sizing'
import {
  dropCascade,
  dropChange,
  refreshPadding,
  withSizing,
  replaceEntry,
  setMoved,
  setRemoved,
  upsertCascade,
  upsertChange,
  type LoggedElement,
} from '#/site/dev/log'
import {
  cssProperty,
  cssValue,
  readValues,
  tailwindClass,
  type Key,
  type RawValues,
  type Values,
} from '#/site/dev/values'

const logKey = 'pastaui-design-inspector-log'

interface Offset {
  dx: number
  dy: number
}

interface Live {
  base: string | null
  before: Values
  meta: ElementMeta
  move: Offset
  raw: RawValues
  style: string | null
}

interface CascadeNode {
  base: Values[CascadeKey]
  before: string
  element: HTMLElement
  label: string
  selector: string
  style: string | null
}

interface Session {
  base: Values[CascadeKey]
  container: HTMLElement
  file: string | null
  key: CascadeKey
  label: string
  meta: ElementMeta
  nodes: CascadeNode[]
  owner: string | null
  skipped: number
}

interface Snapshot {
  at: number
  cascade?: {
    key: CascadeKey
    session: Session | undefined
    styles: [HTMLElement, string | null][]
  }
  element: HTMLElement
  entry: LoggedElement | undefined
  id: string
  move: Offset
  style: string | null
  tag: string
}

interface CascadeJob {
  mode: CascadeMode
  session: Session
  value: Values[CascadeKey]
}

function firstChild(element: HTMLElement) {
  return (
    [...element.children].find(
      (child): child is HTMLElement =>
        isElement(child) &&
        !child.hasAttribute('data-design-inspector') &&
        !['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'LINK', 'META'].includes(child.tagName),
    ) ?? null
  )
}

function navigation(event: KeyboardEvent, inPanel: boolean) {
  if (event.key === '[' || (event.altKey && event.key === 'ArrowUp')) return 'parent'
  if (event.key === ']' || (event.altKey && event.key === 'ArrowDown')) return 'child'
  if (event.key !== 'Enter' || inPanel || event.altKey) return null
  return event.shiftKey ? 'parent' : 'child'
}

const arrows: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
}

function sizedPatch(patch: Partial<Values>, display: string) {
  const sized =
    (patch.width !== undefined && patch.width !== 'auto') ||
    (patch.height !== undefined && patch.height !== 'auto')
  return sized && display === 'inline' ? { ...patch, display: 'inline-block' } : patch
}

export function useEditor(pathname: string, grid: GridSettings, active: boolean) {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [values, setValues] = useState<Values | null>(null)
  const [log, setLog] = useState<LoggedElement[]>(() => readSession(logKey, []))
  const [page, setPage] = useState(pathname)
  const [scope, setScope] = useState<Scope>('self')
  const live = useRef(new Map<HTMLElement, Live>())
  const origins = useRef(new Map<HTMLElement, string | null>())
  const sessions = useRef<Session[]>([])
  const history = useRef<Snapshot[]>([])
  const logRef = useRef(log)
  const deepest = useRef<HTMLElement | null>(null)
  const job = useRef<CascadeJob | null>(null)
  const frame = useRef(0)

  if (page !== pathname) {
    setPage(pathname)
    setSelection(null)
    setValues(null)
  }

  useEffect(() => {
    logRef.current = log
    writeSession(logKey, log)
  }, [log])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function select(element: HTMLElement) {
    flushCascade()
    const current = readValues(element)
    const existing = live.current.get(element)
    const text = textDescendants(element)
    const trail = deepest.current
    if (!trail || trail.ownerDocument !== element.ownerDocument || !element.contains(trail))
      deepest.current = element
    if (element !== selection?.element) setScope(text.nodes.length ? 'proportional' : 'self')
    setSelection({
      element,
      before: existing?.before ?? current.values,
      raw: existing?.raw ?? current.raw,
      meta:
        existing?.meta ??
        sessions.current.find((session) => session.container === element)?.meta ??
        describe(element),
      fonts: fontOptions(element, current.values.family),
      text,
    })
    setValues(current.values)
  }

  function parentOf(element: HTMLElement) {
    const parent = element.parentElement
    return parent && parent.tagName !== 'HTML' ? parent : null
  }

  function childOf(element: HTMLElement) {
    const trail = deepest.current
    if (!trail || trail === element || !element.contains(trail)) return firstChild(element)
    let child: HTMLElement | null = trail
    while (child && child.parentElement !== element) child = child.parentElement
    return child
  }

  function selectParent() {
    const parent = selection && parentOf(selection.element)
    if (parent) select(parent)
  }

  function selectChild() {
    const child = selection && childOf(selection.element)
    if (child) select(child)
  }

  function deselect() {
    setSelection(null)
    setValues(null)
  }

  function ensureLive(element: HTMLElement) {
    const existing = live.current.get(element)
    if (existing) return existing
    const snapshot =
      selection?.element === element
        ? { values: selection.before, raw: selection.raw }
        : readValues(element)
    if (!origins.current.has(element)) origins.current.set(element, element.getAttribute('style'))
    const entry: Live = {
      base: null,
      before: snapshot.values,
      meta: selection?.element === element ? selection.meta : describe(element),
      move: { dx: 0, dy: 0 },
      raw: snapshot.raw,
      style: element.getAttribute('style'),
    }
    live.current.set(element, entry)
    return entry
  }

  function remember(element: HTMLElement, tag: string) {
    const entry = ensureLive(element)
    const now = Date.now()
    const last = history.current.at(-1)
    if (last && last.element === element && last.tag === tag && now - last.at < 1000) {
      last.at = now
      return
    }
    history.current.push({
      at: now,
      element,
      entry: logRef.current.find((item) => item.id === entry.meta.id),
      id: entry.meta.id,
      move: { ...entry.move },
      style: element.getAttribute('style'),
      tag,
    })
    if (history.current.length > 100) history.current.shift()
  }

  function refresh(element: HTMLElement) {
    if (selection?.element === element) setValues(readValues(element).values)
  }

  function applyPatch(element: HTMLElement, input: Partial<Values>, record = true) {
    const current = selection?.element === element && values ? values : readValues(element).values
    const entry = ensureLive(element)
    const patch = sizedPatch(input, entry.before.display)
    const changed = Object.keys(patch) as Key[]
    if (record) remember(element, `patch:${changed.join()}`)
    const next = { ...current, ...patch }
    const updates = changed.map((key) => {
      const property = cssProperty[key]
      const after = cssValue(key, next)
      const before = cssValue(key, entry.before)
      if (after === before) {
        restoreProperty(element, entry.style, property)
        return { key, change: null }
      }
      element.style.setProperty(property, after)
      return {
        key,
        change: {
          key,
          property,
          before,
          beforeRaw: entry.raw[key],
          after,
          tailwind: tailwindClass(key, next),
        },
      }
    })
    if (selection?.element === element) setValues({ ...readValues(element).values, ...patch })
    const padding = changed.some((key) => key.startsWith('padding'))
      ? paddingClasses({ ...readValues(element).values, ...patch })
      : null
    setLog((log) => {
      const result = updates.reduce(
        (current, { key, change }) =>
          change ? upsertChange(current, entry.meta, change) : dropChange(current, entry.meta, key),
        log,
      )
      return padding ? refreshPadding(result, entry.meta.id, padding) : result
    })
  }

  function startSession(container: HTMLElement, key: CascadeKey): Session {
    const { nodes, total } = textDescendants(container)
    const source = sourceFile(container)
    const meta =
      live.current.get(container)?.meta ??
      (selection?.element === container ? selection.meta : describe(container))
    const cascadeNodes = [container, ...nodes].map((element) => {
      const style = element.getAttribute('style')
      if (!origins.current.has(element)) origins.current.set(element, style)
      const base = readKey(element, key)
      return {
        base,
        before: formatKey(key, base),
        element,
        label: layerLabel(element),
        selector: element === container ? ':scope' : relativeSelector(container, element),
        style,
      }
    })
    return {
      base: cascadeNodes[0]?.base ?? readKey(container, key),
      container,
      file: source?.file ?? null,
      key,
      label: layerLabel(container),
      meta,
      nodes: cascadeNodes,
      owner: source?.owner ?? null,
      skipped: total - nodes.length,
    }
  }

  function writeCascade({ mode, session, value }: CascadeJob) {
    const { key, meta } = session
    const property = cssProperty[key]
    if (sameValue(value, session.base)) {
      for (const node of session.nodes) restoreProperty(node.element, node.style, property)
      setLog((current) => dropCascade(current, meta, key))
      return
    }
    const children = session.nodes.map((node) => {
      const next =
        node.element === session.container
          ? value
          : cascadeValue(key, mode, node.base, session.base, value)
      const after = formatKey(key, next)
      node.element.style.setProperty(property, after)
      return { label: node.label, selector: node.selector, before: node.before, after }
    })
    const { base } = session
    const numeric = typeof value === 'number' && typeof base === 'number'
    const ratio = numeric && base ? Math.round((value / base) * 100) / 100 : null
    const cascade = {
      key,
      property,
      mode,
      label: session.label,
      before: session.nodes[0]?.before ?? '',
      after: formatKey(key, value),
      ratio,
      tailwind: tailwindClass(key, { [key]: value } as unknown as Values),
      count: children.length - 1,
      skipped: session.skipped,
      file: session.file,
      owner: session.owner,
      children: children.slice(1),
    }
    setLog((current) => upsertCascade(current, meta, cascade))
  }

  function flushCascade() {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    const pending = job.current
    job.current = null
    if (pending) writeCascade(pending)
  }

  function cascade(key: CascadeKey, value: Values[CascadeKey], mode: CascadeMode) {
    if (!selection) return
    const container = selection.element
    const existing = sessions.current.find(
      (session) => session.container === container && session.key === key,
    )
    const session = existing ?? startSession(container, key)
    const now = Date.now()
    const tag = `cascade:${key}`
    const last = history.current.at(-1)
    if (last && last.element === container && last.tag === tag && now - last.at < 1000)
      last.at = now
    else {
      history.current.push({
        at: now,
        cascade: {
          key,
          session: existing,
          styles: session.nodes.map((node) => [node.element, node.element.getAttribute('style')]),
        },
        element: container,
        entry: logRef.current.find((item) => item.id === session.meta.id),
        id: session.meta.id,
        move: { ...(live.current.get(container)?.move ?? { dx: 0, dy: 0 }) },
        style: container.getAttribute('style'),
        tag,
      })
      if (history.current.length > 100) history.current.shift()
    }
    if (!existing) sessions.current.push(session)
    job.current = { mode, session, value }
    if (!frame.current) frame.current = requestAnimationFrame(flushCascade)
    setValues((current) => (current ? { ...current, [key]: value } : current))
  }

  function set<K extends Key>(key: K, value: Values[K]) {
    if (!selection) return
    if (scope !== 'self' && isCascadeKey(key) && selection.text.nodes.length)
      cascade(key, value as Values[CascadeKey], scope)
    else applyPatch(selection.element, { [key]: value })
  }

  function patch(input: Partial<Values>) {
    if (selection) applyPatch(selection.element, input)
  }

  function placeAt(element: HTMLElement, offset: Offset) {
    const entry = ensureLive(element)
    if (entry.base === null) {
      const computed = element.ownerDocument.defaultView?.getComputedStyle(element).transform
      entry.base = computed && computed !== 'none' ? computed : ''
    }
    entry.move = { dx: Math.round(offset.dx), dy: Math.round(offset.dy) }
    if (!entry.move.dx && !entry.move.dy) restoreProperty(element, entry.style, 'transform')
    else
      element.style.setProperty(
        'transform',
        `translate(${entry.move.dx}px, ${entry.move.dy}px)${entry.base ? ` ${entry.base}` : ''}`,
      )
    return entry
  }

  function commitMove(element: HTMLElement, offset: Offset) {
    const entry = placeAt(element, offset)
    const { dx, dy } = entry.move
    const rect = topRect(element)
    const original = box(rect.left - dx, rect.top - dy, rect.width, rect.height)
    const moved =
      dx || dy ? { dx, dy, grid: gridMeaning(grid, gridLayout(grid), rect, original) } : null
    setLog((current) => setMoved(current, entry.meta, moved))
  }

  function beginGesture(element: HTMLElement, tag: string) {
    remember(element, `${tag}:${Date.now()}`)
    return { ...ensureLive(element).move }
  }

  function previewPatch(element: HTMLElement, patch: Partial<Values>) {
    const entry = ensureLive(element)
    const sized = sizedPatch(patch, entry.before.display)
    const next = { ...entry.before, ...sized }
    for (const key of Object.keys(sized) as Key[])
      element.style.setProperty(cssProperty[key], cssValue(key, next))
  }

  function commitResize(element: HTMLElement, patch: Partial<Values>, offset: Offset) {
    applyPatch(element, patch, false)
    commitMove(element, offset)
  }

  function setSizingMode(axis: Axis, mode: SizingMode, current: Pick<Sizing, 'x' | 'y'>) {
    if (!selection) return
    const { element } = selection
    const rect = element.getBoundingClientRect()
    const style = element.ownerDocument.defaultView?.getComputedStyle(element)
    const size = axis === 'x' ? 'width' : 'height'
    const minimum = axis === 'x' ? 'minWidth' : 'minHeight'
    const patch: Partial<Values> = {}
    if (mode === 'hug') {
      patch[size] = 'auto'
      if (Number.parseFloat(style?.getPropertyValue(cssProperty[minimum]) ?? '') > 0)
        patch[minimum] = 0
    }
    if (mode === 'fixed') patch[size] = Math.round(axis === 'x' ? rect.width : rect.height)
    if (mode === 'fill') patch[size] = 'fill'
    applyPatch(element, patch)
    const entry = ensureLive(element)
    const sizing = { ...current, [axis]: mode, padding: paddingClasses(readValues(element).values) }
    setLog((log) => withSizing(log, entry.meta, sizing))
  }

  function hugBoth() {
    if (!selection) return
    const { element } = selection
    const style = element.ownerDocument.defaultView?.getComputedStyle(element)
    const patch: Partial<Values> = { width: 'auto', height: 'auto' }
    if (Number.parseFloat(style?.minWidth ?? '') > 0) patch.minWidth = 0
    if (Number.parseFloat(style?.minHeight ?? '') > 0) patch.minHeight = 0
    applyPatch(element, patch)
    const entry = ensureLive(element)
    const sizing: Sizing = {
      x: 'hug',
      y: 'hug',
      padding: paddingClasses(readValues(element).values),
    }
    setLog((log) => withSizing(log, entry.meta, sizing))
  }

  function nudge(x: number, y: number, large: boolean) {
    if (!selection) return
    const { element } = selection
    const layout = gridLayout(grid)
    const stepX = large ? (grid.enabled ? columnPitch(grid, layout) : 8) : 1
    const stepY = large ? (grid.enabled ? rowPitch(grid, layout) : 8) : 1
    remember(element, 'nudge')
    const { move } = ensureLive(element)
    commitMove(element, { dx: move.dx + x * stepX, dy: move.dy + y * stepY })
  }

  function setOffset(offset: Offset) {
    if (!selection) return
    remember(selection.element, 'position')
    commitMove(selection.element, offset)
  }

  function undo() {
    flushCascade()
    const snapshot = history.current.pop()
    if (!snapshot) return false
    const entry = live.current.get(snapshot.element)
    if (snapshot.cascade) {
      const { key, session, styles } = snapshot.cascade
      for (const [element, style] of styles) restoreElement(element, style)
      sessions.current = sessions.current.filter(
        (item) => !(item.container === snapshot.element && item.key === key),
      )
      if (session) sessions.current.push(session)
    }
    restoreElement(snapshot.element, snapshot.style)
    if (entry) entry.move = snapshot.move
    setLog((current) => replaceEntry(current, snapshot.id, snapshot.entry))
    refresh(snapshot.element)
    return true
  }

  function findLive(id: string) {
    return [...live.current].find(([, entry]) => entry.meta.id === id)
  }

  function findEntry(id: string) {
    return log.find((entry) => entry.id === id)
  }

  function removeChange(id: string, key: Key) {
    const found = findLive(id)
    if (found) {
      restoreProperty(found[0], found[1].style, cssProperty[key])
      refresh(found[0])
    }
    const entry = findEntry(id)
    if (entry) setLog((current) => dropChange(current, entry, key))
  }

  function resetMove(id: string) {
    const found = findLive(id)
    if (found) placeAt(found[0], { dx: 0, dy: 0 })
    const entry = findEntry(id)
    if (entry) setLog((current) => setMoved(current, entry, null))
  }

  function restoreSessions(matches: (session: Session) => boolean) {
    const restored = sessions.current.filter(matches)
    for (const session of [...restored].reverse())
      for (const node of session.nodes)
        restoreProperty(node.element, node.style, cssProperty[session.key])
    sessions.current = sessions.current.filter((session) => !matches(session))
    return restored
  }

  function removeEntry(id: string) {
    flushCascade()
    const restored = restoreSessions((session) => session.meta.id === id)
    const found = findLive(id)
    const element = found?.[0] ?? restored[0]?.container
    if (element) {
      restoreElement(element, origins.current.get(element) ?? found?.[1].style ?? null)
      live.current.delete(element)
      history.current = history.current.filter((item) => item.element !== element)
      refresh(element)
    }
    setLog((current) => current.filter((entry) => entry.id !== id))
  }

  function removeCascade(id: string, key: Key) {
    flushCascade()
    const restored = restoreSessions((session) => session.meta.id === id && session.key === key)
    const container = restored[0]?.container
    if (container) {
      history.current = history.current.filter(
        (item) => !(item.element === container && item.cascade?.key === key),
      )
      refresh(container)
    }
    const entry = findEntry(id)
    if (entry) setLog((current) => dropCascade(current, entry, key))
  }

  function resetElement() {
    if (selection) removeEntry(selection.meta.id)
  }

  function resetAll() {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    job.current = null
    for (const [element, style] of origins.current) restoreElement(element, style)
    origins.current.clear()
    sessions.current = []
    live.current.clear()
    history.current = []
    setLog([])
    if (selection) setValues(readValues(selection.element).values)
  }

  function deleteSelected() {
    if (!selection || protectedReason(selection.element)) return
    const { element } = selection
    remember(element, `delete:${Date.now()}`)
    const entry = ensureLive(element)
    element.style.setProperty('display', 'none', 'important')
    setLog((current) => setRemoved(current, entry.meta, true))
    const parent = element.parentElement
    if (parent && parent.tagName !== 'HTML') select(parent)
    else {
      setSelection(null)
      setValues(null)
    }
  }

  function restoreRemoved(id: string) {
    const found = findLive(id)
    if (found) restoreProperty(found[0], found[1].style, 'display')
    const entry = findEntry(id)
    if (entry) setLog((current) => setRemoved(current, entry, false))
  }

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (!active || event.defaultPrevented || isTyping(event.target)) return
    const inPanel =
      isElement(event.target) && Boolean(event.target.closest('[data-design-inspector]'))
    const modifier = event.metaKey || event.ctrlKey
    if (modifier && !event.shiftKey && !event.altKey && event.key.toLowerCase() === 'z') {
      if (undo()) event.preventDefault()
      return
    }
    if (modifier || !selection) return
    const direction = navigation(event, inPanel)
    if (direction) {
      event.preventDefault()
      if (direction === 'parent') selectParent()
      else selectChild()
      return
    }
    if (inPanel || event.altKey) return
    const arrow = arrows[event.key]
    if (arrow) {
      event.preventDefault()
      nudge(arrow[0], arrow[1], event.shiftKey)
      return
    }
    if (event.key !== 'Delete' && event.key !== 'Backspace') return
    if (protectedReason(selection.element)) return
    event.preventDefault()
    deleteSelected()
  })

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => onShortcut(event)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return {
    beginGesture,
    clearLog: () => setLog([]),
    commitMove,
    commitResize,
    deleteSelected,
    deselect,
    log,
    parentOf,
    childOf,
    patch,
    placeAt,
    hugBoth,
    previewPatch,
    removeCascade,
    scope,
    selectChild,
    selectParent,
    setScope,
    setOffset,
    setSizingMode,
    removeChange,
    removeEntry,
    resetAll,
    resetElement,
    resetMove,
    restoreRemoved,
    select,
    selection,
    set,
    values,
  }
}

export type Editor = ReturnType<typeof useEditor>
