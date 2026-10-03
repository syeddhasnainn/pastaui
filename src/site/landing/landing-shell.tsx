import { Dialog } from '@base-ui/react/dialog'
import { Link, useRouterState } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import CloseIcon from '~icons/solar/close-linear'
import GithubIcon from '~icons/simple-icons/github'
import DownloadIcon from '~icons/solar/download-minimalistic-bold'
import HomeIcon from '~icons/solar/home-2-bold'
import MenuIcon from '~icons/solar/hamburger-menu-linear'
import SearchBoldIcon from '~icons/solar/magnifier-bold'
import SearchIcon from '~icons/solar/magnifier-linear'

import { SearchProvider, useOpenSearch } from '#/site/docs/component-search'
import { ComponentSidebarNav } from '#/site/docs/component-sidebar'
import { focusRing } from '#/site/landing/focus-ring'
import { BrandLink, BrandMenu, useShortcutLabel } from '#/site/landing/brand-menu'
import { ComponentViewToggle } from '#/site/landing/component-view-toggle'
import { SidebarFooter } from '#/site/landing/sidebar-footer'
import { SidebarThemeToggle } from '#/site/theme-toggle'
import { githubUrl } from '#/lib/seo'
import { cn } from '#/lib/utils'

interface SidebarContentProps {
  activeSlug: string
  headerClassName: string
  onSearchOpen?: () => void
}

function SidebarContent({ activeSlug, headerClassName, onSearchOpen }: SidebarContentProps) {
  return (
    <>
      <div className={cn('flex items-center justify-between gap-2', headerClassName)}>
        <BrandLink />
        <SidebarThemeToggle />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <QuickLinks onSearchOpen={onSearchOpen} />
        <div className="min-h-0 flex-1">
          <ComponentSidebarNav activeSlug={activeSlug} />
        </div>
        <SidebarFooter />
      </div>
    </>
  )
}

const quickLinkClass = cn(
  'mr-2 -ml-2 flex h-7 items-center gap-2 rounded-md border-none px-2 sidebar-text-md text-muted-foreground transition-[background-color,color] duration-150 ease-[ease] hover:bg-sidebar-item-hover hover:text-foreground data-[status=active]:bg-sidebar-item-hover data-[status=active]:font-medium data-[status=active]:text-foreground [&>svg]:size-3.5 [&>svg]:shrink-0',
  focusRing,
)

function QuickLinks({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const openSearch = useOpenSearch()
  const searchLabel = useShortcutLabel()

  return (
    <nav aria-label="Quick links" className="flex flex-col">
      <Link activeOptions={{ exact: true }} className={quickLinkClass} to="/">
        <HomeIcon aria-hidden="true" />
        Home
      </Link>
      <Link className={quickLinkClass} to="/docs/installation">
        <DownloadIcon aria-hidden="true" />
        Installation
      </Link>
      <a className={quickLinkClass} href={githubUrl} rel="noreferrer" target="_blank">
        <GithubIcon aria-hidden="true" />
        GitHub
      </a>
      <button
        aria-haspopup="dialog"
        className={cn(quickLinkClass, 'text-left')}
        onClick={() => {
          onSearchOpen?.()
          requestAnimationFrame(openSearch)
        }}
        type="button"
      >
        <SearchBoldIcon aria-hidden="true" />
        Search
        <kbd
          aria-hidden="true"
          className={cn(
            'ml-auto flex h-[18px] items-center rounded-[5px] border-[0.5px] border-border bg-background px-1 font-sans text-[10px] text-muted-foreground shadow-[0_1px_1px_rgb(0_0_0/0.04)]',
            !searchLabel && 'invisible',
          )}
        >
          {searchLabel ?? '⌘K'}
        </kbd>
      </button>
    </nav>
  )
}

function SearchButton() {
  const openSearch = useOpenSearch()

  return (
    <button
      aria-haspopup="dialog"
      aria-label="Search"
      className={cn(
        'flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted',
        focusRing,
      )}
      onClick={openSearch}
      type="button"
    >
      <SearchIcon aria-hidden="true" className="size-4.5" />
    </button>
  )
}

function SidebarDrawer({ activeSlug }: { activeSlug: string }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(pathname)

  if (openedAt !== pathname) {
    setOpenedAt(pathname)
    setOpen(false)
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger
        aria-controls="landing-sidebar-drawer"
        aria-label="Open components menu"
        className={cn(
          '-mr-2 flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden',
          focusRing,
        )}
      >
        <MenuIcon aria-hidden="true" className="size-4.5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none lg:hidden dark:bg-black/60" />
        <Dialog.Popup
          aria-label="Components"
          className="fixed inset-y-0 left-0 z-50 flex w-[min(300px,85vw)] flex-col bg-background pt-14 pr-2 pl-6 text-foreground shadow-xl transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:-translate-x-full data-starting-style:-translate-x-full motion-reduce:transition-none lg:hidden"
          id="landing-sidebar-drawer"
        >
          <Dialog.Close
            aria-label="Close components menu"
            className={cn(
              'absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              focusRing,
            )}
          >
            <CloseIcon aria-hidden="true" className="size-4.5" />
          </Dialog.Close>
          <SidebarContent
            activeSlug={activeSlug}
            headerClassName="absolute top-3 right-14 left-6 h-9"
            onSearchOpen={() => setOpen(false)}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface LandingShellProps {
  activeSlug: string
  children: ReactNode
  heading?: { title: string; description: string }
}

export function LandingShell({ activeSlug, children, heading }: LandingShellProps) {
  const content = (
    <div className="relative mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
      <div className="flex h-15 items-center gap-1 lg:hidden">
        <BrandMenu />
        <div className="ml-auto flex items-center gap-1">
          <SearchButton />
          <SidebarDrawer activeSlug={activeSlug} />
        </div>
      </div>
      <div className="pt-2 lg:pt-6">{children}</div>
    </div>
  )

  return (
    <SearchProvider>
      <div className="isolate flex h-dvh overflow-hidden bg-(--shell) text-foreground">
        <aside
          aria-label="Components"
          className="dark hidden h-full w-56 shrink-0 flex-col gap-3 pt-4 pl-4 text-foreground lg:flex xl:w-60"
        >
          <SidebarContent activeSlug={activeSlug} headerClassName="mr-2 h-8" />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col lg:pl-4">
          {heading && (
            <div className="dark hidden h-14 shrink-0 items-center gap-2.5 pt-4 pr-2 pb-2 lg:flex">
              <h1 className="shrink-0 truncate text-[16px] leading-[1.3] font-[550] tracking-[-0.015em] text-foreground">
                {heading.title}
              </h1>
              <span aria-hidden="true" className="h-3.5 w-px shrink-0 bg-border" />
              <p className="min-w-0 truncate paragraph-text-sm font-[500] text-muted-foreground">
                {heading.description}
              </p>
              <ComponentViewToggle className="ml-auto shrink-0" />
            </div>
          )}
          <main
            className={cn(
              'min-w-0 flex-1 overflow-y-auto overscroll-contain bg-[color-mix(in_oklab,var(--background),var(--muted)_55%)] lg:mr-2 lg:mb-2 lg:rounded-[16px] lg:shadow-[0_1px_2px_rgb(0_0_0/0.2)] dark:bg-neutral-950 dark:lg:shadow-[0_0_0_1px_rgb(255_255_255/0.04)]',
              heading ? 'bg-background dark:bg-black' : 'lg:mt-2',
            )}
            data-inset-scroll
            data-scroll-restoration-id="main-content"
            id="main-content"
          >
            {content}
          </main>
        </div>
      </div>
    </SearchProvider>
  )
}
