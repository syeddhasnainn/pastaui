// Vite exposes raw file contents as a default export.
// oxlint-disable-next-line import/default
import colorPickerSource from '#/components/ai/color-picker.tsx?raw'
import { createAiDocument } from './create-ai-document'

export const colorPickerComponent = createAiDocument({
  slug: 'color-picker',
  isNew: true,
  name: 'Color Picker',
  description:
    'A Tailwind palette picker with search, hex and opacity inputs, and optional linear, radial, and conic gradients with draggable stops.',
  usage: `import { ColorPicker, ColorPickerPopover } from "@/components/ai/color-picker"

export function Example() {
  const [fill, setFill] = React.useState("#2b7fff")

  return (
    <>
      <ColorPicker value={fill} onValueChange={setFill} allowGradient />
      <ColorPickerPopover label="Fill" value={fill} onValueChange={setFill} />
    </>
  )
}`,
  source: colorPickerSource,
  examples: [
    {
      title: 'Popover',
      previewSlug: 'color-picker-popover',
      description:
        'ColorPickerPopover wraps the picker in a swatch trigger for inspector-style fields. Pass allowNone for optional colors like strokes.',
      usage: `import { ColorPickerPopover } from "@/components/ai/color-picker"

export function Fields() {
  const [fill, setFill] = React.useState("#2b7fff")
  const [stroke, setStroke] = React.useState("")

  return (
    <>
      <ColorPickerPopover label="Fill" value={fill} onValueChange={setFill} />
      <ColorPickerPopover label="Stroke" allowNone value={stroke} onValueChange={setStroke} />
    </>
  )
}`,
    },
  ],
  api: [
    {
      name: 'value',
      type: 'string',
      defaultValue: '—',
      description:
        'Controls the color as a hex (#rrggbb or #rrggbbaa) or a CSS gradient string. An empty string means no color.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      defaultValue: "''",
      description: 'Sets the initial color when uncontrolled.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      defaultValue: '—',
      description: 'Called on every change, including while dragging stops or scrubbing values.',
    },
    {
      name: 'onValueCommit',
      type: '(value: string) => void',
      defaultValue: '—',
      description: 'Called once an edit settles, for saving or pushing to an undo stack.',
    },
    {
      name: 'allowGradient',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Shows Solid, Linear, Radial, and Conic modes. Click the gradient bar to add a stop and drag stops to move them.',
    },
    {
      name: 'allowNone',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Adds a no-color swatch that sets the value to an empty string.',
    },
    {
      name: 'recentColors',
      type: 'string[]',
      defaultValue: '—',
      description:
        'Extra swatches shown below the palette, such as colors already used in a document.',
    },
    {
      name: 'recentLabel',
      type: 'string',
      defaultValue: "'Recent'",
      description: 'Heading for the recentColors row.',
    },
    {
      name: 'label',
      type: 'string',
      defaultValue: '—',
      description: 'ColorPickerPopover only. Text shown in the trigger beside the swatch.',
    },
  ],
})
