import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'

import { formatHsla, parseHsla, type Hsla } from '#/site/dev/color'
import { buttonClass, fieldClass, focusRing, labelText } from '#/site/dev/styles'
import { cn } from '#/lib/utils'

const rangeClass = cn(
  'h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full',
  '[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_0.5px_rgb(0_0_0/0.28),0_1px_3px_rgb(0_0_0/0.3)]',
  '[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_0_0.5px_rgb(0_0_0/0.28),0_1px_3px_rgb(0_0_0/0.3)]',
  focusRing,
)

const checker =
  'repeating-conic-gradient(rgb(0 0 0 / 0.12) 0% 25%, transparent 0% 50%) 0 0 / 8px 8px'

interface SliderProps {
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  step: number
  stepper?: SliderStepper
  track?: string
  unit?: string
  value: number
}

interface SliderStepper {
  decrease: string
  increase: string
  onStep: (delta: number) => void
}

const stepButtonClass = cn(buttonClass, 'size-6 shrink-0 px-0 text-[13px] leading-none')

function round(value: number, step: number) {
  const digits = Math.max(0, -Math.floor(Math.log10(step)))
  return Number(value.toFixed(digits))
}

function isUnfinished(text: string) {
  const trimmed = text.trim()
  return trimmed === '-0' || trimmed.endsWith('.') || /\.0+$/.test(trimmed)
}

function parseNumber(text: string) {
  const next = Number(text)
  return text.trim() !== '' && Number.isFinite(next) ? next : null
}

interface NumberFieldProps {
  label: string
  onChange: (value: number) => void
  step: number
  unit?: string
  value: number
}

export function NumberField({ label, onChange, step, unit, value }: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null)

  function type(text: string) {
    setDraft(text)
    const next = parseNumber(text)
    if (next !== null && !isUnfinished(text)) onChange(next)
  }

  function commit() {
    const next = parseNumber(draft ?? '')
    setDraft(null)
    if (next !== null && next !== value) onChange(next === 0 ? 0 : next)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') commit()
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setDraft(null)
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    const direction = event.key === 'ArrowUp' ? 1 : -1
    const base = parseNumber(draft ?? '') ?? value
    setDraft(null)
    onChange(round(base + direction * step * (event.shiftKey ? 10 : 1), Math.min(step, 0.01)))
  }

  return (
    <div className="relative">
      <input
        aria-label={`${label}${unit ? ` (${unit})` : ''}`}
        className={cn(fieldClass, 'w-full pr-5')}
        inputMode="decimal"
        onBlur={commit}
        onChange={(event) => type(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        value={draft ?? String(value)}
      />
      {unit ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-[10px] text-neutral-900/44 dark:text-neutral-100/44"
        >
          {unit}
        </span>
      ) : null}
    </div>
  )
}

export function Slider({
  label,
  max,
  min,
  onChange,
  step,
  stepper,
  track,
  unit,
  value,
}: SliderProps) {
  const id = useId()
  const range = (
    <input
      className={cn(rangeClass, !track && 'bg-neutral-900/10 dark:bg-neutral-100/14')}
      id={id}
      max={max}
      min={min}
      onChange={(event) => {
        const next = Number(event.currentTarget.value)
        onChange(next)
      }}
      step={step}
      style={track ? { background: track } : undefined}
      type="range"
      value={value}
    />
  )

  return (
    <div className="grid grid-cols-[4.5rem_1fr_4.5rem] items-center gap-2">
      <label className={labelText} htmlFor={id}>
        {label}
      </label>
      {stepper ? (
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            aria-label={stepper.decrease}
            className={stepButtonClass}
            onClick={(event) => stepper.onStep(event.shiftKey ? -10 : -1)}
            title={`${stepper.decrease} (Shift: 10)`}
            type="button"
          >
            −
          </button>
          {range}
          <button
            aria-label={stepper.increase}
            className={stepButtonClass}
            onClick={(event) => stepper.onStep(event.shiftKey ? 10 : 1)}
            title={`${stepper.increase} (Shift: 10)`}
            type="button"
          >
            +
          </button>
        </div>
      ) : (
        range
      )}
      <NumberField label={label} onChange={onChange} step={step} unit={unit} value={value} />
    </div>
  )
}

interface ColorFieldProps {
  label: string
  onChange: (value: Hsla) => void
  value: Hsla
}

