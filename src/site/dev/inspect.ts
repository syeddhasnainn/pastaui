import type { RawValues, Values } from '#/site/dev/values'

export interface ElementMeta {
  id: string
  url: string
  selector: string
  tag: string
  classes: string
  text: string
  component: string | null
  dataSlot: string | null
  previewSlug: string | null
  sourceHint: string | null
}

export interface FontOption {
  label: string
  value: string
}

export interface TextNodes {
  nodes: HTMLElement[]
  total: number
}

export interface Selection {
  before: Values
  element: HTMLElement
  fonts: FontOption[]
  meta: ElementMeta
  raw: RawValues
  text: TextNodes
}

const baseFonts: FontOption[] = [
  { label: 'Manrope', value: '"Manrope Variable", Manrope, ui-sans-serif, system-ui, sans-serif' },
  { label: 'System UI', value: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' },
  { label: 'Monospace', value: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' },
]

const blockFiles = Object.keys(import.meta.glob('/src/components/ai/**/*.tsx')).map((path) =>
  path.slice(1),
)

export function isElement(node: unknown): node is HTMLElement {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as Node).nodeType === 1 &&
    'style' in (node as HTMLElement)
  )
}

export function elementLabel(element: Element) {
  const tag = element.tagName.toLowerCase()
  if (element.id) return `${tag}#${element.id}`
  const className = element.getAttribute('class')?.trim().split(/\s+/)[0]
  if (!className) return tag
  return `${tag}.${className.length > 16 ? `${className.slice(0, 15)}…` : className}`
}

export function ancestors(element: HTMLElement) {
  const chain: HTMLElement[] = []
  let current: HTMLElement | null = element
  while (current && current.tagName !== 'HTML') {
    chain.unshift(current)
    if (current.tagName === 'BODY') break
    current = current.parentElement
  }
  return chain
}

