import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { RecordCircleIcon as CircleIcon } from '@solar-icons/react/linear/record-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { ToolboxIcon as WrenchIcon } from '@solar-icons/react/linear/toolbox'
import * as React from 'react'

import { cn } from 'cn'

interface ToolTimelineItem {
  detail?: string
  id: string
  status: 'complete' | 'pending' | 'running'
  target?: string
  time?: string
  verb: string
}

interface ToolTimelineProps extends React.ComponentProps<'section'> {
  items: ToolTimelineItem[]
  summary?: string
  title?: string
}

function TimelineStatus({ status }: Pick<ToolTimelineItem, 'status'>) {
  if (status === 'complete') return <CheckIcon aria-label="Complete" className="size-3" />
  if (status === 'running')
    return <LoaderCircleIcon aria-label="Running" className="size-3 animate-spin" />
  return <CircleIcon aria-label="Pending" className="size-2.5 text-muted-foreground" />
}

function ToolTimeline({
  className,
  items,
  summary,
  title = 'Tool timeline',
  ...props
}: ToolTimelineProps) {
  return (
    <section
      data-slot="tool-timeline"
      className={cn(
        'rounded-md bg-card p-4 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2">
        <WrenchIcon className="size-4 text-muted-foreground" />
        <h3 className="card-heading">{title}</h3>
        {summary && (
          <span className="ml-auto text-xs leading-5 text-muted-foreground">{summary}</span>
        )}
      </header>

      <ol className="mt-4">
        {items.map((item, index) => (
          <li className="relative flex gap-3 pb-4 last:pb-0" key={item.id}>
            {index < items.length - 1 && (
              <span className="absolute top-5 bottom-0 left-2 w-px bg-border" aria-hidden="true" />
            )}
            <span className="relative z-10 flex size-4 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-foreground/15">
              <TimelineStatus status={item.status} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs leading-5 font-medium">{item.verb}</span>
                {item.target && <span className="truncate text-xs leading-5">{item.target}</span>}
                {item.time && (
                  <time className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                    {item.time}
                  </time>
                )}
              </div>
              {item.detail && (
                <p className="mt-1 text-[11px] text-muted-foreground">{item.detail}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export { ToolTimeline }
export type { ToolTimelineItem, ToolTimelineProps }
