import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { MinusIcon } from '@solar-icons/react/linear/minus'
import * as React from 'react'

import { cn } from 'cn'

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-input bg-background text-primary-foreground shadow-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-indeterminate:border-primary data-indeterminate:bg-primary data-checked:border-primary data-checked:bg-primary',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
      >
        {props.indeterminate ? <MinusIcon className="size-3" /> : <CheckIcon className="size-3" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
