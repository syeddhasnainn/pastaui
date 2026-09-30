import { CheckCircleIcon as CheckCircle2Icon } from '@solar-icons/react/linear/check-circle'
import { AltArrowDownIcon as ChevronDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import { DangerCircleIcon as CircleAlertIcon } from '@solar-icons/react/linear/danger-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { ToolboxIcon as WrenchIcon } from '@solar-icons/react/linear/toolbox'
import * as React from 'react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from 'cn'

interface ToolResultProps extends React.ComponentProps<typeof Collapsible> {
  duration?: string
  name: string
  output?: React.ReactNode
  status?: 'complete' | 'error' | 'running'
  summary: string
}

function ToolResult({
  className,
  defaultOpen = false,
  duration,
  name,
  output,
  status = 'complete',
  summary,
  ...props
}: ToolResultProps) {
  return (
    <Collapsible
      data-slot="tool-result"
      className={cn(
        'rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      defaultOpen={defaultOpen}
      {...props}
    >
      <CollapsibleTrigger
        className="group flex w-full items-center gap-3 p-3 text-left"
        render={<button aria-label={`Toggle ${name} result`} type="button" />}
      >
        <ToolStatus status={status} />
        <div className="min-w-0 flex-1">
          <p className="truncate card-heading">{name}</p>
          <p className="truncate text-xs leading-5 text-muted-foreground">{summary}</p>
        </div>
        {duration && <span className="text-xs leading-5 text-muted-foreground">{duration}</span>}
        {output && (
          <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-panel-open:rotate-180" />
        )}
      </CollapsibleTrigger>
      {output && (
        <CollapsibleContent>
          <div className="border-t border-foreground/8 p-3 font-mono text-xs leading-5 text-muted-foreground">
            {output}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

function ToolStatus({ status }: Pick<ToolResultProps, 'status'>) {
  if (status === 'running')
    return <LoaderCircleIcon aria-label="Running" className="size-4 animate-spin" />
  if (status === 'error')
    return <CircleAlertIcon aria-label="Failed" className="size-4 text-destructive" />
  return <CheckCircle2Icon aria-label="Complete" className="size-4 text-emerald-600" />
}

function ToolResultIcon() {
  return <WrenchIcon className="size-4" />
}

export { ToolResult, ToolResultIcon }
export type { ToolResultProps }
