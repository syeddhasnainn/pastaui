import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/bold/check-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { CloseIcon as XIcon } from '@solar-icons/react/linear/close'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface JobStage {
  detail?: string
  id: string
  label: string
  progress?: number
  status: 'complete' | 'pending' | 'running'
  weight?: number
}

interface JobProgressProps extends React.ComponentProps<'section'> {
  eta?: string
  onCancel?: () => void
  stages: JobStage[]
  title: string
}

const labelTone: Record<JobStage['status'], string> = {
  complete: 'text-muted-foreground',
  pending: 'text-muted-foreground/60',
  running: 'text-foreground',
}

function stageFill(stage: JobStage) {
  if (stage.status === 'complete') return 1
  if (stage.status === 'running') return Math.min(Math.max(stage.progress ?? 0, 0), 1)
  return 0
}

function JobProgress({ className, eta, onCancel, stages, title, ...props }: JobProgressProps) {
  const totalWeight = stages.reduce((sum, stage) => sum + (stage.weight ?? 1), 0)
  const doneWeight = stages.reduce((sum, stage) => sum + (stage.weight ?? 1) * stageFill(stage), 0)
  const progress = totalWeight ? Math.round((doneWeight / totalWeight) * 100) : 0

  return (
    <section
      data-slot="job-progress"
      className={cn(
        'rounded-[16px] bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] leading-6 font-medium text-foreground">{title}</h3>
          <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground tabular-nums">
            {eta ? `${progress}% complete · ${eta} remaining` : `${progress}% complete`}
          </p>
        </div>
        {onCancel && (
          <Button aria-label="Cancel job" onClick={onCancel} size="icon-sm" variant="ghost">
            <XIcon />
          </Button>
        )}
      </div>
      <progress aria-label={`${title} progress`} className="sr-only" max={100} value={progress} />
      <div aria-hidden="true" className="mt-4 flex gap-1">
        {stages.map((stage) => (
          <span
            className="h-1.5 overflow-hidden rounded-full bg-foreground/8"
            key={stage.id}
            style={{ flexGrow: stage.weight ?? 1, flexBasis: 0 }}
          >
            <span
              className="block h-full origin-left rounded-full bg-blue-500 transition-[scale] duration-300 ease-linear dark:bg-blue-400"
              style={{ scale: `${stageFill(stage)} 1` }}
            />
          </span>
        ))}
      </div>
      <ol className="mt-5 space-y-3">
        {stages.map((stage) => (
          <li className="flex items-start gap-3" key={stage.id}>
            <span className="flex h-5 w-4 shrink-0 items-center justify-center">
              <StageIcon status={stage.status} />
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn('text-sm leading-5', labelTone[stage.status])}>{stage.label}</p>
              {stage.status === 'running' && stage.detail && (
                <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground/70 tabular-nums">
                  {stage.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function StageIcon({ status }: Pick<JobStage, 'status'>) {
  if (status === 'complete')
    return (
      <CheckIcon
        aria-label="Complete"
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
  return (
    <>
      <span
        aria-hidden="true"
        className="size-3.5 rounded-full border-[1.5px] border-muted-foreground/50"
      />
      <span className="sr-only">Pending</span>
    </>
  )
}

export { JobProgress }
export type { JobProgressProps, JobStage }
