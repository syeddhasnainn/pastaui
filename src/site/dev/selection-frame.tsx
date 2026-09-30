import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

import { box, topRect, type Box } from '#/site/dev/documents'
import type { GridSettings } from '#/site/dev/grid'
import {
  collectTargets,
  hideDrag,
  showDrag,
  snapAxis,
  type DragLayer,
  type Guide,
  type Targets,
} from '#/site/dev/snap'
import type { SizingMode } from '#/site/dev/sizing'
import type { Editor } from '#/site/dev/use-editor'
import type { Values } from '#/site/dev/values'
import { cn } from '#/lib/utils'

const handles = [
  { name: 'nw', className: '-top-1 -left-1 cursor-nwse-resize' },
  { name: 'n', className: '-top-1 left-1/2 -ml-1 cursor-ns-resize' },
  { name: 'ne', className: '-top-1 -right-1 cursor-nesw-resize' },
  { name: 'e', className: 'top-1/2 -right-1 -mt-1 cursor-ew-resize' },
  { name: 'se', className: '-right-1 -bottom-1 cursor-nwse-resize' },
  { name: 's', className: '-bottom-1 left-1/2 -ml-1 cursor-ns-resize' },
  { name: 'sw', className: '-bottom-1 -left-1 cursor-nesw-resize' },
  { name: 'w', className: 'top-1/2 -left-1 -mt-1 cursor-ew-resize' },
]

interface ResizeState {
  handle: string
  hugX: boolean
  hugY: boolean
  latest: PointerEvent
  moved: boolean
  padX: number
  padY: number
  patch: Partial<Values>
  offset: { dx: number; dy: number }
  origin: Box
  scaleX: number
  scaleY: number
  startX: number
  startY: number
  targets: Targets
}

interface SelectionFrameProps {
  editor: Pick<Editor, 'beginGesture' | 'commitResize' | 'placeAt' | 'previewPatch'>
  element: HTMLElement
  grid: GridSettings
  layer: DragLayer
  sizing: { x: SizingMode; y: SizingMode }
}

function stepped(value: number, step: number) {
  return Math.max(0, Math.round(value / step) * step)
}

function paddingFor(state: ResizeState, grid: GridSettings) {
  const { handle, latest } = state
  const dx = latest.clientX - state.startX
  const dy = latest.clientY - state.startY
  const divisor = latest.altKey ? 1 : 2
  const free = latest.ctrlKey || latest.metaKey
  const stepX = free ? 1 : 4
  const stepY = free ? 1 : grid.enabled && grid.rowHeight ? grid.rowHeight / 2 : 4
  const x = handle.includes('e') ? dx : handle.includes('w') ? -dx : 0
  const y = handle.includes('s') ? dy : handle.includes('n') ? -dy : 0
  return {
    x: stepped(state.padX + x / divisor, stepX),
    y: stepped(state.padY + y / divisor, stepY),
  }
}

function edgesFor(state: ResizeState, grid: GridSettings, guides: Guide[]) {
  const { handle, latest, origin, targets } = state
  const dx = latest.clientX - state.startX
  const dy = latest.clientY - state.startY
  const centre = latest.altKey
  const snapping = !(latest.ctrlKey || latest.metaKey)
  const east = handle.includes('e')
  const west = handle.includes('w')
  const south = handle.includes('s')
  const north = handle.includes('n')
  let { left, right, top, bottom } = origin

  function moveX(delta: number) {
    if (east) right += delta
    if (west) left += delta
    if (centre) {
      if (east) left -= delta
      if (west) right -= delta
    }
  }

  function moveY(delta: number) {
    if (south) bottom += delta
    if (north) top += delta
    if (centre) {
      if (south) top -= delta
      if (north) bottom -= delta
    }
  }

  moveX(dx)
  moveY(dy)
  if (snapping && (east || west)) {
    const hit = snapAxis([east ? right : left], targets.x, 0, grid.threshold)
    if (hit) {
      moveX(hit.delta)
      guides.push({ axis: 'x', kind: hit.target.kind, pos: hit.target.pos })
    }
  }
  if (snapping && (north || south)) {
    const hit = snapAxis([south ? bottom : top], targets.y, targets.baseline, grid.threshold)
    if (hit) {
      moveY(hit.delta)
      guides.push({ axis: 'y', kind: hit.target.kind, pos: hit.target.pos })
    }
  }
  if (latest.shiftKey && origin.width && origin.height) {
    const ratio = origin.width / origin.height
    const horizontal = east || west
    const vertical = north || south
    let width = right - left
    let height = bottom - top
    const widthLeads =
      horizontal &&
      (!vertical || Math.abs(width / origin.width) >= Math.abs(height / origin.height))
    if (widthLeads) height = width / ratio
    else width = height * ratio
    const centreX = (origin.left + origin.right) / 2
    const centreY = (origin.top + origin.bottom) / 2
    if (centre || !horizontal) [left, right] = [centreX - width / 2, centreX + width / 2]
    else if (west) left = right - width
    else right = left + width
    if (centre || !vertical) [top, bottom] = [centreY - height / 2, centreY + height / 2]
    else if (north) top = bottom - height
    else bottom = top + height
  }
  return box(left, top, Math.max(1, right - left), Math.max(1, bottom - top))
}

