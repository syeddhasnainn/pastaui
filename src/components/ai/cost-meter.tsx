import { DollarMinimalisticIcon as CoinsIcon } from '@solar-icons/react/linear/dollar-minimalistic'
import * as React from 'react'

import { cn } from 'cn'

interface CostItem {
  cost: number
  id: string
  label: string
  tokens?: number
}

interface CostMeterProps extends React.ComponentProps<'section'> {
  budget?: number
  currency?: string
  items: CostItem[]
}

function CostMeter({ budget, className, currency = '$', items, ...props }: CostMeterProps) {
  const total = items.reduce((sum, item) => sum + item.cost, 0)
  const max = Math.max(...items.map((item) => item.cost), 0.001)
  const budgetPercent = budget ? Math.min((total / budget) * 100, 100) : undefined

  return (
    <section
      data-slot="cost-meter"
      className={cn(
        'rounded-md bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-start gap-3">
        <CoinsIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="card-heading">Run cost</p>
          <p className="mt-0.5 text-sm font-[450] tabular-nums">
            {currency}
            {total.toFixed(4)}
          </p>
        </div>
        {budget && (
          <span className="text-xs leading-5 text-muted-foreground tabular-nums">
            of {currency}
            {budget.toFixed(2)}
          </span>
        )}
      </header>
      {budgetPercent !== undefined && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-[width]"
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
      )}
      <ul className="mt-5 flex flex-col gap-4">
        {items.map((item) => {
          const filledSegments = item.cost > 0 ? Math.max(1, Math.round((item.cost / max) * 10)) : 0

          return (
            <li
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3"
              key={item.id}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-[450]">{item.label}</p>
                {item.tokens && (
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground tabular-nums">
                    {item.tokens.toLocaleString()} tokens
                  </p>
                )}
              </div>
              <div aria-hidden="true" className="flex items-center gap-1">
                {Array.from({ length: 10 }, (_, index) => (
                  <span
                    className={cn(
                      'h-6 w-1 rounded-full bg-muted',
                      index < filledSegments && 'bg-foreground',
                    )}
                    key={index}
                  />
                ))}
              </div>
              <span className="w-16 text-right text-sm text-muted-foreground tabular-nums">
                {currency}
                {item.cost.toFixed(4)}
              </span>
              <meter
                aria-label={`${item.label}: ${currency}${item.cost.toFixed(4)}`}
                className="sr-only"
                max={max}
                min={0}
                value={item.cost}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export { CostMeter }
export type { CostItem, CostMeterProps }
