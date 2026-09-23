import { Select as SelectPrimitive } from '@base-ui/react/select'
import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { AltArrowDownIcon as ChevronDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import * as React from 'react'

import { cn } from 'cn'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        'flex h-9 w-fit min-w-40 items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  align = 'start',
  className,
  children,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup> &
  Pick<React.ComponentProps<typeof SelectPrimitive.Positioner>, 'align' | 'sideOffset'>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={false}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            'min-w-(--anchor-width) origin-(--transform-origin) rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 transition-[opacity,transform] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            className,
          )}
          {...props}
        >
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex cursor-default items-center rounded-md py-2 pr-8 pl-2 text-sm outline-none data-highlighted:bg-muted data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon className="size-3.5" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue }
