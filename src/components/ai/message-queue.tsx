import { Menu } from '@base-ui/react/menu'
import { Reorder, useDragControls, useReducedMotion } from 'motion/react'
import { Forward2Icon } from '@solar-icons/react/bold-duotone/forward-2'
import { ListArrowDownMinimalisticIcon as QueueIcon } from '@solar-icons/react/linear/list-arrow-down-minimalistic'
import { TrashBinMinimalisticIcon as TrashIcon } from '@solar-icons/react/linear/trash-bin-minimalistic'
import { MenuDotsIcon as MoreIcon } from '@solar-icons/react/linear/menu-dots'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface QueuedMessage {
  attachments?: number
  content: string
  id: string
  status?: 'queued' | 'sending'
}

interface MessageQueueProps extends React.ComponentProps<'section'> {
  items: QueuedMessage[]
  onRemove?: (id: string) => void
  onSendNow?: (id: string) => void
  onMoveToTop?: (id: string) => void
  onReorder?: (items: QueuedMessage[]) => void
}

function QueueRow({
  item,
  enabled,
  onMove,
  children,
}: {
  item: QueuedMessage
  enabled: boolean
  onMove: (direction: number) => void
  children: React.ReactNode
}) {
  const controls = useDragControls()
  const reducedMotion = useReducedMotion()
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="group/queue-row relative flex items-center gap-3 rounded-md bg-card py-1.5"
      whileDrag={{ zIndex: 10 }}
      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
    >
      <button
        type="button"
        disabled={!enabled}
        aria-label={`Reorder message: ${item.content}`}
        title="Drag to reorder, or use Up and Down arrow keys"
        className="relative flex h-7 w-4 shrink-0 touch-none items-center justify-center rounded-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing enabled:cursor-grab"
        onPointerDown={(event) => {
          if (enabled) controls.start(event)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault()
            onMove(event.key === 'ArrowUp' ? -1 : 1)
          }
        }}
      >
        <QueueIcon
          aria-hidden="true"
          className={cn(
            'absolute size-4 opacity-100 transition-opacity duration-150 ease-out motion-reduce:transition-none',
            enabled && 'group-focus-within/queue-row:opacity-0 group-hover/queue-row:opacity-0',
          )}
        />
        <svg
          className={cn(
            'absolute size-4 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none',
            enabled && 'group-focus-within/queue-row:opacity-100 group-hover/queue-row:opacity-100',
          )}
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          {[4, 8, 12].map((y) => (
            <React.Fragment key={y}>
              <circle cx="5" cy={y} r="1" />
              <circle cx="11" cy={y} r="1" />
            </React.Fragment>
          ))}
        </svg>
      </button>
      {children}
    </Reorder.Item>
  )
}

function MessageQueue({
  className,
  items,
  onRemove,
  onSendNow,
  onMoveToTop,
  onReorder,
  ...props
}: MessageQueueProps) {
  return (
    <section
      aria-label="Queued messages"
      data-slot="message-queue"
      className={cn(
        'rounded-[16px] bg-card p-3 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <Reorder.Group as="ol" axis="y" values={items} onReorder={(next) => onReorder?.(next)}>
        {items.map((item, index) => (
          <QueueRow
            key={item.id}
            item={item}
            enabled={!!onReorder}
            onMove={(direction) => {
              const target = index + direction
              if (target < 0 || target >= items.length) return
              const next = [...items]
              ;[next[index], next[target]] = [next[target], next[index]]
              onReorder?.(next)
            }}
          >
            <p className="line-clamp-2 min-w-0 flex-1 text-sm leading-5 font-[450] text-muted-foreground">
              {item.content}
            </p>
            {item.attachments ? (
              <span className="shrink-0 text-xs leading-5 font-[450] text-muted-foreground">
                {item.attachments} files
              </span>
            ) : null}
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                disabled={item.status === 'sending'}
                onClick={() => onSendNow?.(item.id)}
                size="sm"
                variant="ghost"
                className="gap-1.5 text-sm font-[450] tracking-[-0.05px] text-muted-foreground"
              >
                <Forward2Icon className="size-4" />
                {item.status === 'sending' ? 'Steering…' : 'Steer'}
              </Button>
              <Button
                type="button"
                aria-label={`Remove queued message: ${item.content}`}
                onClick={() => onRemove?.(item.id)}
                size="icon-sm"
                variant="ghost"
              >
                <TrashIcon className="size-4" />
              </Button>
              <Menu.Root>
                <Menu.Trigger
                  render={
                    <Button
                      type="button"
                      aria-label={`More actions for: ${item.content}`}
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                >
                  <MoreIcon className="size-4" />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner side="bottom" align="end" sideOffset={6} className="z-50">
                    <Menu.Popup className="min-w-36 rounded-[16px] bg-card p-1 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card outline-none">
                      <Menu.Item
                        className="cursor-pointer rounded-[12px] px-3 py-2 outline-none data-highlighted:bg-muted"
                        onClick={() => navigator.clipboard.writeText(item.content)}
                      >
                        Copy message
                      </Menu.Item>
                      {onMoveToTop && (
                        <Menu.Item
                          disabled={index === 0}
                          className="cursor-pointer rounded-[12px] px-3 py-2 outline-none data-highlighted:bg-muted data-disabled:opacity-40"
                          onClick={() => onMoveToTop(item.id)}
                        >
                          Move to top
                        </Menu.Item>
                      )}
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </div>
          </QueueRow>
        ))}
      </Reorder.Group>
      {!items.length && (
        <p className="px-2 py-3 text-xs leading-5 font-[450] text-muted-foreground">
          No queued messages.
        </p>
      )}
    </section>
  )
}

export { MessageQueue }
export type { MessageQueueProps, QueuedMessage }
