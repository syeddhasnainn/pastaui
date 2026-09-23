import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import * as React from 'react'

import { cn } from 'cn'

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-3', className)}
      {...props}
    />
  )
}

interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  variant?: 'default' | 'showcase'
}

function TabsList({ className, variant = 'default', ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'inline-flex w-fit items-center',
        variant === 'default' && 'h-9 rounded-full bg-muted p-1',
        variant === 'showcase' && 'h-9 gap-6',
        className,
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Tab> {
  variant?: 'default' | 'showcase'
}

function TabsTrigger({ className, variant = 'default', ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        'inline-flex items-center justify-center text-muted-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' &&
          'h-7 rounded-full px-3 text-sm data-active:bg-background data-active:text-foreground data-active:shadow-xs',
        variant === 'showcase' &&
          'h-9 border-b border-transparent px-0 text-sm data-active:border-foreground data-active:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
