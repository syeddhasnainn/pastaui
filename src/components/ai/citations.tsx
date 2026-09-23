import { GlobalIcon as GlobeIcon } from '@solar-icons/react/linear/global'
import { ExportIcon as ExternalLinkIcon } from '@solar-icons/react/linear/export'
import * as React from 'react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from 'cn'

interface CitationItem {
  icon?: React.ReactNode
  description?: string
  domain?: string
  id: string
  title: string
  url: string
}

interface CitationsProps extends React.ComponentProps<typeof Collapsible> {
  items: CitationItem[]
}

function Citations({ className, defaultOpen = false, items, ...props }: CitationsProps) {
  return (
    <Collapsible
      data-slot="citations"
      className={cn('text-sm font-[450] tracking-[-0.05px] text-muted-foreground', className)}
      defaultOpen={defaultOpen}
      {...props}
    >
      <CollapsibleTrigger
        className="inline-flex cursor-pointer items-center gap-2 rounded-md py-1 text-sm font-[450] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        render={<button aria-label="Toggle sources" type="button" />}
      >
        <span className="flex -space-x-2" aria-hidden="true">
          {items.slice(0, 3).map((item) => (
            <span
              className="relative flex size-5 items-center justify-center overflow-hidden rounded-full bg-background ring-2 ring-background [&_img]:size-full [&_img]:object-contain [&_svg]:size-4"
              key={item.id}
            >
              {item.icon ?? <GlobeIcon />}
            </span>
          ))}
        </span>
        <span>
          {items.length} {items.length === 1 ? 'source' : 'sources'}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="-mx-1">
        <div className="px-1 pt-3 pb-2">
          <ol className="space-y-1 rounded-md bg-card p-2 shadow-card">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  className="group/link flex gap-3 rounded-md p-2 transition-colors hover:bg-muted"
                  href={item.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full [&_img]:size-5 [&_img]:object-contain [&_svg]:size-5"
                  >
                    {item.icon ?? <GlobeIcon />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 card-heading">
                      <span className="truncate">{item.title}</span>
                      <ExternalLinkIcon className="size-3 text-muted-foreground" />
                    </span>
                    {item.description && (
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                    {item.domain && (
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        {item.domain}
                      </span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { Citations }
export type { CitationItem, CitationsProps }
