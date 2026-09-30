import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import MinimizeIcon from '~icons/solar/minimize-square-minimalistic-linear'

import { activeClass, buttonClass, hairline, muted } from '#/site/dev/styles'
import { cn } from '#/lib/utils'

interface PanelHeaderProps {
  offset: { x: number; y: number }
  onCollapse: () => void
  onMove: (x: number, y: number) => void
  onTogglePause: () => void
  paused: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function PanelHeader({
  offset,
  onCollapse,
  onMove,
  onTogglePause,
  paused,
}: PanelHeaderProps) {
  const drag = useRef<{ x: number; y: number } | null>(null)

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as Element).closest('button')) return
    drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current) return
    onMove(
      clamp(event.clientX - drag.current.x, -(window.innerWidth - 352), 0),
      clamp(event.clientY - drag.current.y, -(window.innerHeight - 200), 52),
    )
  }

  function endDrag() {
    drag.current = null
  }

  return (
    <div
      className="flex h-10 shrink-0 cursor-grab touch-none items-center gap-2 pr-1.5 pl-3 select-none active:cursor-grabbing"
      onLostPointerCapture={endDrag}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
    >
      <h2 className="text-[12px] font-[600]">Design inspector</h2>
      <span
        className={cn(
          'rounded-full border-[0.5px] px-1.5 text-[10px] leading-4 font-[600]',
          hairline,
          muted,
        )}
      >
        DEV
      </span>
      <button
        aria-label={paused ? 'Resume edit mode' : 'Pause edit mode'}
        aria-pressed={paused}
        className={cn(buttonClass, 'ml-auto h-6 px-2 text-[11px]', paused && activeClass)}
        onClick={onTogglePause}
        title="Alt+S"
        type="button"
      >
        {paused ? 'Paused' : 'Pause'}
      </button>
      <button
        aria-label="Collapse design inspector"
        className={cn(buttonClass, 'size-7 border-transparent px-0')}
        onClick={onCollapse}
        type="button"
      >
        <MinimizeIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}
