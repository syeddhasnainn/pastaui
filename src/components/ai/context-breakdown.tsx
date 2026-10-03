import * as React from 'react'

import { cn } from 'cn'

interface ContextSegment {
  id: string
  label: string
  tokens: number
}

interface ContextBreakdownProps extends React.ComponentProps<'section'> {
  limit: number
  segments: ContextSegment[]
}

const segmentTones = [
  'bg-sky-500/80 dark:bg-sky-400/70',
  'bg-violet-500/80 dark:bg-violet-400/70',
  'bg-amber-500/80 dark:bg-amber-400/70',
  'bg-teal-500/80 dark:bg-teal-400/70',
  'bg-rose-500/80 dark:bg-rose-400/70',
]

function ContextBreakdown({ className, limit, segments, ...props }: ContextBreakdownProps) {
  const rows = segments.map((segment, index) => ({
    ...segment,
    tokens: Number.isFinite(segment.tokens) ? Math.max(0, segment.tokens) : 0,
    tone: segmentTones[index % segmentTones.length],
  }))
  const used = rows.reduce((sum, row) => sum + row.tokens, 0)
  const capacity = Number.isFinite(limit) ? Math.max(0, limit) : 0
  const available = Math.max(capacity - used, 0)
  const total = Math.max(capacity, used)
  const percentage = (tokens: number) => (total > 0 ? (tokens / total) * 100 : 0)

  return (
    <section
      aria-label="Context window"
      data-slot="context-breakdown"
      className={cn(
        'rounded-[16px] bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <h3 className="text-sm leading-5 font-medium text-muted-foreground">Context window</h3>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
        <span className="text-[22px] leading-7 font-medium tracking-[-0.02em] text-foreground">
          {used.toLocaleString()} / {capacity.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">
          tokens · {Math.round(percentage(used))}% used
        </span>
      </p>

      <div
        aria-hidden="true"
        className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-foreground/8"
      >
        {rows
          .filter((row) => row.tokens > 0)
          .map((row) => (
            <span
              className={cn('h-full shrink-0 border-r border-card last:border-r-0', row.tone)}
              key={row.id}
              style={{ width: `${percentage(row.tokens)}%` }}
            />
          ))}
      </div>

      <ul className="mt-5 space-y-3 tabular-nums">
        {rows.map((row) => (
          <li className="flex items-center gap-2.5" key={row.id}>
            <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', row.tone)} />
            <span className="min-w-0 flex-1 truncate text-foreground/80">{row.label}</span>
            <span className="text-foreground/80">{row.tokens.toLocaleString()}</span>
            <span className="w-10 text-right text-muted-foreground/70">
              {Math.round(percentage(row.tokens))}%
            </span>
          </li>
        ))}
        <li className="flex items-center gap-2.5 border-t border-foreground/8 pt-3">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full ring-1 ring-muted-foreground/60 ring-inset"
          />
          <span className="min-w-0 flex-1 truncate">Available</span>
          <span>{available.toLocaleString()}</span>
          <span className="w-10 text-right text-muted-foreground/70">
            {Math.round(percentage(available))}%
          </span>
        </li>
      </ul>
    </section>
  )
}

export { ContextBreakdown }
export type { ContextBreakdownProps, ContextSegment }
