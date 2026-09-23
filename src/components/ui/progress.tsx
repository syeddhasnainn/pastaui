import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import * as React from 'react'

import { cn } from 'cn'

interface ProgressProps extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, 'value'> {
  value?: number | null
}

function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      {...props}
    >
      <ProgressPrimitive.Track className="h-full">
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full rounded-full bg-primary transition-[width] duration-300"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
