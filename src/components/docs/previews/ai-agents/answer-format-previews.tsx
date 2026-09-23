import type { ComponentType } from 'react'
import { useState } from 'react'

import { InlineCitation } from '#/components/ai/inline-citation'

interface PreviewProps {
  slug: string
}

function InlineCitationPreview() {
  const [open, setOpen] = useState(true)

  return (
    <p className="w-full max-w-lg pt-40 pb-4 text-sm leading-7 font-[450] tracking-[-0.05px] text-muted-foreground">
      Agent products repeatedly need approval, recovery, execution state, and durable output
      <InlineCitation
        className="mx-1"
        excerpt="Most agent libraries concentrate on the message surface while application teams rebuild operational UI."
        index={1}
        onOpenChange={setOpen}
        open={open}
        source="Pasta UI registry audit · Sep 2026"
        title="Agent interface opportunity"
      />
      —which makes complete workflow components a stronger differentiator.
    </p>
  )
}

const answerFormatPreviews: Record<string, ComponentType> = {
  'inline-citation': InlineCitationPreview,
}

export function AiAnswerFormatPreview({ slug }: PreviewProps) {
  const Preview = answerFormatPreviews[slug]

  return Preview ? <Preview /> : null
}
