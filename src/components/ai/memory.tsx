import { BrainIcon } from '@solar-icons/react/linear/brain'
import { AddIcon as PlusIcon } from '@solar-icons/react/linear/add'
import { CloseIcon as XIcon } from '@solar-icons/react/linear/close'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface MemoryItem {
  category?: string
  id: string
  value: string
}

interface MemoryProps extends React.ComponentProps<'section'> {
  items: MemoryItem[]
  onAdd?: () => void
  onRemove?: (id: string) => void
}

function Memory({ className, items, onAdd, onRemove, ...props }: MemoryProps) {
  return (
    <section
      data-slot="agent-memory"
      className={cn(
        'rounded-md bg-card p-4 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2">
        <BrainIcon className="size-4 text-muted-foreground" />
        <h3 className="card-heading">Memory</h3>
        <span className="text-xs leading-5 text-muted-foreground">{items.length}</span>
        {onAdd && (
          <Button
            aria-label="Add memory"
            className="ml-auto"
            onClick={onAdd}
            size="icon-xs"
            variant="ghost"
          >
            <PlusIcon />
          </Button>
        )}
      </header>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            className="group flex max-w-full items-center gap-2 rounded-md bg-muted px-2.5 py-1.5 text-sm leading-5"
            key={item.id}
          >
            {item.category && (
              <span className="font-[450] text-muted-foreground">{item.category}</span>
            )}
            <span className="truncate">{item.value}</span>
            <button
              aria-label={`Forget ${item.value}`}
              className="rounded-sm text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
              onClick={() => onRemove?.(item.id)}
              type="button"
            >
              <XIcon className="size-3" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export { Memory }
export type { MemoryItem, MemoryProps }
