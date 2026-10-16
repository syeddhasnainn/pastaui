import { Link, createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect, useRef, useState } from 'react'

import { componentCatalog } from '#/components/docs/component-catalog'
import { ComponentPreview } from '#/components/docs/component-preview'
import { cn } from '#/lib/utils'
import { seo, siteName } from '#/lib/seo'

export const Route = createFileRoute('/_shell/docs/component/')({
  head: () =>
    seo({
      title: `Components — ${siteName}`,
      description: `All ${componentCatalog.length} open-source React components for AI agent interfaces, installed with the shadcn CLI.`,
      path: '/docs/component',
    }),
  component: ComponentsIndexPage,
})

const categories = [
  ...new Set(componentCatalog.map((component) => component.category ?? component.group)),
].map((name) => ({
  name,
  components: componentCatalog.filter(
    (component) => (component.category ?? component.group) === name,
  ),
}))

const previewWidth = 480
const previewHeight = 360
const previewGap = 24
const previewZoom: Record<string, number> = { 'data-table': 0.5 }

function previewStage(slug: string) {
  const zoom = previewZoom[slug] ?? 0.6
  return { zoom, width: `${100 / zoom}%`, height: `${100 / zoom}%` }
}

function ComponentsIndexPage() {
  const indexRef = useRef<HTMLDivElement>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [preview, setPreview] = useState<{
    slug: string
    top: number
    left: number
    slide: boolean
  } | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => () => clearTimeout(showTimer.current), [])

  const show = (slug: string, link: HTMLElement) => {
    const index = indexRef.current
    const column = link.closest('section')
    if (!index || !column) return
    const bounds = index.getBoundingClientRect()
    const box = link.getBoundingClientRect()
    const columnBox = column.getBoundingClientRect()
    const fitsRight = columnBox.right + previewGap + previewWidth <= bounds.right
    const left = fitsRight
      ? columnBox.right - bounds.left + previewGap
      : columnBox.left - bounds.left - previewGap - previewWidth
    const centered = box.top + box.height / 2 - previewHeight / 2
    const viewportTop = Math.min(Math.max(centered, 72), window.innerHeight - previewHeight - 16)
    setPreview({ slug, top: viewportTop - bounds.top, left, slide: visible })
    if (visible) return
    clearTimeout(showTimer.current)
    showTimer.current = setTimeout(() => setVisible(true), 150)
  }

  const hide = () => {
    clearTimeout(showTimer.current)
    setVisible(false)
  }

  return (
    <div className="w-full min-w-0 pb-16">
      <h1 className="text-[32px] leading-[1.15] font-[600] tracking-[-0.025em] text-balance text-foreground">
        Components
      </h1>
      <div
        className="relative mt-10"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) hide()
        }}
        onPointerLeave={hide}
        ref={indexRef}
      >
        <div className="columns-1 gap-x-12 sm:columns-2 lg:columns-3 xl:columns-4">
          {categories.map((category) => (
            <section
              aria-labelledby={`category-${category.name}`}
              className="mb-10 break-inside-avoid"
              key={category.name}
            >
              <h2
                className="flex items-baseline gap-2 text-[15px] leading-[1.5] font-[600] text-foreground"
                id={`category-${category.name}`}
              >
                {category.name}
                <span className="text-[13px] font-medium text-muted-foreground tabular-nums">
                  {category.components.length}
                </span>
              </h2>
              <ul className="mt-3 flex flex-col">
                {category.components.map((component) => (
                  <li key={component.slug}>
                    <Link
                      className="group flex w-fit items-center gap-2 py-1.5"
                      onFocus={(event) => show(component.slug, event.currentTarget)}
                      onPointerEnter={(event) => show(component.slug, event.currentTarget)}
                      params={{ slug: component.slug }}
                      to="/docs/component/$slug"
                    >
                      <span
                        className={cn(
                          'text-[18px] leading-[1.4] font-[500] tracking-[-0.01em] transition-colors',
                          visible && preview?.slug === component.slug
                            ? 'text-foreground'
                            : 'text-foreground/70 group-hover:text-foreground',
                        )}
                      >
                        {component.name}
                      </span>
                      {component.isNew && (
                        <span className="flex h-[18px] items-center rounded-full bg-[oklch(62.6%_0.205_254.947/0.14)] px-1.5 text-[11px] leading-none font-[550] text-[oklch(50%_0.2_257)] dark:text-[oklch(78%_0.12_253)]">
                          New
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {preview ? (
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute z-20 hidden overflow-hidden rounded-xl border-[0.5px] border-border bg-card shadow-[0_24px_48px_-12px_rgb(0_0_0/.25)] transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none lg:block dark:shadow-[0_24px_48px_-12px_rgb(0_0_0/.6)]',
              preview.slide &&
                'transition-[top,left,opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              visible ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0',
            )}
            inert
            style={{
              top: preview.top,
              left: preview.left,
              width: previewWidth,
              height: previewHeight,
            }}
          >
            <div
              className="flex size-full animate-in items-center justify-center duration-200 fade-in-0 motion-reduce:animate-none"
              key={preview.slug}
            >
              <div
                className="flex shrink-0 items-center justify-center p-6"
                style={previewStage(preview.slug)}
              >
                <Suspense fallback={null}>
                  <ComponentPreview slug={preview.slug} />
                </Suspense>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
