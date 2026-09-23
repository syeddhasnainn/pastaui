import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { MenuDotsIcon as EllipsisIcon } from '@solar-icons/react/linear/menu-dots'
import * as React from 'react'

import { cn } from 'cn'

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    />
  )
}

function BreadcrumbLink({ children, className, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      data-slot="breadcrumb-link"
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    >
      {children}
    </a>
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn('font-normal text-foreground', className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      role="presentation"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      className={cn('flex size-5 items-center justify-center [&>svg]:size-4', className)}
      {...props}
    >
      <EllipsisIcon />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
