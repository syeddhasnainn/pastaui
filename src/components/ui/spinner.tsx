import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import * as React from 'react'

import { cn } from 'cn'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <output aria-label="Loading" data-slot="spinner">
      <LoaderCircleIcon
        aria-hidden="true"
        className={cn('size-4 animate-spin text-muted-foreground', className)}
        {...props}
      />
    </output>
  )
}

export { Spinner }
