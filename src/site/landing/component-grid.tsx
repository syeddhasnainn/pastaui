import { Link } from '@tanstack/react-router'
import { Suspense } from 'react'

import { componentCatalog, type ComponentDocument } from '#/components/docs/component-catalog'
import { ComponentPreview } from '#/components/docs/component-preview'
import { focusRing } from '#/site/landing/focus-ring'
import { cn } from '#/lib/utils'

const tileClass = cn(
  'group flex size-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-[16px] bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.06),0_4px_14px_-6px_rgb(0_0_0/0.12)] transition-shadow duration-200 ease-out hover:shadow-[0_2px_4px_rgb(0_0_0/0.07),0_10px_24px_-8px_rgb(0_0_0/0.18)] motion-reduce:transition-none dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_4px_14px_-6px_rgb(0_0_0/0.6)]',
  focusRing,
)

function ComponentTile({ component }: { component: ComponentDocument }) {
  return (
    <Link
      aria-label={`${component.name}, ${component.category ?? component.group}`}
      className={tileClass}
      params={{ slug: component.slug }}
      to="/docs/component/$slug"
    >
      <span className="relative block aspect-[16/10] w-full overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 [&>*]:max-h-full [&>*]:max-w-full"
          inert
        >
          <Suspense fallback={null}>
            <ComponentPreview slug={component.slug} />
          </Suspense>
        </span>
      </span>
      <span className="flex items-baseline justify-between gap-3 border-t-[0.5px] border-border px-4 py-3">
        <span className="truncate card-text-sm text-foreground">{component.name}</span>
        <span className="shrink-0 sidebar-text-sm text-muted-foreground">
          {component.category ?? component.group}
        </span>
      </span>
    </Link>
  )
}

export function ComponentGrid() {
  return (
    <div className="@container pb-10">
      <h1 className="sr-only">All components</h1>
      <ul className="grid grid-cols-1 gap-2 @min-[640px]:grid-cols-2">
        {componentCatalog.map((component) => (
          <li key={component.slug}>
            <ComponentTile component={component} />
          </li>
        ))}
      </ul>
    </div>
  )
}
