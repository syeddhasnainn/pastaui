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

export const categoryDropdownComponent = createAiDocument({
  slug: 'category-dropdown',
  isNew: true,
  name: 'Category Dropdown',
  description:
    'A dropdown with vertical category tabs on the left and their items on the right, with a sliding tab indicator, animated height, and a morphing chevron.',
  usage: `import { CategoryDropdown } from "@/components/ai/category-dropdown"

const categories = [
  {
    id: "conversation",
    label: "Conversation",
    items: [
      { id: "message-bubble", label: "Message Bubble" },
      { id: "prompt-input", label: "Prompt Input" },
    ],
  },
  {
    id: "tools",
    label: "Tools & execution",
    items: [
      { id: "tool-call", label: "Tool Call" },
      { id: "tool-approval", label: "Tool Approval" },
    ],
  },
]

export function Example() {
  const [value, setValue] = React.useState("prompt-input")

  return <CategoryDropdown categories={categories} value={value} onValueChange={setValue} />
}`,
  api: [
    {
      name: 'categories',
      type: 'CategoryDropdownCategory[]',
      defaultValue: '—',
      description:
        'Tabs shown on the left. Each category has an id, a label, and items with an id, a label, and an optional href.',
    },
    {
      name: 'value',
      type: 'string',
      defaultValue: '—',
      description:
        'The selected item id. It labels the trigger, marks the item as current, and opens its category.',
    },
    {
      name: 'onValueChange',
      type: '(id: string) => void',
      defaultValue: '—',
      description: 'Called with the item id when an item is chosen.',
    },
    {
      name: 'placeholder',
      type: 'string',
      defaultValue: "'Browse'",
      description: 'Trigger text when no item is selected.',
    },
    {
      name: 'renderItem',
      type: '(item: CategoryDropdownItem) => ReactElement',
      defaultValue: '—',
      description:
        'Renders each item as a custom element, such as a router Link. Items with an href render as anchors by default.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      defaultValue: "'center'",
      description: 'Aligns the popup to the trigger.',
    },
  ],
})
