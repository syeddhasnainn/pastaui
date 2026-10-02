import { Link, useSearch } from '@tanstack/react-router'

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
            'flex h-7 items-center rounded-full px-3 text-[13px] font-semibold transition-colors',
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
