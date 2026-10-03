import { DangerTriangleIcon as DangerIcon } from '@solar-icons/react/bold/danger-triangle'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface ToolErrorProps extends React.ComponentProps<'section'> {
  attempts?: number
  code?: string
  title?: string
  message: string
  onFix?: () => void
  onRetry?: () => void
  fixLabel?: string
  tool: string
}

function ToolError({
  attempts,
  className,
  code,
  title,
  message,
  onFix,
  onRetry,
  fixLabel = 'Fix connection',
  tool,
  ...props
}: ToolErrorProps) {
  return (
    <section
      data-slot="tool-error"
      className={cn(
        'font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0',
        className,
      )}
      {...props}
    >
      <div className="mb-3 flex items-center gap-2 px-1 text-destructive" role="alert">
        <DangerIcon aria-hidden="true" className="size-3.5 shrink-0" />
        <span>Needs a fix</span>
      </div>
      <div className="rounded-[16px] bg-muted/40 p-4 shadow-card">
        <h3 className="text-sm leading-5 font-[450]">
          {title ?? `${tool} connection lost partway through`}
        </h3>
        <p className="mt-1 text-sm leading-5 text-foreground">{message}</p>
        {(code || attempts !== undefined) && (
          <p className="mt-2 metadata-label break-words">
            {code && <code>{code}</code>}
            {code && attempts !== undefined && ' · '}
            {attempts !== undefined && `Attempt ${attempts}`}
          </p>
        )}
        {(onFix || onRetry) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {onFix && (
              <Button
                onClick={onFix}
                size="sm"
                variant="default"
                className="h-7 rounded-md border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-sm font-[450] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
              >
                {fixLabel}
              </Button>
            )}
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="h-7 rounded-md bg-card px-3 text-sm font-[450]"
              >
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export { ToolError }
export type { ToolErrorProps }
