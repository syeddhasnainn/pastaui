import { useId, useState } from 'react'
import AltArrowRightIcon from '~icons/solar/alt-arrow-right-linear'

import { ancestors, isElement, layerLabel } from '#/site/dev/inspect'
import { activeClass, focusRing, hairline, labelText, muted } from '#/site/dev/styles'
import { cn } from '#/lib/utils'

const storageKey = 'pastaui-design-inspector-layers'
const levelCap = 60
const hiddenTags = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'LINK', 'META'])

interface LayersProps {
  onPreview: (element: HTMLElement | null) => void
  onSelect: (element: HTMLElement) => void
  selected: HTMLElement
}

function readOpen() {
  try {
    return window.localStorage.getItem(storageKey) === 'open'
  } catch {
    return false
  }
}

function writeOpen(open: boolean) {
  try {
    window.localStorage.setItem(storageKey, open ? 'open' : 'closed')
  } catch {
    return
  }
}

function layerChildren(element: HTMLElement) {
  if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml') return []
  return [...element.children].filter(
    (child): child is HTMLElement =>
      isElement(child) &&
      !hiddenTags.has(child.tagName) &&
      !child.hasAttribute('data-design-inspector'),
  )
}

export function Layers({ onPreview, onSelect, selected }: LayersProps) {
  const [open, setOpen] = useState(readOpen)
  const id = useId()
  const path = ancestors(selected)
  const [root] = path

  function toggle() {
    setOpen(!open)
    writeOpen(!open)
  }

  return (
    <div className={cn('border-t-[0.5px] px-3 py-1.5', hairline)}>
      <button
        aria-controls={id}
        aria-expanded={open}
        className={cn('flex h-6 w-full items-center gap-1 rounded', labelText, focusRing)}
        onClick={toggle}
        type="button"
      >
        <AltArrowRightIcon
          aria-hidden="true"
          className={cn(
            'size-3 transition-transform motion-reduce:transition-none',
            open && 'rotate-90',
          )}
        />
        Layers
      </button>
      {open && root ? (
        <ul
          aria-label="Layers"
          className="max-h-44 overflow-auto overscroll-contain pb-1"
          id={id}
          onPointerLeave={() => onPreview(null)}
        >
          <LayerNode
            depth={0}
            element={root}
            onPreview={onPreview}
            onSelect={onSelect}
            path={path}
            selected={selected}
          />
        </ul>
      ) : null}
    </div>
  )
}

interface LayerNodeProps extends LayersProps {
  depth: number
  element: HTMLElement
  path: HTMLElement[]
}

const layerIds = new WeakMap<Element, number>()
let nextLayerId = 0

function layerId(element: Element) {
  let id = layerIds.get(element)
  if (id === undefined) {
    id = nextLayerId++
    layerIds.set(element, id)
  }
  return id
}

interface LayerRowProps {
  childCount: number
  current: boolean
  depth: number
  element: HTMLElement
  expanded: boolean
  onPreview: LayersProps['onPreview']
  onSelect: LayersProps['onSelect']
  onToggle: () => void
  onPath: boolean
}

function LayerRow({
  childCount,
  current,
  depth,
  element,
  expanded,
  onPath,
  onPreview,
  onSelect,
  onToggle,
}: LayerRowProps) {
  const label = layerLabel(element)
  const open = expanded || onPath

  return (
    <div
      className={cn(
        'flex h-6 items-center gap-0.5 rounded pr-1',
        current ? activeClass : 'hover:bg-neutral-900/5 dark:hover:bg-neutral-100/8',
      )}
      style={{ paddingLeft: depth * 10 }}
    >
      {childCount ? (
        <button
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${label}`}
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded',
            muted,
            focusRing,
          )}
          onClick={onToggle}
          type="button"
        >
          <AltArrowRightIcon
            aria-hidden="true"
            className={cn('size-3', open && 'rotate-90', !expanded && onPath && 'opacity-50')}
          />
        </button>
      ) : (
        <span aria-hidden="true" className="size-5 shrink-0" />
      )}
      <button
        aria-current={current ? 'true' : undefined}
        className={cn(
          'min-w-0 flex-1 truncate rounded px-0.5 text-left text-[11px] leading-5',
          current && 'font-[600]',
          focusRing,
        )}
        data-layer=""
        onBlur={() => onPreview(null)}
        onClick={() => onSelect(element)}
        onFocus={() => onPreview(element)}
        onPointerEnter={() => onPreview(element)}
        ref={(node) => {
          if (node && current) node.scrollIntoView({ block: 'nearest' })
        }}
        title={label}
        type="button"
      >
        {label}
        {expanded || !childCount ? null : (
          <span className={cn('ml-1 tabular-nums', muted)}>{childCount}</span>
        )}
      </button>
    </div>
  )
}

function LayerNode({ depth, element, onPreview, onSelect, path, selected }: LayerNodeProps) {
  const current = element === selected
  const next = path[path.indexOf(element) + 1]
  const onPath = path.includes(element) && Boolean(next)
  const [expanded, setExpanded] = useState(current)
  const children = layerChildren(element)
  const shown = expanded ? children.slice(0, levelCap) : onPath && next ? [next] : []
  const more = expanded ? children.length - shown.length : 0

  return (
    <li>
      <LayerRow
        childCount={children.length}
        current={current}
        depth={depth}
        element={element}
        expanded={expanded}
        onPath={onPath}
        onPreview={onPreview}
        onSelect={onSelect}
        onToggle={() => setExpanded(!expanded)}
      />
      {shown.length ? (
        <ul>
          {shown.map((child) => (
            <LayerNode
              depth={depth + 1}
              element={child}
              key={layerId(child)}
              onPreview={onPreview}
              onSelect={onSelect}
              path={path}
              selected={selected}
            />
          ))}
          {more > 0 ? (
            <li
              className={cn('h-5 text-[10.5px] leading-5', muted)}
              style={{ paddingLeft: depth * 10 + 32 }}
            >
              {`…and ${more} more`}
            </li>
          ) : null}
        </ul>
      ) : null}
    </li>
  )
}
