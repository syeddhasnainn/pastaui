import { SoundwaveIcon as AudioLinesIcon } from '@solar-icons/react/linear/soundwave'
import { PauseIcon } from '@solar-icons/react/bold/pause'
import { PlayIcon } from '@solar-icons/react/bold/play'
import { RewindBackIcon as PreviousIcon } from '@solar-icons/react/bold/rewind-back'
import { RewindForwardIcon as NextIcon } from '@solar-icons/react/bold/rewind-forward'
import { AirbudsIcon } from '@solar-icons/react/bold/airbuds'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from 'cn'

interface AudioPlayerProps extends Omit<React.ComponentProps<'section'>, 'onChange'> {
  currentTime: number
  artworkUrl?: string
  duration: number
  isPlaying?: boolean
  onChange?: (time: number) => void
  onToggle?: () => void
  onPrevious?: () => void
  onNext?: () => void
  onOutput?: () => void
  subtitle?: string
  title: string
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${remainder.toString().padStart(2, '0')}`
}

function AudioPlayer({
  className,
  artworkUrl,
  currentTime,
  duration,
  isPlaying = false,
  onChange,
  onToggle,
  onPrevious,
  onNext,
  onOutput,
  subtitle,
  title,
  ...props
}: AudioPlayerProps) {
  return (
    <section
      data-slot="audio-player"
      className={cn(
        'rounded-[16px] bg-card p-6 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card sm:p-7',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-5">
        {artworkUrl ? (
          <img src={artworkUrl} alt="" className="size-20 shrink-0 rounded-[10px] object-cover" />
        ) : (
          <span className="flex size-20 shrink-0 items-center justify-center rounded-[10px] bg-muted">
            <AudioLinesIcon aria-hidden="true" className="size-8 text-muted-foreground" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate card-heading">{title}</h3>
          {subtitle && (
            <p className="mt-1 truncate text-xs leading-5 text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <AudioLinesIcon aria-hidden="true" className="size-7 shrink-0 text-muted-foreground" />
      </div>
      <div className="mt-5 flex items-center gap-2.5">
        <span className="shrink-0 text-xs leading-5 text-muted-foreground tabular-nums">
          {formatTime(currentTime)}
        </span>
        <Slider
          aria-label="Audio position"
          className="min-w-0 flex-1 [--muted:var(--audio-track)] [--primary:var(--audio-progress)] [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:opacity-0 [&_[data-slot=slider-thumb]:has(:focus-visible)]:opacity-100 [&_[data-slot=slider-track]]:h-1.5 [&:hover_[data-slot=slider-thumb]]:opacity-100"
          max={duration}
          min={0}
          onValueChange={(value) => onChange?.(Array.isArray(value) ? value[0] : value)}
          value={[currentTime]}
        />
        <span className="shrink-0 text-right text-xs leading-5 text-muted-foreground tabular-nums">
          −{formatTime(Math.max(0, duration - currentTime))}
        </span>
      </div>
      <div className="relative mt-4 flex items-center justify-center gap-6">
        <Button
          aria-label={onPrevious ? 'Previous track' : 'Rewind 10 seconds'}
          disabled={!onPrevious && !onChange}
          onClick={() => (onPrevious ? onPrevious() : onChange?.(Math.max(0, currentTime - 10)))}
          className="size-11 rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-muted-foreground"
          size="icon"
          variant="ghost"
        >
          <PreviousIcon className="size-8" />
        </Button>
        <Button
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          disabled={!onToggle}
          onClick={onToggle}
          className="size-14 rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-muted-foreground"
          size="icon"
          variant="ghost"
        >
          {isPlaying ? <PauseIcon className="size-10" /> : <PlayIcon className="size-10" />}
        </Button>
        <Button
          aria-label={onNext ? 'Next track' : 'Forward 10 seconds'}
          disabled={!onNext && !onChange}
          onClick={() => (onNext ? onNext() : onChange?.(Math.min(duration, currentTime + 10)))}
          className="size-11 rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-muted-foreground"
          size="icon"
          variant="ghost"
        >
          <NextIcon className="size-8" />
        </Button>
        {onOutput ? (
          <Button
            aria-label="Audio output"
            onClick={onOutput}
            className="absolute right-0 size-8 rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
            size="icon"
            variant="ghost"
          >
            <AirbudsIcon className="size-6" />
          </Button>
        ) : (
          <AirbudsIcon
            aria-hidden="true"
            className="absolute right-0 size-6 text-muted-foreground"
          />
        )}
      </div>
    </section>
  )
}

export { AudioPlayer }
export type { AudioPlayerProps }
