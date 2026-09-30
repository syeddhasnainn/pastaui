import { useEffect, useRef } from 'react'

import { topRect } from '#/site/dev/documents'
import { layerLabel } from '#/site/dev/inspect'

const outlineCap = 150

function place(node: HTMLElement, element: HTMLElement) {
  const rect = topRect(element)
  const visible =
    element.isConnected &&
    rect.width + rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  node.style.display = visible ? 'block' : 'none'
  if (!visible) return rect
  node.style.transform = `translate(${rect.left}px, ${rect.top}px)`
  node.style.width = `${rect.width}px`
  node.style.height = `${rect.height}px`
  return rect
}

export function PreviewOutline({ element }: { element: HTMLElement | null }) {
  const box = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = box.current
    if (!node) return
    if (!element) {
      node.style.display = 'none'
      return
    }
    if (label.current) label.current.textContent = layerLabel(element)
    let frame = 0
    const loop = () => {
      const rect = place(node, element)
      if (label.current) label.current.dataset.inside = String(rect.top < 22)
      frame = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      cancelAnimationFrame(frame)
      node.style.display = 'none'
    }
  }, [element])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-2147483590 hidden outline-1 outline-offset-0 outline-[oklch(62.6%_0.205_254.947)] outline-dashed"
      data-preview-outline=""
      ref={box}
    >
      <span
        className="absolute bottom-full left-0 mb-1 rounded-[4px] bg-[oklch(62.6%_0.205_254.947)] px-1.5 py-0.5 text-[10px] leading-4 whitespace-pre text-white data-[inside=true]:top-0 data-[inside=true]:bottom-auto data-[inside=true]:mb-0"
        ref={label}
      />
    </div>
  )
}

export function TextOutlines({ nodes }: { nodes: HTMLElement[] }) {
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = layer.current
    if (!root || !nodes.length) return
    const targets = nodes.slice(0, outlineCap)
    const boxes = targets.map(() => {
      const node = root.ownerDocument.createElement('div')
      node.className =
        'absolute top-0 left-0 hidden rounded-[1px] outline-1 outline-[oklch(62.6%_0.205_254.947/0.4)] outline-dashed'
      root.appendChild(node)
      return node
    })
    let frame = 0
    const loop = () => {
      targets.forEach((element, index) => {
        const node = boxes[index]
        if (node) place(node, element)
      })
      frame = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      cancelAnimationFrame(frame)
      for (const node of boxes) node.remove()
    }
  }, [nodes])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-2147483540"
      data-text-outlines=""
      ref={layer}
    />
  )
}
