import type { RefObject } from 'react'

import { topRect, type Box } from '#/site/dev/documents'
import { gridLayout, type GridSettings } from '#/site/dev/grid'

type Kind = 'grid' | 'element'

interface Target {
  kind: Kind
  pos: number
}

export interface Targets {
  baseline: number
  x: Target[]
  y: Target[]
}

export interface Guide {
  axis: 'x' | 'y'
  kind: Kind
  pos: number
}

export interface DragLayer {
  ghost: RefObject<HTMLDivElement | null>
  guides: RefObject<HTMLDivElement | null>
  label: RefObject<HTMLSpanElement | null>
}

const guideColor: Record<Kind, string> = {
  grid: 'oklch(62.6% 0.205 254.947)',
  element: 'oklch(65% 0.26 330)',
}

function edges(rect: Box, kind: Kind) {
  return {
    x: [rect.left, rect.left + rect.width / 2, rect.right].map((pos) => ({ kind, pos })),
    y: [rect.top, rect.top + rect.height / 2, rect.bottom].map((pos) => ({ kind, pos })),
  }
}

export function collectTargets(element: HTMLElement, grid: GridSettings): Targets {
  const x: Target[] = []
  const y: Target[] = []
  const parent = element.parentElement
  if (parent && parent.tagName !== 'HTML') {
    const own = edges(topRect(parent), 'element')
    x.push(...own.x)
    y.push(...own.y)
    for (const sibling of [...parent.children].slice(0, 60)) {
      if (sibling === element) continue
      const rect = topRect(sibling)
      if (!rect.width && !rect.height) continue
      const next = edges(rect, 'element')
      x.push(...next.x)
      y.push(...next.y)
    }
  }
  if (!grid.enabled) return { baseline: 0, x, y }
  const layout = gridLayout(grid)
  x.push(...layout.xLines.map((pos) => ({ kind: 'grid' as const, pos })))
  y.push(...layout.yLines.map((pos) => ({ kind: 'grid' as const, pos })))
  return { baseline: layout.baseline, x, y }
}

export function snapAxis(
  positions: number[],
  targets: Target[],
  baseline: number,
  threshold: number,
): { delta: number; target: Target } | null {
  let best: { delta: number; target: Target } | null = null
  for (const position of positions) {
    const candidates = baseline
      ? [...targets, { kind: 'grid' as const, pos: Math.round(position / baseline) * baseline }]
      : targets
    for (const target of candidates) {
      const delta = target.pos - position
      if (Math.abs(delta) > threshold) continue
      if (!best || Math.abs(delta) < Math.abs(best.delta)) best = { delta, target }
    }
  }
  return best
}

export function showDrag(layer: DragLayer, rect: Box, text: string, guides: Guide[]) {
  const ghost = layer.ghost.current
  const label = layer.label.current
  const container = layer.guides.current
  if (ghost) {
    ghost.style.display = 'block'
    ghost.style.transform = `translate(${rect.left}px, ${rect.top}px)`
    ghost.style.width = `${rect.width}px`
    ghost.style.height = `${rect.height}px`
  }
  if (label) label.textContent = text
  if (!container) return
  container.replaceChildren(
    ...guides.map((guide) => {
      const line = document.createElement('div')
      const vertical = guide.axis === 'x'
      Object.assign(line.style, {
        position: 'fixed',
        left: vertical ? `${guide.pos}px` : '0',
        top: vertical ? '0' : `${guide.pos}px`,
        width: vertical ? '1px' : '100vw',
        height: vertical ? '100vh' : '1px',
        background: guideColor[guide.kind],
      })
      return line
    }),
  )
}

export function hideDrag(layer: DragLayer) {
  if (layer.ghost.current) layer.ghost.current.style.display = 'none'
  layer.guides.current?.replaceChildren()
}
