import { useId, useState } from 'react'
import LinkIcon from '~icons/solar/link-linear'
import UnlinkIcon from '~icons/solar/unlink-linear'

import { NumberField, NumberRow, Section } from '#/site/dev/controls'
import { canFillHeight, isButtonLike, type Axis, type SizingMode } from '#/site/dev/sizing'
import { activeClass, buttonClass, hintClass, labelText } from '#/site/dev/styles'
import { layoutDisplays, paddingKeys, radiusKeys, type Key, type Values } from '#/site/dev/values'
import { cn } from '#/lib/utils'

const paddingLabels = ['Top', 'Right', 'Bottom', 'Left']
const radiusLabels = ['Top left', 'Top right', 'Bottom right', 'Bottom left']

interface SizePanelProps {
  element: HTMLElement
  part: 'size' | 'border'
  onHug: () => void
  onPatch: (patch: Partial<Values>) => void
  onSet: <K extends Key>(key: K, value: Values[K]) => void
  onSizing: (axis: Axis, mode: SizingMode) => void
  sizing: { x: SizingMode; y: SizingMode }
  values: Values
}

function allEqual(values: Values, group: readonly Key[]) {
  return group.every((key) => values[key] === values[group[0] ?? key])
}

function fill(group: readonly Key[], value: number) {
  return Object.fromEntries(group.map((key) => [key, value])) as Partial<Values>
}

function constraints(element: HTMLElement) {
  const view = element.ownerDocument.defaultView
  const style = view?.getComputedStyle(element)
  const parent = element.parentElement && view?.getComputedStyle(element.parentElement)
  const notes: string[] = []
  if (style?.maxWidth && style.maxWidth !== 'none') notes.push(`max-width ${style.maxWidth}`)
  if (style?.minWidth && !['auto', '0px'].includes(style.minWidth))
    notes.push(`min-width ${style.minWidth}`)
  if (parent && parent.display.includes('flex') && style?.flexShrink !== '0')
    notes.push('flex parent may shrink it (flex-shrink 1)')
  return notes
}

interface LinkToggleProps {
  label: string
  linked: boolean
  onToggle: () => void
}

function LinkToggle({ label, linked, onToggle }: LinkToggleProps) {
  const Icon = linked ? LinkIcon : UnlinkIcon
  return (
    <button
      aria-label={`${linked ? 'Unlink' : 'Link'} ${label}`}
      aria-pressed={linked}
      className={cn(buttonClass, 'size-7 px-0', linked && activeClass)}
      onClick={onToggle}
      title={linked ? `Edit ${label} per side` : `Edit all ${label} together`}
      type="button"
    >
      <Icon aria-hidden="true" className="size-3.5" />
    </button>
  )
}

