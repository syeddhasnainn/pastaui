import { StarsMinimalisticIcon as SparklesIcon } from '@solar-icons/react/linear/stars-minimalistic'
import * as React from 'react'

import { cn } from 'cn'

interface ThinkingShimmerProps extends React.ComponentProps<'div'> {
  label?: string
}

function ThinkingShimmer({ className, label = 'Thinking', ...props }: ThinkingShimmerProps) {
  return (
    <div
      aria-live="polite"
      data-slot="thinking-shimmer"
      className={cn(
        'flex items-center gap-2 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      <SparklesIcon className="size-4 animate-pulse motion-reduce:animate-none" />
      <span className="agent-text-shimmer">{label}</span>
    </div>
  )
}

export { ThinkingShimmer }
export type { ThinkingShimmerProps }
