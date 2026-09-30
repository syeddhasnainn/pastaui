import { CalendarDateIcon as CalendarClockIcon } from '@solar-icons/react/linear/calendar-date'
import { ClockCircleIcon as Clock3Icon } from '@solar-icons/react/linear/clock-circle'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface ScheduleCardProps extends React.ComponentProps<'article'> {
  description?: string
  nextRun: string
  onEdit?: () => void
  onToggle?: () => void
  schedule: string
  status?: 'active' | 'paused'
  timezone?: string
  title: string
}

function ScheduleCard({
  className,
  description,
  nextRun,
  onEdit,
  onToggle,
  schedule,
  status = 'active',
  timezone,
  title,
  ...props
}: ScheduleCardProps) {
  const isPaused = status === 'paused'

  return (
    <article
      data-slot="schedule-card"
      className={cn(
        'rounded-[16px] bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
          <CalendarClockIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate card-heading">{title}</h3>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs leading-5 font-[450] text-muted-foreground capitalize">
              {status}
            </span>
          </div>
          {description && (
            <p className="mt-1 text-xs leading-5 font-[450] text-muted-foreground">{description}</p>
          )}
        </div>
      </header>

      <dl className="mt-5 grid gap-3 rounded-[10px] bg-muted/45 p-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs leading-5 font-[450] text-muted-foreground">Schedule</dt>
          <dd className="mt-1 text-sm font-[450]">{schedule}</dd>
        </div>
        <div>
          <dt className="text-xs leading-5 font-[450] text-muted-foreground">Next run</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm font-[450]">
            <Clock3Icon className="size-3.5 shrink-0 text-muted-foreground" />
            {nextRun}
          </dd>
        </div>
      </dl>

      <footer className="mt-4 flex flex-wrap items-center gap-2">
        {timezone && (
          <span className="text-xs leading-5 font-[450] text-muted-foreground">{timezone}</span>
        )}
        <div className="ml-auto flex gap-2">
          <Button
            className="h-7 gap-2 rounded-full px-3 text-sm font-[450] tracking-[-0.05px] text-muted-foreground hover:text-muted-foreground"
            onClick={onEdit}
            size="sm"
            type="button"
            variant="ghost"
          >
            Edit
          </Button>
          <Button
            className="h-7 gap-2 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-sm font-[450] tracking-[-0.05px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
            onClick={onToggle}
            size="sm"
            type="button"
            variant="default"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </footer>
    </article>
  )
}

export { ScheduleCard }
export type { ScheduleCardProps }