const modes: { label: string; value: SizingMode }[] = [
  { label: 'Hug', value: 'hug' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Fill', value: 'fill' },
]

interface ModeSwitchProps {
  axis: Axis
  disabledFill: boolean
  mode: SizingMode
  onChange: (axis: Axis, mode: SizingMode) => void
}

function ModeSwitch({ axis, disabledFill, mode, onChange }: ModeSwitchProps) {
  const name = useId()
  const label = axis === 'x' ? 'Width' : 'Height'
  return (
    <fieldset className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
      <legend className="sr-only">{`${label} sizing`}</legend>
      <span aria-hidden="true" className={labelText}>
        {label}
      </span>
      <div className="grid grid-cols-3 gap-0.5 rounded-md border-[0.5px] border-neutral-900/12 p-0.5 dark:border-neutral-100/14">
        {modes.map((item) => {
          const disabled = item.value === 'fill' && disabledFill
          return (
            <label
              className={cn(
                'flex h-6 cursor-pointer items-center justify-center rounded-[5px] text-[11px] font-[500] has-checked:bg-[oklch(62.6%_0.205_254.947/0.12)] has-checked:text-[oklch(55%_0.205_254.947)] has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-[oklch(62.6%_0.205_254.947)] has-focus-visible:outline-solid has-disabled:cursor-not-allowed has-disabled:opacity-40 dark:has-checked:text-[oklch(72%_0.16_254.947)]',
              )}
              key={item.value}
              title={disabled ? 'Fill height needs a flex or grid parent' : undefined}
            >
              <input
                checked={mode === item.value}
                className="sr-only"
                disabled={disabled}
                name={name}
                onChange={() => onChange(axis, item.value)}
                type="radio"
                value={item.value}
              />
              {item.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function SizePanel(props: SizePanelProps) {
  return (
    <Section>
      {props.part === 'size' ? <SizeFields {...props} /> : <BorderFields {...props} />}
    </Section>
  )
}

function SizeFields({ element, onHug, onPatch, onSet, onSizing, sizing, values }: SizePanelProps) {
  const [paddingLinked, setPaddingLinked] = useState(() => allEqual(values, paddingKeys))
  const rect = element.getBoundingClientRect()
  const width = typeof values.width === 'number' ? values.width : Math.round(rect.width)
  const height = typeof values.height === 'number' ? values.height : Math.round(rect.height)
  const notes = constraints(element)
  const suggestHug = isButtonLike(element) && (sizing.x === 'fixed' || sizing.y === 'fixed')

  return (
    <>
      <ModeSwitch axis="x" disabledFill={false} mode={sizing.x} onChange={onSizing} />
      <ModeSwitch
        axis="y"
        disabledFill={!canFillHeight(element)}
        mode={sizing.y}
        onChange={onSizing}
      />
      {suggestHug ? (
        <button
          className={cn(buttonClass, 'justify-start text-[11px]')}
          onClick={onHug}
          type="button"
        >
          Hug (size by padding)
        </button>
      ) : null}
      <p className={cn(hintClass, 'tabular-nums')}>
        {`${Math.round(rect.width)} × ${Math.round(rect.height)} px · ${sizing.x === 'hug' || sizing.y === 'hug' ? 'hug axes size from padding + content' : 'set a size below'}`}
      </p>
      {sizing.x === 'fixed' ? (
        <NumberRow
          label="Width"
          onChange={(next) => onSet('width', next)}
          unit="px"
          value={width}
        />
      ) : null}
      {sizing.y === 'fixed' ? (
        <NumberRow
          label="Height"
          onChange={(next) => onSet('height', next)}
          unit="px"
          value={height}
        />
      ) : null}
      <NumberRow
        label="Min height"
        onChange={(next) => onSet('minHeight', next)}
        unit="px"
        value={values.minHeight}
      />
      {paddingLinked ? (
        <NumberRow
          label="Padding"
          onChange={(next) => onPatch(fill(paddingKeys, next))}
          unit="px"
          value={values.paddingTop}
        >
          <LinkToggle label="padding" linked onToggle={() => setPaddingLinked(false)} />
        </NumberRow>
      ) : (
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <span className={labelText}>Padding</span>
            <LinkToggle label="padding" linked={false} onToggle={() => setPaddingLinked(true)} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {paddingKeys.map((key, index) => (
              <NumberField
                key={key}
                label={`Padding ${paddingLabels[index]?.toLowerCase()}`}
                onChange={(next) => onSet(key, next)}
                step={1}
                unit={paddingLabels[index]?.[0]}
                value={values[key]}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <NumberField
              label="Padding x"
              onChange={(next) => onPatch({ paddingLeft: next, paddingRight: next })}
              step={1}
              unit="X"
              value={values.paddingLeft}
            />
            <NumberField
              label="Padding y"
              onChange={(next) => onPatch({ paddingTop: next, paddingBottom: next })}
              step={1}
              unit="Y"
              value={values.paddingTop}
            />
          </div>
        </div>
      )}
      {layoutDisplays.has(values.display) ? (
        <NumberRow
          label="Gap"
          onChange={(next) => onSet('gap', next)}
          unit="px"
          value={values.gap}
        />
      ) : null}
      {values.display === 'inline' ? (
        <p className={hintClass}>
          Inline element: setting a width or height switches it to inline-block.
        </p>
      ) : null}
      {notes.length ? <p className={hintClass}>{`Constraints: ${notes.join(', ')}.`}</p> : null}
    </>
  )
}

function BorderFields({ onPatch, onSet, values }: SizePanelProps) {
  const [radiusLinked, setRadiusLinked] = useState(() => allEqual(values, radiusKeys))

  return (
    <>
      {radiusLinked ? (
        <NumberRow
          label="Radius"
          onChange={(next) => onPatch(fill(radiusKeys, next))}
          unit="px"
          value={values.radiusTopLeft}
        >
          <LinkToggle label="radius" linked onToggle={() => setRadiusLinked(false)} />
        </NumberRow>
      ) : (
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <span className={labelText}>Radius</span>
            <LinkToggle label="radius" linked={false} onToggle={() => setRadiusLinked(true)} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {radiusKeys.map((key, index) => (
              <NumberField
                key={key}
                label={`Radius ${radiusLabels[index]?.toLowerCase()}`}
                onChange={(next) => onSet(key, next)}
                step={1}
                unit={radiusLabels[index]
                  ?.split(' ')
                  .map((word) => word[0]?.toUpperCase())
                  .join('')}
                value={values[key]}
              />
            ))}
          </div>
        </div>
      )}
      <NumberRow
        label="Border"
        onChange={(next) => onSet('borderWidth', next)}
        step={0.5}
        unit="px"
        value={values.borderWidth}
      />
    </>
  )
}
