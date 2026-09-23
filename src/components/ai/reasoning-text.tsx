import { AltArrowDownIcon as ChevronDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import * as React from 'react'

import { cn } from 'cn'

import styles from './reasoning-text.module.css'

const DEFAULT_DELAYS = [700, 900, 800, 850, 800, 900] as const
const SENTENCE_HEIGHT = 40
const SENTENCE_GAP = 4
const MAX_VIEWPORT_HEIGHT = 180
const FADE_SIZE = 16

interface ReasoningTextProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  collapseDelay?: number
  defaultOpen?: boolean
  delays?: readonly number[]
  sentences: readonly string[]
  thinkingLabel?: string
}

interface ReasoningHeaderProps {
  contentId: string
  done: boolean
  elapsedSeconds: number
  expanded: boolean
  onToggle: () => void
  thinkingLabel: string
}

interface ReasoningLayoutOptions {
  done: boolean
  fade: { bottom: boolean; top: boolean }
  open: boolean
  revealed: number
  sentenceCount: number
}

interface ReasoningViewportProps {
  contentId: string
  expanded: boolean
  layout: ReturnType<typeof getReasoningLayout>
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void
  sentences: readonly string[]
  viewportRef: React.RefObject<HTMLDivElement | null>
}

interface ScheduleReasoningOptions {
  collapseDelay: number
  delays: readonly number[]
  onComplete: () => void
  onReset: () => void
  onReveal: (count: number) => void
  sentences: readonly string[]
  thinkingDuration: number
}

function getSentenceDelay(delays: readonly number[], index: number) {
  return delays[index] ?? delays.at(-1) ?? 800
}

function getThinkingDuration(sentences: readonly string[], delays: readonly number[]) {
  return sentences.reduce(
    (duration, _sentence, index) => duration + getSentenceDelay(delays, index),
    0,
  )
}

function scheduleReasoning({
  collapseDelay,
  delays,
  onComplete,
  onReset,
  onReveal,
  sentences,
  thinkingDuration,
}: ScheduleReasoningOptions) {
  const timers: number[] = []
  const schedule = (delay: number, action: () => void) => {
    timers.push(window.setTimeout(action, delay))
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    schedule(0, onComplete)
    return () => timers.forEach(window.clearTimeout)
  }

  schedule(0, onReset)
  let elapsed = 0
  sentences.forEach((_sentence, index) => {
    elapsed += getSentenceDelay(delays, index)
    schedule(elapsed, () => onReveal(index + 1))
  })
  schedule(thinkingDuration + collapseDelay, onComplete)

  return () => timers.forEach(window.clearTimeout)
}

function getReasoningLayout({ done, fade, open, revealed, sentenceCount }: ReasoningLayoutOptions) {
  const expanded = done ? open : true
  const visibleSentenceCount = done ? sentenceCount : revealed
  const contentHeight =
    visibleSentenceCount > 0
      ? visibleSentenceCount * SENTENCE_HEIGHT + (visibleSentenceCount - 1) * SENTENCE_GAP
      : 0
  const capped = contentHeight > MAX_VIEWPORT_HEIGHT
  const viewportHeight = capped ? MAX_VIEWPORT_HEIGHT : contentHeight
  const scrollable = done && open
  const translateY = scrollable ? 0 : capped ? MAX_VIEWPORT_HEIGHT - FADE_SIZE - contentHeight : 0
  const showTopFade = scrollable ? fade.top : capped
  const showBottomFade = scrollable ? fade.bottom : capped
  const maskImage = capped
    ? `linear-gradient(to bottom, transparent 0, black ${showTopFade ? FADE_SIZE : 0}px, black calc(100% - ${showBottomFade ? FADE_SIZE : 0}px), transparent 100%)`
    : 'none'

  return { expanded, maskImage, scrollable, translateY, viewportHeight, visibleSentenceCount }
}

