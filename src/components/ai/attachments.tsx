import { FileIcon } from '@solar-icons/react/linear/file'
import { FileTextIcon } from '@solar-icons/react/linear/file-text'
import { GalleryIcon as ImageIcon } from '@solar-icons/react/linear/gallery'
import { RestartIcon as RotateCcwIcon } from '@solar-icons/react/linear/restart'
import { CloseIcon as XIcon } from '@solar-icons/react/linear/close'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface AttachmentItem {
  id: string
  kind?: 'document' | 'file' | 'image' | 'pdf'
  name: string
  progress?: number
  size?: string
  status?: 'error' | 'ready' | 'uploading'
  url?: string
}

interface AttachmentsProps extends React.ComponentProps<'ul'> {
  variant?: 'default' | 'uploading' | 'failed'
  items: AttachmentItem[]
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
}

function Attachments({
  className,
  items,
  onRemove,
  onRetry,
  variant = 'default',
  ...props
}: AttachmentsProps) {
  return (
    <ul
      aria-label="Attachments"
      data-slot="attachments"
      className={cn(
        'grid gap-3 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground sm:grid-cols-2',
        className,
      )}
      {...props}
    >
      {items.map((attachment) => {
        const item = {
          ...attachment,
          status:
            attachment.status ??
            (variant === 'failed' ? 'error' : variant === 'uploading' ? 'uploading' : 'ready'),
        }
        return (
          <li
            className="relative flex min-w-0 items-center gap-3 overflow-hidden rounded-[16px] bg-card p-3 shadow-card transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-[0.97] starting:opacity-0 motion-reduce:starting:scale-100"
            key={item.id}
          >
            <AttachmentPreview item={item} />
            <div className="min-w-0 flex-1">
              <p className="truncate card-heading leading-5 text-muted-foreground">{item.name}</p>
              <p
                className={cn(
                  'mt-0.5 text-xs leading-5 font-[450] text-muted-foreground',
                  item.status === 'error' && 'text-destructive',
                )}
              >
                {item.status === 'uploading'
                  ? `${item.progress ?? 0}% uploaded`
                  : item.status === 'error'
                    ? 'Upload failed'
                    : item.size}
              </p>
            </div>
            {item.status === 'error' && (
              <Button
                aria-label={`Retry upload: ${item.name}`}
                type="button"
                onClick={() => onRetry?.(item.id)}
                size="icon-xs"
                variant="ghost"
              >
                <RotateCcwIcon />
              </Button>
            )}
            <Button
              aria-label={`Remove ${item.name}`}
              type="button"
              onClick={() => onRemove?.(item.id)}
              size="icon-xs"
              variant="ghost"
            >
              <XIcon />
            </Button>
            {item.status === 'uploading' && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-muted">
                <span
                  className="block h-full origin-left bg-foreground transition-[scale] duration-300 ease-linear"
                  style={{ scale: `${(item.progress ?? 0) / 100} 1` }}
                />
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function AttachmentPreview({ item }: { item: AttachmentItem }) {
  if (item.kind === 'image' && item.url) {
    return (
      <img
        alt=""
        className="size-10 shrink-0 rounded-md object-cover"
        height={40}
        src={item.url}
        width={40}
      />
    )
  }

  const kind = item.kind === 'pdf' || /\.pdf$/i.test(item.name) ? 'pdf' : (item.kind ?? 'file')
  const Icon =
    kind === 'image' ? ImageIcon : kind === 'document' || kind === 'pdf' ? FileTextIcon : FileIcon
  const colors = {
    image: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    document: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    pdf: 'bg-red-500/10 text-red-600 dark:text-red-400',
    file: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md',
        colors[kind],
      )}
    >
      <Icon className="size-4" />
      {kind === 'pdf' && (
        <span className="text-[8px] leading-none font-semibold tracking-wide">PDF</span>
      )}
    </span>
  )
}

export { Attachments }
export type { AttachmentItem, AttachmentsProps }
