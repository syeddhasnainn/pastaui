import * as React from 'react'

import { cn } from 'cn'

interface ResearchReportSection {
  content: React.ReactNode
  id: string
  title: string
  level?: 2 | 3
}

interface ResearchReportSource {
  id: string
  label: string
  url?: string
}

interface ResearchReportProps extends React.ComponentProps<'article'> {
  generatedAt?: string
  onOpenSource?: (id: string) => void
  sections: ResearchReportSection[]
  sources?: ResearchReportSource[]
  summary: string
  title: string
}

function ResearchReport({
  className,
  generatedAt,
  onOpenSource,
  sections,
  sources = [],
  summary,
  title,
  ...props
}: ResearchReportProps) {
  const instanceId = React.useId()
  const viewportRef = React.useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [contentsOpen, setContentsOpen] = React.useState(false)
  const contentsId = `${instanceId}-contents`
  const entries = [
    { title, level: 1 },
    { title: 'Executive summary', level: 2 },
    ...sections.map((section) => ({ title: section.title, level: section.level ?? 2 })),
    ...(sources.length ? [{ title: 'Sources', level: 2 }] : []),
  ]

  function jumpTo(index: number) {
    const viewport = viewportRef.current
    const target = viewport?.querySelector<HTMLElement>(`[data-report-heading="${index}"]`)
    if (!viewport || !target) return
    viewport.scrollTo({
      top:
        target.getBoundingClientRect().top -
        viewport.getBoundingClientRect().top +
        viewport.scrollTop -
        32,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
    setActiveIndex(index)
    target.focus({ preventScroll: true })
    setContentsOpen(false)
  }

  return (
    <article
      data-slot="research-report"
      className={cn(
        'relative isolate bg-background font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      <div
        className="absolute top-11 left-3 z-20"
        onMouseEnter={() => setContentsOpen(true)}
        onMouseLeave={() => setContentsOpen(false)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setContentsOpen(false)
        }}
      >
        <button
          type="button"
          aria-label="Table of contents"
          aria-expanded={contentsOpen}
          aria-controls={contentsId}
          className="flex w-10 flex-col items-start gap-2.5 rounded px-2 py-3 focus-visible:outline-2 focus-visible:outline-ring"
          onClick={() => setContentsOpen((open) => !open)}
        >
          {entries.map((entry, index) => (
            <span
              key={index}
              className={cn(
                'h-0.5 rounded-full transition-colors',
                entry.level === 3 ? 'w-2.5' : 'w-4',
                index === activeIndex ? 'bg-foreground' : 'bg-foreground/20',
              )}
            />
          ))}
        </button>
        {/* Escape dismisses the navigation from any of its buttons. */}
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <nav
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setContentsOpen(false)
              event.currentTarget.parentElement?.querySelector('button')?.focus()
            }
          }}
          id={contentsId}
          aria-label="Table of contents"
          hidden={!contentsOpen}
          className="absolute top-0 left-0 w-64 origin-top-left overflow-hidden rounded-[16px] bg-card shadow-card transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] sm:w-72 starting:scale-95 starting:opacity-0 motion-reduce:starting:scale-100"
        >
          <div className="max-h-[min(32rem,70vh)] [scrollbar-width:thin] overflow-y-auto overscroll-contain px-5 py-3">
            <p className="mb-4 text-[11px] font-[450] text-muted-foreground">Table of contents</p>
            <ol className="space-y-3">
              {entries.map((entry, index) => (
                <li key={index}>
                  <button
                    type="button"
                    aria-current={index === activeIndex ? 'location' : undefined}
                    onClick={() => jumpTo(index)}
                    className={cn(
                      'w-full rounded text-left text-sm leading-6 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring',
                      entry.level === 3 && 'pl-4',
                      index === activeIndex && 'font-medium text-foreground',
                    )}
                  >
                    {entry.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </div>
      <section
        ref={viewportRef}
        // The scroll viewport must be keyboard-scrollable.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-label={`${title} report`}
        className="max-h-[42rem] overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:outline-ring"
        onScroll={() => {
          const viewport = viewportRef.current
          if (!viewport) return
          const headings = Array.from(
            viewport.querySelectorAll<HTMLElement>('[data-report-heading]'),
          )
          let current = 0
          for (const [index, heading] of headings.entries()) {
            if (heading.getBoundingClientRect().top <= viewport.getBoundingClientRect().top + 80)
              current = index
          }
          setActiveIndex(current)
        }}
      >
        <div className="mx-auto box-content max-w-[42rem] px-14 py-12 sm:px-20">
          <h2
            data-report-heading="0"
            tabIndex={-1}
            className="mb-9 text-2xl leading-snug font-medium tracking-[-0.05px] outline-none sm:text-[28px]"
          >
            {title}
          </h2>
          <section className="mb-8">
            <h3
              data-report-heading="1"
              tabIndex={-1}
              className="mb-3 text-xl font-medium tracking-[-0.05px] outline-none"
            >
              Executive summary
            </h3>
            <p className="text-sm leading-6 whitespace-pre-line text-muted-foreground">{summary}</p>
            {generatedAt && (
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{generatedAt}</p>
            )}
          </section>
          {sections.map((section, index) => {
            const Heading = section.level === 3 ? 'h4' : 'h3'
            return (
              <section key={section.id} className="mb-8">
                <Heading
                  data-report-heading={index + 2}
                  tabIndex={-1}
                  className={cn(
                    'mb-3 font-medium tracking-[-0.05px] outline-none',
                    section.level === 3 ? 'text-base' : 'text-xl',
                  )}
                >
                  {section.title}
                </Heading>
                <div className="text-sm leading-6 whitespace-pre-line text-muted-foreground [&_p+p]:mt-4 [&_strong]:font-medium [&_strong]:text-foreground">
                  {section.content}
                </div>
              </section>
            )
          })}
          {sources.length > 0 && (
            <section>
              <h3
                data-report-heading={sections.length + 2}
                tabIndex={-1}
                className="mb-3 text-xl font-medium outline-none"
              >
                Sources
              </h3>
              <ol className="list-inside list-decimal space-y-2 text-sm leading-6 text-muted-foreground">
                {sources.map((source) => (
                  <li key={source.id}>
                    {onOpenSource ? (
                      <button
                        type="button"
                        className="text-left underline underline-offset-4 hover:text-foreground"
                        onClick={() => onOpenSource(source.id)}
                      >
                        {source.label}
                      </button>
                    ) : source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4 hover:text-foreground"
                      >
                        {source.label}
                      </a>
                    ) : (
                      source.label
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </section>
    </article>
  )
}

export { ResearchReport }
export type { ResearchReportProps, ResearchReportSection, ResearchReportSource }
