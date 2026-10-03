import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/bold/check-circle'
import { ClockCircleIcon as Clock3Icon } from '@solar-icons/react/linear/clock-circle'
import { InboxIcon } from '@solar-icons/react/linear/inbox'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { CloseIcon as XIcon } from '@solar-icons/react/linear/close'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface BackgroundInboxItem {
  detail?: string
  id: string
  status: 'ready' | 'running' | 'waiting'
  time?: string
  title: string
}

interface BackgroundInboxProps extends Omit<React.ComponentProps<'section'>, 'onSelect'> {
  items: BackgroundInboxItem[]
  onDismiss?: (id: string) => void
  onSelect?: (id: string) => void
}

const titleTone: Record<BackgroundInboxItem['status'], string> = {
  ready: 'text-foreground',
  running: 'text-muted-foreground',
  waiting: 'text-muted-foreground/70',
}

function InboxStatus({ status }: Pick<BackgroundInboxItem, 'status'>) {
  if (status === 'ready')
    return (
      <CheckIcon
        aria-label="Ready"
        className="size-4 text-emerald-600 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] dark:text-emerald-500 starting:scale-90 starting:opacity-0 motion-reduce:starting:scale-100"
      />
    )
  if (status === 'running')
    return (
      <LoaderCircleIcon
        aria-label="Running"
        className="size-4 animate-spin text-blue-500 motion-reduce:animate-none dark:text-blue-400"
      />
    )
  return <Clock3Icon aria-label="Waiting" className="size-4 text-muted-foreground/70" />
}

function BackgroundInbox({
  className,
  items,
  onDismiss,
  onSelect,
  ...props
}: BackgroundInboxProps) {
  const ready = items.filter((item) => item.status === 'ready').length

  return (
    <section
      data-slot="background-inbox"
      className={cn(
        'rounded-[16px] bg-card p-2 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2 px-3 pt-2 pb-1">
        <InboxIcon className="size-4 text-muted-foreground" />
        <h3 className="text-sm leading-5 font-medium text-muted-foreground">Background inbox</h3>
        <span
          className={cn(
            'ml-auto rounded-full px-2 py-0.5 text-xs leading-5 tabular-nums',
            ready > 0
              ? 'bg-blue-500/12 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300'
              : 'bg-foreground/6 text-muted-foreground',
          )}
        >
          {ready} ready
        </span>
      </header>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li
            className="group relative rounded-[12px] px-3 py-3 transition-[opacity,translate,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-foreground/4 starting:-translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0"
            key={item.id}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 shrink-0 items-center">
                <InboxStatus status={item.status} />
              </span>
              <button
                className={cn(
                  'min-w-0 flex-1 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  onDismiss && 'pointer-coarse:pr-8',
                )}
                onClick={() => onSelect?.(item.id)}
                type="button"
              >
                <span className="flex items-baseline gap-3">
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span
                      className={cn(
                        'truncate text-[15px] leading-6 font-medium',
                        titleTone[item.status],
                      )}
                    >
                      {item.title}
                    </span>
                    {item.status === 'ready' && (
                      <>
                        <span
                          aria-hidden="true"
                          className="size-1.5 shrink-0 rounded-full bg-blue-500 dark:bg-blue-400"
                        />
                        <span className="sr-only">Unread</span>
                      </>
                    )}
                  </span>
                  {item.time && (
                    <span
                      className={cn(
                        'shrink-0 text-xs text-muted-foreground/70 tabular-nums',
                        onDismiss &&
                          'transition-opacity duration-150 ease-out group-focus-within:opacity-0 group-hover:opacity-0 pointer-coarse:opacity-100',
                      )}
                    >
                      {item.time}
                    </span>
                  )}
                </span>
                {item.detail && (
                  <span className="mt-0.5 block truncate text-[13px] leading-5 text-muted-foreground/70">
                    {item.detail}
                  </span>
                )}
              </button>
            </div>
            {onDismiss && (
              <Button
                aria-label={`Dismiss ${item.title}`}
                className="absolute top-3 right-3 opacity-0 transition-[opacity,background-color] duration-150 ease-out group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100"
                onClick={() => onDismiss(item.id)}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <XIcon />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export { BackgroundInbox }
export type { BackgroundInboxItem, BackgroundInboxProps }
