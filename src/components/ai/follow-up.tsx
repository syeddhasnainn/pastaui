import { useId, type ComponentProps } from 'react'

import { cn } from 'cn'

interface FollowUpItem {
  id: string
  label: string
  disabled?: boolean
}

interface FollowUpProps extends Omit<ComponentProps<'section'>, 'onSelect'> {
  items: FollowUpItem[]
  title?: string
  onSelect?: (item: FollowUpItem) => void
}

function FollowUp({ className, items, title = 'Follow up', onSelect, ...props }: FollowUpProps) {
  const titleId = useId()

  if (items.length === 0) return null

  return (
    <section
      aria-labelledby={titleId}
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
        {items.map((item) => (
          <li
            key={item.id}
            className="max-w-full transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0"
          >
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => onSelect?.(item)}
              className="flex min-h-9 max-w-full items-center gap-2 rounded-full bg-foreground/6 px-3 py-1.5 text-left text-sm leading-5 font-[450] transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-colors motion-reduce:active:scale-100"
            >
              <svg
                aria-hidden="true"
                className="size-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 5v5a2 2 0 0 0 2 2h12m-5-5 5 5-5 5" />
              </svg>
              <span className="min-w-0 break-words">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export { FollowUp }
export type { FollowUpItem, FollowUpProps }
