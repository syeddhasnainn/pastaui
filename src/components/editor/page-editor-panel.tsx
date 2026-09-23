import ChevronUpIcon from '~icons/solar/alt-arrow-up-linear'
import RotateCcwIcon from '~icons/solar/restart-linear'
import Trash2Icon from '~icons/solar/trash-bin-2-linear'
import { colorToHex, type EditorValues } from '#/components/editor/page-editor-utils'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

interface PageEditorPanelProps {
  canSelectParent: boolean
  isContainer: boolean
  onChange: (property: keyof EditorValues, value: string) => void
  onResetElement: () => void
  onResetPage: () => void
  onSelectParent: () => void
  selectedLabel: string | null
  values: EditorValues
}

const fontFamilies = [
  { label: 'Inter', value: 'inter' },
  { label: 'System', value: 'system' },
  { label: 'Serif', value: 'serif' },
  { label: 'Mono', value: 'mono' },
]

export function PageEditorPanel({
  canSelectParent,
  isContainer,
  onChange,
  onResetElement,
  onResetPage,
  onSelectParent,
  selectedLabel,
  values,
}: PageEditorPanelProps) {
  return (
    <div className="fixed right-4 bottom-16 z-9999 w-80 overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-foreground/12">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold">Page editor</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
            {selectedLabel ?? 'Select an element'}
          </p>
        </div>
        <Button
          aria-label="Select parent container"
          disabled={!canSelectParent}
          onClick={onSelectParent}
          size="icon-sm"
          variant="ghost"
        >
          <ChevronUpIcon />
        </Button>
      </div>

      {selectedLabel ? (
        <div className="max-h-[min(560px,calc(100dvh-8rem))] overflow-y-auto px-4 pb-4">
          <p className="mb-3 rounded-lg bg-muted px-3 py-2 text-[11px] leading-4 text-muted-foreground">
            {isContainer
              ? 'Container selected. Typography changes apply proportionally to everything inside.'
              : 'Element selected. Changes apply only to this element.'}
          </p>

          <EditorSection title="Colors">
            <div className="grid gap-2">
              <EditorColorField
                label="Text color"
                value={values.color}
                onChange={(value) => onChange('color', value)}
              />
              <EditorColorField
                label="Background color"
                value={values.backgroundColor}
                onChange={(value) => onChange('backgroundColor', value)}
              />
              <EditorColorField
                label="Border color"
                value={values.borderColor}
                onChange={(value) => onChange('borderColor', value)}
              />
            </div>
          </EditorSection>

          <EditorSection title="Sizing">
            <div className="grid grid-cols-2 gap-2">
              <EditorField
                label="Width"
                onChange={(value) => onChange('width', value)}
                value={values.width}
              />
              <EditorField
                label="Height"
                onChange={(value) => onChange('height', value)}
                value={values.height}
              />
              <EditorField
                label="Padding"
                onChange={(value) => onChange('padding', value)}
                suffix="px"
                value={values.padding}
              />
              <EditorField
                label="Gap"
                onChange={(value) => onChange('gap', value)}
                suffix="px"
                value={values.gap}
              />
              <EditorField
                label="Radius"
                onChange={(value) => onChange('borderRadius', value)}
                suffix="px"
                value={values.borderRadius}
              />
            </div>
          </EditorSection>

          <EditorSection title="Typography">
            <div className="grid grid-cols-2 gap-2">
              <EditorField
                label="Font size"
                onChange={(value) => onChange('fontSize', value)}
                suffix="px"
                value={values.fontSize}
              />
              <EditorSelect
                label="Weight"
                onChange={(value) => onChange('fontWeight', value)}
                options={['300', '400', '450', '500', '550', '600', '700']}
                value={values.fontWeight}
              />
              <EditorField
                label="Line height"
                onChange={(value) => onChange('lineHeight', value)}
                suffix="px"
                value={values.lineHeight}
              />
              <EditorField
                label="Tracking"
                onChange={(value) => onChange('letterSpacing', value)}
                suffix="px"
                value={values.letterSpacing}
              />
              <EditorSelect
                className="col-span-2"
                label="Font family"
                onChange={(value) => onChange('fontFamily', value)}
                options={fontFamilies}
                value={values.fontFamily}
              />
            </div>
          </EditorSection>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={onResetElement} size="sm" variant="outline">
              <RotateCcwIcon data-icon="inline-start" /> Reset element
            </Button>
            <Button onClick={onResetPage} size="sm" variant="ghost">
              <Trash2Icon data-icon="inline-start" /> Reset page
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 text-sm leading-5 text-muted-foreground">
          Click anything on the page to edit it. Use the up arrow to move from an element to its
          parent container.
        </div>
      )}
    </div>
  )
}

interface EditorSectionProps {
  children: React.ReactNode
  title: string
}

function EditorSection({ children, title }: EditorSectionProps) {
  return (
    <section className="mt-4">
      <h2 className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

interface EditorFieldProps {
  label: string
  onChange: (value: string) => void
  suffix?: string
  value: string
}

function EditorField({ label, onChange, suffix, value }: EditorFieldProps) {
  return (
    <label className="grid gap-1 text-[11px] text-muted-foreground">
      {label}
      <span className="relative">
        <Input
          className="h-8 px-2 text-xs shadow-none"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px]">
            {suffix}
          </span>
        )}
      </span>
    </label>
  )
}

interface EditorSelectProps {
  className?: string
  label: string
  onChange: (value: string) => void
  options: Array<string | { label: string; value: string }>
  value: string
}

function EditorSelect({ className, label, onChange, options, value }: EditorSelectProps) {
  return (
    <label className={`grid gap-1 text-[11px] text-muted-foreground ${className ?? ''}`}>
      {label}
      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => {
          const item = typeof option === 'string' ? { label: option, value: option } : option
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>
    </label>
  )
}

function EditorColorField({ label, onChange, value }: EditorFieldProps) {
  return (
    <div className="grid gap-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          className="h-8 w-9 shrink-0 cursor-pointer rounded-md border border-input bg-background p-1"
          value={colorToHex(value)}
          onChange={(event) => onChange(event.target.value)}
        />
        <Input
          aria-label={label}
          className="h-8 min-w-0 px-2 font-mono text-xs shadow-none"
          placeholder="#171717 or transparent"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}