export function ColorField({ label, onChange, value }: ColorFieldProps) {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  const { h, s, l, a } = value
  const solid = `hsl(${h} ${s}% ${l}%)`

  function update(patch: Partial<Hsla>) {
    setDraft(null)
    onChange({ ...value, ...patch })
  }

  function type(text: string) {
    setDraft(text)
    const parsed = parseHsla(text)
    if (parsed) onChange(parsed)
  }

  return (
    <fieldset className="grid gap-2">
      <legend className="sr-only">{label}</legend>
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-7 shrink-0 rounded-md border-[0.5px] border-neutral-900/12 dark:border-neutral-100/14"
          style={{
            background: `linear-gradient(${formatHsla(value)}, ${formatHsla(value)}), ${checker}`,
          }}
        />
        <label className="sr-only" htmlFor={id}>
          {`${label} as hsl()`}
        </label>
        <input
          aria-invalid={draft !== null && !parseHsla(draft)}
          className={cn(
            fieldClass,
            'min-w-0 flex-1 font-mono text-[11px] aria-invalid:text-red-600',
          )}
          id={id}
          onBlur={() => setDraft(null)}
          onChange={(event) => type(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') setDraft(null)
            if (event.key !== 'Escape') return
            event.preventDefault()
            event.stopPropagation()
            setDraft(null)
          }}
          spellCheck={false}
          value={draft ?? formatHsla(value)}
        />
      </div>
      <Slider
        label="Hue"
        max={360}
        min={0}
        onChange={(next) => update({ h: next })}
        step={1}
        track="linear-gradient(to right, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))"
        unit="°"
        value={h}
      />
      <Slider
        label="Saturation"
        max={100}
        min={0}
        onChange={(next) => update({ s: next })}
        step={1}
        track={`linear-gradient(to right, hsl(${h} 0% ${l}%), hsl(${h} 100% ${l}%))`}
        unit="%"
        value={s}
      />
      <Slider
        label="Lightness"
        max={100}
        min={0}
        onChange={(next) => update({ l: next })}
        step={1}
        track={`linear-gradient(to right, hsl(${h} ${s}% 0%), hsl(${h} ${s}% 50%), hsl(${h} ${s}% 100%))`}
        unit="%"
        value={l}
      />
      <Slider
        label="Alpha"
        max={1}
        min={0}
        onChange={(next) => update({ a: next })}
        step={0.01}
        track={`linear-gradient(to right, transparent, ${solid}), ${checker}`}
        value={a}
      />
    </fieldset>
  )
}

interface SectionProps {
  children: ReactNode
  title?: string
}

export function Section({ children, title }: SectionProps) {
  return (
    <section className="grid gap-2 border-t-[0.5px] border-neutral-900/10 px-3 py-3 first:border-t-0 dark:border-neutral-100/10">
      {title ? (
        <h3 className="text-[11px] leading-4 font-[600] tracking-[0.06em] text-neutral-900/60 uppercase dark:text-neutral-100/60">
          {title}
        </h3>
      ) : null}
      {children}
    </section>
  )
}

interface NumberRowProps {
  children?: ReactNode
  label: string
  onChange: (value: number) => void
  step?: number
  unit?: string
  value: number
}

export function NumberRow({ children, label, onChange, step = 1, unit, value }: NumberRowProps) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-2">
      <span aria-hidden="true" className={labelText}>
        {label}
      </span>
      <NumberField label={label} onChange={onChange} step={step} unit={unit} value={value} />
      {children ?? <span />}
    </div>
  )
}

interface SegmentedProps<T extends string> {
  label: string
  onChange: (value: T) => void
  options: { id: T; label: string; title: string }[]
  value: T
}

export function Segmented<T extends string>({
  label,
  onChange,
  options,
  value,
}: SegmentedProps<T>) {
  const index = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  )

  return (
    <fieldset
      className="relative m-0 grid min-w-0 rounded-md border-[0.5px] border-neutral-900/12 p-0.5 dark:border-neutral-100/14"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <legend className="sr-only">{label}</legend>
      <span
        aria-hidden="true"
        className="absolute top-0.5 bottom-0.5 left-0.5 rounded-[5px] bg-neutral-900/7 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:bg-neutral-100/12"
        style={{
          width: `calc((100% - 4px) / ${options.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            aria-label={option.title}
            aria-pressed={selected}
            className={cn(
              'relative flex h-6 min-w-0 items-center justify-center truncate rounded-[5px] px-1 text-[11px] font-[500]',
              selected
                ? 'text-neutral-900/88 dark:text-neutral-100/90'
                : 'text-neutral-900/60 dark:text-neutral-100/60',
              focusRing,
            )}
            key={option.id}
            onClick={() => onChange(option.id)}
            title={option.title}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </fieldset>
  )
}
