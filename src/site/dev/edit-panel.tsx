import { useId, useState, type KeyboardEvent } from 'react'
import ArrowDownIcon from '~icons/solar/arrow-down-linear'
import ArrowUpIcon from '~icons/solar/arrow-up-linear'
import TrashIcon from '~icons/solar/trash-bin-minimalistic-linear'

import { cascadeCap, type Scope } from '#/site/dev/cascade'
import { ColorField, NumberRow, Section, Segmented, Slider } from '#/site/dev/controls'
import {
  ancestors,
  elementLabel,
  layerLabel,
  protectedReason,
  type Selection,
} from '#/site/dev/inspect'
import { Layers } from '#/site/dev/layers'
import type { LoggedElement } from '#/site/dev/log'
import { SizePanel } from '#/site/dev/size-panel'
import type { Axis, SizingMode } from '#/site/dev/sizing'
import {
  buttonClass,
  fieldClass,
  focusRing,
  hairline,
  hintClass,
  ink,
  labelText,
  muted,
  panelId,
  tabId,
} from '#/site/dev/styles'
import { Tabs } from '#/site/dev/tabs'
import type { Key, Values } from '#/site/dev/values'
import { cn } from '#/lib/utils'

const transforms = ['none', 'uppercase', 'lowercase', 'capitalize']
const tabStorageKey = 'pastaui-design-inspector-edit-tab'

type SectionId = 'type' | 'color' | 'size' | 'border' | 'position'

const sections: { id: SectionId; label: string; keys: Key[] }[] = [
  {
    id: 'type',
    label: 'Type',
    keys: ['family', 'size', 'weight', 'tracking', 'leading', 'transform'],
  },
  { id: 'color', label: 'Color', keys: ['color', 'background'] },
  {
    id: 'size',
    label: 'Size',
    keys: [
      'width',
      'height',
      'minWidth',
      'minHeight',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'gap',
      'display',
    ],
  },
  {
    id: 'border',
    label: 'Border',
    keys: [
      'radiusTopLeft',
      'radiusTopRight',
      'radiusBottomRight',
      'radiusBottomLeft',
      'borderWidth',
    ],
  },
  { id: 'position', label: 'Position', keys: [] },
]

function readTab(): SectionId {
  try {
    const stored = window.localStorage.getItem(tabStorageKey)
    return sections.some((section) => section.id === stored) ? (stored as SectionId) : 'type'
  } catch {
    return 'type'
  }
}

function writeTab(tab: SectionId) {
  try {
    window.localStorage.setItem(tabStorageKey, tab)
  } catch {
    return
  }
}

function hasChanges(section: (typeof sections)[number], entry: LoggedElement | undefined) {
  if (!entry) return false
  if (section.id === 'position') return Boolean(entry.moved)
  if (section.id === 'size' && entry.sizing) return true
  const keys = new Set(section.keys)
  return [...entry.changes, ...(entry.cascades ?? [])].some((change) => keys.has(change.key))
}

const scopeOptions: { id: Scope; label: string; title: string }[] = [
  { id: 'self', label: 'This element', title: 'This element' },
  { id: 'proportional', label: 'Proportional', title: 'All text inside · proportional' },
  { id: 'exact', label: 'Exact', title: 'All text inside · exact' },
]

const scopeHints: Record<Scope, string> = {
  self: 'Edits apply to this element only.',
  proportional:
    'Font size and line height scale every text element inside by the same ratio; other properties are set on each one.',
  exact: 'Every text element inside gets the exact value.',
}

interface EditPanelProps {
  entry: LoggedElement | undefined
  onChild: () => void
  onCopy: (text: string, message: string) => void
  onDelete: () => void
  onHug: () => void
  onOffset: (offset: { dx: number; dy: number }) => void
  onParent: () => void
  onPatch: (patch: Partial<Values>) => void
  onPreview: (element: HTMLElement | null) => void
  onResetElement: () => void
  onResetMove: (id: string) => void
  onScope: (scope: Scope) => void
  onSelect: (element: HTMLElement) => void
  onSet: <K extends Key>(key: K, value: Values[K]) => void
  onSizing: (axis: Axis, mode: SizingMode) => void
  hasChild: boolean
  hasParent: boolean
  scope: Scope
  selection: Selection | null
  sizing: { x: SizingMode; y: SizingMode } | null
  values: Values | null
}

