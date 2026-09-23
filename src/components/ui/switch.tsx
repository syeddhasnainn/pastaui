import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import * as React from 'react'

import { cn } from 'cn'

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full bg-input p-0.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-checked:bg-primary',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="block size-5 rounded-full bg-background shadow-sm transition-transform duration-200 data-checked:translate-x-4"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
