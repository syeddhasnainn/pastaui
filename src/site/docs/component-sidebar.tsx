import { Link } from '@tanstack/react-router'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  componentCatalog,
  componentGroups,
  type ComponentDocument,
} from '#/components/docs/component-catalog'
import { cn } from '#/lib/utils'

interface ComponentSidebarNavProps {
  activeSlug?: string
}

interface ComponentLinkProps {
  active: boolean
  component: ComponentDocument
  linkRef: (element: HTMLAnchorElement | null) => void
  onBlur: () => void
  onFocus: () => void
  onMouseEnter: () => void
}

const SIDEBAR_FADE_SIZE = 32

interface SidebarIndicatorRect {
  height: number
  top: number
}

function SidebarComponentLink({
  active,
  component,
  linkRef,
  onBlur,
  onFocus,
  onMouseEnter,
}: ComponentLinkProps) {
  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative z-10 mr-2 -ml-2 flex h-7 items-center gap-2 rounded-md border-none px-2 sidebar-text-md text-muted-foreground transition-[color] duration-150 ease-[ease] hover:text-foreground',
        active && 'font-medium text-foreground',
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
        <span className="ml-auto flex h-4 shrink-0 items-center rounded-full bg-[oklch(62.6%_0.205_254.947/0.12)] px-1.5 text-[10px] leading-none font-[550] text-[oklch(50%_0.2_257)] dark:text-[oklch(78%_0.12_253)]">
          New
        </span>
      )}
    </Link>
  )
}

export function ComponentSidebarNav({ activeSlug }: ComponentSidebarNavProps) {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [indicatorRect, setIndicatorRect] = useState<SidebarIndicatorRect | null>(null)
  const componentLinks = useRef<Record<string, HTMLAnchorElement | null>>({})
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const slug = hoveredComponent ?? activeSlug
    const component = slug ? componentLinks.current[slug] : null

    if (component) {
      setIndicatorRect({ height: component.offsetHeight, top: component.offsetTop })
    } else {
      setIndicatorRect(null)
    }
  }, [activeSlug, hoveredComponent])

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      indicatorRef.current?.setAttribute('data-ready', 'true')
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current

    if (!container) return

    let animationFrame = 0

    const updateFades = () => {
      animationFrame = 0
      const remaining = container.scrollHeight - container.clientHeight - container.scrollTop
      container.style.setProperty(
        '--sidebar-fade-top',
        `${Math.min(Math.max(container.scrollTop, 0), SIDEBAR_FADE_SIZE)}px`,
      )
      container.style.setProperty(
        '--sidebar-fade-bottom',
        `${Math.min(Math.max(remaining, 0), SIDEBAR_FADE_SIZE)}px`,
      )
    }

    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(updateFades)
    }

    updateFades()
    container.addEventListener('scroll', scheduleUpdate, { passive: true })
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', scheduleUpdate)
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  useLayoutEffect(() => {
    const container = scrollContainerRef.current
    const activeLink = activeSlug ? componentLinks.current[activeSlug] : null

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
    <div
      className="relative -ml-2 flex h-full w-[calc(100%+0.5rem)] [scrollbar-width:none] flex-col gap-5 overflow-y-auto overscroll-contain [mask-image:linear-gradient(to_bottom,transparent,#000_var(--sidebar-fade-top),#000_calc(100%-var(--sidebar-fade-bottom)),transparent)] pb-8 pl-2 [--sidebar-fade-bottom:32px] [--sidebar-fade-top:0px] [&::-webkit-scrollbar]:hidden"
      data-sidebar-scroll
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
      {componentGroups.map((group) => {
        const groupComponents = componentCatalog.filter((component) => component.group === group)
        const categories = [
          ...new Set(groupComponents.map((component) => component.category ?? group)),
        ]

        return categories.map((category) => (
          <nav aria-label={category} className="flex flex-col" key={`${group}/${category}`}>
            <p className="mb-1 sidebar-text-sm text-foreground">{category}</p>
            {groupComponents
              .filter((component) => (component.category ?? group) === category)
              .map((component) => (
                <SidebarComponentLink
                  active={component.slug === activeSlug}
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
        ))
      })}
    </div>
  )
}
