import { useRouterState } from '@tanstack/react-router'
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from 'react'
import PaletteIcon from '~icons/solar/palette-linear'

import { ChangesPanel } from '#/site/dev/changes-panel'
import { EditPanel } from '#/site/dev/edit-panel'
import { loadGrid, saveGrid, type GridSettings } from '#/site/dev/grid'
import { PanelHeader } from '#/site/dev/panel-header'
import { GridOverlay } from '#/site/dev/grid-overlay'
import { GridPanel } from '#/site/dev/grid-panel'
import { readSession, writeSession } from '#/site/dev/inspect'
import { PreviewOutline, TextOutlines } from '#/site/dev/outlines'
import { SelectionFrame } from '#/site/dev/selection-frame'
import { currentSizing, type SizingMode } from '#/site/dev/sizing'
import type { DragLayer } from '#/site/dev/snap'
import { activeClass, buttonClass, focusRing, hairline, ink, muted } from '#/site/dev/styles'
import { useCanvas } from '#/site/dev/use-canvas'
import { useEditor, type Editor } from '#/site/dev/use-editor'
import { cn } from '#/lib/utils'

const uiKey = 'pastaui-design-inspector'
const tabClass = 'flex-1 aria-pressed:bg-neutral-900/6 dark:aria-pressed:bg-neutral-100/10'
const tabs = [
  { id: 'edit', label: 'Edit' },
  { id: 'grid', label: 'Grid' },
  { id: 'changes', label: 'Changes' },
] as const

type Tab = (typeof tabs)[number]['id']

interface UiState {
  open: boolean
  x: number
  y: number
}

function subscribe() {
  return () => {}
}

export function DesignInspector() {
  const ready = useSyncExternalStore(
    subscribe,
    () => window.self === window.top,
    () => false,
  )
  return ready ? <Inspector /> : null
}

function DragLayerView({ ghost, guides, label }: DragLayer) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-2147483560"
        ref={guides}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-2147483570 hidden outline-1 outline-offset-0 outline-[oklch(62.6%_0.205_254.947)] outline-dashed"
        ref={ghost}
      >
        <span
          className="absolute top-full left-0 mt-1 rounded-[4px] bg-[oklch(62.6%_0.205_254.947)] px-1.5 py-0.5 font-mono text-[10px] leading-4 whitespace-pre text-white"
          ref={label}
        />
      </div>
    </>
  )
}

interface PanelContentProps {
  editor: Editor
  grid: GridSettings
  onGrid: (settings: GridSettings) => void
  onPreview: (element: HTMLElement | null) => void
  pathname: string
  sizing: { x: SizingMode; y: SizingMode } | null
}

