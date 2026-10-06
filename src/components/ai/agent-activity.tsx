import * as React from 'react'

import {
  TimelineConnector,
  TimelineStatusIcon,
  timelineDetailTone,
  timelineLabelTone,
  type TimelineStatus,
} from '@/components/ai/timeline-status'
import { cn } from 'cn'

interface AgentActivityItem {
  detail?: string
  icon?: React.ReactNode
  id: string
  label: string
  status: 'complete' | 'running' | 'waiting'
}

interface AgentActivityProps extends React.ComponentProps<'ol'> {
  items: AgentActivityItem[]
}

const iconTone: Record<TimelineStatus, string> = {
  complete: 'text-muted-foreground',
  pending: 'text-muted-foreground/45',
  running: 'animate-pulse text-blue-500 motion-reduce:animate-none dark:text-blue-400',
}

const statusLabel: Record<TimelineStatus, string> = {
  complete: 'Complete',
  pending: 'Pending',
  running: 'Running',
}

function AgentActivityIcon({ icon, status }: { icon: React.ReactNode; status: TimelineStatus }) {
  return (
    <span
      className={cn(
        'mt-0.5 flex size-4 shrink-0 items-center justify-center transition-colors duration-200 ease-out [&>svg]:size-3.5',
        iconTone[status],
      )}
    >
      {icon}
      <span className="sr-only">{statusLabel[status]}</span>
    </span>
  )
}

const toTimelineStatus = (status: AgentActivityItem['status']): TimelineStatus =>
  status === 'waiting' ? 'pending' : status

function AgentActivity({ className, items, ...props }: AgentActivityProps) {
  return (
    <ol
      data-slot="agent-activity"
      className={cn(
        'font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const status = toTimelineStatus(item.status)
        const next = items[index + 1]

        return (
          <li
            className="relative flex gap-3 pb-5 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] last:pb-0 starting:opacity-0"
            key={item.id}
          >
            {next && <TimelineConnector reached={next.status !== 'waiting'} />}
            {item.icon ? (
              <AgentActivityIcon icon={item.icon} status={status} />
            ) : (
              <TimelineStatusIcon className="mt-0.5" status={status} />
            )}
            <div className="min-w-0 flex-1">
              <p className={cn('text-sm leading-5', timelineLabelTone[status])}>{item.label}</p>
              {item.detail && (
                <p className={cn('mt-0.5 text-xs leading-4', timelineDetailTone[status])}>
                  {item.detail}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { AgentActivity }
export type { AgentActivityItem, AgentActivityProps }
