import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import { cn } from 'cn'

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        'peer size-4 shrink-0 rounded-full border border-input bg-background shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary',
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex size-full items-center justify-center before:size-2 before:rounded-full before:bg-primary" />
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