function PanelContent({ editor, grid, onGrid, onPreview, pathname, sizing }: PanelContentProps) {
  const { log, selection } = editor
  const [tab, setTab] = useState<Tab>('edit')
  const [status, setStatus] = useState('')
  const statusTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(statusTimer.current), [])

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(message)
    } catch {
      setStatus('Copy failed')
    }
    window.clearTimeout(statusTimer.current)
    statusTimer.current = window.setTimeout(() => setStatus(''), 1600)
  }

  const changeCount = log.reduce(
    (total, entry) =>
      total +
      entry.changes.length +
      (entry.cascades?.length ?? 0) +
      (entry.removed ? 1 : 0) +
      (entry.moved ? 1 : 0),
    0,
  )

  return (
    <>
      <div className={cn('flex gap-1 border-t-[0.5px] px-3 py-2', hairline)}>
        {tabs.map((item) => (
          <button
            aria-pressed={tab === item.id}
            className={cn(buttonClass, tabClass)}
            key={item.id}
            onClick={() => setTab(item.id)}
            type="button"
          >
            {item.label}
            {item.id === 'changes' ? (
              <span className={cn('tabular-nums', muted)}>{changeCount}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div
        className={cn(
          'min-h-0 flex-1 overscroll-contain',
          tab === 'edit' ? 'flex flex-col' : 'overflow-y-auto',
        )}
      >
        {tab === 'edit' ? (
          <EditPanel
            entry={selection ? log.find((entry) => entry.id === selection.meta.id) : undefined}
            hasChild={Boolean(selection && editor.childOf(selection.element))}
            hasParent={Boolean(selection && editor.parentOf(selection.element))}
            onChild={editor.selectChild}
            onCopy={copy}
            onDelete={editor.deleteSelected}
            onHug={editor.hugBoth}
            onPatch={editor.patch}
            onSizing={(axis, mode) =>
              editor.setSizingMode(axis, mode, sizing ?? { x: 'hug', y: 'hug' })
            }
            onOffset={editor.setOffset}
            onParent={editor.selectParent}
            onPreview={onPreview}
            onResetElement={editor.resetElement}
            onResetMove={editor.resetMove}
            onScope={editor.setScope}
            onSelect={editor.select}
            onSet={editor.set}
            scope={editor.scope}
            selection={selection}
            sizing={sizing}
            values={editor.values}
          />
        ) : null}
        {tab === 'grid' ? <GridPanel onChange={onGrid} settings={grid} /> : null}
        {tab === 'changes' ? (
          <ChangesPanel
            log={log}
            onClear={editor.clearLog}
            onCopy={copy}
            onRemoveCascade={editor.removeCascade}
            onRemoveChange={editor.removeChange}
            onRemoveEntry={editor.removeEntry}
            onResetAll={editor.resetAll}
            onResetMove={editor.resetMove}
            onRestore={editor.restoreRemoved}
            pathname={pathname}
          />
        ) : null}
      </div>

      <output
        aria-live="polite"
        className={cn(
          'block border-t-[0.5px] px-3 py-1.5 text-[11px] leading-4 empty:border-t-0 empty:py-0',
          hairline,
          muted,
        )}
      >
        {status}
      </output>
    </>
  )
}

interface SelectionOverlaysProps {
  active: boolean
  editor: Editor
  grid: GridSettings
  layer: DragLayer
  preview: HTMLElement | null
  sizing: { x: SizingMode; y: SizingMode } | null
}

function SelectionOverlays({
  active,
  editor,
  grid,
  layer,
  preview,
  sizing,
}: SelectionOverlaysProps) {
  const { selection } = editor
  const shown = active ? selection : null
  return (
    <>
      {shown ? (
        <SelectionFrame
          editor={editor}
          element={shown.element}
          grid={grid}
          layer={layer}
          sizing={sizing ?? { x: 'hug', y: 'hug' }}
        />
      ) : null}
      {shown?.text.nodes.length ? <TextOutlines nodes={shown.text.nodes} /> : null}
      <PreviewOutline element={active && preview !== selection?.element ? preview : null} />
    </>
  )
}

function Inspector() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [grid, setGrid] = useState<GridSettings>(loadGrid)
  const [ui, setUi] = useState<UiState>(() => readSession(uiKey, { open: false, x: 0, y: 0 }))
  const [paused, setPaused] = useState(false)
  const [preview, setPreview] = useState<HTMLElement | null>(null)
  const active = ui.open && !paused
  const editor = useEditor(pathname, grid, active)
  const { selection } = editor
  const selectedEntry = selection
    ? editor.log.find((entry) => entry.id === selection.meta.id)
    : undefined
  const sizing =
    selection && editor.values
      ? currentSizing(selection.element, editor.values, selectedEntry?.sizing)
      : null
  const ghost = useRef<HTMLDivElement>(null)
  const guides = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const layer: DragLayer = { ghost, guides, label }
  const { overlay, overlayLabel } = useCanvas({
    active,
    editor,
    grid,
    layer,
    selected: selection?.element ?? null,
  })

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (!event.altKey || event.ctrlKey || event.metaKey) return
    if (event.code === 'KeyG') {
      event.preventDefault()
      setGrid((current) => ({ ...current, enabled: !current.enabled }))
    }
    if (event.code !== 'KeyS') return
    event.preventDefault()
    if (ui.open) setPaused((current) => !current)
    else {
      setUi((current) => ({ ...current, open: true }))
      setPaused(false)
    }
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKey(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  useEffect(() => writeSession(uiKey, ui), [ui])
  useEffect(() => saveGrid(grid), [grid])

  return (
    <div className="font-sans" data-design-inspector="">
      {grid.enabled ? <GridOverlay settings={grid} /> : null}
      <SelectionOverlays
        active={active}
        editor={editor}
        grid={grid}
        layer={layer}
        preview={preview}
        sizing={sizing}
      />
      <DragLayerView ghost={ghost} guides={guides} label={label} />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-2147483600 hidden rounded-[2px] border border-[oklch(62.6%_0.205_254.947)] bg-[oklch(62.6%_0.205_254.947/0.08)]"
        ref={overlay}
      >
        <span
          className="absolute bottom-full left-[-1px] mb-1 rounded-[4px] bg-[oklch(62.6%_0.205_254.947)] px-1.5 py-0.5 font-mono text-[10px] leading-4 whitespace-pre text-white data-[inside=true]:top-0 data-[inside=true]:bottom-auto data-[inside=true]:mb-0"
          ref={overlayLabel}
        />
      </div>

      {ui.open ? (
        <section
          aria-label="Design inspector"
          className={cn(
            'fixed right-4 bottom-17 z-2147483647 flex max-h-[min(680px,calc(100dvh-88px))] w-[320px] flex-col overflow-hidden rounded-xl border-[0.5px] bg-white text-[12px] shadow-[0_18px_48px_-16px_rgb(0_0_0/0.28),0_2px_8px_rgb(0_0_0/0.06)] dark:bg-neutral-900 dark:shadow-[0_18px_48px_-16px_rgb(0_0_0/0.7)]',
            hairline,
            ink,
          )}
          style={{ transform: `translate(${ui.x}px, ${ui.y}px)` }}
        >
          <PanelHeader
            offset={ui}
            onCollapse={() => setUi((current) => ({ ...current, open: false }))}
            onMove={(x, y) => setUi((current) => ({ ...current, x, y }))}
            onTogglePause={() => setPaused((current) => !current)}
            paused={paused}
          />

          <PanelContent
            editor={editor}
            sizing={sizing}
            grid={grid}
            onGrid={setGrid}
            onPreview={setPreview}
            pathname={pathname}
          />
        </section>
      ) : null}

      <button
        aria-expanded={ui.open}
        aria-label={ui.open ? 'Hide design inspector' : 'Open design inspector'}
        className={cn(
          'fixed right-4 bottom-4 z-2147483647 flex size-10 items-center justify-center rounded-full border-[0.5px] bg-white shadow-[0_8px_24px_-8px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.08)] transition-[background-color] hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800',
          hairline,
          ink,
          focusRing,
          active && activeClass,
        )}
        onClick={() => setUi((current) => ({ ...current, open: !current.open }))}
        type="button"
      >
        <PaletteIcon aria-hidden="true" className="size-5" />
      </button>
    </div>
  )
}
