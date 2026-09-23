import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import { DatabaseIcon } from '@solar-icons/react/linear/database'
import { MagnifierIcon as SearchIcon } from '@solar-icons/react/linear/magnifier'
import * as React from 'react'

import { Button } from '@/components/ui/button'
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
        'rounded-md bg-card p-3 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2 px-1">
        <DatabaseIcon className="size-4 text-muted-foreground" />
        <h3 className="card-heading">Retrieved context</h3>
        <span className="ml-auto text-xs leading-5 text-muted-foreground">
          {items.length} matches
        </span>
      </header>
      <div className="mt-3 flex items-center gap-2 rounded-md bg-muted/55 px-3 py-2 text-xs leading-5">
        <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{query}</span>
      </div>
      <ol className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li className="rounded-md bg-muted/30 p-3" key={item.id}>
            <div className="flex items-center gap-2 text-xs leading-5">
              <span className="flex size-5 items-center justify-center rounded-md bg-card font-mono text-[10px] shadow-card">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate font-[450]">{item.source}</span>
              {item.location && <span className="text-muted-foreground">{item.location}</span>}
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {Math.round(item.score * 100)}%
              </span>
            </div>
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
              {item.content}
            </p>
            {onOpen && (
              <Button className="mt-2" onClick={() => onOpen(item.id)} size="xs" variant="ghost">
                Open source <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export { RetrievalChunks }
export type { RetrievalChunk, RetrievalChunksProps }
