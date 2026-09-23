import * as React from 'react'

import { cn } from 'cn'

function Label({ children, className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  )
}

export { Label }
