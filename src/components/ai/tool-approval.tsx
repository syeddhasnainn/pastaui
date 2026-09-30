import { ShieldCheckIcon } from '@solar-icons/react/linear/shield-check'
import { FileTerminalIcon as TerminalIcon } from '@solar-icons/react/linear/file-terminal'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface ToolApprovalProps extends React.ComponentProps<'section'> {
  command?: string
  description: string
  onAllow?: (remember: boolean) => void
  onDeny?: () => void
  scope?: string
  tool: string
}

function ToolApproval({
  className,
  command,
  description,
  onAllow,
  onDeny,
  scope,
  tool,
  ...props
}: ToolApprovalProps) {
  return (
    <section
      data-slot="tool-approval"
      className={cn(
        'font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      <div className="mb-3 flex items-center gap-2 px-1 text-emerald-600 dark:text-emerald-400">
        <ShieldCheckIcon aria-hidden="true" className="size-3.5 shrink-0" />
        <span>Approval needed</span>
      </div>
      <div className="rounded-[16px] bg-muted/40 p-4 shadow-card">
        <h3 className="card-heading text-foreground">Allow {tool}?</h3>
        <p className="mt-1 text-xs leading-5">{description}</p>
        {command && (
          <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-muted p-3 font-mono text-xs leading-5">
            <TerminalIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <code className="min-w-0 break-all">{command}</code>
          </div>
        )}
        {scope && <p className="mt-2 text-xs leading-5">Scope: {scope}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            onClick={() => onAllow?.(false)}
            size="sm"
            variant="default"
            className="h-7 rounded-md border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-sm font-[450] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
          >
            Allow once
          </Button>
          <Button
            onClick={() => onAllow?.(true)}
            size="sm"
            variant="outline"
            className="h-7 rounded-md bg-card px-3 text-sm font-[450]"
          >
            Always allow
          </Button>
          <Button
            onClick={onDeny}
            size="sm"
            variant="ghost"
            className="h-7 rounded-md px-3 text-sm font-[450] text-muted-foreground"
          >
            Deny
          </Button>
        </div>
      </div>
    </section>
  )
}

export { ToolApproval }
export type { ToolApprovalProps }