export function EditPanel(props: EditPanelProps) {
  const { entry, selection, values } = props
  const idBase = useId()
  const [tab, setTab] = useState<SectionId>(readTab)

  function choose(next: SectionId) {
    setTab(next)
    writeTab(next)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start gap-1.5 px-3 pb-2">
        <div className="min-w-0 flex-1">
          {selection ? (
            <Breadcrumb
              onPreview={props.onPreview}
              onSelect={props.onSelect}
              selection={selection}
            />
          ) : (
            <p className={cn(hintClass, 'py-0.5')}>Click an element on the page to select it.</p>
          )}
        </div>
        {selection ? (
          <>
            <button
              aria-label="Select parent"
              className={cn(buttonClass, 'size-6 shrink-0 px-0')}
              disabled={!props.hasParent}
              onClick={props.onParent}
              title="Select parent ([ or Alt+↑)"
              type="button"
            >
              <ArrowUpIcon aria-hidden="true" className="size-3.5" />
            </button>
            <button
              aria-label="Select child"
              className={cn(buttonClass, 'size-6 shrink-0 px-0')}
              disabled={!props.hasChild}
              onClick={props.onChild}
              title="Select child (] , Enter or Alt+↓)"
              type="button"
            >
              <ArrowDownIcon aria-hidden="true" className="size-3.5" />
            </button>
          </>
        ) : null}
        <HelpButton />
      </div>
      {selection ? (
        <Layers
          key={selection.meta.id}
          onPreview={props.onPreview}
          onSelect={props.onSelect}
          selected={selection.element}
        />
      ) : null}
      {selection && values ? (
        <>
          <div className={cn('border-t-[0.5px] px-3 pt-2 pb-2', hairline)}>
            <Tabs
              idBase={idBase}
              label="Edit sections"
              onChange={choose}
              tabs={sections.map((section) => ({
                id: section.id,
                label: section.label,
                dot: hasChanges(section, entry),
              }))}
              value={tab}
            />
          </div>
          <div
            aria-labelledby={tabId(idBase, tab)}
            className={cn(
              'h-[min(380px,calc(100dvh-380px))] min-h-40 overflow-y-auto overscroll-contain border-t-[0.5px]',
              hairline,
              focusRing,
            )}
            id={panelId(idBase, tab)}
            role="tabpanel"
            tabIndex={0}
          >
            <SectionContent {...props} selection={selection} tab={tab} values={values} />
          </div>
          <EditActions
            deleteReason={protectedReason(selection.element)}
            entry={entry}
            onCopy={props.onCopy}
            onDelete={props.onDelete}
            onResetElement={props.onResetElement}
          />
        </>
      ) : null}
    </div>
  )
}

interface SectionContentProps extends EditPanelProps {
  selection: Selection
  tab: SectionId
  values: Values
}

function SectionContent(props: SectionContentProps) {
  const { selection, tab, values } = props
  const scope = selection.text.nodes.length ? (
    <ScopeControl
      label={layerLabel(selection.element)}
      onScope={props.onScope}
      scope={props.scope}
      text={selection.text}
    />
  ) : null
  if (tab === 'type')
    return (
      <>
        {scope}
        <FontSection
          fonts={selection.fonts}
          key={`font-${selection.meta.id}`}
          onSet={props.onSet}
          values={values}
        />
      </>
    )
  if (tab === 'color')
    return (
      <>
        {scope}
        <Section>
          <p className={labelText}>Text</p>
          <ColorField
            key={`color-${selection.meta.id}`}
            label="Text colour"
            onChange={(next) => props.onSet('color', next)}
            value={values.color}
          />
          <p className={cn(labelText, 'pt-2')}>Background</p>
          {scope && props.scope !== 'self' ? (
            <p className={hintClass}>Background always applies to this element only.</p>
          ) : null}
          <ColorField
            key={`background-${selection.meta.id}`}
            label="Background colour"
            onChange={(next) => props.onSet('background', next)}
            value={values.background}
          />
        </Section>
      </>
    )
  if (tab === 'position')
    return (
      <PositionSection
        entry={props.entry}
        key={`position-${selection.meta.id}`}
        onOffset={props.onOffset}
        onResetMove={props.onResetMove}
      />
    )
  return (
    <>
      <SizePanel
        element={selection.element}
        key={`${tab}-${selection.meta.id}`}
        onHug={props.onHug}
        onPatch={props.onPatch}
        onSet={props.onSet}
        onSizing={props.onSizing}
        part={tab}
        sizing={props.sizing ?? { x: 'hug', y: 'hug' }}
        values={values}
      />
      {tab === 'size' ? (
        <p className={cn(hintClass, 'px-3 pb-3')}>
          Resize with the handles (in Hug they change padding): Shift keeps the ratio, Alt resizes
          from the centre, Ctrl/Cmd turns snapping off.
        </p>
      ) : null}
    </>
  )
}

