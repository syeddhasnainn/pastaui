import { GlobalIcon as GlobeIcon } from '@solar-icons/react/linear/global'
import { GalleryIcon as ImageIcon } from '@solar-icons/react/linear/gallery'
import { DocumentTextIcon as NewsIcon } from '@solar-icons/react/linear/document-text'
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
                'inline-flex cursor-pointer items-center gap-2 border-b border-transparent bg-transparent px-0 py-2 text-sm font-[450] capitalize transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
                activeType === type && 'border-foreground text-foreground',
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
            </button>
          ))}
        </div>
      )}
      <ol
        className={
          activeType === 'images' ? 'columns-1 gap-4 sm:columns-2 lg:columns-3' : 'space-y-5'
        }
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
            <li key={item.id}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span
                      aria-hidden="true"
                      className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-sm"
                    >
                      {item.icon ?? <GlobeIcon className="size-4" />}
                    </span>
                    <span>
                      {item.source ??
                        item.meta ??
                        item.url?.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    </span>
                  </div>
                  <h3 className="mt-2 card-heading leading-6 text-foreground">
                    {item.type === 'news' ? (
                      item.title
                    ) : item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        onClick={() => onOpen?.(item.id)}
                      >
                        {item.title}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="text-left hover:underline"
                        onClick={() => onOpen?.(item.id)}
                      >
                        {item.title}
                      </button>
                    )}
                  </h3>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5">{item.description}</p>
                  )}
                  {item.type === 'news' && item.publishedLabel && (
                    <time dateTime={item.publishedAt} className="mt-2 block text-xs leading-5">
                      {item.publishedLabel}
                    </time>
                  )}
                </div>
              </div>
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
