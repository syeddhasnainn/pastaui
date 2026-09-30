import { Menu } from '@base-ui/react/menu'
import { Link } from '@tanstack/react-router'
import { useSyncExternalStore } from 'react'
import GithubIcon from '~icons/simple-icons/github'
import ChevronDownIcon from '~icons/solar/alt-arrow-down-linear'
import ArrowUpRightIcon from '~icons/solar/arrow-right-up-linear'
import DownloadIcon from '~icons/solar/download-minimalistic-linear'
import HomeIcon from '~icons/solar/home-2-linear'
import SearchIcon from '~icons/solar/magnifier-linear'
import ShieldIcon from '~icons/solar/shield-check-bold'

import { BrandMark } from '#/site/brand-mark'
import { useOpenSearch } from '#/site/docs/component-search'
import { focusRing } from '#/site/landing/focus-ring'
import { githubUrl } from '#/lib/seo'
import { cn } from '#/lib/utils'

const itemClass =
  'flex h-8 cursor-default items-center gap-2 rounded-[12px] px-2 sidebar-text-md text-foreground select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-[oklch(62.6%_0.205_254.947)] data-[highlighted]:bg-foreground/5 data-[disabled]:opacity-50 dark:focus-visible:outline-[oklch(68%_0.173_253.301)] dark:data-[highlighted]:bg-foreground/8 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground'

const subscribeToPlatform = () => () => {}

export function useShortcutLabel(key = 'K') {
  return useSyncExternalStore(
    subscribeToPlatform,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? `⌘${key}` : `Ctrl ${key}`),
    () => null,
  )
}

interface BrandMenuProps {
  className?: string
  onSearchOpen?: () => void
}

export function BrandMenu({ className, onSearchOpen }: BrandMenuProps) {
  const openSearch = useOpenSearch()
  const searchLabel = useShortcutLabel('K')

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open PastaUI menu"
        className={cn(
          '-ml-1 flex h-8 shrink-0 items-center gap-1 rounded-md px-1 text-foreground transition-[background-color] hover:bg-muted data-[popup-open]:bg-muted motion-reduce:transition-none',
          focusRing,
          className,
        )}
      >
        <BrandMark />
        <ChevronDownIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="start" className="z-50" sideOffset={6}>
          <Menu.Popup className="w-60 origin-(--transform-origin) rounded-[16px] border-[0.5px] border-foreground/10 bg-popover p-1 text-popover-foreground shadow-[0_8px_24px_rgb(23_23_23/.1),0_1px_2px_rgb(23_23_23/.06)] transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-[0.96] data-ending-style:opacity-0 data-starting-style:scale-[0.96] data-starting-style:opacity-0 motion-reduce:transition-none dark:shadow-[0_8px_24px_rgb(0_0_0/.5)]">
            <Menu.Item className={itemClass} render={<Link to="/" />}>
              <HomeIcon aria-hidden="true" />
              All
            </Menu.Item>
            <Menu.Item
              className={itemClass}
              onClick={() => {
                onSearchOpen?.()
                requestAnimationFrame(openSearch)
              }}
            >
              <SearchIcon aria-hidden="true" />
              Search
              <kbd
                aria-hidden="true"
                className={cn(
                  'ml-auto font-sans sidebar-text-sm text-muted-foreground',
                  !searchLabel && 'invisible',
                )}
              >
                {searchLabel ?? '⌘K'}
              </kbd>
            </Menu.Item>
            <Menu.Item className={itemClass} render={<Link to="/docs/installation" />}>
              <DownloadIcon aria-hidden="true" />
              Installation
            </Menu.Item>
            <Menu.Item
              className={itemClass}
              render={
                <a
                  aria-label="Pasta UI on GitHub"
                  href={githubUrl}
                  rel="noreferrer"
                  target="_blank"
                />
              }
            >
              <GithubIcon aria-hidden="true" />
              GitHub
            </Menu.Item>
            <Menu.Separator className="-mx-1 my-1 h-[0.5px] bg-foreground/10" />
            <Menu.Item
              className={itemClass}
              render={
                <a
                  aria-label="Get Pasta UI Pro"
                  href="https://pro.pastaui.com/"
                  rel="noreferrer"
                  target="_blank"
                />
              }
            >
              <ArrowUpRightIcon aria-hidden="true" />
              Get Pro
            </Menu.Item>
            <Menu.Item className={itemClass} render={<Link to="/privacy" />}>
              <ShieldIcon aria-hidden="true" />
              Privacy
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link
      aria-label="PastaUI home"
      className={cn(
        '-ml-1 flex h-8 shrink-0 items-center rounded-md px-1 text-foreground',
        focusRing,
        className,
      )}
      to="/"
    >
      <BrandMark />
    </Link>
  )
}
