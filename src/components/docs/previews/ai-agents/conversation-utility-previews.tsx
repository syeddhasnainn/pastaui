import type { ComponentType } from 'react'
import { useState } from 'react'

import { FollowUp } from '#/components/ai/follow-up'

import { EditMessage } from '#/components/ai/edit-message'
import { FollowUpSuggestions } from '#/components/ai/follow-up-suggestions'

interface PreviewProps {
  slug: string
}

function FollowUpPreview() {
  const [selected, setSelected] = useState('')

  return (
    <div className="w-full max-w-xl space-y-4">
      <FollowUp
        items={[
          { id: 'copy', label: 'What should I focus on first?' },
          { id: 'audience', label: 'Can you show me a practical example?' },
        ]}
        onSelect={(item) => setSelected(item.label)}
      />
      {selected && (
        <output className="block text-xs leading-5 text-muted-foreground">
          Selected: {selected}
        </output>
      )}
    </div>
  )
}

function FollowUpSuggestionsPreview() {
  return (
    <FollowUpSuggestions
      className="w-full max-w-lg"
      items={[
        {
          id: 'architecture',
          label: 'Explain the recommended architecture',
        },
        {
          id: 'priorities',
          label: 'Prioritize the first release',
        },
        {
          id: 'compare',
          label: 'Compare the strongest libraries',
        },
        { id: 'custom', label: 'Ask a different question' },
      ]}
      onDismiss={() => undefined}
      onSelect={() => undefined}
    />
  )
}

function EditMessagePreview() {
  const [value, setValue] = useState(
    'Focus the next collection on conversation recovery and navigation.',
  )

  return (
    <EditMessage
      className="w-full max-w-lg"
      onCancel={() => undefined}
      onSave={() => undefined}
      onValueChange={setValue}
      value={value}
    />
  )
}

const conversationUtilityPreviews: Record<string, ComponentType> = {
  'follow-up': FollowUpPreview,
  'follow-up-suggestions': FollowUpSuggestionsPreview,
  'edit-message': EditMessagePreview,
}

export function AiConversationUtilityPreview({ slug }: PreviewProps) {
  const Preview = conversationUtilityPreviews[slug]

  return Preview ? <Preview /> : null
}
