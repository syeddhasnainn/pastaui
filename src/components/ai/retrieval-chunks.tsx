import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import { DatabaseIcon } from '@solar-icons/react/linear/database'
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
  items: RetrievalChunk[]
  onOpen?: (id: string) => void
  query: string
}

function RetrievalChunks({ className, items, onOpen, query, ...props }: RetrievalChunksProps) {
  return (
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
          <h3 className="text-sm leading-5 font-medium text-muted-foreground">Retrieved context</h3>
          <span className="ml-auto text-[13px] leading-5 text-muted-foreground/70 tabular-nums">
            {items.length} {items.length === 1 ? 'match' : 'matches'}
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
                <span className="shrink-0 text-[13px] leading-5 text-muted-foreground/70 tabular-nums">
                  {[item.location, `${Math.round(item.score * 100)}% match`]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </span>
              <span className="mt-1 line-clamp-3 block pl-8 text-sm leading-6 text-foreground/75">
                “{item.content}”
              </span>
            </>
          )

          return (
            <li key={item.id}>
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
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export { RetrievalChunks }
export type { RetrievalChunk, RetrievalChunksProps }
