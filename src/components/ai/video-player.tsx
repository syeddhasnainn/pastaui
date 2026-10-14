import { MaximizeIcon as Maximize2Icon } from '@solar-icons/react/linear/maximize'
import { PauseIcon } from '@solar-icons/react/linear/pause'
import { PlayIcon } from '@solar-icons/react/linear/play'
import { Rewind10SecondsBackIcon as RewindIcon } from '@solar-icons/react/linear/rewind-10-seconds-back'
import { Rewind10SecondsForwardIcon as ForwardIcon } from '@solar-icons/react/linear/rewind-10-seconds-forward'
import { VolumeLoudIcon as Volume2Icon } from '@solar-icons/react/linear/volume-loud'
import { VolumeCrossIcon as VolumeMutedIcon } from '@solar-icons/react/linear/volume-cross'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { cn } from 'cn'

interface VideoChapter {
  start: number
  title: string
}

interface VideoPlayerProps extends Omit<
  React.ComponentProps<'section'>,
  'title' | 'onVolumeChange'
> {
  chapters?: VideoChapter[]
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
  'flex shrink-0 items-center justify-center rounded-md transition-[background-color,scale] duration-150 ease-out hover:bg-black/65 active:scale-[0.96] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

const slider =
  'block cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black/40 [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white'

function VideoPlayer({
  chapters = [],
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
  const [idle, setIdle] = React.useState(false)
  const [seekFlash, setSeekFlash] = React.useState<{ id: number; label: string } | null>(null)
  const [hover, setHover] = React.useState<{ left: number; time: number } | null>(null)
  const idleTimer = React.useRef(0)
  const safeDuration = Math.max(0, duration)
  const time = Math.max(0, Math.min(currentTime, safeDuration))
  const progress = safeDuration ? (time / safeDuration) * 100 : 0
  const sortedChapters = [...chapters].sort((a, b) => a.start - b.start)
  const chapterAt = (seconds: number) =>
    sortedChapters.filter((chapter) => chapter.start <= seconds).at(-1)
  const currentChapter = chapterAt(time)

  function changeVolume(value: number) {
    setVolume(value)
    onVolumeChange?.(value)
  }

  function wake() {
    setIdle(false)
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => setIdle(true), 2200)
  }

  React.useEffect(() => {
    if (!playing) return
    idleTimer.current = window.setTimeout(() => setIdle(true), 2200)
    return () => window.clearTimeout(idleTimer.current)
  }, [playing])

  React.useEffect(() => {
    if (!seekFlash) return
    const timer = window.setTimeout(() => setSeekFlash(null), 700)
    return () => window.clearTimeout(timer)
  }, [seekFlash])

  function seekBy(seconds: number) {
    onSeek?.(Math.max(0, Math.min(safeDuration, time + seconds)))
    setSeekFlash({ id: Date.now(), label: seconds > 0 ? `+${seconds}s` : `${seconds}s` })
    wake()
  }

  const hidden = playing && idle

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('input[aria-label="Volume"]')) return
    const key = event.key.toLowerCase()
    const actions: Record<string, () => void> = {
      ' ': () => onPlayingChange?.(!playing),
      k: () => onPlayingChange?.(!playing),
      arrowleft: () => seekBy(-10),
      j: () => seekBy(-10),
      arrowright: () => seekBy(10),
      l: () => seekBy(10),
      m: () => changeVolume(volume === 0 ? 0.7 : 0),
      f: () => void toggleFullscreen(),
    }
    if (!actions[key] || event.metaKey || event.ctrlKey || event.altKey) return
    if ((event.target as HTMLElement).tagName === 'BUTTON' && (key === ' ' || key === 'enter'))
      return
    event.preventDefault()
    actions[key]()
    wake()
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
    <MotionConfig reducedMotion="user">
      {/* The focusable player owns media keyboard shortcuts, like a native video element. */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <section
        ref={playerRef}
        data-slot="video-player"
        data-idle={hidden || undefined}
        onFocus={wake}
        onKeyDown={onKeyDown}
        onPointerMove={wake}
        aria-keyshortcuts="Space K J L ArrowLeft ArrowRight M F"
        aria-label="Video player"
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className={cn(
          'group/player relative isolate aspect-video min-h-64 overflow-hidden rounded-[16px] bg-neutral-950 font-sans text-sm font-[450] tracking-[-0.05px] text-white shadow-card outline-none focus-visible:ring-2 focus-visible:ring-ring data-idle:cursor-none sm:min-h-80',
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'video-player-kenburns absolute inset-0 -z-20 [&>*]:size-full [&>*]:object-cover',
            !playing && '[animation-play-state:paused]',
          )}
        >
          {poster ?? (
            <img
              alt="Sunlight falling over a forested mountain valley"
              className="object-cover"
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=85"
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

        <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-4 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-idle/player:pointer-events-none group-data-idle/player:-translate-y-2 group-data-idle/player:opacity-0 sm:inset-x-7 sm:top-6">
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
              <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 *:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:*:transition-opacity">
                <Volume2Icon className={cn('size-4', volume === 0 && 'scale-75 opacity-0')} />
                <VolumeMutedIcon className={cn('size-4', volume !== 0 && 'scale-75 opacity-0')} />
              </span>
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[45%] flex -translate-y-1/2 items-center justify-center gap-4 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-idle/player:pointer-events-none group-data-idle/player:opacity-0">
          <button
            aria-label="Rewind 10 seconds"
            className={cn(controlSurface, control, 'size-9')}
            onClick={() => seekBy(-10)}
            type="button"
          >
            <RewindIcon className="size-5" />
          </button>
          <AnimatePresence>
            {seekFlash && (
              <motion.span
                animate={{ opacity: 1, y: -52 }}
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium tabular-nums backdrop-blur-sm"
                exit={{ opacity: 0, y: -64 }}
                initial={{ opacity: 0, y: -40 }}
                key={seekFlash.id}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              >
                {seekFlash.label}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            aria-label={playing ? 'Pause video' : 'Play video'}
            className={cn(controlSurface, control, 'relative size-12')}
            onClick={() => onPlayingChange?.(!playing)}
            type="button"
          >
            <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 *:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:*:transition-opacity">
              <PlayIcon
                className={cn('ml-0.5 size-6 fill-current', playing && 'scale-75 opacity-0')}
              />
              <PauseIcon className={cn('size-6 fill-current', !playing && 'scale-75 opacity-0')} />
            </span>
            <motion.span
              animate={{ opacity: 0, scale: 1.7 }}
              className="pointer-events-none absolute inset-0 rounded-md border-2 border-white/70"
              initial={{ opacity: 0.8, scale: 1 }}
              key={String(playing)}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </button>
          <button
            aria-label="Forward 10 seconds"
            className={cn(controlSurface, control, 'size-9')}
            onClick={() => seekBy(10)}
            type="button"
          >
            <ForwardIcon className="size-5" />
          </button>
        </div>

        <div className="absolute inset-x-5 bottom-5 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-idle/player:pointer-events-none group-data-idle/player:translate-y-2 group-data-idle/player:opacity-0 sm:inset-x-7 sm:bottom-6">
          {subtitle && (
            <p className="mb-1 truncate text-xs leading-5 font-medium text-white/80 sm:text-sm">
              {subtitle}
            </p>
          )}
          <h3 className="truncate card-heading">{title}</h3>
          <div className="relative mt-4">
            <AnimatePresence>
              {hover && (
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="pointer-events-none absolute bottom-4 -translate-x-1/2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium tabular-nums backdrop-blur-sm"
                  exit={{ opacity: 0, y: 4 }}
                  initial={{ opacity: 0, y: 4 }}
                  style={{ left: hover.left }}
                  transition={{ duration: 0.15 }}
                >
                  {chapterAt(hover.time) && (
                    <span className="block max-w-40 truncate text-white/80">
                      {chapterAt(hover.time)!.title}
                    </span>
                  )}
                  {formatTime(hover.time)}
                </motion.span>
              )}
            </AnimatePresence>
            <input
              onPointerLeave={() => setHover(null)}
              onPointerMove={(event) => {
                const box = event.currentTarget.getBoundingClientRect()
                const ratio = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width))
                setHover({ left: ratio * box.width, time: ratio * safeDuration })
              }}
              aria-label="Video progress"
              aria-valuetext={`${formatTime(time)} of ${formatTime(safeDuration)}`}
              className={cn(slider, 'h-1 w-full transition-[height] duration-150 hover:h-1.5')}
              max={safeDuration}
              min={0}
              onChange={(event) => onSeek?.(Number(event.target.value))}
              style={{
                background: `linear-gradient(to right, white ${progress}%, #ffffff40 ${progress}%)`,
              }}
              type="range"
              value={time}
            />
            {safeDuration > 0 &&
              sortedChapters
                .filter((chapter) => chapter.start > 0 && chapter.start < safeDuration)
                .map((chapter) => (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 h-2 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-black/60"
                    key={chapter.start}
                    style={{ left: `${(chapter.start / safeDuration) * 100}%` }}
                  />
                ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] leading-5 font-medium text-white/70 tabular-nums sm:text-xs">
            <span className="flex min-w-0 items-center gap-1.5">
              {formatTime(time)}
              {currentChapter && (
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    animate={{ opacity: 1, y: 0 }}
                    className="truncate text-white/70"
                    exit={{ opacity: 0, y: -4 }}
                    initial={{ opacity: 0, y: 4 }}
                    key={currentChapter.title}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  >
                    · {currentChapter.title}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
            <span>{formatTime(safeDuration)}</span>
          </div>
          {fullscreenError && (
            <output className="mt-2 block text-xs leading-5">{fullscreenError}</output>
          )}
        </div>
      </section>
    </MotionConfig>
  )
}

export { VideoPlayer }
export type { VideoChapter, VideoPlayerProps }
export default VideoPlayer
