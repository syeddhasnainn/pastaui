import { useSyncExternalStore } from 'react'
import ArrowUpRightIcon from '~icons/solar/arrow-right-up-linear'
import CloseIcon from '~icons/solar/close-linear'

import { focusRing } from '#/site/landing/focus-ring'
import { cn } from '#/lib/utils'

const DISMISS_KEY = 'pastaui-sidebar-pro-dismissed'
const dismissListeners = new Set<() => void>()

function subscribeToDismiss(listener: () => void) {
  dismissListeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    dismissListeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

function dismissCard() {
  try {
    localStorage.setItem(DISMISS_KEY, '1')
  } catch {}
  for (const listener of dismissListeners) listener()
}

function useDismissed() {
  return useSyncExternalStore(subscribeToDismiss, readDismissed, () => true)
}

function ProCard() {
  const dismissed = useDismissed()

  if (dismissed) return null

  return (
    <div className="relative rounded-[16px] border-[0.5px] border-border bg-linear-to-b from-surface to-background p-2.5">
      <span className="flex h-[18px] w-fit items-center justify-center rounded-full bg-[oklch(62.6%_0.205_254.947/0.12)] px-1.5 text-[11px] leading-none font-[550] text-[oklch(50%_0.2_257)] dark:text-[oklch(78%_0.12_253)]">
        Pasta UI Pro
      </span>
      <p className="mt-1.5 pr-5 text-[13px] leading-[1.35] font-[550] text-foreground">
        Premium blocks and pages
      </p>
      <p className="mt-0.5 pr-5 text-[12px] leading-[1.4] text-muted-foreground">
        Application blocks and full landing pages in the same system.
      </p>
      <a
        className={cn(
          'group mt-3 flex h-8 w-full items-center justify-center gap-1 rounded-full bg-[oklch(62.6%_0.205_254.947)] text-[13px] font-[550] text-white transition-[background-color] hover:bg-[oklch(55.6%_0.187_255.617)] motion-reduce:transition-none dark:bg-[oklch(68%_0.173_253.301)] dark:text-[#0A0A0A] dark:hover:bg-[oklch(74%_0.15_251)]',
          focusRing,
        )}
        href="https://pro.pastaui.com/"
        rel="noreferrer"
        target="_blank"
      >
        Explore Pro
        <ArrowUpRightIcon
          aria-hidden="true"
          className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        />
      </a>
      <button
        aria-label="Dismiss Pro card"
        className={cn(
          'absolute top-2 right-1.5 flex size-5 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color] hover:bg-foreground/6 hover:text-foreground dark:text-foreground/60 dark:hover:bg-foreground/10 dark:hover:text-foreground',
          focusRing,
        )}
        onClick={dismissCard}
        type="button"
      >
        <CloseIcon aria-hidden="true" className="size-3" />
      </button>
    </div>
  )
}

export function SidebarFooter() {
  return (
    <div className="mr-2 -ml-2 flex shrink-0 flex-col gap-3 pb-4">
      <ProCard />
    </div>
  )
}
