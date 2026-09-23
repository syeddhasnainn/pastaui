import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from 'cn'

const alertVariants = cva(
  'relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 rounded-md px-4 py-3 text-sm ring-1 ring-foreground/10 [&>svg]:mt-0.5 [&>svg]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        muted: 'bg-muted text-foreground',
        destructive: 'bg-destructive/10 text-destructive ring-destructive/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 leading-5 font-medium', className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 text-sm leading-5 text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