interface ScopeControlProps {
  label: string
  onScope: (scope: Scope) => void
  scope: Scope
  text: Selection['text']
}

function ScopeControl({ label, onScope, scope, text }: ScopeControlProps) {
  const skipped = text.total - text.nodes.length

  return (
    <div className={'grid gap-1.5 px-3 py-2.5'} data-scope="">
      <p className={cn(labelText, 'flex justify-between gap-2')}>
        <span className="truncate">{`Apply to · ${label}`}</span>
        <span className="shrink-0 tabular-nums">{`${text.total} text inside`}</span>
      </p>
      <Segmented label="Edit scope" onChange={onScope} options={scopeOptions} value={scope} />
      <p className={hintClass}>{scopeHints[scope]}</p>
      {skipped > 0 && scope !== 'self' ? (
        <p className="text-[11px] leading-4 font-[500] text-amber-700 dark:text-amber-400">
          {`Capped at ${cascadeCap} text elements: ${skipped} will be skipped.`}
        </p>
      ) : null}
    </div>
  )
}

function HelpButton() {
  const [open, setOpen] = useState(false)
  const id = useId()

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'Escape' || !open) return
    event.stopPropagation()
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        aria-controls={id}
        aria-expanded={open}
        aria-label="How editing works"
        className={cn(buttonClass, 'size-6 rounded-full px-0 text-[11px]')}
        data-escape-local=""
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        type="button"
      >
        ?
      </button>
      {open ? (
        <div
          className={cn(
            'absolute top-7 right-0 z-10 w-64 rounded-lg border-[0.5px] bg-white p-2.5 text-[11px] leading-4 shadow-lg dark:bg-neutral-900',
            hairline,
            ink,
          )}
          id={id}
          role="note"
        >
          Click to select, drag to move (Alt: no snapping, Shift: lock axis). Alt+click selects the
          parent, double-click goes one level deeper, Cmd/Ctrl+click uses the page, Esc deselects,
          Alt+S pauses. [ or Alt+↑ selects the parent, ], Enter or Alt+↓ the child. Arrow keys nudge
          1px (Shift: 8px or one grid unit), Delete hides, Ctrl/Cmd+Z undoes.
        </div>
      ) : null}
    </div>
  )
}

interface BreadcrumbProps {
  onPreview: (element: HTMLElement | null) => void
  onSelect: (element: HTMLElement) => void
  selection: Selection
}

