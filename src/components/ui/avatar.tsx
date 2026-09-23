import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import * as React from 'react'

import { cn } from 'cn'

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative inline-flex size-9 shrink-0 overflow-hidden rounded-full bg-muted',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  alt,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('size-full object-cover', className)}
      alt={alt}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center text-xs font-medium text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
