import { Menu } from '@base-ui/react/menu'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react'

import { cn } from 'cn'

interface CategoryDropdownItem {
  id: string
  label: string
  href?: string
}

interface CategoryDropdownCategory {
  id: string
  label: string
  items: CategoryDropdownItem[]
}

interface CategoryDropdownProps {
  categories: CategoryDropdownCategory[]
  value?: string
  onValueChange?: (id: string) => void
  placeholder?: string
  renderItem?: (item: CategoryDropdownItem) => ReactElement
  align?: ComponentProps<typeof Menu.Positioner>['align']
  className?: string
}

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

function categoryOf(categories: CategoryDropdownCategory[], id?: string) {
  return categories.find((category) => category.items.some((item) => item.id === id))?.id
}

function useEnableTransition(ready: boolean) {
  const [enabled, setEnabled] = useState(false)

  useLayoutEffect(() => {
    if (!ready || enabled) return
    const frame = requestAnimationFrame(() => setEnabled(true))
    return () => cancelAnimationFrame(frame)
  }, [ready, enabled])

  return enabled
}

function CategoryDropdown({
  categories,
  value,
  onValueChange,
  placeholder = 'Browse',
  renderItem,
  align = 'center',
  className,
}: CategoryDropdownProps) {
  const selectedCategory = categoryOf(categories, value)
  const selectedItem = categories
    .flatMap((category) => category.items)
    .find((item) => item.id === value)
  const [tab, setTab] = useState(selectedCategory ?? categories[0]?.id ?? '')
  const [tabsHeight, setTabsHeight] = useState(420)
  const activeCategory = categories.find((category) => category.id === tab)

  return (
    <Menu.Root onOpenChange={(open) => open && selectedCategory && setTab(selectedCategory)}>
      <Menu.Trigger
        className={cn(
          'group flex h-9 w-48 items-center justify-between gap-2 rounded-full bg-foreground/7 pr-3 pl-4 text-[14px] font-[550] text-foreground transition-colors outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
      >
        <span className="truncate">{selectedItem?.label ?? placeholder}</span>
        <MorphChevron />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align={align} className="z-50" sideOffset={6}>
          <Menu.Popup className="flex w-[480px] max-w-[calc(100vw-2rem)] origin-(--transform-origin) gap-1 rounded-xl border-[0.5px] border-foreground/10 bg-popover p-1 text-popover-foreground shadow-[0_12px_32px_rgb(0_0_0/.18)] transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-[0.96] data-ending-style:opacity-0 data-starting-style:scale-[0.96] data-starting-style:opacity-0 motion-reduce:transition-none dark:shadow-[0_12px_32px_rgb(0_0_0/.5)]">
            <CategoryTabs
              categories={categories}
              onChange={setTab}
              onHeight={setTabsHeight}
              value={tab}
            />
            <AnimatedHeight className="min-w-0 flex-1" contentKey={tab} maxHeight={tabsHeight}>
              <HoverList key={tab}>
                {(highlight) => (
                  <Menu.Group className="flex animate-in flex-col duration-200 fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
                    <Menu.GroupLabel className="sr-only">{activeCategory?.label}</Menu.GroupLabel>
                    {activeCategory?.items.map((item) => (
                      <Menu.Item
                        aria-current={item.id === value ? 'page' : undefined}
                        className="group/item flex h-9 cursor-default items-center rounded-[10px] px-3 text-[14px] font-medium text-muted-foreground transition-colors duration-200 outline-none select-none aria-[current=page]:font-semibold aria-[current=page]:text-foreground data-[highlighted]:text-foreground"
                        key={item.id}
                        onClick={() => onValueChange?.(item.id)}
                        onFocus={(event) => highlight(event.currentTarget)}
                        onPointerEnter={(event) => highlight(event.currentTarget)}
                        render={
                          renderItem?.(item) ??
                          (item.href
                            ? (props) => (
                                <a {...props} href={item.href}>
                                  {props.children}
                                </a>
                              )
                            : undefined)
                        }
                      >
                        <span className={nudgeClass}>{item.label}</span>
                      </Menu.Item>
                    ))}
                  </Menu.Group>
                )}
              </HoverList>
            </AnimatedHeight>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

const nudgeClass = cn(
  'truncate transition-transform duration-300 group-hover/item:translate-x-0.5 group-data-[highlighted]/item:translate-x-0.5 motion-reduce:transition-none',
  ease,
)

function HoverList({
  children,
}: {
  children: (highlight: (element: HTMLElement) => void) => ReactNode
}) {
  const [box, setBox] = useState<{ top: number; height: number; slide: boolean } | null>(null)
  const [visible, setVisible] = useState(false)

  const highlight = (element: HTMLElement) => {
    setBox({ top: element.offsetTop, height: element.offsetHeight, slide: visible })
    setVisible(true)
  }

  return (
    <div
      className="relative isolate"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setVisible(false)
      }}
      onPointerLeave={() => setVisible(false)}
    >
      {box ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 top-0 -z-10 rounded-[10px] bg-foreground/7 transition-opacity duration-200 motion-reduce:transition-none',
            box.slide && cn('transition-[translate,height,opacity] duration-300', ease),
            !visible && 'opacity-0',
          )}
          style={{ translate: `0 ${box.top}px`, height: box.height }}
        />
      ) : null}
      {children(highlight)}
    </div>
  )
}

