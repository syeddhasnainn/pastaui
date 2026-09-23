import * as React from 'react'

import { cn } from 'cn'

function EmptyState({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-state"
      className={cn('flex flex-col items-center justify-center text-center', className)}
      {...props}
    />
  )
}

function EmptyStateIcon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-state-icon"
      className={cn(
        'mb-4 flex size-11 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-5',
        className,
      )}
      {...props}
    />
  )
}

function EmptyStateTitle({ children, className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3 data-slot="empty-state-title" className={cn('font-medium', className)} {...props}>
      {children}
    </h3>
  )
}

function EmptyStateDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn('mt-1 max-w-sm text-sm leading-6 text-muted-foreground', className)}
      {...props}
    />
  )
}

function EmptyStateActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-state-actions"
      className={cn('mt-5 flex flex-wrap items-center justify-center gap-2', className)}
      {...props}
    />
  )
}

export { EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle }
