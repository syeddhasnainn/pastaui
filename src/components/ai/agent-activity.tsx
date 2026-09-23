import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { RecordCircleIcon as CircleIcon } from '@solar-icons/react/linear/record-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { MagnifierIcon as SearchIcon } from '@solar-icons/react/linear/magnifier'
import { FileTerminalIcon as TerminalIcon } from '@solar-icons/react/linear/file-terminal'
import { ToolboxIcon as WrenchIcon } from '@solar-icons/react/linear/toolbox'
import * as React from 'react'

import { cn } from 'cn'

interface AgentActivityItem {
  detail?: string
  id: string
  label: string
  status: 'complete' | 'running' | 'waiting'
  type?: 'reasoning' | 'search' | 'terminal' | 'tool'
}

interface AgentActivityProps extends React.ComponentProps<'ol'> {
  items: AgentActivityItem[]
}

function AgentActivity({ className, items, ...props }: AgentActivityProps) {
  return (
    <ol
      data-slot="agent-activity"
      className={cn(
        'space-y-1 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      {items.map((item, index) => (
        <li className="relative flex gap-3 pb-3" key={item.id}>
          {index < items.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute top-5 left-2 h-[calc(100%-0.5rem)] w-px bg-border"
            />
          )}
          <span className="relative flex size-4 shrink-0 items-center justify-center bg-background text-muted-foreground">
            <ActivityIcon item={item} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn('text-sm', item.status === 'waiting' && 'text-muted-foreground')}>
              {item.label}
            </p>
            {item.detail && (
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

function ActivityIcon({ item }: { item: AgentActivityItem }) {
  if (item.status === 'running')
    return <LoaderCircleIcon aria-label="Running" className="size-3.5 animate-spin" />
  if (item.status === 'complete') return <CheckIcon aria-label="Complete" className="size-3.5" />
  if (item.type === 'search') return <SearchIcon aria-label="Search" className="size-3.5" />
  if (item.type === 'terminal') return <TerminalIcon aria-label="Terminal" className="size-3.5" />
  if (item.type === 'tool') return <WrenchIcon aria-label="Tool" className="size-3.5" />
  return <CircleIcon aria-label="Waiting" className="size-3" />
}

export { AgentActivity }
export type { AgentActivityItem, AgentActivityProps }
