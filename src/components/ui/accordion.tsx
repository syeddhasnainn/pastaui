import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { AltArrowDownIcon as ChevronDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import * as React from 'react'

import { cn } from 'cn'

function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col gap-2', className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('rounded-md bg-background ring-1 ring-foreground/10', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'flex w-full items-center justify-between gap-4 rounded-md px-4 py-3 text-left text-sm font-medium transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[panel-open]:[&>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Panel>) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn('px-4 pt-1 pb-4 text-sm leading-6 text-muted-foreground', className)}>
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
