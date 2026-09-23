import * as React from 'react'

import { cn } from 'cn'

interface AspectRatioProps extends React.ComponentProps<'div'> {
  ratio?: number
}

function AspectRatio({ className, ratio = 16 / 9, style, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn('relative w-full overflow-hidden', className)}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    />
  )
}

export { AspectRatio }
