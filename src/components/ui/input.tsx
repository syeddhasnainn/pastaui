import * as React from 'react'

import { cn } from 'cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
