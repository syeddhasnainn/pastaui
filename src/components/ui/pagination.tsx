import { AltArrowLeftIcon as ChevronLeftIcon } from '@solar-icons/react/linear/alt-arrow-left'
import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { MenuDotsIcon as MoreHorizontalIcon } from '@solar-icons/react/linear/menu-dots'
import * as React from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from 'cn'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="Pagination"
      data-slot="pagination"
      className={cn('flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

interface PaginationLinkProps extends React.ComponentProps<'a'> {
  isActive?: boolean
}

function PaginationLink({ children, className, isActive, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: isActive ? 'outline' : 'ghost', size: 'icon' }),
        'rounded-full',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      aria-label="Go to previous page"
      data-slot="pagination-previous"
      className={cn(buttonVariants({ variant: 'ghost' }), 'gap-1 rounded-full', className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" /> Previous
    </a>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      aria-label="Go to next page"
      data-slot="pagination-next"
      className={cn(buttonVariants({ variant: 'ghost' }), 'gap-1 rounded-full', className)}
      {...props}
    >
      Next <ChevronRightIcon data-icon="inline-end" />
    </a>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn('flex size-8 items-center justify-center text-muted-foreground', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
