import { BookmarkIcon } from '@solar-icons/react/linear/bookmark'
import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { FileIcon } from '@solar-icons/react/linear/file'
import { FolderIcon } from '@solar-icons/react/linear/folder'
import { FolderOpenIcon } from '@solar-icons/react/linear/folder-open'
import { PanelsTopLeftIcon } from '@solar-icons/react/linear/panels-top-left'
import * as React from 'react'

import { cn } from 'cn'

interface AiSidebarItem {
  active?: boolean
  depth?: number
  expanded?: boolean
  id: string
  kind: 'bookmark' | 'file' | 'folder' | 'project'
  label: string
  meta?: string
}

interface AiSidebarProps extends Omit<React.ComponentProps<'aside'>, 'onSelect'> {
  items: AiSidebarItem[]
  onSelect?: (id: string) => void
  title?: string
}

function ItemIcon({ expanded, kind }: Pick<AiSidebarItem, 'expanded' | 'kind'>) {
  if (kind === 'bookmark') return <BookmarkIcon className="size-4" />
  if (kind === 'file') return <FileIcon className="size-4" />
  if (kind === 'folder')
    return expanded ? <FolderOpenIcon className="size-4" /> : <FolderIcon className="size-4" />
  return <PanelsTopLeftIcon className="size-4" />
}

function AiSidebar({ className, items, onSelect, title = 'Workspace', ...props }: AiSidebarProps) {
  return (
    <aside
      data-slot="ai-sidebar"
      className={cn(
        'rounded-[16px] bg-card p-2 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <h3 className="px-2 py-2 text-[11px] leading-5 font-[450] text-muted-foreground">{title}</h3>
      <nav aria-label={title}>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.id}>
              <button
                aria-current={item.active ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground',
                  item.active && 'bg-background text-foreground shadow-sm ring-1 ring-foreground/8',
                )}
                onClick={() => onSelect?.(item.id)}
                style={{ paddingLeft: `${(item.depth ?? 0) * 14 + 8}px` }}
                type="button"
              >
                {(item.kind === 'folder' || item.kind === 'project') && (
                  <ChevronRightIcon className={cn('size-3', item.expanded && 'rotate-90')} />
                )}
                {item.kind === 'file' || item.kind === 'bookmark' ? <span className="w-3" /> : null}
                <ItemIcon expanded={item.expanded} kind={item.kind} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.meta && (
                  <span className="text-[10px] text-muted-foreground">{item.meta}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export { AiSidebar }
export type { AiSidebarItem, AiSidebarProps }
