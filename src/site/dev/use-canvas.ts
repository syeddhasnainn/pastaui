import { useEffect, useEffectEvent, useRef } from 'react'

import { frameOffset, isTyping, listenToDocuments, outside } from '#/site/dev/documents'
import type { GridSettings } from '#/site/dev/grid'
import { elementLabel, isElement, protectedReason } from '#/site/dev/inspect'
import { trackGesture } from '#/site/dev/move-gesture'
import type { DragLayer } from '#/site/dev/snap'
import type { Editor } from '#/site/dev/use-editor'

const blockedEvents = ['mousedown', 'mouseup', 'pointerup', 'click', 'auxclick', 'dblclick']

interface CanvasOptions {
  active: boolean
  editor: Pick<Editor, 'beginGesture' | 'commitMove' | 'deselect' | 'placeAt' | 'select'>
  grid: GridSettings
  layer: DragLayer
  selected: HTMLElement | null
}

interface LastClick {
  at: number
  before: HTMLElement | null
  doc: Document
  x: number
  y: number
}

function passThrough(event: MouseEvent) {
  return event.ctrlKey || event.metaKey
}

function childToward(container: HTMLElement, target: HTMLElement) {
  let child: HTMLElement | null = target
  while (child && child.parentElement !== container) child = child.parentElement
  return child
}

export function useCanvas({ active, editor, grid, layer, selected }: CanvasOptions) {
  const overlay = useRef<HTMLDivElement>(null)
  const overlayLabel = useRef<HTMLSpanElement>(null)
  const lastClick = useRef<LastClick | null>(null)

  const parentTarget = useEffectEvent((target: HTMLElement) => {
    const from =
      selected && selected.ownerDocument === target.ownerDocument && selected.contains(target)
        ? selected
        : target
    const parent = from.parentElement
    return parent && parent.tagName !== 'HTML' ? parent : null
  })

  const clickSelect = useEffectEvent((event: PointerEvent, target: HTMLElement) => {
    const now = Date.now()
    const last = lastClick.current
    const double =
      last &&
      last.doc === target.ownerDocument &&
      now - last.at < 450 &&
      Math.hypot(event.clientX - last.x, event.clientY - last.y) < 6
    lastClick.current = double
      ? null
      : { at: now, before: selected, doc: target.ownerDocument, x: event.clientX, y: event.clientY }
    if (event.altKey) {
      const parent = parentTarget(target)
      if (parent) editor.select(parent)
      return
    }
    const container = double ? last.before : null
    if (container && container !== target && container.contains(target)) {
      const child = childToward(container, target)
      if (child) editor.select(child)
      return
    }
    if (target !== selected) editor.select(target)
  })

  const dragTarget = useEffectEvent((target: HTMLElement) => {
    const element =
      selected && selected.ownerDocument === target.ownerDocument && selected.contains(target)
        ? selected
        : target
    if (protectedReason(element)) return null
    if (element !== selected) editor.select(element)
    return element
  })

  const gesture = useEffectEvent((event: PointerEvent, doc: Document, done: () => void) => {
    const target = event.target as HTMLElement
    trackGesture({
      doc,
      editor,
      event,
      grid,
      layer,
      onClick: (down) => clickSelect(down, target),
      onDragStart: () => dragTarget(target),
      onEnd: done,
    })
  })

  const escape = useEffectEvent(() => {
    if (selected) editor.deselect()
  })

  useEffect(() => {
    if (!active) return
    const box = overlay.current
    const label = overlayLabel.current
    let frame = 0
    let hovered: HTMLElement | null = null
    let pointed: HTMLElement | null = null
    let dragging = false

    const draw = () => {
      frame = 0
      if (!box || !label) return
      if (dragging || !hovered?.isConnected) {
        box.style.display = 'none'
        return
      }
      const rect = hovered.getBoundingClientRect()
      const offset = frameOffset(hovered.ownerDocument)
      box.style.display = 'block'
      box.style.transform = `translate(${rect.left + offset.x}px, ${rect.top + offset.y}px)`
      box.style.width = `${rect.width}px`
      box.style.height = `${rect.height}px`
      label.textContent = `${pointed && pointed !== hovered ? '↑ ' : ''}${elementLabel(hovered)}  ${Math.round(rect.width)}×${Math.round(rect.height)}`
      label.dataset.inside = String(rect.top + offset.y < 22)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const release = listenToDocuments((doc) => {
      const aim = (alt: boolean) => {
        hovered = pointed && alt ? parentTarget(pointed) : pointed
        schedule()
      }
      const onMove = (event: PointerEvent) => {
        pointed = outside(event.target) && !passThrough(event) ? event.target : null
        aim(event.altKey)
      }
      const onLeave = (event: PointerEvent) => {
        if (event.relatedTarget) return
        pointed = null
        aim(false)
      }
      const onAlt = (event: KeyboardEvent) => {
        if (event.key === 'Alt') aim(event.type === 'keydown')
      }
      const onDown = (event: PointerEvent) => {
        if (!outside(event.target) || passThrough(event)) return
        event.preventDefault()
        event.stopPropagation()
        if (event.button !== 0) return
        dragging = true
        schedule()
        gesture(event, doc, () => {
          dragging = false
          schedule()
        })
      }
      const onBlocked = (event: Event) => {
        if (!outside(event.target) || passThrough(event as MouseEvent)) return
        event.preventDefault()
        event.stopPropagation()
      }
      const onKey = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || isTyping(event.target)) return
        if (isElement(event.target) && event.target.closest('[data-escape-local]')) return
        escape()
      }
      doc.addEventListener('pointermove', onMove, true)
      doc.addEventListener('pointerout', onLeave, true)
      doc.addEventListener('pointerdown', onDown, true)
      doc.addEventListener('keydown', onKey, true)
      doc.addEventListener('keydown', onAlt, true)
      doc.addEventListener('keyup', onAlt, true)
      doc.addEventListener('scroll', schedule, { capture: true, passive: true })
      for (const type of blockedEvents) doc.addEventListener(type, onBlocked, true)
      return () => {
        doc.removeEventListener('pointermove', onMove, true)
        doc.removeEventListener('pointerout', onLeave, true)
        doc.removeEventListener('pointerdown', onDown, true)
        doc.removeEventListener('keydown', onKey, true)
        doc.removeEventListener('keydown', onAlt, true)
        doc.removeEventListener('keyup', onAlt, true)
        doc.removeEventListener('scroll', schedule, true)
        for (const type of blockedEvents) doc.removeEventListener(type, onBlocked, true)
      }
    })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      release()
      if (box) box.style.display = 'none'
    }
  }, [active])

  return { overlay, overlayLabel }
}
