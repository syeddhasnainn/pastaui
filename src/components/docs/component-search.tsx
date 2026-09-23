import SearchIcon from '~icons/solar/magnifier-linear'
import * as React from 'react'

import { componentCatalog } from '#/components/docs/component-catalog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { buttonVariants } from '#/components/ui/button'

export function ComponentSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [highlight, setHighlight] = React.useState<{ top: number; height: number } | null>(null)
  const [highlightVisible, setHighlightVisible] = React.useState(false)
  const highlightRef = React.useRef<HTMLSpanElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const results = componentCatalog
    .filter((component) =>
      [component.name, component.category, component.description]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)),
    )
    .slice(0, 10)

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault()
        setOpen((currentOpen) => !currentOpen)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  React.useEffect(() => {
    if (!open) return

    const animationFrame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(animationFrame)
  }, [open])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    setHighlight(null)
    setHighlightVisible(false)
    if (!nextOpen) setQuery('')
  }

  function highlightResult(element: HTMLAnchorElement) {
    if (highlight) highlightRef.current?.setAttribute('data-ready', 'true')
    setHighlight({ top: element.offsetTop, height: element.offsetHeight })
    setHighlightVisible(true)
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger
        className={buttonVariants({
          className: 'hidden! w-61 justify-between xl:inline-flex!',
          size: 'lg',
          variant: 'secondary',
        })}
      >
        <span className="flex min-w-0 items-center gap-2 text-[13px] leading-5 font-[450] tracking-normal text-muted-foreground">
          <SearchIcon aria-hidden="true" className="size-3.5" />
          Search documentation…
        </span>
        <kbd className="text-xs font-normal text-muted-foreground">⌘ K</kbd>
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(28rem,calc(100dvh-2rem))] max-w-lg flex-col overflow-hidden p-3 text-sm leading-5 font-[450] tracking-[-0.05px] text-muted-foreground [&>button]:top-3 [&>button]:right-3 [&>button]:size-9">
        <DialogTitle className="sr-only">Search components</DialogTitle>
        <DialogDescription className="sr-only">
          Search the Pasta UI component documentation.
        </DialogDescription>
        <div className="relative shrink-0 pr-11">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="Search components"
            autoComplete="off"
            className="border-0 bg-muted pl-9 text-sm leading-5 font-[450] tracking-[-0.05px] text-muted-foreground shadow-none focus-visible:ring-0"
            name="component-search"
            onChange={(event) => {
              setQuery(event.target.value)
              setHighlight(null)
              setHighlightVisible(false)
              highlightRef.current?.removeAttribute('data-ready')
            }}
            placeholder="Search components…"
            ref={inputRef}
            spellCheck={false}
            value={query}
          />
        </div>
        <div className="mt-2 min-h-0 [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [@supports_selector(::-webkit-scrollbar)]:[scrollbar-width:auto]">
          {results.length > 0 ? (
            <div
              className="relative flex flex-col gap-0.5"
              onMouseLeave={() => setHighlightVisible(false)}
            >
              <span
                aria-hidden="true"
                className="sidebar-hover-indicator pointer-events-none absolute inset-x-0 rounded-md bg-sidebar-item-hover"
                ref={highlightRef}
                style={{
                  top: highlight?.top ?? 0,
                  height: highlight?.height ?? 0,
                  opacity: highlightVisible ? 1 : 0,
                }}
              />
              {results.map((component) => (
                <a
                  className="relative z-10 flex min-w-0 shrink-0 items-center justify-between gap-3 rounded-md px-3 py-2 text-sm leading-5 font-[450] tracking-[-0.05px] text-muted-foreground transition-colors focus-visible:outline-none"
                  href={`/docs/component/${component.slug}`}
                  key={component.slug}
                  onClick={() => setOpen(false)}
                  onMouseEnter={(event) => highlightResult(event.currentTarget)}
                  onFocus={(event) => highlightResult(event.currentTarget)}
                  onBlur={() => setHighlightVisible(false)}
                >
                  <span className="min-w-0 flex-1 truncate">{component.name}</span>
                  <span className="max-w-[40%] truncate text-[13px] leading-5 font-[450] text-muted-foreground">
                    {component.category ?? component.group}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No components found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
