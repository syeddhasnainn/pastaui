import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import { CheckCircleIcon as CheckCircle2Icon } from '@solar-icons/react/linear/check-circle'
import { ClockCircleIcon as Clock3Icon } from '@solar-icons/react/linear/clock-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface TaskCardProps extends React.ComponentProps<'article'> {
  agent?: string
  description?: string
  duration?: string
  onOpen?: () => void
  result?: string
  status: 'complete' | 'queued' | 'running'
  title: string
}

function TaskIcon({ status }: Pick<TaskCardProps, 'status'>) {
  if (status === 'complete')
    return (
      <CheckCircle2Icon
        aria-label="Complete"
        className="size-4 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-90 starting:opacity-0 motion-reduce:starting:scale-100"
      />
    )
  if (status === 'running')
    return (
      <LoaderCircleIcon
        aria-label="Running"
        className="size-4 animate-spin motion-reduce:animate-none"
      />
    )
  return <Clock3Icon aria-label="Queued" className="size-4 text-muted-foreground" />
}

function TaskCard({
  agent,
  className,
  description,
  duration,
  onOpen,
  result,
  status,
  title,
  ...props
}: TaskCardProps) {
  return (
    <article
      data-slot="task-card"
      className={cn(
        'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <div className="p-4">
        <header className="flex items-start gap-3">
          <span className="mt-0.5 flex size-5 items-center justify-center">
            <TaskIcon status={status} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="card-heading">{title}</h3>
            {description && (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground capitalize">{status}</span>
        </header>
        {result && (
          <div className="mt-4 rounded-[10px] bg-muted/45 p-3 text-xs leading-5 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0">
            {result}
          </div>
        )}
      </div>
      <footer className="flex items-center gap-2 bg-muted/30 px-4 py-3">
        {agent && <span className="text-xs leading-5 text-muted-foreground">{agent}</span>}
        {duration && <span className="text-xs leading-5 text-muted-foreground">· {duration}</span>}
        <Button className="ml-auto" onClick={onOpen} size="sm" type="button" variant="ghost">
          Open task{' '}
          <ArrowUpRightIcon
            data-icon="inline-end"
            className="transition-[translate] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/button:translate-x-px group-hover/button:-translate-y-px motion-reduce:transition-none"
          />
        </Button>
      </footer>
    </article>
  )
}

export { TaskCard }
export type { TaskCardProps }
