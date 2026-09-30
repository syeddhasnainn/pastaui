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

const segmentTones = ['bg-amber-400', 'bg-teal-500', 'bg-orange-500', 'bg-sky-500', 'bg-pink-500']

function ContextBreakdown({ className, limit, segments, ...props }: ContextBreakdownProps) {
  const normalizedSegments = segments.map((segment) => ({
    ...segment,
    tokens: Number.isFinite(segment.tokens) ? Math.max(0, segment.tokens) : 0,
  }))
  const used = normalizedSegments.reduce((sum, segment) => sum + segment.tokens, 0)
  const capacity = Number.isFinite(limit) ? Math.max(0, limit) : 0
  const available = Math.max(capacity - used, 0)
  const total = Math.max(capacity, used)
  const rows = [
    ...normalizedSegments.map((segment, index) => ({
      ...segment,
      tone: segmentTones[index % segmentTones.length],
    })),
    { id: '__available', label: 'Available', tokens: available, tone: 'bg-pink-500' },
  ]
  const percentage = (tokens: number) => (total > 0 ? (tokens / total) * 100 : 0)

  return (
    <section
      aria-label="Context breakdown"
      data-slot="context-breakdown"
      className={cn(
        'rounded-[16px] bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <p className="sr-only">
        Context window: {used.toLocaleString()} tokens used, {available.toLocaleString()} available.
      </p>
      <div aria-hidden="true" className="flex h-3.5 overflow-hidden rounded-xs bg-muted">
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
      <ul className="mt-5 space-y-3">
        {rows.map((row) => (
          <li className="flex items-center gap-2.5" key={row.id}>
            <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-xs', row.tone)} />
            <span className="min-w-0 flex-1 truncate">{row.label}</span>
            <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
              <span>{row.tokens.toLocaleString()}</span>
              <span className="w-[4.5rem] text-right text-muted-foreground/80">
                ({percentage(row.tokens).toFixed(2)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export { ContextBreakdown }
export type { ContextBreakdownProps, ContextSegment }
