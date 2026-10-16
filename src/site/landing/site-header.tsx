import { Menu } from '@base-ui/react/menu'
import { Link, useRouterState } from '@tanstack/react-router'
import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import MenuIcon from '~icons/solar/hamburger-menu-linear'
import SearchIcon from '~icons/solar/magnifier-linear'
import GithubIcon from '~icons/simple-icons/github'

import { LogoMark } from '#/site/brand/logo-mark'
import { useOpenSearch } from '#/site/docs/component-search'
import { focusRing } from '#/site/landing/focus-ring'
import { useThemeToggle } from '#/site/theme-toggle'
import { githubUrl } from '#/lib/seo'
import { cn } from '#/lib/utils'
import MoonIcon from '~icons/solar/moon-bold'
import SunIcon from '~icons/solar/sun-2-bold'

const pillLinkClass = cn(
  'relative flex h-7 items-center rounded-full px-3 text-[14px] font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground aria-[current=page]:text-foreground',
  focusRing,
)

const roundButtonClass = cn(
  'flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground/7 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground',
  focusRing,
)

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const openSearch = useOpenSearch()
  const { label: themeLabel, toggleTheme } = useThemeToggle()

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 bg-background px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link aria-label="Pasta UI home" className={cn('shrink-0 rounded-md', focusRing)} to="/">
          <LogoMark size={36} />
        </Link>
        <PrimaryNav className="hidden sm:flex" pathname={pathname} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          aria-haspopup="dialog"
          aria-label="Search components"
          className={cn(roundButtonClass, 'w-9')}
          onClick={openSearch}
          type="button"
        >
          <SearchIcon aria-hidden="true" className="size-4" />
        </button>
        <button
          aria-label={themeLabel}
          className={cn(roundButtonClass, 'hidden w-9 md:flex')}
          onClick={toggleTheme}
          title={themeLabel}
          type="button"
        >
          <MoonIcon aria-hidden="true" className="size-4 dark:hidden" />
          <SunIcon aria-hidden="true" className="hidden size-4 dark:block" />
        </button>
        <a
          aria-label="GitHub"
          className={cn(roundButtonClass, 'hidden w-9 md:flex')}
          href={githubUrl}
          rel="noreferrer"
          target="_blank"
        >
          <GithubIcon aria-hidden="true" className="size-4" />
        </a>
        <a
          className={cn(
            roundButtonClass,
            'hidden gap-1 px-4 text-[14px] font-semibold text-foreground md:flex',
          )}
          href="https://pro.pastaui.com/"
          rel="noreferrer"
          target="_blank"
        >
          Get Pro
          <ArrowUpRightIcon aria-hidden="true" className="size-4" />
        </a>
        <MobileMenu pathname={pathname} themeLabel={themeLabel} toggleTheme={toggleTheme} />
      </div>
    </header>
  )
}

function PrimaryNav({ pathname, className }: { pathname: string; className?: string }) {
  const items = [
    { key: 'installation', active: pathname === '/docs/installation' },
    { key: 'components', active: pathname.startsWith('/docs/component') },
    { key: 'blog', active: pathname.startsWith('/blog') },
  ]
  const activeKey = items.find((item) => item.active)?.key ?? null
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const [animate, setAnimate] = useState(false)

  useLayoutEffect(() => {
    const element = activeKey ? linkRefs.current.get(activeKey) : undefined
    if (element) setIndicator({ left: element.offsetLeft, width: element.offsetWidth })
  }, [activeKey])

  useLayoutEffect(() => {
    if (!indicator || animate) return
    const frame = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(frame)
  }, [indicator, animate])

  const register = (key: string) => (element: HTMLAnchorElement | null) => {
    if (element) linkRefs.current.set(key, element)
    else linkRefs.current.delete(key)
  }
  const current = (key: string) => (activeKey === key ? ('page' as const) : undefined)

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'relative isolate h-9 items-center gap-0.5 rounded-full bg-foreground/7 p-1',
        className,
      )}
    >
      {indicator ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1 left-0 -z-10 h-7 rounded-full bg-foreground/10 motion-reduce:transition-none',
            animate &&
              'transition-[translate,width,opacity] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
            !activeKey && 'opacity-0',
          )}
          style={{ translate: `${indicator.left}px 0`, width: indicator.width }}
        />
      ) : null}
      <Link
        aria-current={current('installation')}
        className={pillLinkClass}
        ref={register('installation')}
        to="/docs/installation"
      >
        Installation
      </Link>
      <Link
        aria-current={current('components')}
        className={pillLinkClass}
        ref={register('components')}
        to="/docs/component"
      >
        Components
      </Link>
      <Link
        aria-current={current('blog')}
        className={pillLinkClass}
        ref={register('blog')}
        to="/blog"
      >
        Blog
      </Link>
    </nav>
  )
}

const menuItemClass =
  'flex h-9 cursor-default items-center gap-2.5 rounded-[10px] px-3 text-[14px] font-medium text-muted-foreground outline-none select-none data-[highlighted]:bg-foreground/7 data-[highlighted]:text-foreground aria-[current=page]:text-foreground [&>svg]:size-4 [&>svg]:shrink-0'

function MobileMenu({
  pathname,
  themeLabel,
  toggleTheme,
}: {
  pathname: string
  themeLabel: string
  toggleTheme: () => void
}) {
  const links = [
    { to: '/docs/installation', label: 'Installation', active: pathname === '/docs/installation' },
    { to: '/docs/component', label: 'Components', active: pathname.startsWith('/docs/component') },
    { to: '/blog', label: 'Blog', active: pathname.startsWith('/blog') },
  ] as const

  return (
    <Menu.Root>
      <Menu.Trigger aria-label="Open menu" className={cn(roundButtonClass, 'w-9 md:hidden')}>
        <MenuIcon aria-hidden="true" className="size-4" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" className="z-50" sideOffset={8}>
          <Menu.Popup className="flex w-56 origin-(--transform-origin) flex-col rounded-xl border-[0.5px] border-foreground/10 bg-popover p-1 text-popover-foreground shadow-[0_12px_32px_rgb(0_0_0/.18)] transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-[0.96] data-ending-style:opacity-0 data-starting-style:scale-[0.96] data-starting-style:opacity-0 motion-reduce:transition-none dark:shadow-[0_12px_32px_rgb(0_0_0/.5)]">
            <Menu.Group className="flex flex-col sm:hidden">
              {links.map((link) => (
                <Menu.Item
                  aria-current={link.active ? 'page' : undefined}
                  className={menuItemClass}
                  key={link.to}
                  render={<Link to={link.to} />}
                >
                  {link.label}
                </Menu.Item>
              ))}
              <Menu.Separator className="mx-2 my-1 h-px bg-border" />
            </Menu.Group>
            <Menu.Item className={menuItemClass} onClick={toggleTheme}>
              <MoonIcon aria-hidden="true" className="dark:hidden" />
              <SunIcon aria-hidden="true" className="hidden dark:block" />
              {themeLabel}
            </Menu.Item>
            <Menu.Item
              className={menuItemClass}
              render={(props) => (
                <a {...props} href={githubUrl} rel="noreferrer" target="_blank">
                  {props.children}
                </a>
              )}
            >
              <GithubIcon aria-hidden="true" />
              GitHub
            </Menu.Item>
            <Menu.Item
              className={cn(menuItemClass, 'text-foreground')}
              render={(props) => (
                <a {...props} href="https://pro.pastaui.com/" rel="noreferrer" target="_blank">
                  {props.children}
                </a>
              )}
            >
              <ArrowUpRightIcon aria-hidden="true" />
              Get Pro
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
