import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import * as React from 'react'

import { cn } from 'cn'

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogClose = AlertDialogPrimitive.Close

function AlertDialogContent({ className, ...props }: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop className="fixed inset-0 bg-black/35 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <AlertDialogPrimitive.Viewport className="fixed inset-0 flex items-center justify-center p-4">
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-content"
          className={cn(
            'w-full max-w-md rounded-md bg-background p-6 shadow-xl ring-1 ring-foreground/10 transition-[opacity,transform] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            className,
          )}
          {...props}
        />
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-6 flex justify-end gap-2 max-sm:flex-col-reverse', className)}
      {...props}
    />
  )
}

function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return <AlertDialogPrimitive.Title className={cn('text-lg font-medium', className)} {...props} />
}

function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('text-sm leading-6 text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
}
