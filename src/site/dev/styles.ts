import { cn } from '#/lib/utils'

export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-[oklch(62.6%_0.205_254.947)]'

export const labelText =
  'text-[11px] leading-4 font-[500] text-neutral-900/44 dark:text-neutral-100/44'

export const fieldClass =
  'h-7 rounded-md border-[0.5px] border-neutral-900/12 bg-neutral-900/3 px-2 text-[12px] text-neutral-900/88 tabular-nums outline-hidden focus-visible:border-neutral-900/30 dark:border-neutral-100/14 dark:bg-neutral-100/5 dark:text-neutral-100/90 dark:focus-visible:border-neutral-100/30'

export const buttonClass = cn(
  'inline-flex h-7 items-center justify-center gap-1.5 rounded-md border-[0.5px] border-neutral-900/12 px-2 text-[12px] font-[500] text-neutral-900/88 transition-[background-color,color] hover:bg-neutral-900/5 disabled:pointer-events-none disabled:opacity-45 dark:border-neutral-100/14 dark:text-neutral-100/90 dark:hover:bg-neutral-100/8',
  focusRing,
)

export const ink = 'text-neutral-900/88 dark:text-neutral-100/90'
export const muted = 'text-neutral-900/60 dark:text-neutral-100/60'
export const hairline = 'border-neutral-900/10 dark:border-neutral-100/10'
export const activeClass =
  'border-[oklch(62.6%_0.205_254.947)] bg-[oklch(62.6%_0.205_254.947/0.1)] text-[oklch(55%_0.205_254.947)] hover:bg-[oklch(62.6%_0.205_254.947/0.14)] dark:border-[oklch(62.6%_0.205_254.947)] dark:text-[oklch(72%_0.16_254.947)]'
export const hintClass = cn('text-[11px] leading-4', muted)

export function tabId(idBase: string, id: string) {
  return `${idBase}-tab-${id}`
}

export function panelId(idBase: string, id: string) {
  return `${idBase}-panel-${id}`
}
