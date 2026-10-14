import { MotionConfig, motion } from 'motion/react'
import { useId, type ComponentProps, type KeyboardEvent } from 'react'

import { cn } from 'cn'

interface FollowUpItem {
  id: string
  label: string
  disabled?: boolean
}

interface FollowUpProps extends Omit<ComponentProps<'section'>, 'onSelect'> {
  items: FollowUpItem[]
  loading?: boolean
  onSelect?: (item: FollowUpItem) => void
  selectedId?: string
  shortcuts?: boolean
  title?: string
}

const ease = [0.23, 1, 0.32, 1] as const

function FollowUp({
  className,
  items,
  loading = false,
  onSelect,
  selectedId,
  shortcuts = true,
  title = 'Follow up',
  ...props
}: FollowUpProps) {
  const titleId = useId()

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!shortcuts || selectedId || loading) return
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const item = items[Number(event.key) - 1]
    if (item && !item.disabled) {
      event.preventDefault()
      onSelect?.(item)
    }
  }

  if (items.length === 0 && !loading) return null

  return (
    <MotionConfig reducedMotion="user">
      {/* Number shortcuts are delegated from the focused chips. */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <section
        aria-busy={loading}
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        data-slot="follow-up"
        className={cn(
          'font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
          className,
        )}
        {...props}
      >
        <h3 id={titleId} className="mb-3 card-heading">
          {title}
        </h3>
        <ul className="flex flex-col items-start gap-2.5">
          {loading
            ? [56, 72, 44].map((width, index) => (
                <li aria-hidden="true" key={`loading-${index}`}>
                  <span
                    className="block h-9 animate-pulse rounded-full bg-foreground/6 motion-reduce:animate-none"
                    style={{ width: `${width * 4}px`, animationDelay: `${index * 120}ms` }}
                  />
                </li>
              ))
            : items.map((item, index) => {
                const selected = item.id === selectedId
                const faded = selectedId !== undefined && !selected
                return (
                  <motion.li
                    animate={{ opacity: faded ? 0.45 : 1, x: 0, filter: 'blur(0px)' }}
                    className="max-w-full"
                    initial={{ opacity: 0, x: -6, filter: 'blur(3px)' }}
                    key={item.id}
                    transition={{ delay: selectedId ? 0 : index * 0.07, duration: 0.3, ease }}
                  >
                    <button
                      aria-keyshortcuts={shortcuts && index < 9 ? String(index + 1) : undefined}
                      aria-pressed={selectedId !== undefined ? selected : undefined}
                      type="button"
                      disabled={item.disabled || faded}
                      onClick={() => onSelect?.(item)}
                      className={cn(
                        'group/chip flex min-h-9 max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-left text-sm leading-5 font-[450] transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.97] disabled:pointer-events-none motion-reduce:transition-colors motion-reduce:active:scale-100',
                        selected
                          ? 'bg-foreground/10 text-foreground'
                          : 'bg-foreground/6 hover:bg-foreground/10',
                      )}
                    >
                      <span className="grid size-4 shrink-0 *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-200">
                        <svg
                          aria-hidden="true"
                          className={cn('size-4', selected && 'scale-75 opacity-0')}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 5v5a2 2 0 0 0 2 2h12m-5-5 5 5-5 5" />
                        </svg>
                        <svg
                          aria-hidden="true"
                          className={cn('size-4', !selected && 'scale-75 opacity-0')}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span className="min-w-0 break-words">{item.label}</span>
                      {shortcuts && index < 9 && !selectedId && (
                        <kbd className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-md bg-foreground/6 px-1 font-sans text-[11px] leading-none text-muted-foreground">
                          {index + 1}
                        </kbd>
                      )}
                    </button>
                  </motion.li>
                )
              })}
        </ul>
      </section>
    </MotionConfig>
  )
}

export { FollowUp }
export type { FollowUpItem, FollowUpProps }