export function SelectionFrame({ editor, element, grid, layer, sizing }: SelectionFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const resize = useRef<ResizeState | null>(null)
  const animation = useRef(0)

  useEffect(() => {
    let frame = 0
    const loop = () => {
      const node = frameRef.current
      if (node) {
        const rect = topRect(element)
        const visible = element.isConnected && (rect.width > 0 || rect.height > 0)
        node.style.display = visible ? 'block' : 'none'
        node.style.transform = `translate(${rect.left}px, ${rect.top}px)`
        node.style.width = `${rect.width}px`
        node.style.height = `${rect.height}px`
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(animation.current)
    }
  }, [element])

  function render() {
    animation.current = 0
    const state = resize.current
    if (!state) return
    const guides: Guide[] = []
    const next = edgesFor(state, grid, guides)
    const horizontal = /[ew]/.test(state.handle)
    const vertical = /[ns]/.test(state.handle)
    const padding = paddingFor(state, grid)
    const patch: Partial<Values> = {}
    if (horizontal && state.hugX) {
      patch.paddingLeft = padding.x
      patch.paddingRight = padding.x
    } else if (horizontal) patch.width = Math.round(next.width * state.scaleX)
    if (vertical && state.hugY) {
      patch.paddingTop = padding.y
      patch.paddingBottom = padding.y
    } else if (vertical) patch.height = Math.round(next.height * state.scaleY)
    state.patch = patch
    editor.previewPatch(element, patch)
    editor.placeAt(element, state.offset)
    const actual = topRect(element)
    state.offset = {
      dx: state.offset.dx + (horizontal && !state.hugX ? next.left - actual.left : 0),
      dy: state.offset.dy + (vertical && !state.hugY ? next.top - actual.top : 0),
    }
    editor.placeAt(element, state.offset)
    const shown = topRect(element)
    const size = `${Math.round(shown.width)} × ${Math.round(shown.height)}`
    const hugging = (horizontal && state.hugX) || (vertical && state.hugY)
    showDrag(
      layer,
      hugging ? shown : next,
      hugging ? `px ${padding.x} · py ${padding.y} → ${size}` : size,
      hugging ? [] : guides,
    )
  }

  function start(event: ReactPointerEvent<HTMLDivElement>, handle: string) {
    if (event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    const origin = topRect(element)
    const style = element.ownerDocument.defaultView?.getComputedStyle(element)
    const width = Number.parseFloat(style?.width ?? '') || origin.width
    const height = Number.parseFloat(style?.height ?? '') || origin.height
    resize.current = {
      handle,
      hugX: sizing.x === 'hug',
      hugY: sizing.y === 'hug',
      latest: event.nativeEvent,
      moved: false,
      padX: Number.parseFloat(style?.paddingLeft ?? '') || 0,
      padY: Number.parseFloat(style?.paddingTop ?? '') || 0,
      patch: {},
      offset: editor.beginGesture(element, 'resize'),
      origin,
      scaleX: origin.width ? width / origin.width : 1,
      scaleY: origin.height ? height / origin.height : 1,
      startX: event.clientX,
      startY: event.clientY,
      targets: collectTargets(element, grid),
    }
  }

  function move(event: ReactPointerEvent<HTMLDivElement>) {
    const state = resize.current
    if (!state) return
    state.latest = event.nativeEvent
    state.moved = true
    if (!animation.current) animation.current = requestAnimationFrame(render)
  }

  function end() {
    const state = resize.current
    if (!state) return
    cancelAnimationFrame(animation.current)
    if (state.moved) render()
    resize.current = null
    hideDrag(layer)
    if (state.moved) editor.commitResize(element, state.patch, state.offset)
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-2147483550 hidden outline-1 outline-[oklch(62.6%_0.205_254.947)] outline-solid"
      ref={frameRef}
    >
      {handles.map((handle) => (
        <div
          className={cn(
            'pointer-events-auto absolute size-2 touch-none rounded-[2px] border border-[oklch(62.6%_0.205_254.947)] bg-white',
            handle.className,
          )}
          data-handle={handle.name}
          key={handle.name}
          onLostPointerCapture={end}
          onPointerDown={(event) => start(event, handle.name)}
          onPointerMove={move}
          onPointerUp={end}
        />
      ))}
    </div>
  )
}
