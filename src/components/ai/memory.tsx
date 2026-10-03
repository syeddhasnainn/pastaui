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
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const visibleCount = items.filter((item) => item.id !== pendingId).length
  const onRemoveRef = React.useRef(onRemove)

  React.useEffect(() => {
    onRemoveRef.current = onRemove
  })

  React.useEffect(() => {
    if (!pendingId) return
    const timer = window.setTimeout(() => {
      onRemoveRef.current?.(pendingId)
      setPendingId(null)
    }, 4000)
    return () => window.clearTimeout(timer)
  }, [pendingId])

  function forget(id: string) {
    if (pendingId) onRemove?.(pendingId)
    setPendingId(id)
  }

  return (
    <section
      data-slot="agent-memory"
      className={cn(
        'rounded-[16px] bg-card p-2 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex h-9 items-center gap-2 pr-1 pl-3">
        <BrainIcon className="size-4 text-muted-foreground" />
        <h3 className="text-sm leading-5 font-medium text-muted-foreground">
          Memory <span className="text-muted-foreground/60 tabular-nums">· {visibleCount}</span>
        </h3>
        {onAdd && (
          <Button
            className="ml-auto h-7 rounded-full px-2.5 text-xs text-muted-foreground hover:bg-foreground/8 hover:text-foreground"
            onClick={onAdd}
            size="xs"
            type="button"
            variant="ghost"
          >
            <PlusIcon data-icon="inline-start" /> Add
          </Button>
        )}
      </header>
      <ul className="mt-1 flex flex-col">
        {items.map((item) =>
          item.id === pendingId ? (
            <li
              className="flex min-h-10 items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] leading-5 text-muted-foreground transition-opacity duration-150 ease-out starting:opacity-0"
              key={item.id}
            >
              <span className="min-w-0 flex-1 truncate">Forgot “{item.value}”</span>
              <Button
                className="h-6 rounded-full px-2 text-xs text-foreground/85 hover:bg-foreground/8"
                onClick={() => setPendingId(null)}
                size="xs"
                type="button"
                variant="ghost"
              >
                Undo
              </Button>
            </li>
          ) : (
            <li
              className="group relative flex min-h-10 items-baseline gap-3 rounded-[10px] px-3 py-2 transition-[opacity,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-foreground/4 starting:opacity-0"
              key={item.id}
            >
              <span className="w-16 shrink-0 truncate text-[13px] leading-5 font-medium text-muted-foreground/70">
                {item.category}
              </span>
              <span
                className={cn(
                  'min-w-0 flex-1 text-sm leading-5 text-foreground/85',
                  onRemove && 'pr-6',
                )}
              >
                {item.value}
              </span>
              {onRemove && (
                <Button
                  aria-label={`Forget ${item.value}`}
                  className="absolute top-2 right-2 opacity-0 transition-[opacity,background-color] duration-150 ease-out group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100"
                  onClick={() => forget(item.id)}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                >
                  <XIcon />
                </Button>
              )}
            </li>
          ),
        )}
      </ul>
    </section>
  )
}

export { Memory }
export type { MemoryItem, MemoryProps }
