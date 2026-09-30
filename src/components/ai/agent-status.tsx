import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { RecordCircleIcon as CircleIcon } from '@solar-icons/react/linear/record-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { ChecklistIcon as ListTodoIcon } from '@solar-icons/react/linear/checklist'
import * as React from 'react'

import { cn } from 'cn'

interface AgentStatusTask {
  id: string
  label: string
  status: 'complete' | 'pending' | 'running'
}

interface AgentStatusProps extends React.ComponentProps<'section'> {
  detail?: string
  tasks?: AgentStatusTask[]
  title: string
}

function TaskStatus({ status }: Pick<AgentStatusTask, 'status'>) {
  if (status === 'complete') return <CheckIcon aria-label="Complete" className="size-3" />
  if (status === 'running')
    return <LoaderCircleIcon aria-label="Running" className="size-3 animate-spin" />
  return <CircleIcon aria-label="Pending" className="size-2.5 text-muted-foreground" />
}

function AgentStatus({ className, detail, tasks = [], title, ...props }: AgentStatusProps) {
  const complete = tasks.filter((task) => task.status === 'complete').length

  return (
    <section
      data-slot="agent-status"
      className={cn(
        'rounded-[16px] bg-card p-3 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
          <ListTodoIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate card-heading">{title}</h3>
          {detail && <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{detail}</p>}
        </div>
        {tasks.length > 0 && (
          <span className="font-mono text-xs text-muted-foreground">
            {complete}/{tasks.length}
          </span>
        )}
      </header>

      {tasks.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 rounded-[10px] bg-muted/40 p-2">
          {tasks.map((task) => (
            <li
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs leading-5"
              key={task.id}
            >
              <span className="flex size-4 items-center justify-center">
                <TaskStatus status={task.status} />
              </span>
              <span className={cn(task.status === 'complete' && 'text-muted-foreground')}>
                {task.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export { AgentStatus }
export type { AgentStatusProps, AgentStatusTask }
