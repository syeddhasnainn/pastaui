import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import { FileTextIcon } from '@solar-icons/react/linear/file-text'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface DocumentReferenceProps extends React.ComponentProps<'article'> {
  excerpt?: string
  label?: string
  location?: string
  metadata?: string
  onOpen?: () => void
  title: string
}

function DocumentReference({
  className,
  excerpt,
  label = 'Source',
  location,
  metadata,
  onOpen,
  title,
  ...props
}: DocumentReferenceProps) {
  return (
    <article
      data-slot="document-reference"
      className={cn(
        'rounded-[16px] bg-card p-4 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
          <FileTextIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-5 text-muted-foreground">{label}</p>
          <h3 className="mt-0.5 truncate card-heading">{title}</h3>
          {(location || metadata) && (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {[location, metadata].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        {onOpen && (
          <Button aria-label={`Open ${title}`} onClick={onOpen} size="icon-sm" variant="ghost">
            <ArrowUpRightIcon />
          </Button>
        )}
      </div>
      {excerpt && (
        <blockquote className="mt-3 rounded-[10px] bg-muted/45 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
          {excerpt}
        </blockquote>
      )}
    </article>
  )
}

export { DocumentReference }
export type { DocumentReferenceProps }
