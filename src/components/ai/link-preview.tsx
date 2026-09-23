import { StarIcon } from '@solar-icons/react/bold/star'
import { GlobalIcon as Globe2Icon } from '@solar-icons/react/linear/global'
import * as React from 'react'

import { cn } from 'cn'

interface LinkPreviewProps extends React.ComponentProps<'article'> {
  description?: string
  imageSrc?: string
  price?: string
  seller?: string
  rating?: number
  reviewCount?: string
  onOpen?: () => void
  siteName?: string
  title: string
  url: string
}

function LinkPreview({
  className,
  description,
  imageSrc,
  price,
  seller,
  rating,
  reviewCount,
  onOpen,
  siteName,
  title,
  url,
  ...props
}: LinkPreviewProps) {
  let hostname = url
  try {
    hostname = new URL(url).hostname.replace('www.', '')
  } catch {
    hostname = url
  }

  return (
    <article
      data-slot="link-preview"
      className={cn(
        'flex items-center gap-4 rounded-md font-sans text-sm leading-5 font-[450] tracking-[-0.05px] text-muted-foreground sm:gap-6',
        className,
      )}
      {...props}
    >
      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted sm:size-40">
        {imageSrc ? (
          <img
            alt=""
            className="size-full object-cover"
            height={160}
            loading="lazy"
            src={imageSrc}
            width={160}
          />
        ) : (
          <Globe2Icon className="size-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="card-heading leading-6 text-foreground">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            onClick={(event) => {
              if (onOpen) {
                event.preventDefault()
                onOpen()
              }
            }}
          >
            {title}
          </a>
        </h3>
        <p className="text-muted-foreground">
          {price && (
            <>
              <span className="tabular-nums">{price}</span>
              <span aria-hidden="true"> · </span>
            </>
          )}
          {siteName ?? hostname}
          {seller && ` – ${seller}`}
        </p>
        {rating !== undefined && (
          <p
            className="flex items-center gap-2 text-muted-foreground"
            aria-label={`${rating} out of 5 stars${reviewCount ? `, ${reviewCount} reviews` : ''}`}
          >
            <StarIcon aria-hidden="true" className="size-4 shrink-0" />
            <span>
              {rating.toFixed(1)}
              {reviewCount && ` (${reviewCount})`}
            </span>
          </p>
        )}
        {description && (
          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{description}</p>
        )}
      </div>
    </article>
  )
}

export { LinkPreview }
export type { LinkPreviewProps }
