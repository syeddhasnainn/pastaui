import { useSyncExternalStore } from 'react'

import { gridLayout, type GridColor, type GridSettings } from '#/site/dev/grid'

const channels: Record<GridColor, [string, string]> = {
  blue: ['62.6% 0.205 254.947', '70.7% 0.165 254.624'],
  red: ['63.7% 0.237 25.331', '70.4% 0.191 22.216'],
  neutral: ['55.6% 0 0', '70.8% 0 0'],
}

function subscribeViewport(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

function viewport() {
  return `${document.documentElement.clientWidth}x${window.innerHeight}`
}

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function isDark() {
  return document.documentElement.classList.contains('dark')
}

export function GridOverlay({ settings }: { settings: GridSettings }) {
  const size = useSyncExternalStore(subscribeViewport, viewport, () => '0x0')
  const dark = useSyncExternalStore(subscribeTheme, isDark, () => false)
  const [width = 0, height = 0] = size.split('x').map(Number)
  const layout = gridLayout(settings, width, height)
  const channel = channels[settings.color][dark ? 1 : 0]
  const fill = `oklch(${channel} / ${(dark ? 0.06 : 0.04) * settings.opacity})`
  const line = `oklch(${channel} / ${(dark ? 0.2 : 0.14) * settings.opacity})`
  const text = `oklch(${channel} / ${0.5 * Math.min(1, settings.opacity)})`
  const lines = settings.golden ? layout.xLines : []
  const rows = settings.golden || settings.rows ? layout.yLines : []

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-2147483500 overflow-hidden"
      data-grid-overlay={settings.preset}
    >
      {layout.columns.map((column, index) => (
        <div
          className="absolute inset-y-0"
          key={column.start}
          style={{
            left: column.start,
            width: column.end - column.start,
            background: fill,
            boxShadow: `inset 0.5px 0 0 ${line}, inset -0.5px 0 0 ${line}`,
          }}
        >
          {settings.numbers ? (
            <span
              className="absolute top-1 left-1 font-mono text-[9px] leading-3"
              style={{ color: text }}
            >
              {index + 1}
            </span>
          ) : null}
        </div>
      ))}
      {lines.map((position) => (
        <div
          className="absolute inset-y-0 w-px"
          key={`x-${position}`}
          style={{ left: position, background: line }}
        />
      ))}
      {rows.map((position) => (
        <div
          className="absolute inset-x-0 h-px"
          key={`y-${position}`}
          style={{ top: position, background: line }}
        />
      ))}
      {settings.rowHeight ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${line} 0.5px, transparent 0.5px)`,
            backgroundSize: `100% ${settings.rowHeight}px`,
          }}
        />
      ) : null}
    </div>
  )
}
