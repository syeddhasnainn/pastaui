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

const segmentTones = ['bg-sky-500', 'bg-violet-500', 'bg-amber-400', 'bg-emerald-500', 'bg-pink-500']

function CostMeter({ budget, className, currency = '$', items, ...props }: CostMeterProps) {
  const total = items.reduce((sum, item) => sum + item.cost, 0)
  const scale = budget && budget > total ? budget : total
  const share = (cost: number) => (total > 0 ? (cost / total) * 100 : 0)
  const money = (value: number) => `${currency}${value.toFixed(4)}`

  return (
    <section
      data-slot="cost-meter"
      className={cn(
        'rounded-[16px] bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-foreground/6 text-muted-foreground">
          <CoinsIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm leading-5 font-medium text-muted-foreground">Run cost</h3>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
            <span className="text-[22px] leading-7 font-medium tracking-[-0.02em] text-foreground">
              {money(total)}
            </span>
            {budget !== undefined && (
              <span className="text-sm text-muted-foreground">
                of {currency}
                {budget.toFixed(2)} budget
              </span>
            )}
          </p>
        </div>
      </header>

      {budget !== undefined && (
        <meter
          aria-label={`Run cost: ${money(total)} of ${currency}${budget.toFixed(2)} budget`}
          className="sr-only"
          max={budget}
          min={0}
          value={Math.min(total, budget)}
        />
      )}
      <div
        aria-hidden="true"
        className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-foreground/8"
      >
        {items.map((item, index) => (
          <span
            className={cn(
              'h-full shrink-0 border-r border-card last:border-r-0',
              segmentTones[index % segmentTones.length],
            )}
            key={item.id}
            style={{ width: `${scale > 0 ? (item.cost / scale) * 100 : 0}%` }}
          />
        ))}
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item, index) => (
          <li
            className="grid grid-cols-[minmax(0,1fr)_auto_auto_2.5rem] items-baseline gap-x-4 tabular-nums"
            key={item.id}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  segmentTones[index % segmentTones.length],
                )}
              />
              <span className="truncate text-foreground/80">{item.label}</span>
            </span>
            <span className="text-xs leading-5 text-muted-foreground/70">
              {item.tokens !== undefined && `${item.tokens.toLocaleString()} tokens`}
            </span>
            <span className="text-right text-foreground/80">{money(item.cost)}</span>
            <span className="text-right text-muted-foreground">
              {Math.round(share(item.cost))}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export { CostMeter }
export type { CostItem, CostMeterProps }
