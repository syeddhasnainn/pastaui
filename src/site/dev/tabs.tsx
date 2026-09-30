import type { KeyboardEvent } from 'react'

import { focusRing, muted, panelId, tabId } from '#/site/dev/styles'
import { cn } from '#/lib/utils'

export interface TabItem<T extends string> {
  dot?: boolean
  id: T
  label: string
}

interface TabsProps<T extends string> {
  idBase: string
  label: string
  onChange: (id: T) => void
  tabs: TabItem<T>[]
  value: T
}

export function Tabs<T extends string>({ idBase, label, onChange, tabs, value }: TabsProps<T>) {
  const index = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === value),
  )

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = tabs.length - 1
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft'
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    const target = tabs[next]
    if (!target) return
    onChange(target.id)
    event.currentTarget.ownerDocument.getElementById(tabId(idBase, target.id))?.focus()
  }

  return (
    <div
      aria-label={label}
      className="relative grid rounded-md border-[0.5px] border-neutral-900/12 p-0.5 dark:border-neutral-100/14"
      role="tablist"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute top-0.5 bottom-0.5 left-0.5 rounded-[5px] bg-neutral-900/7 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:bg-neutral-100/12"
        style={{
          width: `calc((100% - 4px) / ${tabs.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {tabs.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            aria-controls={panelId(idBase, tab.id)}
            aria-selected={selected}
            className={cn(
              'relative flex h-6 items-center justify-center gap-1 rounded-[5px] text-[11px] font-[500]',
              selected ? 'text-neutral-900/88 dark:text-neutral-100/90' : muted,
              focusRing,
            )}
            id={tabId(idBase, tab.id)}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            onKeyDown={handleKeyDown}
            role="tab"
            tabIndex={selected ? 0 : -1}
            type="button"
          >
            {tab.label}
            {tab.dot ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-[oklch(62.6%_0.205_254.947)]"
                  data-tab-dot=""
                />
                <span className="sr-only">has changes</span>
              </>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
