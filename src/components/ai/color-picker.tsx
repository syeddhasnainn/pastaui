import { Popover } from '@base-ui/react/popover'
import { MinimalisticMagnifierIcon } from '@solar-icons/react/linear/minimalistic-magnifier'
import { TrashBinMinimalisticIcon } from '@solar-icons/react/linear/trash-bin-minimalistic'
import * as React from 'react'

import {
  SHADES,
  baseColors,
  colorAt,
  defaultGradient,
  paletteName,
  parseColor,
  parseGradient,
  resolvePaletteName,
  stringifyGradient,
  tailwindPalette,
  withAlpha,
  type Gradient,
  type GradientKind,
} from '@/components/ai/color-palette'
import { cn } from 'cn'

type ColorPickerMode = 'solid' | GradientKind

interface ColorPickerProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onValueCommit?: (value: string) => void
  allowGradient?: boolean
  allowNone?: boolean
  recentColors?: string[]
  recentLabel?: string
}

interface ColorPickerPopoverProps extends ColorPickerProps {
  label?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  triggerClassName?: string
}

const MODES: { id: ColorPickerMode; label: string }[] = [
  { id: 'solid', label: 'Solid' },
  { id: 'linear', label: 'Linear' },
  { id: 'radial', label: 'Radial' },
  { id: 'conic', label: 'Conic' },
]

const HEX6 = /^#[0-9a-f]{6}$/i
const CHECKER =
  'bg-[repeating-conic-gradient(#e4e4e7_0_25%,#fafafa_0_50%)] bg-size-[8px_8px] dark:bg-[repeating-conic-gradient(#3f3f46_0_25%,#27272a_0_50%)]'
const SPECTRUM =
  'conic-gradient(from 0deg, #ef4444, #f59e0b, #84cc16, #10b981, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)'
const SCROLLBAR =
  '[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[3px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-foreground/15 [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-thumb:hover]:bg-foreground/30 [&::-webkit-scrollbar-track]:my-1 [&::-webkit-scrollbar-track]:bg-transparent supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-color:color-mix(in_oklch,var(--foreground)_20%,transparent)_transparent] supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin]'
const FIELD =
  'flex h-10 min-w-0 items-center rounded-xl bg-muted transition-[background-color,box-shadow] focus-within:ring-2 focus-within:ring-ring/40 hover:bg-muted/80'

const sameHex = (a: string | undefined, b: string) => !!a && a.toLowerCase() === b.toLowerCase()
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const STOP_INSET = 20
const insetPos = (pos: number) =>
  `calc(${STOP_INSET}px + (100% - ${STOP_INSET * 2}px) * ${pos / 100})`
const insetPreview = (stops: Gradient['stops']) =>
  `linear-gradient(90deg, ${[...stops]
    .sort((a, b) => a.pos - b.pos)
    .map((s) => `${withAlpha(s.color, s.alpha)} ${insetPos(s.pos)}`)
    .join(', ')})`

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) > 150
}

function withStop(g: Gradient, index: number, patch: Partial<Gradient['stops'][number]>) {
  const stops = g.stops.map((s, i) => (i === index ? { ...s, ...patch } : s))
  const moved = stops[index]
  const sorted = [...stops].sort((a, b) => a.pos - b.pos)
  return { gradient: { ...g, stops: sorted }, index: sorted.indexOf(moved) }
}

function startDrag(
  target: Element,
  pointerId: number,
  onMove: (e: PointerEvent) => void,
  onEnd: () => void,
) {
  const move = (e: PointerEvent) => e.pointerId === pointerId && onMove(e)
  const end = (e: Event) => {
    if (e instanceof PointerEvent && e.pointerId !== pointerId) return
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)
    window.removeEventListener('blur', end)
    if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId)
    onEnd()
  }
  target.setPointerCapture(pointerId)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
  window.addEventListener('blur', end)
}

