import type { ComponentType } from 'react'
import { useState } from 'react'

import { CategoryDropdown, type CategoryDropdownCategory } from '#/components/ai/category-dropdown'
import { ColorPickerPopover } from '#/components/ai/color-picker'

interface PreviewProps {
  slug: string
}

const brandColors = ['#ff5a1f', '#1d1d1f', '#f5f0e8', '#3b5bdb', '#12b886']

function ColorPickerPreview() {
  const [fill, setFill] = useState('#2b7fff')

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        aria-hidden="true"
        className="size-40 rounded-[16px] shadow-card"
        style={{ background: fill || 'transparent' }}
      />
      <ColorPickerPopover
        allowGradient
        label="Fill"
        onValueChange={setFill}
        recentColors={brandColors}
        recentLabel="Brand colors"
        align="center"
        side="right"
        value={fill}
      />
    </div>
  )
}

function ColorPickerPopoverPreview() {
  const [fill, setFill] = useState('#2b7fff')
  const [stroke, setStroke] = useState('')

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ColorPickerPopover label="Fill" onValueChange={setFill} value={fill} />
      <ColorPickerPopover allowNone label="Stroke" onValueChange={setStroke} value={stroke} />
    </div>
  )
}

const dropdownCategories: CategoryDropdownCategory[] = [
  {
    id: 'featured',
    label: 'Featured',
    items: [
      { id: 'color-picker', label: 'Color Picker' },
      { id: 'data-table', label: 'Data Table' },
      { id: 'image-generation-loader', label: 'Image Generation Loader' },
    ],
  },
  {
    id: 'conversation',
    label: 'Conversation',
    items: [
      { id: 'message-bubble', label: 'Message Bubble' },
      { id: 'message-scroller', label: 'Message Scroller' },
      { id: 'prompt-input', label: 'Prompt Input' },
      { id: 'citations', label: 'Citations' },
      { id: 'message-queue', label: 'Message Queue' },
      { id: 'attachments', label: 'Attachments' },
      { id: 'model-picker', label: 'Model Picker' },
      { id: 'voice-input', label: 'Voice Input' },
      { id: 'follow-up', label: 'Follow Up' },
      { id: 'follow-up-suggestions', label: 'Follow-up Suggestions' },
      { id: 'edit-message', label: 'Edit Message' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & execution',
    items: [
      { id: 'tool-call', label: 'Tool Call' },
      { id: 'tool-approval', label: 'Tool Approval' },
      { id: 'tool-result', label: 'Tool Result' },
    ],
  },
  {
    id: 'activity',
    label: 'Agent activity',
    items: [
      { id: 'thinking', label: 'Thinking' },
      { id: 'activity-feed', label: 'Activity Feed' },
    ],
  },
  {
    id: 'output',
    label: 'Rich output',
    items: [
      { id: 'research-report', label: 'Research Report' },
      { id: 'audio-player', label: 'Audio Player' },
      { id: 'link-preview', label: 'Link Preview' },
    ],
  },
  {
    id: 'developer',
    label: 'Developer',
    items: [
      { id: 'commit', label: 'Commit' },
      { id: 'environment-variables', label: 'Environment Variables' },
    ],
  },
]

function CategoryDropdownPreview() {
  const [value, setValue] = useState('prompt-input')

  return <CategoryDropdown categories={dropdownCategories} onValueChange={setValue} value={value} />
}

const inputPreviews: Record<string, ComponentType> = {
  'category-dropdown': CategoryDropdownPreview,
  'color-picker': ColorPickerPreview,
  'color-picker-popover': ColorPickerPopoverPreview,
}

export function AiInputPreview({ slug }: PreviewProps) {
  const Preview = inputPreviews[slug]

  return Preview ? <Preview /> : null
}
