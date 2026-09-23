import { Link } from '@tanstack/react-router'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  componentCatalog,
  componentGroups,
  type ComponentDocument,
} from '#/components/docs/component-catalog'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

interface ComponentSidebarProps {
  activeComponent?: ComponentDocument
}

interface ComponentLinkProps {
  activeComponent?: ComponentDocument
  component: ComponentDocument
  linkRef: (element: HTMLAnchorElement | null) => void
  onBlur: () => void
  onFocus: () => void
  onMouseEnter: () => void
}

interface SidebarIndicatorRect {
  height: number
  top: number
}

function SidebarComponentLink({
  activeComponent,
  component,
  linkRef,
  onBlur,
  onFocus,
  onMouseEnter,
}: ComponentLinkProps) {
  return (
    <Link
      aria-current={
        component.slug === (activeComponent?.slug ?? 'installation') ? 'page' : undefined
      }
      className={cn(
        'relative z-10 mr-2 -ml-2 flex h-7 items-center gap-2 rounded-md border-none px-2 text-sm text-muted-foreground transition-[color] duration-150 ease-[ease] hover:text-foreground',
        component.slug === (activeComponent?.slug ?? 'installation') &&
          'font-medium text-foreground',
      )}
      data-component-link
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      params={{ slug: component.slug }}
      ref={linkRef}
      to="/docs/component/$slug"
    >
      <span className="min-w-0 truncate">{component.name}</span>
      {component.isNew && (
        <Badge className="ml-auto h-4 px-1.5 text-[9px] leading-none uppercase" variant="secondary">
          New
        </Badge>
      )}
    </Link>
  )
}

export function ComponentSidebar({ activeComponent }: ComponentSidebarProps) {
  const activeSlug = activeComponent?.slug ?? 'installation'
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [indicatorRect, setIndicatorRect] = useState<SidebarIndicatorRect | null>(null)
  const componentLinks = useRef<Record<string, HTMLAnchorElement | null>>({})
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const component = componentLinks.current[hoveredComponent ?? activeSlug]

    if (component) {
      setIndicatorRect({
        height: component.offsetHeight,
        top: component.offsetTop,
      })
    }
  }, [activeSlug, hoveredComponent])

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      indicatorRef.current?.setAttribute('data-ready', 'true')
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  useLayoutEffect(() => {
    const container = scrollContainerRef.current
    const activeLink = componentLinks.current[activeSlug]

    if (!container || !activeLink) return

    const linkTop = activeLink.offsetTop
    const linkBottom = linkTop + activeLink.offsetHeight
    const visibleTop = container.scrollTop
    const visibleBottom = visibleTop + container.clientHeight

    if (linkTop < visibleTop) {
      container.scrollTop = Math.max(0, linkTop - 32)
    } else if (linkBottom > visibleBottom) {
      container.scrollTop = linkBottom - container.clientHeight + 32
    }
  }, [activeSlug])

  return (
    <aside className="hidden lg:sticky lg:top-26 lg:block lg:h-[calc(100dvh-6.5rem)]">
      <div
        className="relative -ml-2 flex h-full w-[calc(100%+0.5rem)] [scrollbar-width:none] flex-col gap-8 overflow-y-auto overscroll-contain pb-8 pl-2 [&::-webkit-scrollbar]:hidden"
        onMouseLeave={() => setHoveredComponent(null)}
        ref={scrollContainerRef}
      >
        <span
          aria-hidden="true"
          className="sidebar-hover-indicator pointer-events-none absolute right-2 left-0 z-0 rounded-md bg-sidebar-item-hover"
          style={{
            height: indicatorRect?.height ?? 0,
            opacity: indicatorRect ? 1 : 0,
            top: indicatorRect?.top ?? 0,
          }}
          ref={indicatorRef}
        />
        <Link
          to="/docs/installation"
          aria-current={!activeComponent ? 'page' : undefined}
          className={cn(
            'relative z-10 mr-2 -ml-2 flex h-7 shrink-0 items-center rounded-md px-2 text-sm text-muted-foreground hover:text-foreground',
            !activeComponent && 'font-medium text-foreground',
          )}
          ref={(element) => {
            componentLinks.current.installation = element
          }}
          onFocus={() => setHoveredComponent('installation')}
          onBlur={() => setHoveredComponent(null)}
          onMouseEnter={() => setHoveredComponent('installation')}
        >
          Installation
        </Link>
        {componentGroups.map((group) => {
          const groupComponents = componentCatalog.filter((component) => component.group === group)
          const categories = [
            ...new Set(groupComponents.map((component) => component.category ?? group)),
          ]

          return (
            <section aria-label={`${group} components`} className="flex flex-col gap-5" key={group}>
              {categories.map((category) => {
                const categoryComponents = groupComponents.filter(
                  (component) => (component.category ?? group) === category,
                )

                return (
                  <nav
                    aria-label={`${category} components`}
                    className="flex flex-col gap-1"
                    key={category}
                  >
                    <p className="mb-1 text-[11px] leading-4 font-semibold text-muted-foreground">
                      {category}
                    </p>
                    {categoryComponents.map((component) => (
                      <SidebarComponentLink
                        activeComponent={activeComponent}
                        component={component}
                        key={component.slug}
                        linkRef={(element) => {
                          componentLinks.current[component.slug] = element
                        }}
                        onBlur={() => setHoveredComponent(null)}
                        onFocus={() => setHoveredComponent(component.slug)}
                        onMouseEnter={() => setHoveredComponent(component.slug)}
                      />
                    ))}
                  </nav>
                )
              })}
            </section>
          )
        })}
      </div>
    </aside>
  )
}

export function MobileComponentNav({ activeComponent }: ComponentSidebarProps) {
  return (
    <nav
      aria-label="Components"
      className="flex shrink-0 [scrollbar-width:none] gap-1 overflow-x-auto pr-4 pb-2 sm:pr-6 lg:hidden [&::-webkit-scrollbar]:hidden"
    >
      <Link
        to="/docs/installation"
        aria-current={!activeComponent ? 'page' : undefined}
        className={cn(
          'inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
          !activeComponent && 'bg-muted text-foreground',
        )}
      >
        Installation
      </Link>
      {componentCatalog.map((component) => (
        <Link
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            component.slug === (activeComponent?.slug ?? 'installation') &&
              'bg-muted text-foreground',
          )}
          key={component.slug}
          params={{ slug: component.slug }}
          to="/docs/component/$slug"
        >
          {component.name}
          {component.isNew && (
            <Badge className="h-4 px-1.5 text-[9px] leading-none uppercase" variant="secondary">
              New
            </Badge>
          )}
        </Link>
      ))}
    </nav>
  )
}
