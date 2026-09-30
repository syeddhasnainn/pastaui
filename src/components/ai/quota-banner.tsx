import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import { SpeedometerMiddleIcon as GaugeIcon } from '@solar-icons/react/linear/speedometer-middle'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface QuotaBannerProps extends React.ComponentProps<'aside'> {
  label?: string
  limit: number
  onUpgrade?: () => void
  resetsAt: string
  unit?: string
  used: number
}

function QuotaBanner({
  className,
  label = 'Monthly agent usage',
  limit,
  onUpgrade,
  resetsAt,
  unit = 'runs',
  used,
  ...props
}: QuotaBannerProps) {
  const remaining = Math.max(limit - used, 0)
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0

  return (
    <aside
      data-slot="quota-banner"
      className={cn(
        'rounded-[16px] bg-card p-4 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-card text-muted-foreground shadow-card">
          <GaugeIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="card-heading">{label}</h3>
            <span className="font-mono text-xs tabular-nums">
              {remaining.toLocaleString()} {unit} left
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background ring-1 ring-foreground/8">
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>
              {used.toLocaleString()} of {limit.toLocaleString()} used
            </span>
            <span>Resets {resetsAt}</span>
          </div>
        </div>
        {onUpgrade && (
          <Button onClick={onUpgrade} size="sm" type="button" variant="outline">
            Upgrade <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </aside>
  )
}

export { QuotaBanner }
export type { QuotaBannerProps }
