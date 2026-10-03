import { CalendarDateIcon as CalendarClockIcon } from '@solar-icons/react/linear/calendar-date'
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
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-foreground/6 text-muted-foreground">
          <CalendarClockIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="min-w-0 flex-1 truncate text-[15px] leading-6 font-medium text-foreground">
              {title}
            </h3>
            <span
              className="flex shrink-0 items-center gap-1.5 text-xs leading-5 text-muted-foreground transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-95 starting:opacity-0 motion-reduce:starting:scale-100"
              key={status}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-1.5 rounded-full',
                  isPaused ? 'bg-muted-foreground/60' : 'bg-emerald-500',
                )}
              />
              {isPaused ? 'Paused' : 'Active'}
            </span>
          </div>
          {description && (
            <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{description}</p>
          )}
        </div>
      </header>

      <dl className="mt-5 grid gap-3 rounded-[12px] bg-foreground/4 p-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs leading-5 text-muted-foreground">Schedule</dt>
          <dd className="mt-0.5 text-sm text-foreground/85">
            {schedule}
            {timezone && <span className="text-muted-foreground"> {timezone}</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs leading-5 text-muted-foreground">Next run</dt>
          <dd
            className={cn(
              'mt-0.5 text-sm',
              isPaused ? 'text-muted-foreground' : 'text-foreground/85',
            )}
          >
            {isPaused ? 'Not scheduled' : nextRun}
          </dd>
        </div>
      </dl>

      <footer className="mt-4 flex justify-end gap-2">
        <Button
          className="h-7 rounded-full bg-foreground/8 px-3 text-sm font-[450] tracking-[-0.05px] text-foreground/85 hover:bg-foreground/12 hover:text-foreground"
          onClick={onEdit}
          size="sm"
          type="button"
          variant="ghost"
        >
          Edit
        </Button>
        <Button
          className="h-7 rounded-full bg-foreground/8 px-3 text-sm font-[450] tracking-[-0.05px] text-foreground/85 hover:bg-foreground/12 hover:text-foreground"
          onClick={onToggle}
          size="sm"
          type="button"
          variant="ghost"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </footer>
    </article>
  )
}

export { ScheduleCard }
export type { ScheduleCardProps }
