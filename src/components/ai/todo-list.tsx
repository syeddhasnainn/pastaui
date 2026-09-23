import { CheckCircleIcon } from '@solar-icons/react/bold-duotone/check-circle'
import { AltArrowDownIcon as ChevronDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import { ChecklistIcon as ListTodoIcon } from '@solar-icons/react/linear/checklist'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import * as React from 'react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from 'cn'

interface AgentTodoItem {
  detail?: string
  id: string
  label: string
  status: 'complete' | 'in-progress' | 'pending'
}

interface TodoListProps extends React.ComponentProps<typeof Collapsible> {
  items: AgentTodoItem[]
  title?: string
}

function TodoList({
  className,
  defaultOpen = true,
  items,
  title = 'Plan',
  ...props
}: TodoListProps) {
  const complete = items.filter((item) => item.status === 'complete').length

  return (
    <Collapsible
      data-slot="todo-list"
      className={cn(
        'rounded-md bg-card p-4 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      defaultOpen={defaultOpen}
      {...props}
    >
      <CollapsibleTrigger
        className="group flex w-full items-center gap-2 rounded-sm text-left card-heading leading-5 outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        render={<button aria-label="Toggle agent plan" type="button" />}
      >
        <ListTodoIcon aria-hidden="true" className="size-4 shrink-0" />
        <span>{title}</span>
        <span className="ml-auto shrink-0 text-xs leading-5 font-[450] text-muted-foreground">
          {complete}/{items.length}
        </span>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-panel-open:rotate-180 motion-reduce:transition-none" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ol className="mt-4 space-y-3">
          {items.map((item) => (
            <li className="flex gap-3" key={item.id}>
              <TodoStatus status={item.status} />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-sm leading-5 font-[450]',
                    item.status === 'complete' && 'text-muted-foreground line-through',
                  )}
                >
                  {item.label}
                </p>
                {item.detail && (
                  <p className="mt-0.5 text-xs leading-5 font-[450] text-muted-foreground">
                    {item.detail}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  )
}

function TodoStatus({ status }: Pick<AgentTodoItem, 'status'>) {
  if (status === 'complete') {
    return <CheckCircleIcon aria-label="Complete" className="mt-0.5 size-4 shrink-0" />
  }

  if (status === 'in-progress') {
    return (
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
        <LoaderCircleIcon
          aria-label="In progress"
          className="size-3.5 animate-spin motion-reduce:animate-none"
        />
      </span>
    )
  }

  return (
    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
      <span aria-hidden="true" className="size-3.5 rounded-full border border-current" />
      <span className="sr-only">Pending</span>
    </span>
  )
}

export { TodoList }
export type { AgentTodoItem, TodoListProps }
