import { MaximizeIcon as Maximize2Icon } from '@solar-icons/react/linear/maximize'
import { PauseIcon } from '@solar-icons/react/linear/pause'
import { PlayIcon } from '@solar-icons/react/linear/play'
import { Rewind10SecondsBackIcon as RewindIcon } from '@solar-icons/react/linear/rewind-10-seconds-back'
import { Rewind10SecondsForwardIcon as ForwardIcon } from '@solar-icons/react/linear/rewind-10-seconds-forward'
import { VolumeLoudIcon as Volume2Icon } from '@solar-icons/react/linear/volume-loud'
import { VolumeCrossIcon as VolumeMutedIcon } from '@solar-icons/react/linear/volume-cross'
import * as React from 'react'

import { cn } from 'cn'

interface VideoPlayerProps extends Omit<
  React.ComponentProps<'section'>,
  'title' | 'onVolumeChange'
> {
  currentTime: number
  duration: number
  onPlayingChange?: (playing: boolean) => void
  onSeek?: (seconds: number) => void
  onVolumeChange?: (volume: number) => void
  playing?: boolean
  poster?: React.ReactNode
  subtitle?: string
  title: React.ReactNode
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}

const controlSurface = 'bg-black/45'
const control =
  'flex shrink-0 items-center justify-center rounded-md transition-colors hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
const slider =
  'block cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black/40 [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white'

function VideoPlayer({
  className,
  currentTime,
  duration,
  onPlayingChange,
  onSeek,
  onVolumeChange,
  playing = false,
  poster,
  subtitle,
  title,
  ...props
}: VideoPlayerProps) {
  const playerRef = React.useRef<HTMLElement>(null)
  const [volume, setVolume] = React.useState(0.7)
  const [fullscreenError, setFullscreenError] = React.useState('')
  const safeDuration = Math.max(0, duration)
  const time = Math.max(0, Math.min(currentTime, safeDuration))
  const progress = safeDuration ? (time / safeDuration) * 100 : 0

  function changeVolume(value: number) {
    setVolume(value)
    onVolumeChange?.(value)
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === playerRef.current) {
        await document.exitFullscreen()
      } else {
        await playerRef.current?.requestFullscreen()
      }
      setFullscreenError('')
    } catch {
      setFullscreenError('Fullscreen is unavailable in this browser.')
    }
  }

  return (
    <section
      ref={playerRef}
      data-slot="video-player"
      aria-label="Video player"
      className={cn(
        'relative isolate aspect-video min-h-64 overflow-hidden rounded-md bg-neutral-950 font-sans text-sm font-[450] tracking-[-0.05px] text-white shadow-card sm:min-h-80',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-20 [&>*]:size-full [&>*]:object-cover">
        {poster ?? (
          <img
            alt="Sunlight falling over a forested mountain valley"
            className="object-cover"
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=85"
          />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

      <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-4 sm:inset-x-7 sm:top-6">
        <button
          aria-label="Toggle fullscreen"
          className={cn(controlSurface, control, 'size-8')}
          onClick={() => void toggleFullscreen()}
          type="button"
        >
          <Maximize2Icon className="size-4" />
        </button>
        <div className={cn(controlSurface, 'flex h-8 items-center gap-2 rounded-md px-3')}>
          <input
            aria-label="Volume"
            className={cn(slider, 'h-1 w-16')}
            max={1}
            min={0}
            onChange={(event) => changeVolume(Number(event.target.value))}
            step={0.01}
            style={{
              background: `linear-gradient(to right, white ${volume * 100}%, #ffffff40 ${volume * 100}%)`,
            }}
            type="range"
            value={volume}
          />
          <button
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            className={cn(control, 'size-5')}
            onClick={() => changeVolume(volume === 0 ? 0.7 : 0)}
            type="button"
          >
            {volume === 0 ? (
              <VolumeMutedIcon className="size-4" />
            ) : (
              <Volume2Icon className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[45%] flex -translate-y-1/2 items-center justify-center gap-4">
        <button
          aria-label="Rewind 10 seconds"
          className={cn(controlSurface, control, 'size-9')}
          onClick={() => onSeek?.(Math.max(0, time - 10))}
          type="button"
        >
          <RewindIcon className="size-5" />
        </button>
        <button
          aria-label={playing ? 'Pause video' : 'Play video'}
          className={cn(controlSurface, control, 'size-12')}
          onClick={() => onPlayingChange?.(!playing)}
          type="button"
        >
          {playing ? (
            <PauseIcon className="size-6 fill-current" />
          ) : (
            <PlayIcon className="ml-0.5 size-6 fill-current" />
          )}
        </button>
        <button
          aria-label="Forward 10 seconds"
          className={cn(controlSurface, control, 'size-9')}
          onClick={() => onSeek?.(Math.min(safeDuration, time + 10))}
          type="button"
        >
          <ForwardIcon className="size-5" />
        </button>
      </div>

      <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-6">
        {subtitle && (
          <p className="mb-1 truncate text-xs leading-5 font-medium text-white/80 sm:text-sm">
            {subtitle}
          </p>
        )}
        <h3 className="truncate card-heading">{title}</h3>
        <input
          aria-label="Video progress"
          aria-valuetext={`${formatTime(time)} of ${formatTime(safeDuration)}`}
          className={cn(slider, 'mt-4 h-1 w-full')}
          max={safeDuration}
          min={0}
          onChange={(event) => onSeek?.(Number(event.target.value))}
          style={{
            background: `linear-gradient(to right, white ${progress}%, #ffffff40 ${progress}%)`,
          }}
          type="range"
          value={time}
        />
        <div className="mt-2 flex justify-between text-[10px] leading-5 font-medium text-white/70 tabular-nums sm:text-xs">
          <span>{formatTime(time)}</span>
          <span>{formatTime(safeDuration)}</span>
        </div>
        {fullscreenError && (
          <output className="mt-2 block text-xs leading-5">{fullscreenError}</output>
        )}
      </div>
    </section>
  )
}

export { VideoPlayer }
export type { VideoPlayerProps }