function ReasoningHeader({
  contentId,
  done,
  elapsedSeconds,
  expanded,
  onToggle,
  thinkingLabel,
}: ReasoningHeaderProps) {
  return (
    <button
      aria-controls={contentId}
      aria-expanded={expanded}
      aria-label="Toggle thought"
      className={cn(styles.header, done && styles.clickable)}
      onClick={done ? onToggle : undefined}
      type="button"
    >
      {done ? (
        <span className={styles.label}>
          <span className={styles.verb}>Thought</span> for {elapsedSeconds}s
        </span>
      ) : (
        <span aria-live="polite" className={cn(styles.label, styles.shimmer)}>
          {thinkingLabel}
        </span>
      )}
      {done && (
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            styles.chevron,
            expanded && styles.chevronExpanded,
            '[&_*]:[stroke-width:1.5]',
          )}
        />
      )}
    </button>
  )
}

function ReasoningViewport({
  contentId,
  expanded,
  layout,
  onScroll,
  sentences,
  viewportRef,
}: ReasoningViewportProps) {
  return (
    <div
      aria-hidden={!expanded}
      className={cn(styles.collapsible, !expanded && styles.collapsed)}
      id={contentId}
    >
      <div className={styles.inner}>
        <div
          className={cn(styles.viewport, layout.scrollable && styles.scrollable)}
          onScroll={layout.scrollable ? onScroll : undefined}
          ref={viewportRef}
          style={{
            height: layout.viewportHeight,
            maskImage: layout.maskImage,
            WebkitMaskImage: layout.maskImage,
          }}
        >
          <div
            className={styles.stream}
            style={{ transform: `translateY(${layout.translateY}px)` }}
          >
            {sentences.slice(0, layout.visibleSentenceCount).map((sentence) => (
              <p className={styles.sentence} key={sentence}>
                {sentence}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReasoningText({
  className,
  collapseDelay = 360,
  defaultOpen = false,
  delays = DEFAULT_DELAYS,
  sentences,
  thinkingLabel = 'Thinking…',
  ...props
}: ReasoningTextProps) {
  const [phase, setPhase] = React.useState<'done' | 'thinking'>('thinking')
  const [revealed, setRevealed] = React.useState(0)
  const [open, setOpen] = React.useState(defaultOpen)
  const [fade, setFade] = React.useState({ bottom: true, top: false })
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const contentId = React.useId()
  const thinkingDuration = getThinkingDuration(sentences, delays)

  React.useEffect(
    () =>
      scheduleReasoning({
        collapseDelay,
        delays,
        onComplete: () => {
          setRevealed(sentences.length)
          setPhase('done')
          setOpen(defaultOpen)
        },
        onReset: () => {
          setPhase('thinking')
          setRevealed(0)
          setOpen(defaultOpen)
        },
        onReveal: setRevealed,
        sentences,
        thinkingDuration,
      }),
    [collapseDelay, defaultOpen, delays, sentences, thinkingDuration],
  )

  const done = phase === 'done'
  const layout = getReasoningLayout({
    done,
    fade,
    open,
    revealed,
    sentenceCount: sentences.length,
  })
  const elapsedSeconds = Math.max(1, Math.round(thinkingDuration / 1000))

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget
    setFade({
      bottom: viewport.scrollTop + viewport.clientHeight < viewport.scrollHeight - 1,
      top: viewport.scrollTop > 1,
    })
  }

  function toggleReasoning() {
    const nextOpen = !open
    if (nextOpen) {
      setFade({ bottom: true, top: false })
      if (viewportRef.current) viewportRef.current.scrollTop = 0
    }
    setOpen(nextOpen)
  }

  return (
    <div
      className={cn(styles.root, className)}
      data-phase={phase}
      data-slot="reasoning-text"
      {...props}
    >
      <ReasoningHeader
        contentId={contentId}
        done={done}
        elapsedSeconds={elapsedSeconds}
        expanded={layout.expanded}
        onToggle={toggleReasoning}
        thinkingLabel={thinkingLabel}
      />
      <ReasoningViewport
        contentId={contentId}
        expanded={layout.expanded}
        layout={layout}
        onScroll={handleScroll}
        sentences={sentences}
        viewportRef={viewportRef}
      />
    </div>
  )
}

export { ReasoningText }
export type { ReasoningTextProps }