function Breadcrumb({ onPreview, onSelect, selection }: BreadcrumbProps) {
  const chain = ancestors(selection.element).map((element, depth) => ({ depth, element }))
  const visible = chain.slice(-4)

  return (
    <nav aria-label="Selected element path">
      <ol
        className="flex [scrollbar-width:none] flex-nowrap items-center gap-x-1 overflow-x-auto font-mono text-[11px] leading-5 whitespace-nowrap"
        ref={(node) => {
          if (node) node.scrollLeft = node.scrollWidth
        }}
      >
        {selection.meta.previewSlug ? (
          <li className={cn('shrink-0', muted)}>{`preview/${selection.meta.previewSlug} ›`}</li>
        ) : null}
        {chain.length > visible.length ? <li className={cn('shrink-0', muted)}>… ›</li> : null}
        {visible.map(({ depth, element }) => {
          const current = element === selection.element
          return (
            <li className="flex shrink-0 items-center gap-1" key={depth}>
              <button
                aria-current={current ? 'true' : undefined}
                className={cn(
                  'max-w-[120px] truncate rounded px-0.5 hover:bg-neutral-900/6 dark:hover:bg-neutral-100/10',
                  current ? cn(ink, 'font-[600]') : muted,
                  focusRing,
                )}
                onBlur={() => onPreview(null)}
                onClick={() => onSelect(element)}
                onFocus={() => onPreview(element)}
                onPointerEnter={() => onPreview(element)}
                onPointerLeave={() => onPreview(null)}
                title={layerLabel(element)}
                type="button"
              >
                {elementLabel(element)}
              </button>
              {current ? null : (
                <span aria-hidden="true" className={muted}>
                  ›
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

interface PositionSectionProps {
  entry: LoggedElement | undefined
  onOffset: EditPanelProps['onOffset']
  onResetMove: EditPanelProps['onResetMove']
}

function PositionSection({ entry, onOffset, onResetMove }: PositionSectionProps) {
  const dx = entry?.moved?.dx ?? 0
  const dy = entry?.moved?.dy ?? 0

  return (
    <Section>
      <NumberRow label="Δx" onChange={(next) => onOffset({ dx: next, dy })} unit="px" value={dx} />
      <NumberRow label="Δy" onChange={(next) => onOffset({ dx, dy: next })} unit="px" value={dy} />
      <p className={cn(hintClass, 'tabular-nums')}>
        {entry?.moved?.grid?.text ??
          'Drag on the page or use the arrow keys: 1px, Shift for 8px or one grid unit.'}
      </p>
      <button
        className={buttonClass}
        disabled={!entry?.moved}
        onClick={() => entry && onResetMove(entry.id)}
        type="button"
      >
        Reset position
      </button>
    </Section>
  )
}

interface FontSectionProps {
  fonts: Selection['fonts']
  onSet: EditPanelProps['onSet']
  values: Values
}

function FontSection({ fonts, onSet, values }: FontSectionProps) {
  return (
    <Section>
      <label className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
        <span className={labelText}>Family</span>
        <select
          className={cn(fieldClass, 'min-w-0')}
          onChange={(event) => onSet('family', event.currentTarget.value)}
          value={values.family}
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
      <Slider
        label="Size"
        max={128}
        min={8}
        onChange={(next) => onSet('size', next)}
        step={1}
        stepper={{
          decrease: 'Decrease font size',
          increase: 'Increase font size',
          onStep: (delta) =>
            onSet('size', Math.max(1, Math.round((values.size + delta) * 100) / 100)),
        }}
        unit="px"
        value={values.size}
      />
      <Slider
        label="Weight"
        max={900}
        min={100}
        onChange={(next) => onSet('weight', next)}
        step={1}
        value={values.weight}
      />
      <Slider
        label="Tracking"
        max={0.3}
        min={-0.1}
        onChange={(next) => onSet('tracking', next)}
        step={0.005}
        unit="em"
        value={values.tracking}
      />
      <Slider
        label="Line height"
        max={2.5}
        min={0.8}
        onChange={(next) => onSet('leading', next)}
        step={0.05}
        value={values.leading}
      />
      <label className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
        <span className={labelText}>Transform</span>
        <select
          className={cn(fieldClass, 'min-w-0')}
          onChange={(event) => onSet('transform', event.currentTarget.value)}
          value={values.transform}
        >
          {transforms.map((transform) => (
            <option key={transform} value={transform}>
              {transform}
            </option>
          ))}
        </select>
      </label>
    </Section>
  )
}

interface EditActionsProps {
  deleteReason: string | null
  entry: LoggedElement | undefined
  onCopy: EditPanelProps['onCopy']
  onDelete: () => void
  onResetElement: () => void
}

function EditActions({ deleteReason, entry, onCopy, onDelete, onResetElement }: EditActionsProps) {
  const tailwind = entry?.changes.map((change) => change.tailwind).join(' ') ?? ''
  const css = entry?.changes.map((change) => `${change.property}: ${change.after};`).join('\n')

  return (
    <div className={cn('grid shrink-0 gap-1.5 border-t-[0.5px] px-3 py-2', hairline)}>
      {tailwind ? (
        <code
          className={cn(
            'truncate rounded-md bg-neutral-900/4 px-2 py-1 font-mono text-[10.5px] leading-4 dark:bg-neutral-100/6',
            muted,
          )}
          title={tailwind}
        >
          {tailwind}
        </code>
      ) : null}
      <div className="grid grid-cols-4 gap-1">
        <button
          className={cn(buttonClass, 'px-1 text-[11px]')}
          disabled={!entry?.changes.length}
          onClick={() => onCopy(css ?? '', 'Copied CSS')}
          type="button"
        >
          Copy CSS
        </button>
        <button
          aria-label="Copy Tailwind"
          className={cn(buttonClass, 'px-1 text-[11px]')}
          disabled={!entry?.changes.length}
          onClick={() => onCopy(tailwind, 'Copied Tailwind')}
          type="button"
        >
          Copy TW
        </button>
        <button
          aria-label="Reset element"
          className={cn(buttonClass, 'px-1 text-[11px]')}
          disabled={!entry}
          onClick={onResetElement}
          type="button"
        >
          Reset
        </button>
        <button
          aria-disabled={deleteReason ? true : undefined}
          aria-label="Delete element"
          className={cn(buttonClass, 'px-1 text-[11px] aria-disabled:opacity-45')}
          onClick={() => {
            if (!deleteReason) onDelete()
          }}
          title={deleteReason ?? 'Hide this element (Delete key, undo with Ctrl/Cmd+Z)'}
          type="button"
        >
          <TrashIcon aria-hidden="true" className="size-3.5" />
          Delete
        </button>
      </div>
    </div>
  )
}
