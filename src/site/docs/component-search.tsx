import SearchIcon from '~icons/solar/magnifier-linear'
import { Link, ScriptOnce, useNavigate } from '@tanstack/react-router'
import * as React from 'react'

import { searchDocs } from '#/site/docs/search-index'
import type { SearchItem } from '#/site/docs/search-index'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '#/components/ui/dialog'
import { Kbd } from '#/components/ui/kbd'
import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'

declare global {
  interface Window {
    __searchShortcut?: { pending: boolean; ready: boolean }
  }
}

const earlyShortcutScript = `(function(){if(window.__searchShortcut)return;var s=window.__searchShortcut={pending:false,ready:false};document.addEventListener('keydown',function(e){if(s.ready||!(e.metaKey||e.ctrlKey)||e.key.toLowerCase()!=='k')return;e.preventDefault();s.pending=true})})()`

const SearchContext = React.createContext<(() => void) | null>(null)

export function useOpenSearch() {
  const openSearch = React.useContext(SearchContext)
  if (!openSearch) throw new Error('useOpenSearch must be used inside SearchProvider')
  return openSearch
}

interface SearchProviderProps {
  children: React.ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const parentOpenSearch = React.useContext(SearchContext)
  if (parentOpenSearch) return children
  return <SearchPalette>{children}</SearchPalette>
}

function optionId(item: SearchItem) {
  return `search-option-${item.id.replaceAll(':', '-')}`
}

