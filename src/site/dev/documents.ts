import { isElement } from '#/site/dev/inspect'

export interface Box {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}

export function frameOffset(doc: Document) {
  let x = 0
  let y = 0
  let view = doc.defaultView
  while (view && view !== window) {
    const frame = view.frameElement
    if (!frame) break
    const rect = frame.getBoundingClientRect()
    x += rect.left + frame.clientLeft
    y += rect.top + frame.clientTop
    view = frame.ownerDocument.defaultView
  }
  return { x, y }
}

export function box(left: number, top: number, width: number, height: number): Box {
  return { left, top, width, height, right: left + width, bottom: top + height }
}

export function topRect(element: Element) {
  const rect = element.getBoundingClientRect()
  const offset = frameOffset(element.ownerDocument)
  return box(rect.left + offset.x, rect.top + offset.y, rect.width, rect.height)
}

export function outside(target: EventTarget | null): target is HTMLElement {
  return isElement(target) && !target.closest('[data-design-inspector]')
}

export function isTyping(target: EventTarget | null) {
  return (
    isElement(target) &&
    Boolean(
      target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'),
    )
  )
}

export function listenToDocuments(attach: (doc: Document) => () => void) {
  const cleanups: (() => void)[] = []
  const attached = new Set<Document>()

  const attachFrame = (iframe: HTMLIFrameElement) => {
    try {
      const doc = iframe.contentDocument
      if (doc?.head) visit(doc)
    } catch {
      return
    }
  }

  const watched = new Set<HTMLIFrameElement>()

  function watch(iframe: HTMLIFrameElement) {
    if (watched.has(iframe)) return
    watched.add(iframe)
    const onLoad = () => attachFrame(iframe)
    iframe.addEventListener('load', onLoad)
    cleanups.push(() => iframe.removeEventListener('load', onLoad))
    attachFrame(iframe)
  }

  function visit(doc: Document) {
    if (attached.has(doc)) return
    attached.add(doc)
    cleanups.push(attach(doc))
    for (const iframe of doc.querySelectorAll('iframe')) watch(iframe)
    const observer = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes) {
          if (!isElement(node)) continue
          if (node.tagName === 'IFRAME') watch(node as HTMLIFrameElement)
          for (const iframe of node.querySelectorAll('iframe')) watch(iframe)
        }
    })
    observer.observe(doc.documentElement, { childList: true, subtree: true })
    cleanups.push(() => observer.disconnect())
  }

  visit(document)
  return () => {
    for (const cleanup of cleanups) cleanup()
  }
}

export function injectStyle(doc: Document, css: string) {
  const style = doc.createElement('style')
  style.textContent = css
  doc.head.appendChild(style)
  return () => style.remove()
}
