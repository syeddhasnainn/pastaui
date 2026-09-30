import { BellIcon } from '@solar-icons/react/linear/bell'
import { CheckCircleIcon as CheckCircle2Icon } from '@solar-icons/react/linear/check-circle'
import { DangerCircleIcon as CircleAlertIcon } from '@solar-icons/react/linear/danger-circle'
import { ClockCircleIcon as Clock3Icon } from '@solar-icons/react/linear/clock-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { CloseIcon as XIcon } from '@solar-icons/react/linear/close'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface BackgroundRun {
  detail?: string
  id: string
  label: string
  progress?: number
  status: 'complete' | 'failed' | 'queued' | 'running'
  updatedAt?: string
}

interface BackgroundRunsProps extends React.ComponentProps<'section'> {
  items: BackgroundRun[]
  onCancel?: (id: string) => void
  onOpen?: (id: string) => void
}

function BackgroundRuns({ className, items, onCancel, onOpen, ...props }: BackgroundRunsProps) {
  const active = items.filter(
    (item) => item.status === 'queued' || item.status === 'running',
  ).length

  return (
    <section
      data-slot="background-runs"
      className={cn(
        'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2 p-3">
        <BellIcon className="size-4 text-muted-foreground" />
        <h3 className="card-heading">Background runs</h3>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {active} active
        </span>
      </header>
      <ul className="space-y-1 border-t border-foreground/8 p-2">
        {items.map((item) => (
          <li className="group rounded-md p-2.5 transition-colors hover:bg-muted/55" key={item.id}>
            <div className="flex items-start gap-2.5">
              <RunStatus status={item.status} />
              <button
                className="min-w-0 flex-1 text-left"
                onClick={() => onOpen?.(item.id)}
                type="button"
              >
                <span className="block truncate text-sm font-[450]">{item.label}</span>
                {item.detail && (
                  <span className="mt-0.5 block truncate text-xs leading-5 text-muted-foreground">
                    {item.detail}
                  </span>
                )}
              </button>
              {item.updatedAt && (
                <time className="shrink-0 text-[11px] text-muted-foreground">{item.updatedAt}</time>
              )}
              {(item.status === 'queued' || item.status === 'running') && (
                <Button
                  aria-label={`Cancel ${item.label}`}
                  onClick={() => onCancel?.(item.id)}
                  size="icon-xs"
                  variant="ghost"
                >
                  <XIcon />
                </Button>
              )}
            </div>
            {item.status === 'running' && item.progress !== undefined && (
              <div className="mt-2 ml-6 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground transition-[width]"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function RunStatus({ status }: Pick<BackgroundRun, 'status'>) {
  if (status === 'complete')
    return <CheckCircle2Icon aria-label="Complete" className="mt-0.5 size-4 text-emerald-600" />
  if (status === 'failed')
    return <CircleAlertIcon aria-label="Failed" className="mt-0.5 size-4 text-destructive" />
  if (status === 'running')
    return <LoaderCircleIcon aria-label="Running" className="mt-0.5 size-4 animate-spin" />
  return <Clock3Icon aria-label="Queued" className="mt-0.5 size-4 text-muted-foreground" />
}

export { BackgroundRuns }
export type { BackgroundRun, BackgroundRunsProps }