function segment(element: Element) {
  if (element.id) return `#${CSS.escape(element.id)}`
  const tag = element.tagName.toLowerCase()
  const slot = element.getAttribute('data-slot')
  let part = slot ? `${tag}[data-slot="${slot}"]` : tag
  const siblings = element.parentElement
    ? [...element.parentElement.children].filter((sibling) => sibling.tagName === element.tagName)
    : []
  if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(element) + 1})`
  return part
}

export function selectorFor(element: Element) {
  const parts: string[] = []
  let current: Element | null = element
  while (current && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
    parts.unshift(segment(current))
    if (current.id) break
    const selector = parts.join(' > ')
    if (element.ownerDocument.querySelectorAll(selector).length === 1 && parts.length > 1) break
    current = current.parentElement
  }
  return parts.join(' > ')
}

const routerNames =
  /^(Match|Outlet|Lazy|CatchBoundary|CatchNotFound|SafeFragment|RouterProvider|ShellInner)/

interface Fiber {
  _debugOwner?: Fiber | null
  _debugSource?: { fileName?: string } | null
  _debugStack?: { stack?: string } | null
  type: unknown
  return: Fiber | null
}

const semantic: Record<string, string> = {
  aside: 'Sidebar',
  nav: 'Navigation',
  section: 'Section',
  header: 'Header',
  footer: 'Footer',
  main: 'Main',
  article: 'Article',
  form: 'Form',
  dialog: 'Dialog',
  ul: 'List',
  ol: 'List',
  table: 'Table',
  body: 'Body',
}

function typeName(type: unknown): string | null {
  if (typeof type === 'function') {
    const component = type as { displayName?: string; name?: string }
    return component.displayName || component.name || null
  }
  if (typeof type === 'object' && type !== null) {
    const wrapper = type as {
      displayName?: string
      render?: { name?: string }
      type?: { name?: string }
    }
    return wrapper.displayName || wrapper.render?.name || wrapper.type?.name || null
  }
  return null
}

function fiberOf(element: Element) {
  const key = Object.keys(element).find((name) => name.startsWith('__reactFiber$'))
  return key ? ((element as unknown as Record<string, Fiber | undefined>)[key] ?? null) : null
}

function componentNames(element: Element) {
  const names = new Set<string>()
  try {
    let fiber = fiberOf(element)
    while (fiber && names.size < 3) {
      const name = typeName(fiber.type)
      if (name && routerNames.test(name)) break
      if (name && /^[A-Z]/.test(name)) names.add(name)
      fiber = fiber.return
    }
  } catch {
    return [...names]
  }
  return [...names]
}

function rootComponent(element: Element) {
  try {
    const host = fiberOf(element)
    const owner = host?._debugOwner?.type
    let fiber = host?.return ?? null
    for (let guard = 0; fiber && guard < 6; guard++) {
      if (typeof fiber.type === 'string') return null
      const name = typeName(fiber.type)
      if (name && /^[A-Z]/.test(name) && !routerNames.test(name))
        return fiber.type === owner ? name : null
      if (typeof fiber.type === 'function') return null
      fiber = fiber.return
    }
  } catch {
    return null
  }
  return null
}

export function sourceFile(element: Element) {
  try {
    const fiber = fiberOf(element)
    const file =
      fiber?._debugSource?.fileName ??
      [...(fiber?._debugStack?.stack ?? '').matchAll(/\/(src\/[^\s?:)]+\.[jt]sx?)/g)]
        .map((match) => match[1])
        .find((path) => path && !path.startsWith('src/site/dev/'))
    const owner = typeName(fiber?._debugOwner?.type)
    return file || owner ? { file: file ?? null, owner } : null
  } catch {
    return null
  }
}

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function layerLabel(element: Element) {
  const tag = element.tagName.toLowerCase()
  const kind = semantic[tag]
  const aria = element.getAttribute('aria-label')?.trim()
  if (aria) {
    const short = aria.length > 24 ? `${aria.slice(0, 23)}…` : aria
    const withKind =
      kind && !short.toLowerCase().includes(kind.toLowerCase())
        ? `${short} ${kind.toLowerCase()}`
        : short
    return `${capitalise(withKind)} (${tag})`
  }
  const named =
    element.getAttribute('data-component') ??
    element.getAttribute('data-slot') ??
    rootComponent(element)
  if (named) return `${named} (${tag})`
  if (kind) return kind.toLowerCase() === tag ? kind : `${kind} (${tag})`
  return elementLabel(element)
}

export function relativeSelector(container: Element, element: Element) {
  const parts: string[] = []
  let current: Element | null = element
  while (current && current !== container) {
    parts.unshift(segment(current))
    if (current.id) break
    current = current.parentElement
  }
  return parts.join(' > ')
}

function kebab(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .toLowerCase()
}

function blockFile(name: string) {
  return blockFiles.find((path) => path.endsWith(`/${name}.tsx`)) ?? null
}

function nearestData(element: Element) {
  const slotted = element.closest('[data-slot]')
  if (slotted) return `data-slot="${slotted.getAttribute('data-slot')}"`
  let current: Element | null = element
  while (current) {
    const attribute = [...current.attributes].find((item) => item.name.startsWith('data-'))
    if (attribute) return `${attribute.name}="${attribute.value}"`
    current = current.parentElement
  }
  return null
}

export function describe(element: HTMLElement): ElementMeta {
  const url = window.location.pathname
  const framePath = element.ownerDocument.location?.pathname ?? ''
  const previewSlug =
    element.ownerDocument !== document
      ? (framePath.match(/^\/preview\/([^/]+)/)?.[1] ?? null)
      : null
  const names = componentNames(element)
  const sourceHint =
    names.map((name) => blockFile(kebab(name))).find(Boolean) ??
    (previewSlug ? (blockFile(previewSlug) ?? `preview slug: ${previewSlug}`) : null)
  const selector = selectorFor(element)
  const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim()
  return {
    id: `${url}|${previewSlug ?? ''}|${selector}`,
    url,
    selector,
    tag: element.tagName.toLowerCase(),
    classes: element.getAttribute('class')?.trim() ?? '',
    text: text.length > 40 ? `${text.slice(0, 40)}…` : text,
    component: names.length ? names.join(' < ') : null,
    dataSlot: nearestData(element),
    previewSlug,
    sourceHint,
  }
}

export function restoreProperty(element: HTMLElement, original: string | null, property: string) {
  const template = element.ownerDocument.createElement('div')
  template.setAttribute('style', original ?? '')
  const value = template.style.getPropertyValue(property)
  if (value)
    element.style.setProperty(property, value, template.style.getPropertyPriority(property))
  else element.style.removeProperty(property)
  if (original === null && !element.getAttribute('style')) element.removeAttribute('style')
}

export function restoreElement(element: HTMLElement, original: string | null) {
  if (original === null) element.removeAttribute('style')
  else element.setAttribute('style', original)
}

export function protectedReason(element: HTMLElement) {
  if (element.tagName === 'HTML' || element.tagName === 'BODY')
    return `Can't delete <${element.tagName.toLowerCase()}>`
  if (element.matches('#root, #app, [data-slot="preview-root"]')) return "Can't delete the app root"
  if (element.closest('[data-design-inspector]')) return "Can't delete the inspector"
  return null
}

export function fontOptions(element: HTMLElement, current: string) {
  const options = [...baseFonts]
  const known = new Set(options.flatMap((option) => [option.value, option.label]))
  element.ownerDocument.fonts.forEach((face) => {
    const name = face.family.replace(/^["']|["']$/g, '')
    const value = /\s/.test(name) ? `"${name}"` : name
    if (known.has(value) || known.has(name)) return
    known.add(value)
    options.push({ label: name, value })
  })
  if (!known.has(current))
    options.unshift({
      label: `Current (${current.split(',')[0]?.replaceAll('"', '').trim()})`,
      value: current,
    })
  return options
}

export function readSession<T>(key: string, fallback: T): T {
  try {
    const stored = window.sessionStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeSession(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}