function SearchPalette({ children }: SearchProviderProps) {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const groups = React.useMemo(() => searchDocs(query), [query])
  const results = React.useMemo(() => groups.flatMap((group) => group.items), [groups])
  const activeItem = results.at(Math.min(activeIndex, results.length - 1))
  const itemRefs = React.useRef(new Map<string, HTMLAnchorElement>())
  const indicatorRef = React.useRef<HTMLSpanElement>(null)
  const [indicatorRect, setIndicatorRect] = React.useState<{ top: number; height: number } | null>(
    null,
  )

  React.useLayoutEffect(() => {
    const element = activeItem ? itemRefs.current.get(activeItem.id) : undefined
    setIndicatorRect(element ? { top: element.offsetTop, height: element.offsetHeight } : null)
  }, [activeItem, results])

  React.useEffect(() => {
    if (!open) return
    const indicator = indicatorRef.current
    const frame = requestAnimationFrame(() => indicator?.setAttribute('data-ready', 'true'))
    return () => {
      cancelAnimationFrame(frame)
      indicator?.removeAttribute('data-ready')
    }
  }, [open])

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault()
        setOpen((currentOpen) => !currentOpen)
        setQuery('')
        setActiveIndex(0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const earlyShortcut = window.__searchShortcut
    if (earlyShortcut) {
      earlyShortcut.ready = true
      if (earlyShortcut.pending) {
        earlyShortcut.pending = false
        document.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' }))
      }
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (earlyShortcut) earlyShortcut.ready = false
    }
  }, [])

  React.useEffect(() => {
    if (!open) return

    const animationFrame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(animationFrame)
  }, [open])

  const openSearch = React.useCallback(() => {
    setOpen(true)
    setQuery('')
    setActiveIndex(0)
  }, [])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    setActiveIndex(0)
    if (!nextOpen) setQuery('')
  }

  function activate(index: number) {
    setActiveIndex(index)
    if (index === 0) {
      document.getElementById('component-search-results')?.scrollIntoView({ block: 'start' })
    } else {
      document.getElementById(optionId(results[index]))?.scrollIntoView({ block: 'nearest' })
    }
  }

  function moveActive(offset: number) {
    const currentIndex = activeItem ? results.indexOf(activeItem) : 0
    activate((currentIndex + offset + results.length) % results.length)
  }

  async function selectItem(item: SearchItem) {
    handleOpenChange(false)
    await navigate({ href: item.href })
  }

  function handleResultClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    handleOpenChange(false)
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      activate(event.key === 'Home' ? 0 : results.length - 1)
    } else if (event.key === 'Enter' && activeItem) {
      event.preventDefault()
      void selectItem(activeItem)
    }
  }

  return (
    <SearchContext value={openSearch}>
      <ScriptOnce>{earlyShortcutScript}</ScriptOnce>
      {children}
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="flex max-h-[min(28rem,calc(100dvh-2rem))] max-w-lg flex-col overflow-hidden p-3 text-[15px] leading-5 font-[450] tracking-[-0.05px] text-muted-foreground dark:bg-[#1c1d1f] dark:ring-0 [&>button]:top-3 [&>button]:right-3 [&>button]:size-9">
          <DialogTitle className="sr-only">Search documentation</DialogTitle>
          <DialogDescription className="sr-only">
            Search Pasta UI components and docs.
          </DialogDescription>
          <div className="relative shrink-0 pr-11">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              aria-activedescendant={activeItem ? optionId(activeItem) : undefined}
              aria-autocomplete="list"
              aria-controls="component-search-results"
              aria-expanded={results.length > 0}
              aria-label="Search components"
              autoComplete="off"
              className="h-9 w-full min-w-0 rounded-md border-0 bg-muted py-1 pr-3 pl-9 text-[15px] leading-5 font-[450] tracking-[-0.05px] text-muted-foreground shadow-none transition-[color,box-shadow,border-color] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground dark:bg-[#242528]"
              data-slot="input"
              name="component-search"
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search components…"
              ref={inputRef}
              role="combobox"
              spellCheck={false}
              type="text"
              value={query}
            />
          </div>
          <div className="mt-2 min-h-0 [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [@supports_selector(::-webkit-scrollbar)]:[scrollbar-width:auto]">
            {results.length > 0 ? (
              <div
                aria-label="Search results"
                className="relative flex flex-col gap-2"
                id="component-search-results"
                // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- select and datalist cannot hold rich, link-backed rows
                role="listbox"
              >
                <span
                  aria-hidden="true"
                  className="sidebar-hover-indicator pointer-events-none absolute inset-x-0 z-0 rounded-md bg-search-item-active"
                  ref={indicatorRef}
                  style={{
                    height: indicatorRect?.height ?? 0,
                    opacity: indicatorRect ? 1 : 0,
                    top: indicatorRect?.top ?? 0,
                  }}
                />
                {groups.map((group) => (
                  <fieldset
                    aria-labelledby={`component-search-${group.section}`}
                    className="flex min-w-0 flex-col gap-0.5"
                    key={group.section}
                  >
                    <div
                      className="px-3 pt-1 pb-0.5 sidebar-text-sm text-muted-foreground"
                      id={`component-search-${group.section}`}
                    >
                      {group.section}
                    </div>
                    {group.items.map((item) => (
                      <Link
                        to={item.href}
                        aria-selected={item === activeItem}
                        className={cn(
                          'relative z-10 flex w-full min-w-0 shrink-0 scroll-my-1 items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-[15px] leading-5 font-[450] tracking-[-0.05px] text-muted-foreground transition-colors focus-visible:outline-none',
                          item === activeItem && 'text-foreground',
                        )}
                        id={optionId(item)}
                        key={item.id}
                        ref={(element) => {
                          if (element) itemRefs.current.set(item.id, element)
                          else itemRefs.current.delete(item.id)
                        }}
                        onClick={handleResultClick}
                        onMouseMove={() => {
                          if (item !== activeItem) setActiveIndex(results.indexOf(item))
                        }}
                        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a native option cannot be a link, and results must stay real hrefs
                        role="option"
                        tabIndex={-1}
                      >
                        <span className="min-w-0 flex-1 truncate">{item.title}</span>
                        <span className="max-w-[40%] truncate text-[12px] leading-5 font-[450] text-muted-foreground">
                          {item.subtitle}
                        </span>
                      </Link>
                    ))}
                  </fieldset>
                ))}
              </div>
            ) : (
              <p className="px-3 py-8 text-center paragraph-text-md text-muted-foreground">
                No results found.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </SearchContext>
  )
}

function HeaderSearchTriggers() {
  const openSearch = useOpenSearch()

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-label="Search documentation"
        className={buttonVariants({ className: 'xl:hidden', size: 'icon-lg', variant: 'ghost' })}
        onClick={openSearch}
        type="button"
      >
        <SearchIcon aria-hidden="true" className="size-4" />
      </button>
      <button
        aria-haspopup="dialog"
        className={buttonVariants({
          className: 'hidden! w-61 justify-between xl:inline-flex!',
          size: 'lg',
          variant: 'secondary',
        })}
        onClick={openSearch}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2 text-[12px] leading-5 font-[450] tracking-normal text-muted-foreground">
          <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
          Search documentation…
        </span>
        <span aria-hidden="true" className="flex items-center gap-1">
          <Kbd className="text-[12px] leading-none">⌘</Kbd>
          <Kbd className="text-[12px] leading-none">K</Kbd>
        </span>
      </button>
    </>
  )
}

export function ComponentSearch() {
  return (
    <SearchProvider>
      <HeaderSearchTriggers />
    </SearchProvider>
  )
}
