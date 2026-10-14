import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import { DatabaseIcon } from '@solar-icons/react/linear/database'
import { LoaderIcon } from '@solar-icons/react/linear/loader'
import { MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { cn } from 'cn'

interface RetrievalChunk {
  content: string
  id: string
  location?: string
  score: number
  source: string
}

interface RetrievalChunksProps extends React.ComponentProps<'section'> {
  highlight?: string[]
  items: RetrievalChunk[]
  searching?: boolean
  onOpen?: (id: string) => void
  query: string
}

const ease = [0.23, 1, 0.32, 1] as const

function escape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ terms, text }: { terms: string[]; text: string }) {
  if (!terms.length) return <>{text}</>
  const pattern = new RegExp(`(${terms.map(escape).join('|')})`, 'gi')
  return (
    <>
      {text.split(pattern).map((part, index) =>
        index % 2 ? (
          <mark className="rounded-[4px] bg-foreground/6 px-0.5 text-inherit" key={index}>
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

function RetrievalChunks({
  className,
  highlight = [],
  items,
  onOpen,
  query,
  searching = false,
  ...props
}: RetrievalChunksProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  return (
    <MotionConfig reducedMotion="user">
      <section
        data-slot="retrieval-chunks"
        className={cn(
          'rounded-[16px] bg-card p-2 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
          className,
        )}
        {...props}
      >
        <header className="px-3 pt-2">
          <div className="flex items-center gap-2">
            <DatabaseIcon className="size-4 text-muted-foreground" />
            <h3 className="text-sm leading-5 font-medium text-muted-foreground">
              Retrieved context
            </h3>
            <span
              aria-live="polite"
              className="ml-auto flex items-center gap-1.5 text-[13px] leading-5 text-muted-foreground/70 tabular-nums"
            >
              {searching && (
                <LoaderIcon
                  aria-hidden="true"
                  className="size-3.5 animate-spin motion-reduce:animate-none"
                />
              )}
              {searching
                ? 'Searching'
                : `${items.length} ${items.length === 1 ? 'match' : 'matches'}`}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">
            Searched for <span className="text-foreground/80">“{query}”</span>
          </p>
        </header>
        <ol className="mt-2 flex flex-col">
          {items.map((item, index) => {
            const body = (
              <>
                <span className="flex items-center gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground/6 text-[11px] text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-1">
                    <span className="truncate text-[15px] leading-6 font-medium text-foreground">
                      {item.source}
                    </span>
                    {onOpen && (
                      <ArrowUpRightIcon
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100"
                      />
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-[13px] leading-5 text-muted-foreground/70 tabular-nums">
                    {[item.location, `${Math.round(item.score * 100)}%`]
                      .filter(Boolean)
                      .join(' · ')}
                    <span
                      aria-hidden="true"
                      className="h-1 w-10 overflow-hidden rounded-full bg-foreground/6"
                    >
                      <motion.span
                        animate={{ scaleX: item.score }}
                        className="block h-full origin-left rounded-full bg-muted-foreground/70"
                        initial={{ scaleX: 0 }}
                        transition={{ duration: 0.6, ease }}
                      />
                    </span>
                  </span>
                </span>
                <span
                  className={cn(
                    'mt-1 block pl-8 text-sm leading-6 text-foreground/75',
                    !expanded.has(item.id) && 'line-clamp-2',
                  )}
                >
                  “<Highlight terms={highlight} text={item.content} />”
                </span>
              </>
            )

            return (
              <motion.li
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
                key={item.id}
                layout="position"
                transition={{ duration: 0.3, ease }}
              >
                {onOpen ? (
                  <button
                    className="group block w-full rounded-[12px] p-3 text-left transition-colors duration-150 ease-out outline-none hover:bg-foreground/4 focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onOpen(item.id)}
                    type="button"
                  >
                    {body}
                  </button>
                ) : (
                  <div className="p-3">{body}</div>
                )}
                {item.content.length > 140 && (
                  <button
                    aria-expanded={expanded.has(item.id)}
                    className="-mt-2 mb-1 ml-11 rounded-sm text-[13px] leading-5 text-muted-foreground/70 outline-none hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() =>
                      setExpanded((current) => {
                        const next = new Set(current)
                        if (next.has(item.id)) next.delete(item.id)
                        else next.add(item.id)
                        return next
                      })
                    }
                    type="button"
                  >
                    {expanded.has(item.id) ? 'Show less' : 'Show more'}
                  </button>
                )}
              </motion.li>
            )
          })}
          {searching &&
            [0, 1].slice(items.length > 1 ? 1 : 0).map((row) => (
              <li aria-hidden="true" className="space-y-2 p-3" key={`skeleton-${row}`}>
                <span className="flex items-center gap-3">
                  <span className="size-5 animate-pulse rounded-md bg-foreground/6 motion-reduce:animate-none" />
                  <span className="h-3.5 w-40 animate-pulse rounded-full bg-foreground/6 motion-reduce:animate-none" />
                </span>
                <span className="ml-8 block h-3 w-4/5 animate-pulse rounded-full bg-foreground/6 motion-reduce:animate-none" />
              </li>
            ))}
        </ol>
      </section>
    </MotionConfig>
  )
}

export { RetrievalChunks }
export type { RetrievalChunk, RetrievalChunksProps }
