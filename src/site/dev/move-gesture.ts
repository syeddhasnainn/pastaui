import { box, injectStyle, topRect, type Box } from '#/site/dev/documents'
import type { GridSettings } from '#/site/dev/grid'
import {
  collectTargets,
  hideDrag,
  showDrag,
  snapAxis,
  type DragLayer,
  type Guide,
} from '#/site/dev/snap'
import type { Editor } from '#/site/dev/use-editor'

const noSelect = '* { user-select: none !important; -webkit-user-select: none !important; }'
const threshold = 3

export interface GestureOptions {
  doc: Document
  editor: Pick<Editor, 'beginGesture' | 'commitMove' | 'placeAt'>
  event: PointerEvent
  grid: GridSettings
  layer: DragLayer
  onClick: (event: PointerEvent) => void
  onDragStart: () => HTMLElement | null
  onEnd: () => void
}

function capture(element: Element, pointerId: number) {
  try {
    element.setPointerCapture(pointerId)
  } catch {
    return false
  }
  return true
}

function shifted(rect: Box, x: number, y: number) {
  return box(rect.left + x, rect.top + y, rect.width, rect.height)
}

function snapGuides(
  latest: PointerEvent,
  origin: Box,
  grid: GridSettings,
  targets: ReturnType<typeof collectTargets>,
  x: number,
  y: number,
) {
  const guides: Guide[] = []
  const lockX = latest.shiftKey && Math.abs(x) < Math.abs(y)
  const lockY = latest.shiftKey && !lockX
  let dx = lockX ? 0 : x
  let dy = lockY ? 0 : y
  if (latest.altKey) return { dx, dy, guides }
  const rect = shifted(origin, dx, dy)
  const snapX = lockX
    ? null
    : snapAxis([rect.left, rect.left + rect.width / 2, rect.right], targets.x, 0, grid.threshold)
  const snapY = lockY
    ? null
    : snapAxis(
        [rect.top, rect.top + rect.height / 2, rect.bottom],
        targets.y,
        targets.baseline,
        grid.threshold,
      )
  if (snapX) {
    dx += snapX.delta
    guides.push({ axis: 'x', kind: snapX.target.kind, pos: snapX.target.pos })
  }
  if (snapY) {
    dy += snapY.delta
    guides.push({ axis: 'y', kind: snapY.target.kind, pos: snapY.target.pos })
  }
  return { dx, dy, guides }
}

export function trackGesture({
  doc,
  editor,
  event,
  grid,
  layer,
  onClick,
  onDragStart,
  onEnd,
}: GestureOptions) {
  const startX = event.clientX
  const startY = event.clientY
  let dragged: HTMLElement | null = null
  let frame = 0
  let latest = event
  let base = { dx: 0, dy: 0 }
  let offset = base
  let origin = box(0, 0, 0, 0)
  let targets = { baseline: 0, x: [], y: [] } as ReturnType<typeof collectTargets>
  let transition = ''
  let releaseSelect = () => {}

  const render = () => {
    frame = 0
    if (!dragged) return
    const next = snapGuides(
      latest,
      origin,
      grid,
      targets,
      latest.clientX - startX,
      latest.clientY - startY,
    )
    offset = { dx: base.dx + next.dx, dy: base.dy + next.dy }
    editor.placeAt(dragged, offset)
    showDrag(
      layer,
      shifted(origin, next.dx, next.dy),
      `Δx ${Math.round(offset.dx)} · Δy ${Math.round(offset.dy)}`,
      next.guides,
    )
  }

  const begin = (next: PointerEvent) => {
    dragged = onDragStart()
    if (!dragged) return
    base = editor.beginGesture(dragged, 'move')
    offset = base
    origin = topRect(dragged)
    targets = collectTargets(dragged, grid)
    transition = dragged.style.getPropertyValue('transition')
    dragged.style.setProperty('transition', 'none')
    releaseSelect = injectStyle(doc, noSelect)
    capture(dragged, next.pointerId)
  }

  const onMove = (next: PointerEvent) => {
    latest = next
    if (!dragged) {
      if (Math.hypot(next.clientX - startX, next.clientY - startY) < threshold) return
      begin(next)
      if (!dragged) return
    }
    next.preventDefault()
    if (!frame) frame = requestAnimationFrame(render)
  }

  const onUp = (next: PointerEvent) => {
    doc.removeEventListener('pointermove', onMove, true)
    doc.removeEventListener('pointerup', onUp, true)
    doc.removeEventListener('pointercancel', onUp, true)
    window.removeEventListener('pointerup', onUp, true)
    if (!dragged) {
      if (next.type === 'pointerup') onClick(event)
      onEnd()
      return
    }
    cancelAnimationFrame(frame)
    latest = next
    render()
    if (transition) dragged.style.setProperty('transition', transition)
    else dragged.style.removeProperty('transition')
    releaseSelect()
    hideDrag(layer)
    editor.commitMove(dragged, offset)
    onEnd()
  }

  doc.addEventListener('pointermove', onMove, true)
  doc.addEventListener('pointerup', onUp, true)
  doc.addEventListener('pointercancel', onUp, true)
  window.addEventListener('pointerup', onUp, true)
}
