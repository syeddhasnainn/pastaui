import { Link, useSearch } from '@tanstack/react-router'

import { AltArrowLeftIcon as ArrowLeftIcon } from '@solar-icons/react/linear/alt-arrow-left'
import { AltArrowRightIcon as ArrowRightIcon } from '@solar-icons/react/linear/alt-arrow-right'

import { componentCatalog } from '#/components/docs/component-catalog'
import { cn } from '#/lib/utils'

export type ComponentView = 'preview' | 'code'

export function useComponentView(): ComponentView {
  const search: { view?: string } = useSearch({ strict: false })
  return search.view === 'code' ? 'code' : 'preview'
}

const views: { label: string; value: ComponentView }[] = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' },
]

export function ComponentViewToggle({ className }: { className?: string }) {
  const active = useComponentView()

  return (
    <nav aria-label="Component view" className={cn('flex items-center gap-1', className)}>
      {views.map((view) => (
        <Link
          aria-current={active === view.value ? 'page' : undefined}
          className={cn(
            'flex h-9 items-center rounded-full px-4 text-[14px] font-semibold transition-colors',
            active === view.value
              ? 'bg-foreground text-background'
              : 'bg-muted text-foreground hover:bg-muted/70',
          )}
          key={view.value}
          replace
          search={view.value === 'code' ? { view: 'code' } : {}}
          to="."
        >
          {view.label}
        </Link>
      ))}
    </nav>
  )
}

const orderedComponents = (() => {
  const categories = [
    ...new Set(componentCatalog.map((component) => component.category ?? component.group)),
  ]
  return categories.flatMap((category) =>
    componentCatalog.filter((component) => (component.category ?? component.group) === category),
  )
})()

const pagerButtonClass =
  'flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70'

export function ComponentPager({ slug, className }: { slug: string; className?: string }) {
  const view = useComponentView()
  const index = orderedComponents.findIndex((component) => component.slug === slug)
  const previous = index > 0 ? orderedComponents[index - 1] : undefined
  const next = index >= 0 ? orderedComponents[index + 1] : undefined
  const search = view === 'code' ? { view: 'code' as const } : {}

  const arrow = (target: typeof previous, direction: 'previous' | 'next') => {
    const Icon = direction === 'previous' ? ArrowLeftIcon : ArrowRightIcon
    if (!target) {
      return (
        <span aria-hidden="true" className={cn(pagerButtonClass, 'opacity-30')}>
          <Icon className="size-4" />
        </span>
      )
    }
    return (
      <Link
        aria-label={`${direction === 'previous' ? 'Previous' : 'Next'}: ${target.name}`}
        className={pagerButtonClass}
        params={{ slug: target.slug }}
        search={search}
        title={target.name}
        to="/docs/component/$slug"
      >
        <Icon aria-hidden="true" className="size-4" />
      </Link>
    )
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {arrow(previous, 'previous')}
      <ComponentViewToggle />
      {arrow(next, 'next')}
    </div>
  )
}