function useControllableColor(
  value: string | undefined,
  defaultValue: string | undefined,
  onValueChange: ((value: string) => void) | undefined,
) {
  const [internal, setInternal] = React.useState(defaultValue ?? '')
  const current = value ?? internal
  const set = (next: string) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }
  return [current, set] as const
}

const Swatch = React.memo(function Swatch({
  name,
  hex,
  selected,
  onPick,
  className,
}: {
  name: string
  hex: string
  selected: boolean
  onPick: (hex: string) => void
  className?: string
}) {
  return (
    <button
      aria-label={name}
      aria-pressed={selected}
      className={cn(
        'relative aspect-square min-w-0 rounded-md ring-1 ring-black/10 transition-[scale,box-shadow] duration-100 outline-none ring-inset hover:z-10 hover:scale-115 hover:ring-2 hover:ring-foreground/60 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-foreground dark:ring-white/10',
        selected && 'z-10 scale-110 ring-2 ring-foreground dark:ring-foreground',
        className,
      )}
      data-hex={hex}
      data-name={name}
      onClick={() => onPick(hex)}
      style={{ background: hex }}
      type="button"
    >
      {selected ? (
        <svg
          aria-hidden="true"
          className="absolute inset-0 m-auto size-3"
          fill="none"
          stroke={isLight(hex) ? '#09090b' : '#ffffff'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3.5}
          viewBox="0 0 24 24"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : null}
    </button>
  )
})

const PaletteGrid = React.memo(function PaletteGrid({
  query,
  selectedHex,
  onPick,
}: {
  query: string
  selectedHex: string | undefined
  onPick: (hex: string) => void
}) {
  const q = query.trim().toLowerCase()
  const families = q ? tailwindPalette.filter((f) => f.name.includes(q)) : tailwindPalette
  if (!families.length)
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No colors match “{query}”
      </div>
    )
  return (
    <div className="grid grid-cols-[60px_repeat(11,minmax(0,1fr))] items-center gap-1">
      {families.map((f) => (
        <React.Fragment key={f.name}>
          <span className="truncate pr-1.5 text-[13px] text-muted-foreground capitalize">
            {f.name}
          </span>
          {SHADES.map((s) => (
            <Swatch
              hex={f.shades[s]}
              key={s}
              name={`${f.name}-${s}`}
              onPick={onPick}
              selected={sameHex(selectedHex, f.shades[s])}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  )
})

function NumberField({
  label,
  value,
  min,
  max,
  unit,
  disabled,
  className,
  title,
  onBegin,
  onChange,
}: {
  label?: string
  value: number
  min: number
  max: number
  unit?: string
  disabled?: boolean
  className?: string
  title?: string
  onBegin?: () => void
  onChange: (value: number, live: boolean) => void
}) {
  const [text, setText] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const scrub = React.useRef<{ startX: number; startValue: number; moved: boolean } | null>(null)

  const commitText = () => {
    if (text === null) return
    const parsed = parseFloat(text)
    setText(null)
    if (Number.isNaN(parsed)) return
    const next = clamp(parsed, min, max)
    if (next !== value) onChange(next, false)
  }

  return (
    <div
      className={cn(FIELD, disabled && 'pointer-events-none opacity-50', className)}
      title={title}
    >
      {label ? (
        <span
          className="flex h-full min-w-8 shrink-0 cursor-ew-resize touch-none items-center justify-center pr-1.5 pl-3 text-[13px] text-muted-foreground select-none"
          onPointerCancel={() => (scrub.current = null)}
          onPointerDown={(e) => {
            e.preventDefault()
            e.currentTarget.setPointerCapture(e.pointerId)
            scrub.current = { startX: e.clientX, startValue: value, moved: false }
          }}
          onPointerMove={(e) => {
            const s = scrub.current
            if (!s) return
            const dx = e.clientX - s.startX
            if (!s.moved) {
              if (Math.abs(dx) < 3) return
              s.moved = true
              onBegin?.()
            }
            onChange(clamp(Math.round(s.startValue + dx * (e.shiftKey ? 10 : 1)), min, max), true)
          }}
          onPointerUp={(e) => {
            const s = scrub.current
            scrub.current = null
            e.currentTarget.releasePointerCapture(e.pointerId)
            if (s?.moved) onChange(clamp(Math.round(value), min, max), false)
            else inputRef.current?.select()
          }}
        >
          {label}
        </span>
      ) : (
        <span className="w-3" />
      )}
      <input
        aria-label={title ?? label}
        className="h-full w-full min-w-0 bg-transparent pr-1 text-sm font-medium text-foreground tabular-nums outline-none"
        disabled={disabled}
        inputMode="decimal"
        onBlur={commitText}
        onChange={(e) => setText(e.target.value)}
        onFocus={(e) => {
          setText(String(value))
          requestAnimationFrame(() => e.target.select())
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          else if (e.key === 'Escape') {
            setText(null)
            e.currentTarget.blur()
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
            const next = clamp(
              value + (e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1),
              min,
              max,
            )
            onChange(next, false)
            setText(String(next))
          }
        }}
        ref={inputRef}
        spellCheck={false}
        value={text ?? String(value)}
      />
      {unit ? <span className="pr-3 text-[13px] text-muted-foreground">{unit}</span> : null}
    </div>
  )
}

function HexInput({
  hex,
  disabled,
  onCommit,
}: {
  hex: string
  disabled?: boolean
  onCommit: (color: { hex: string; alpha: number | null }) => void
}) {
  const [text, setText] = React.useState<string | null>(null)
  const display = hex.replace('#', '').toUpperCase()
  const commit = () => {
    if (text === null) return
    const raw = text.trim().replace(/^#?/, '#')
    const named = resolvePaletteName(text)
    const color = parseColor(raw) ?? (named ? { hex: named, alpha: 1 } : null)
    setText(null)
    if (color) onCommit({ hex: color.hex, alpha: raw.length === 9 ? color.alpha : null })
  }
  return (
    <div className={cn(FIELD, 'flex-1 px-3', disabled && 'pointer-events-none opacity-50')}>
      <span className="text-sm text-muted-foreground">#</span>
      <input
        aria-label="Hex color"
        className="h-full w-full min-w-0 bg-transparent px-1 text-sm font-medium text-foreground uppercase tabular-nums outline-none"
        disabled={disabled}
        onBlur={commit}
        onChange={(e) => setText(e.target.value)}
        onFocus={(e) => {
          setText(display)
          requestAnimationFrame(() => e.target.select())
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') {
            setText(null)
            e.currentTarget.blur()
          }
        }}
        spellCheck={false}
        value={text ?? display}
      />
    </div>
  )
}

function ColorChip({ color, className }: { color: string | undefined; className?: string }) {
  return (
    <span
      className={cn(
        'block shrink-0 overflow-hidden rounded-[5px] ring-1 ring-black/10 ring-inset dark:ring-white/15',
        CHECKER,
        className,
      )}
    >
      {color ? (
        <span className="block size-full" style={{ background: color }} />
      ) : (
        <span className="block size-full bg-[linear-gradient(to_top_right,transparent_calc(50%-0.75px),#ef4444_calc(50%-0.75px),#ef4444_calc(50%+0.75px),transparent_calc(50%+0.75px))]" />
      )}
    </span>
  )
}

function GradientEditor({
  gradient,
  selected,
  onSelect,
  onCommit,
  onLive,
  onEndLive,
}: {
  gradient: Gradient
  selected: number
  onSelect: (index: number) => void
  onCommit: (gradient: Gradient, index?: number) => void
  onLive: (gradient: Gradient) => void
  onEndLive: () => void
}) {
  const barRef = React.useRef<HTMLDivElement>(null)
  const latest = React.useRef(gradient)
  React.useLayoutEffect(() => {
    latest.current = gradient
  })
  const dragIndex = React.useRef(0)
  const stop = gradient.stops[selected]

  const posFromEvent = (clientX: number) => {
    const r = barRef.current!.getBoundingClientRect()
    const track = r.width - STOP_INSET * 2
    return Math.round(clamp(((clientX - r.left - STOP_INSET) / track) * 100, 0, 100) * 10) / 10
  }

  const beginDrag = (e: React.PointerEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect(index)
    dragIndex.current = index
    onEndLive()
    startDrag(
      e.currentTarget,
      e.pointerId,
      (ev) => {
        const next = withStop(latest.current, dragIndex.current, { pos: posFromEvent(ev.clientX) })
        dragIndex.current = next.index
        onSelect(next.index)
        onLive(next.gradient)
      },
      onEndLive,
    )
  }

  const addStop = (e: React.PointerEvent) => {
    const pos = posFromEvent(e.clientX)
    const c = colorAt(gradient.stops, pos)
    const stops = [...gradient.stops, { ...c, pos }].sort((a, b) => a.pos - b.pos)
    const index = stops.findIndex((s) => s.pos === pos && s.color === c.color)
    onCommit({ ...gradient, stops }, Math.max(0, index))
  }

  const patch = (key: 'angle' | 'cx' | 'cy', v: number, live: boolean) =>
    live ? onLive({ ...gradient, [key]: v }) : onCommit({ ...gradient, [key]: v })

  const stopPatch = (p: Partial<Gradient['stops'][number]>, live: boolean) => {
    const next = withStop(gradient, selected, p)
    if (live) {
      onSelect(next.index)
      onLive(next.gradient)
    } else onCommit(next.gradient, next.index)
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={cn(
          'relative h-10 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/15',
          CHECKER,
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 cursor-copy rounded-xl"
          onPointerDown={addStop}
          ref={barRef}
          style={{ background: insetPreview(gradient.stops) }}
        />
        {gradient.stops.map((s, i) => (
          <button
            aria-label={`Stop ${i + 1} at ${Math.round(s.pos)}%`}
            aria-pressed={i === selected}
            className={cn(
              'absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.25)] outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing',
              i === selected && 'ring-2 ring-foreground',
            )}
            key={i}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
              e.preventDefault()
              const step = (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 10 : 1)
              const next = withStop(gradient, i, { pos: clamp(s.pos + step, 0, 100) })
              onCommit(next.gradient, next.index)
            }}
            onPointerDown={(e) => beginDrag(e, i)}
            style={{ left: insetPos(s.pos), background: withAlpha(s.color, 1) }}
            type="button"
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {gradient.kind !== 'radial' ? (
          <NumberField
            label="Angle"
            max={360}
            min={-360}
            onBegin={onEndLive}
            onChange={(v, live) => patch('angle', v, live)}
            title="Angle"
            unit="°"
            value={Math.round(gradient.angle)}
          />
        ) : null}
        {gradient.kind !== 'linear' ? (
          <>
            <NumberField
              label="X"
              max={200}
              min={-100}
              onBegin={onEndLive}
              onChange={(v, live) => patch('cx', v, live)}
              title="Center X"
              unit="%"
              value={Math.round(gradient.cx)}
            />
            <NumberField
              label="Y"
              max={200}
              min={-100}
              onBegin={onEndLive}
              onChange={(v, live) => patch('cy', v, live)}
              title="Center Y"
              unit="%"
              value={Math.round(gradient.cy)}
            />
          </>
        ) : null}
      </div>

      {stop ? (
        <div className="flex items-center gap-2">
          <ColorChip className="size-10 rounded-xl" color={withAlpha(stop.color, stop.alpha)} />
          <HexInput
            hex={stop.color}
            onCommit={(c) =>
              stopPatch(
                c.alpha === null ? { color: c.hex } : { color: c.hex, alpha: c.alpha },
                false,
              )
            }
          />
          <NumberField
            className="w-[72px] flex-none"
            max={100}
            min={0}
            onBegin={onEndLive}
            onChange={(v, live) => stopPatch({ alpha: v / 100 }, live)}
            title="Stop opacity"
            unit="%"
            value={Math.round(stop.alpha * 100)}
          />
          <NumberField
            className="w-[72px] flex-none"
            max={100}
            min={0}
            onBegin={onEndLive}
            onChange={(v, live) => stopPatch({ pos: v }, live)}
            title="Stop position"
            unit="%"
            value={Math.round(stop.pos)}
          />
          <button
            aria-label="Remove stop"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-35"
            disabled={gradient.stops.length <= 2}
            onClick={() =>
              onCommit(
                { ...gradient, stops: gradient.stops.filter((_, i) => i !== selected) },
                Math.max(0, selected - 1),
              )
            }
            type="button"
          >
            <TrashBinMinimalisticIcon className="size-[18px]" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function ColorPicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  allowGradient = false,
  allowNone = false,
  recentColors,
  recentLabel = 'Recent',
  className,
  ...props
}: ColorPickerProps) {
  const [value, setValue] = useControllableColor(valueProp, defaultValue, onValueChange)
  const [query, setQuery] = React.useState('')
  const [hover, setHover] = React.useState<{ name: string; hex: string } | null>(null)
  const [sel, setSel] = React.useState(0)
  const pendingCommit = React.useRef<string | null>(null)

  const gradient = React.useMemo(
    () => (allowGradient ? parseGradient(value) : null),
    [allowGradient, value],
  )
  const mode: ColorPickerMode = gradient ? gradient.kind : 'solid'
  const selected = gradient ? Math.min(sel, gradient.stops.length - 1) : 0
  const solid = !gradient && value && value !== 'transparent' ? parseColor(value) : null
  const activeHex = gradient ? gradient.stops[selected]?.color : solid?.hex
  const activeAlpha = gradient ? (gradient.stops[selected]?.alpha ?? 1) : (solid?.alpha ?? 1)
  const recent = React.useMemo(
    () =>
      (recentColors ?? [])
        .map((c) => parseColor(c)?.hex)
        .filter((hex, i, all): hex is string => !!hex && all.indexOf(hex) === i),
    [recentColors],
  )

  const pick = (css: string) => {
    pendingCommit.current = null
    setValue(css)
    onValueCommit?.(css)
  }
  const live = (css: string) => {
    pendingCommit.current = css
    setValue(css)
  }
  const endLive = () => {
    if (pendingCommit.current !== null) onValueCommit?.(pendingCommit.current)
    pendingCommit.current = null
  }
  const commitGradient = (g: Gradient, index?: number) => {
    if (index !== undefined) setSel(index)
    pick(stringifyGradient(g))
  }

  const pickColor = (hex: string) => {
    if (gradient) {
      const next = withStop(gradient, selected, { color: hex })
      commitGradient(next.gradient, next.index)
    } else pick(withAlpha(hex, solid?.alpha ?? 1))
  }

  const setMode = (next: ColorPickerMode) => {
    if (next === mode) return
    if (next === 'solid') {
      const first = gradient?.stops[0]
      pick(first ? withAlpha(first.color, first.alpha) : '#ffffff')
      return
    }
    const base = gradient
      ? { ...gradient, kind: next, angle: next === 'conic' ? 0 : gradient.angle || 135 }
      : defaultGradient(next, solid?.hex)
    setSel(0)
    pick(stringifyGradient(base))
  }

  const track = (e: React.PointerEvent | React.FocusEvent) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-hex]')
    if (t?.dataset.hex) setHover({ name: t.dataset.name ?? '', hex: t.dataset.hex })
  }

  const readout =
    hover ??
    (activeHex
      ? { name: paletteName(activeHex) ?? 'Custom', hex: withAlpha(activeHex, activeAlpha) }
      : null)

  return (
    <div
      className={cn(
        'flex w-96 flex-col gap-3 rounded-[24px] bg-card p-4 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        allowGradient && 'h-[min(560px,var(--available-height,100vh))]',
        className,
      )}
      data-slot="color-picker"
      onFocus={track}
      onPointerLeave={() => setHover(null)}
      onPointerOver={track}
      {...props}
    >
      {allowGradient ? (
        <div className="relative flex h-11 items-center rounded-xl bg-muted p-1" role="tablist">
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc((100%-8px)/4)] rounded-[9px] bg-background shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none dark:bg-card"
            style={{ transform: `translateX(${MODES.findIndex((m) => m.id === mode) * 100}%)` }}
          />
          {MODES.map((m) => (
            <button
              aria-selected={mode === m.id}
              className={cn(
                'relative h-9 flex-1 rounded-[9px] text-sm text-muted-foreground transition-[color,background-color] duration-200 outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50',
                mode === m.id && 'text-foreground hover:bg-transparent',
              )}
              key={m.id}
              onClick={() => setMode(m.id)}
              role="tab"
              type="button"
            >
              {m.label}
            </button>
          ))}
        </div>
      ) : null}

      {gradient ? (
        <GradientEditor
          gradient={gradient}
          onCommit={commitGradient}
          onEndLive={endLive}
          onLive={(g) => live(stringifyGradient(g))}
          onSelect={setSel}
          selected={selected}
        />
      ) : (
        <div className="flex items-center gap-2">
          <ColorChip
            className="size-10 rounded-xl"
            color={solid ? withAlpha(solid.hex, solid.alpha) : undefined}
          />
          <HexInput
            hex={solid?.hex ?? ''}
            onCommit={(c) => pick(withAlpha(c.hex, c.alpha ?? solid?.alpha ?? 1))}
          />
          <NumberField
            className="w-20 flex-none"
            disabled={!solid}
            max={100}
            min={0}
            onBegin={endLive}
            onChange={(v, isLive) => {
              const css = withAlpha(solid?.hex ?? '#000000', v / 100)
              if (isLive) live(css)
              else pick(css)
            }}
            title="Opacity"
            unit="%"
            value={Math.round(activeAlpha * 100)}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        {allowNone && !gradient ? (
          <button
            aria-label="No color"
            aria-pressed={!solid}
            className={cn(
              'relative size-7 shrink-0 overflow-hidden rounded-lg bg-background ring-1 ring-black/15 outline-none ring-inset hover:ring-2 hover:ring-foreground/60 focus-visible:ring-2 focus-visible:ring-foreground dark:ring-white/20',
              !solid && 'ring-2 ring-foreground dark:ring-foreground',
            )}
            onClick={() => pick('')}
            type="button"
          >
            <span className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-0.75px),#ef4444_calc(50%-0.75px),#ef4444_calc(50%+0.75px),transparent_calc(50%+0.75px))]" />
          </button>
        ) : null}
        {baseColors.map((c) => (
          <Swatch
            className="size-7 shrink-0 rounded-lg"
            hex={c.hex}
            key={c.name}
            name={c.name}
            onPick={pickColor}
            selected={sameHex(activeHex, c.hex)}
          />
        ))}
        <label className={cn(FIELD, 'ml-1 flex-1 gap-2 px-3')}>
          <MinimalisticMagnifierIcon className="size-4 shrink-0" />
          <input
            aria-label="Filter colors"
            className="h-full w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter: blue, rose…"
            spellCheck={false}
            value={query}
          />
        </label>
        <label
          className="relative size-7 shrink-0 cursor-pointer overflow-hidden rounded-full ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-foreground hover:ring-2 hover:ring-foreground/60 dark:ring-white/20"
          style={{ background: SPECTRUM }}
          title="Custom color"
        >
          <input
            aria-label="Custom color"
            className="absolute inset-0 size-full cursor-pointer opacity-0"
            onBlur={endLive}
            onChange={(e) => {
              const hex = e.target.value
              if (gradient)
                live(stringifyGradient(withStop(gradient, selected, { color: hex }).gradient))
              else live(withAlpha(hex, activeAlpha))
            }}
            onPointerDown={endLive}
            type="color"
            value={activeHex && HEX6.test(activeHex) ? activeHex : '#000000'}
          />
        </label>
      </div>

      <div className={cn('flex flex-col gap-2', allowGradient && 'min-h-0 flex-1')}>
        <div className="grid grid-cols-[60px_repeat(11,minmax(0,1fr))] gap-x-1">
          <span />
          {SHADES.map((s) => (
            <span className="text-center text-[10px] text-muted-foreground/70 tabular-nums" key={s}>
              {s}
            </span>
          ))}
        </div>
        <div
          className={cn(
            '-mx-1 -mr-3 overflow-y-auto py-1 pr-1.5 pl-1',
            SCROLLBAR,
            allowGradient ? 'min-h-0 flex-1' : 'max-h-[min(300px,44vh)]',
          )}
        >
          <PaletteGrid onPick={pickColor} query={query} selectedHex={activeHex} />
        </div>
      </div>

      {recent.length ? (
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-muted-foreground">{recentLabel}</span>
          <div className="flex flex-wrap gap-2">
            {recent.map((hex) => (
              <Swatch
                className="size-7 rounded-lg"
                hex={hex}
                key={hex}
                name={paletteName(hex) ?? hex}
                onPick={pickColor}
                selected={sameHex(activeHex, hex)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div
        className="flex h-10 items-center gap-2.5 border-t border-border pt-3"
        aria-live="polite"
      >
        {readout ? (
          <>
            <ColorChip className="size-5 rounded-md" color={readout.hex} />
            <span className="truncate text-sm font-medium text-foreground capitalize">
              {readout.name}
            </span>
            <span className="ml-auto text-sm text-muted-foreground uppercase tabular-nums">
              {readout.hex}
            </span>
          </>
        ) : (
          <span className="text-sm">Pick a color</span>
        )}
      </div>
    </div>
  )
}

function ColorPickerPopover({
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  align = 'start',
  side = 'bottom',
  triggerClassName,
  className,
  ...props
}: ColorPickerPopoverProps) {
  const [value, setValue] = useControllableColor(valueProp, defaultValue, onValueChange)
  const gradient = parseGradient(value)
  const solid = gradient ? null : parseColor(value)
  const text = gradient
    ? `${gradient.kind[0].toUpperCase()}${gradient.kind.slice(1)}`
    : solid
      ? (paletteName(solid.hex) ?? withAlpha(solid.hex, solid.alpha).toUpperCase())
      : 'None'

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <button
            className={cn(
              'inline-flex h-11 items-center gap-2.5 rounded-full bg-muted py-1 pr-4 pl-1.5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground transition-[background-color,scale] duration-150 outline-none hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] data-popup-open:bg-muted/80',
              triggerClassName,
            )}
            type="button"
          >
            <ColorChip className="size-8 rounded-full" color={value || undefined} />
            {label ? <span className="font-medium text-foreground">{label}</span> : null}
            <span className="w-[11ch] truncate text-left tabular-nums">{text}</span>
          </button>
        }
      />
      <Popover.Portal>
        <Popover.Positioner
          align={align}
          className="isolate z-50"
          collisionPadding={32}
          side={side}
          sideOffset={8}
        >
          <Popover.Popup
            className="origin-(--transform-origin) rounded-[24px] transition-[opacity,scale,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-[0.96] data-starting-style:opacity-0 data-[side=bottom]:data-starting-style:-translate-y-1 data-[side=left]:data-starting-style:translate-x-1 data-[side=right]:data-starting-style:-translate-x-1 data-[side=top]:data-starting-style:translate-y-1 motion-reduce:transition-opacity"
            initialFocus={(type) => type === 'keyboard'}
          >
            <ColorPicker className={className} onValueChange={setValue} value={value} {...props} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

export { ColorPicker, ColorPickerPopover }
export type { ColorPickerMode, ColorPickerPopoverProps, ColorPickerProps }
