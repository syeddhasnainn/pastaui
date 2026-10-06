import { ExportIcon as ExternalLinkIcon } from '@solar-icons/react/linear/export'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface InlineCitationProps extends React.ComponentProps<'span'> {
  excerpt?: string
  index: number
  onOpenChange?: (open: boolean) => void
  onOpenSource?: () => void
  open?: boolean
  source: string
  title: string
}

function InlineCitation({
  className,
  excerpt,
  index,
  onOpenChange,
  onOpenSource,
  open = false,
  source,
  title,
  ...props
}: InlineCitationProps) {
  return (
    <span
      data-slot="inline-citation"
      className={cn(
        'relative inline-flex font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      <button
        aria-expanded={open}
        className="inline-flex min-w-5 items-center justify-center rounded-md bg-muted px-1.5 py-0.5 align-super text-xs leading-4 font-[450] text-muted-foreground transition-colors outline-none hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onOpenChange?.(!open)}
        type="button"
      >
        {index}
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-20 mb-2 w-72 max-w-[calc(100vw-2rem)] origin-bottom -translate-x-1/2 rounded-[16px] bg-card p-4 text-muted-foreground shadow-card transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-95 starting:opacity-0 motion-reduce:starting:scale-100">
          <span className="block card-heading leading-5">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">{source}</span>
          {excerpt && (
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">{excerpt}</span>
          )}
          <Button
            className="mt-3 h-7 gap-2 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-sm font-[450] tracking-[-0.05px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
            onClick={onOpenSource}
            size="sm"
            type="button"
            variant="default"
          >
            Open source <ExternalLinkIcon data-icon="inline-end" />
          </Button>
        </span>
      )}
    </span>
  )
}

export { InlineCitation }
export type { InlineCitationProps }
