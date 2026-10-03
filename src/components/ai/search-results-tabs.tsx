import { GlobalIcon as GlobeIcon } from '@solar-icons/react/linear/global'
import { GalleryIcon as ImageIcon } from '@solar-icons/react/linear/gallery'
import { DocumentTextIcon as NewsIcon } from '@solar-icons/react/linear/document-text'
import { motion, useReducedMotion } from 'motion/react'
import * as React from 'react'

import { cn } from 'cn'

interface SearchResultItem {
  id: string
  publishedLabel?: string
  publishedAt?: string
  meta?: string
  title: string
  type: 'images' | 'news' | 'web'
  url?: string
  image?: string
  imageAlt?: string
  source?: string
  description?: string
  icon?: React.ReactNode
}

interface SearchResultsTabsProps extends React.ComponentProps<'section'> {
  activeType?: SearchResultItem['type']
  items: SearchResultItem[]
  onActiveTypeChange?: (type: SearchResultItem['type']) => void
  onOpen?: (id: string) => void
  query: string
  showTabs?: boolean
}

function domainOf(url?: string) {
  if (!url || !/^https?:\/\//.test(url)) return undefined
  return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
}

function SearchResultsTabs({
  activeType = 'web',
  className,
  items,
  onActiveTypeChange,
  onOpen,
  query,
  showTabs = false,
  ...props
}: SearchResultsTabsProps) {
  const visibleItems = items.filter((item) => item.type === activeType)
  const underlineId = React.useId()
  const reducedMotion = useReducedMotion()

  return (
    <section
      aria-label={`Search results for ${query}`}
      data-slot="search-results-tabs"
      className={cn(
        'font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      {showTabs && (
        <div className="mb-4 flex gap-5 pb-2" aria-label="Result types">
          {(['web', 'images', 'news'] as const).map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={activeType === type}
              className={cn(
                'relative inline-flex cursor-pointer items-center gap-2 bg-transparent px-0 py-2 text-sm font-[450] capitalize transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
                activeType === type && 'text-foreground',
              )}
              onClick={() => onActiveTypeChange?.(type)}
            >
              {type === 'web' ? (
                <GlobeIcon aria-hidden="true" className="size-4" />
              ) : type === 'images' ? (
                <ImageIcon aria-hidden="true" className="size-4" />
              ) : (
                <NewsIcon aria-hidden="true" className="size-4" />
              )}
              {type}
              {activeType === type && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px bg-foreground"
                  layoutId={underlineId}
                  transition={
                    reducedMotion ? { duration: 0 } : { duration: 0.25, ease: [0.77, 0, 0.175, 1] }
                  }
                />
              )}
            </button>
          ))}
        </div>
      )}
      <ol
        className={cn(
          'transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0',
          activeType === 'images'
            ? 'columns-1 gap-4 sm:columns-2 lg:columns-3'
            : 'flex max-w-[65ch] flex-col gap-2',
        )}
        key={activeType}
      >
        {visibleItems.map((item, index) =>
          item.type === 'images' && item.image ? (
            <li key={item.id} className="mb-5 break-inside-avoid">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => onOpen?.(item.id)}
                className="group block"
              >
                <img
                  src={item.image}
                  alt={item.imageAlt ?? item.title}
                  loading="lazy"
                  className={cn(
                    'w-full rounded-[16px] object-cover',
                    index % 3 === 0
                      ? 'aspect-[4/3]'
                      : index % 3 === 1
                        ? 'aspect-[3/4]'
                        : 'aspect-square',
                  )}
                />
                <div className="pt-2">
                  <p className="truncate card-heading text-foreground group-hover:underline">
                    {item.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs leading-5">
                    <span
                      aria-hidden="true"
                      className="flex size-4 shrink-0 items-center justify-center"
                    >
                      {item.icon ?? <GlobeIcon className="size-4" />}
                    </span>
                    <span>{item.source ?? 'Unsplash'}</span>
                  </div>
                </div>
              </a>
            </li>
          ) : (
            <li
              className="group relative -mx-3 rounded-[12px] p-3 transition-colors duration-150 ease-out hover:bg-foreground/4"
              key={item.id}
            >
              <div className="flex items-center gap-2 text-[13px] leading-5 text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-foreground/6 [&_img]:size-3.5 [&_img]:object-contain [&_svg]:size-3.5"
                >
                  {item.icon ?? <GlobeIcon />}
                </span>
                <span className="truncate">
                  {[item.source ?? item.meta, domainOf(item.url)].filter(Boolean).join(' · ')}
                </span>
              </div>
              <h3 className="mt-1 text-base leading-6 font-medium text-foreground">
                {item.type === 'news' ? (
                  item.title
                ) : item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="decoration-foreground/40 underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 after:rounded-[12px] visited:text-foreground/70 focus-visible:after:ring-2 focus-visible:after:ring-ring"
                    onClick={() => onOpen?.(item.id)}
                  >
                    {item.title}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="text-left decoration-foreground/40 underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 after:rounded-[12px] focus-visible:after:ring-2 focus-visible:after:ring-ring"
                    onClick={() => onOpen?.(item.id)}
                  >
                    {item.title}
                  </button>
                )}
              </h3>
              {item.description && (
                <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
                  {item.description}
                </p>
              )}
              {item.type === 'news' && item.publishedLabel && (
                <time
                  dateTime={item.publishedAt}
                  className="mt-1.5 block text-[13px] leading-5 text-muted-foreground/70"
                >
                  {item.publishedLabel}
                </time>
              )}
            </li>
          ),
        )}
      </ol>
      {!visibleItems.length && (
        <p className="py-8 text-center text-xs leading-5">No results found.</p>
      )}
    </section>
  )
}

export { SearchResultsTabs }
export type { SearchResultItem, SearchResultsTabsProps }
