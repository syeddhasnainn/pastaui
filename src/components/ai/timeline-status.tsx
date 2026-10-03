import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'

import { cn } from 'cn'

type TimelineStatus = 'complete' | 'pending' | 'running'

const timelineLabelTone: Record<TimelineStatus, string> = {
  complete: 'text-muted-foreground',
  pending: 'text-muted-foreground/55',
  running: 'text-foreground',
}

const timelineDetailTone: Record<TimelineStatus, string> = {
  complete: 'text-muted-foreground/55',
  pending: 'text-muted-foreground/45',
  running: 'text-muted-foreground',
}

const timelineStatusLabel: Record<TimelineStatus, string> = {
  complete: 'Complete',
  pending: 'Pending',
  running: 'Running',
}

function TimelineStatusIcon({ className, status }: { className?: string; status: TimelineStatus }) {
  return (
    <span className={cn('flex size-4 shrink-0 items-center justify-center', className)}>
      {status === 'complete' ? (
        <svg
          aria-hidden="true"
          className="size-3.5 text-muted-foreground transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-90 starting:opacity-0 motion-reduce:starting:scale-100"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          viewBox="0 0 16 16"
        >
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
      ) : status === 'running' ? (
        <LoaderCircleIcon
          aria-hidden="true"
          className="size-3.5 animate-spin text-blue-500 motion-reduce:animate-none dark:text-blue-400"
        />
      ) : (
        <span
          aria-hidden="true"
          className="size-3 rounded-full border-[1.5px] border-muted-foreground/45"
        />
      )}
      <span className="sr-only">{timelineStatusLabel[status]}</span>
    </span>
  )
}

function TimelineConnector({ reached }: { reached: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute top-6 bottom-1 left-2 w-px -translate-x-1/2 transition-colors duration-200 ease-out',
        reached ? 'bg-foreground/25' : 'bg-foreground/8',
      )}
    />
  )
}

export { TimelineConnector, TimelineStatusIcon, timelineDetailTone, timelineLabelTone }
export type { TimelineStatus }