const chevronBarClass = cn(
  'absolute top-1/2 h-[1.5px] w-[7px] rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none',
  ease,
)

function MorphChevron() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative size-3.5 shrink-0 translate-y-[2px] text-muted-foreground transition-transform duration-300 group-data-[popup-open]:-translate-y-[2px] motion-reduce:transition-none',
        ease,
      )}
    >
      <span
        className={cn(
          chevronBarClass,
          'left-0 origin-right -translate-y-1/2 rotate-[38deg] group-data-[popup-open]:-rotate-[38deg]',
        )}
      />
      <span
        className={cn(
          chevronBarClass,
          'right-0 origin-left -translate-y-1/2 -rotate-[38deg] group-data-[popup-open]:rotate-[38deg]',
        )}
      />
    </span>
  )
}

function CategoryTabs({
  categories,
  value,
  onChange,
  onHeight,
}: {
  categories: CategoryDropdownCategory[]
  value: string
  onChange: (value: string) => void
  onHeight: (height: number) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null)
  const animate = useEnableTransition(indicator !== null)

  useLayoutEffect(() => {
    if (listRef.current) onHeight(listRef.current.offsetHeight)
  }, [onHeight])

  useLayoutEffect(() => {
    const element = tabRefs.current.get(value)
    if (element) setIndicator({ top: element.offsetTop, height: element.offsetHeight })
  }, [value])

  return (
    <div
      aria-label="Categories"
      aria-orientation="vertical"
      className="relative isolate flex w-44 shrink-0 flex-col gap-0.5 self-start rounded-[10px] bg-foreground/5 p-0.5"
      ref={listRef}
      role="tablist"
    >
      {indicator ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0.5 top-0 -z-10 rounded-[8px] bg-popover shadow-[0_1px_2px_rgb(0_0_0/0.15)] motion-reduce:transition-none',
            animate && cn('transition-[translate,height] duration-300', ease),
          )}
          style={{ translate: `0 ${indicator.top}px`, height: indicator.height }}
        />
      ) : null}
      {categories.map((category) => (
        <button
          aria-selected={value === category.id}
          className={cn(
            'group/item flex h-8 items-center rounded-[8px] px-3 text-left text-[13px] font-[550] whitespace-nowrap transition-colors duration-200',
            value === category.id
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
          key={category.id}
          onClick={() => onChange(category.id)}
          onPointerEnter={() => onChange(category.id)}
          ref={(element) => {
            if (element) tabRefs.current.set(category.id, element)
            else tabRefs.current.delete(category.id)
          }}
          role="tab"
          type="button"
        >
          <span className={nudgeClass}>{category.label}</span>
        </button>
      ))}
    </div>
  )
}

function AnimatedHeight({
  children,
  contentKey,
  maxHeight,
  className,
}: {
  children: ReactNode
  contentKey: string
  maxHeight: number
  className?: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const heightRef = useRef<number | null>(null)
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [height, setHeight] = useState<number | null>(null)
  const [overflowing, setOverflowing] = useState(false)
  const [settling, setSettling] = useState(false)
  const animate = useEnableTransition(height !== null)

  useLayoutEffect(() => {
    const element = contentRef.current
    if (!element) return
    const measure = () => {
      const next = Math.min(element.offsetHeight, maxHeight)
      if (heightRef.current !== null && heightRef.current !== next) {
        setSettling(true)
        clearTimeout(settleTimer.current)
        settleTimer.current = setTimeout(() => setSettling(false), 420)
      }
      heightRef.current = next
      setHeight(next)
      setOverflowing(element.offsetHeight > maxHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [contentKey, maxHeight])

  useEffect(() => () => clearTimeout(settleTimer.current), [])

  return (
    <div
      className={cn(
        '[scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] overscroll-contain motion-reduce:transition-none',
        overflowing && !settling ? 'overflow-y-auto' : 'overflow-hidden',
        animate && cn('transition-[height] duration-[400ms]', ease),
        className,
      )}
      style={height === null ? undefined : { height }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  )
}

export { CategoryDropdown }
export type { CategoryDropdownCategory, CategoryDropdownItem, CategoryDropdownProps }
