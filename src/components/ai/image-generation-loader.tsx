import { ExportIcon } from '@solar-icons/react/linear/export'
import * as React from 'react'

import { ImageGenerationCanvas } from '@/components/ai/image-generation-canvas'
import { ImageGenerationSnake } from '@/components/ai/image-generation-snake'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface ImageGenerationLoaderProps extends React.ComponentProps<'figure'> {
  alt?: string
  imageUrl?: string
  onEdit?: () => void
  onShare?: () => void
  playable?: boolean
  progress?: number
  prompt: string
  status?: 'complete' | 'generating' | 'queued'
}

function ImageGenerationLoader({
  alt = 'Generated image',
  className,
  imageUrl,
  onEdit,
  onShare,
  playable = true,
  progress = 0,
  prompt,
  status = 'complete',
  ...props
}: ImageGenerationLoaderProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const displayedProgress = Math.max(0, Math.min(Math.round(progress), 100))
  const isComplete = status === 'complete'
  const showGame = status === 'generating' && playable && isPlaying

  return (
    <figure data-slot="image-generation-loader" className={cn('w-full', className)} {...props}>
      <div className="relative aspect-square overflow-hidden rounded-[16px] border-[0.5px] border-border bg-background">
        {isComplete ? (
          <CompletedImage alt={alt} imageUrl={imageUrl} onEdit={onEdit} onShare={onShare} />
        ) : showGame ? (
          <ImageGenerationSnake onExit={() => setIsPlaying(false)} />
        ) : (
          <div className="absolute inset-0 flex flex-col">
            <button
              aria-label={
                playable && status === 'generating'
                  ? 'Play Snake while your image is generating'
                  : 'Image generation in progress'
              }
              className="relative min-h-0 flex-1 overflow-hidden rounded-[16px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default"
              disabled={!playable || status === 'queued'}
              onClick={() => setIsPlaying(true)}
              type="button"
            >
              <ImageGenerationCanvas progress={displayedProgress / 100} />
            </button>
            <progress
              aria-label="Image generation progress"
              className="sr-only"
              max={100}
              value={displayedProgress}
            />
            <span className="pointer-events-none absolute right-3.5 bottom-3.5 z-30 flex h-7 min-w-14 items-center justify-center rounded-full border-[0.5px] border-border bg-background/80 px-2 text-sm font-medium text-foreground tabular-nums shadow-sm backdrop-blur-md select-none">
              {status === 'queued' ? 'Queued' : `${displayedProgress}%`}
            </span>
          </div>
        )}
      </div>
      <figcaption className="sr-only">{prompt}</figcaption>
    </figure>
  )
}

interface CompletedImageProps {
  alt: string
  imageUrl?: string
  onEdit?: () => void
  onShare?: () => void
}

const revealClass =
  'transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-[1.03] starting:opacity-0 motion-reduce:starting:scale-100'

function CompletedImage({ alt, imageUrl, onEdit, onShare }: CompletedImageProps) {
  return (
    <div className="group relative size-full">
      {imageUrl ? (
        <img
          alt={alt}
          className={cn('size-full object-cover', revealClass)}
          height={480}
          src={imageUrl}
          width={480}
        />
      ) : (
        <div
          className={cn(
            'size-full bg-[radial-gradient(circle_at_50%_30%,var(--background),var(--muted)_48%,var(--foreground)_160%)]',
            revealClass,
          )}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-foreground/45 to-transparent" />
      {onEdit && (
        <Button
          className="absolute bottom-4 left-4 border-0 bg-background/16 text-primary-foreground shadow-sm backdrop-blur-md transition-[opacity,translate,background-color] [transition-delay:150ms,150ms,0ms] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-background/25 starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0"
          onClick={onEdit}
          size="sm"
          variant="outline"
        >
          Edit
        </Button>
      )}
      {onShare && (
        <Button
          aria-label="Share generated image"
          className="absolute right-4 bottom-4 border-0 bg-background/16 text-primary-foreground shadow-sm backdrop-blur-md transition-[opacity,translate,background-color] [transition-delay:200ms,200ms,0ms] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-background/25 starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0"
          onClick={onShare}
          size="icon-sm"
          variant="outline"
        >
          <ExportIcon />
        </Button>
      )}
    </div>
  )
}

export { ImageGenerationLoader }
export type { ImageGenerationLoaderProps }
