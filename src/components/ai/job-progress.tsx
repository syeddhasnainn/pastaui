import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { RecordCircleIcon as CircleIcon } from '@solar-icons/react/linear/record-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { CloseIcon as XIcon } from '@solar-icons/react/linear/close'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface JobStage {
  id: string
  label: string
  status: 'complete' | 'pending' | 'running'
  weight?: number
}

interface JobProgressProps extends React.ComponentProps<'section'> {
  eta?: string
  onCancel?: () => void
  stages: JobStage[]
  title: string
}

function JobProgress({ className, eta, onCancel, stages, title, ...props }: JobProgressProps) {
  const totalWeight = stages.reduce((sum, stage) => sum + (stage.weight ?? 1), 0)
  const completeWeight = stages.reduce(
    (sum, stage) => sum + (stage.status === 'complete' ? (stage.weight ?? 1) : 0),
    0,
  )
  const progress = totalWeight ? Math.round((completeWeight / totalWeight) * 100) : 0

  return (
    <section
      data-slot="job-progress"
      className={cn(
        'rounded-md bg-card p-4 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="card-heading">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {eta ? `${progress}% complete · ${eta} remaining` : `${progress}% complete`}
          </p>
        </div>
        {onCancel && (
          <Button aria-label="Cancel job" onClick={onCancel} size="icon-sm" variant="ghost">
            <XIcon />
          </Button>
        )}
      </div>
      <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-muted">
        {stages.map((stage) => (
          <span
            className={cn(
              'h-full border-r border-background last:border-r-0',
              stage.status === 'complete' && 'bg-foreground',
              stage.status === 'running' && 'animate-pulse bg-foreground/55',
            )}
            key={stage.id}
            style={{ width: `${((stage.weight ?? 1) / totalWeight) * 100}%` }}
          />
        ))}
      </div>
      <ol className="mt-4 space-y-2">
        {stages.map((stage) => (
          <li className="flex items-center gap-2 text-sm" key={stage.id}>
            <StageIcon status={stage.status} />
            <span className={cn(stage.status === 'pending' && 'text-muted-foreground')}>
              {stage.label}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function StageIcon({ status }: Pick<JobStage, 'status'>) {
  if (status === 'complete') return <CheckIcon aria-label="Complete" className="size-3.5" />
  if (status === 'running')
    return <LoaderCircleIcon aria-label="Running" className="size-3.5 animate-spin" />
  return <CircleIcon aria-label="Pending" className="size-3 text-muted-foreground" />
}

export { JobProgress }
export type { JobProgressProps, JobStage }
