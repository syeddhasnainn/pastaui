import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
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

function InboxStatus({ status }: Pick<BackgroundInboxItem, 'status'>) {
  if (status === 'ready') return <CheckIcon aria-label="Ready" className="size-3.5" />
  if (status === 'running')
    return <LoaderCircleIcon aria-label="Running" className="size-3.5 animate-spin" />
  return <Clock3Icon aria-label="Waiting" className="size-3.5 text-muted-foreground" />
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
        'overflow-hidden rounded-md bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2 px-4 py-3">
        <InboxIcon className="size-4 text-muted-foreground" />
        <h3 className="card-heading">Background inbox</h3>
        <span className="ml-auto text-xs leading-5 text-muted-foreground">{ready} ready</span>
      </header>
      <ul className="flex flex-col gap-1 bg-muted/30 p-2">
        {items.map((item) => (
          <li
            className="group flex items-start gap-2 rounded-md bg-card p-2.5 shadow-card"
            key={item.id}
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground">
              <InboxStatus status={item.status} />
            </span>
            <button
              className="min-w-0 flex-1 text-left"
              onClick={() => onSelect?.(item.id)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-[450]">{item.title}</span>
                {item.time && (
                  <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                    {item.time}
                  </span>
                )}
              </span>
              {item.detail && (
                <span className="mt-0.5 block truncate text-xs leading-5 text-muted-foreground">
                  {item.detail}
                </span>
              )}
            </button>
            <Button
              aria-label={`Dismiss ${item.title}`}
              className="opacity-0 group-hover:opacity-100"
              onClick={() => onDismiss?.(item.id)}
              size="icon-xs"
              type="button"
              variant="ghost"
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export { BackgroundInbox }
export type { BackgroundInboxItem, BackgroundInboxProps }
