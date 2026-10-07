import type { ComponentType } from 'react'
import { useState } from 'react'

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

const inputPreviews: Record<string, ComponentType> = {
  'color-picker': ColorPickerPreview,
  'color-picker-popover': ColorPickerPopoverPreview,
}

export function AiInputPreview({ slug }: PreviewProps) {
  const Preview = inputPreviews[slug]

  return Preview ? <Preview /> : null
}
