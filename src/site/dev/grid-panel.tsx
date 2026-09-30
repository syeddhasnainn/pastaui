import GridIcon from '~icons/solar/widget-4-linear'

import { Section, Slider } from '#/site/dev/controls'
import { applyPreset, gridPresets, type GridColor, type GridSettings } from '#/site/dev/grid'
import {
  activeClass,
  buttonClass,
  fieldClass,
  focusRing,
  hairline,
  hintClass,
  labelText,
  muted,
} from '#/site/dev/styles'
import { cn } from '#/lib/utils'

const widths = [0, 960, 1200, 1280, 1440]
const colors: GridColor[] = ['blue', 'red', 'neutral']

interface GridPanelProps {
  onChange: (settings: GridSettings) => void
  settings: GridSettings
}

export function GridPanel({ onChange, settings }: GridPanelProps) {
  function layout(patch: Partial<GridSettings>) {
    onChange({ ...settings, ...patch, preset: 'Custom', enabled: true })
  }

  function look(patch: Partial<GridSettings>) {
    onChange({ ...settings, ...patch })
  }

  return (
    <>
      <div className="grid gap-2 px-3 pb-3">
        <button
          aria-pressed={settings.enabled}
          className={cn(buttonClass, 'h-8 w-full justify-start', settings.enabled && activeClass)}
          onClick={() => look({ enabled: !settings.enabled })}
          type="button"
        >
          <GridIcon aria-hidden="true" className="size-4" />
          {settings.enabled ? 'Grid on' : 'Show grid'}
          <kbd
            className={cn(
              'ml-auto rounded border-[0.5px] px-1 font-sans text-[10px] leading-4',
              hairline,
              muted,
            )}
          >
            Alt G
          </kbd>
        </button>
        <label className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
          <span className={labelText}>Preset</span>
          <select
            className={cn(fieldClass, 'min-w-0')}
            onChange={(event) => onChange(applyPreset(settings, event.currentTarget.value))}
            value={settings.preset}
          >
            {gridPresets.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
            <option value="Custom">Custom</option>
          </select>
        </label>
      </div>
      <Section title="Layout">
        <Slider
          label="Columns"
          max={24}
          min={0}
          onChange={(columns) => layout({ columns: Math.max(0, Math.round(columns)) })}
          step={1}
          value={settings.columns}
        />
        <Slider
          label="Gutter"
          max={64}
          min={0}
          onChange={(gutter) => layout({ gutter: Math.max(0, gutter) })}
          step={1}
          unit="px"
          value={settings.gutter}
        />
        <Slider
          label="Margin"
          max={200}
          min={0}
          onChange={(margin) => layout({ margin: Math.max(0, margin) })}
          step={1}
          unit="px"
          value={settings.margin}
        />
        <label className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
          <span className={labelText}>Container</span>
          <select
            className={cn(fieldClass, 'min-w-0')}
            onChange={(event) => layout({ maxWidth: Number(event.currentTarget.value) })}
            value={settings.maxWidth}
          >
            {widths.map((width) => (
              <option key={width} value={width}>
                {width ? `${width}px` : 'Full width'}
              </option>
            ))}
          </select>
        </label>
        <Slider
          label="Rows"
          max={24}
          min={0}
          onChange={(rows) => layout({ rows: Math.max(0, Math.round(rows)) })}
          step={1}
          value={settings.rows}
        />
        <Slider
          label="Baseline"
          max={64}
          min={0}
          onChange={(rowHeight) => layout({ rowHeight: Math.max(0, rowHeight) })}
          step={1}
          unit="px"
          value={settings.rowHeight}
        />
        <p className={hintClass}>Rows 0 with a baseline draws auto rows every baseline step.</p>
      </Section>
      <Section title="Look and snapping">
        <label className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
          <span className={labelText}>Colour</span>
          <select
            className={cn(fieldClass, 'min-w-0 capitalize')}
            onChange={(event) => look({ color: event.currentTarget.value as GridColor })}
            value={settings.color}
          >
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
        <Slider
          label="Opacity"
          max={3}
          min={0.25}
          onChange={(opacity) => look({ opacity: Math.max(0, opacity) })}
          step={0.05}
          value={settings.opacity}
        />
        <Slider
          label="Snap within"
          max={24}
          min={0}
          onChange={(threshold) => look({ threshold: Math.max(0, threshold) })}
          step={1}
          unit="px"
          value={settings.threshold}
        />
        <label className="flex items-center gap-2">
          <input
            checked={settings.numbers}
            className={cn('size-3.5 accent-[oklch(62.6%_0.205_254.947)]', focusRing)}
            onChange={(event) => look({ numbers: event.currentTarget.checked })}
            type="checkbox"
          />
          <span className={labelText}>Column numbers</span>
        </label>
      </Section>
    </>
  )
}
