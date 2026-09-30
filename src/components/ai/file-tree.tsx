import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { FileCodeIcon as FileCode2Icon } from '@solar-icons/react/linear/file-code'
import { FileIcon } from '@solar-icons/react/linear/file'
import { FolderIcon } from '@solar-icons/react/linear/folder'
import { FolderOpenIcon } from '@solar-icons/react/linear/folder-open'
import * as React from 'react'

import { cn } from 'cn'

interface FileTreeItem {
  depth?: number
  expanded?: boolean
  id: string
  kind: 'file' | 'folder'
  name: string
  status?: 'added' | 'deleted' | 'modified'
}

interface FileTreeProps extends Omit<React.ComponentProps<'section'>, 'onSelect'> {
  items: FileTreeItem[]
  onSelect?: (id: string) => void
  selectedId?: string
  title?: string
}

const statusCopy = { added: 'A', deleted: 'D', modified: 'M' }

function FileTree({
  className,
  items,
  onSelect,
  selectedId,
  title = 'Files',
  ...props
}: FileTreeProps) {
  return (
    <section
      data-slot="file-tree"
      className={cn(
        'rounded-[16px] bg-card p-2 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <h3 className="px-2 py-1.5 card-heading text-muted-foreground">{title}</h3>
      <ul className="mt-1 space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className={cn(
                'flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-sm transition-colors hover:bg-muted',
                item.id === selectedId && 'bg-muted',
              )}
              onClick={() => onSelect?.(item.id)}
              style={{ paddingLeft: `${(item.depth ?? 0) * 16 + 8}px` }}
              type="button"
            >
              {item.kind === 'folder' ? (
                <>
                  <ChevronRightIcon
                    className={cn('size-3.5 text-muted-foreground', item.expanded && 'rotate-90')}
                  />
                  {item.expanded ? (
                    <FolderOpenIcon className="size-4 text-muted-foreground" />
                  ) : (
                    <FolderIcon className="size-4 text-muted-foreground" />
                  )}
                </>
              ) : (
                <>
                  <span className="w-3.5" />
                  {item.name.endsWith('.tsx') || item.name.endsWith('.ts') ? (
                    <FileCode2Icon className="size-4 text-muted-foreground" />
                  ) : (
                    <FileIcon className="size-4 text-muted-foreground" />
                  )}
                </>
              )}
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              {item.status && (
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    item.status === 'added' && 'text-emerald-600',
                    item.status === 'deleted' && 'text-destructive',
                    item.status === 'modified' && 'text-amber-600',
                  )}
                >
                  {statusCopy[item.status]}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export { FileTree }
export type { FileTreeItem, FileTreeProps }
