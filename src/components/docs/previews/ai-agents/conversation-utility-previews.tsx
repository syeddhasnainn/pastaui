import type { ComponentType } from 'react'

import { FollowUp } from '#/components/ai/follow-up'

import { EditMessage } from '#/components/ai/edit-message'
import { FollowUpSuggestions } from '#/components/ai/follow-up-suggestions'
import * as React from 'react'
import { type FollowUpItem } from '#/components/ai/follow-up'
import { type FollowUpSuggestion } from '#/components/ai/follow-up-suggestions'

interface PreviewProps {
  slug: string
}

const followUpItems: FollowUpItem[] = [
  { id: 'focus', label: 'What should I focus on first?' },
  { id: 'example', label: 'Can you show me a practical example?' },
  { id: 'compare', label: 'How does this compare to a design system?' },
]

function FollowUpPreview() {
  const [phase, setPhase] = React.useState<'loading' | 'ready' | 'selected'>('ready')
  const [selected, setSelected] = React.useState<string>()
  const [auto, setAuto] = React.useState(true)

  React.useEffect(() => {
    if (!auto && phase !== 'loading') return
    const timer = setTimeout(
      () => {
        if (phase === 'loading') setPhase('ready')
        else if (phase === 'ready') {
          setSelected('example')
          setPhase('selected')
        } else {
          setSelected(undefined)
          setPhase('loading')
        }
      },
      phase === 'loading' ? 1200 : phase === 'ready' ? 3200 : 2200,
    )
    return () => clearTimeout(timer)
  }, [auto, phase])

  return (
    <div className="w-full max-w-xl space-y-4" onPointerDown={() => setAuto(false)}>
      <p className="text-sm leading-6 font-[450] tracking-[-0.05px] text-muted-foreground">
        A component library for agents is most useful when it covers whole workflows: approvals,
        tool output, recovery, and long-running work, not just chat bubbles.
      </p>
      <FollowUp
        items={followUpItems}
        loading={phase === 'loading'}
        onSelect={(item) => {
          setAuto(false)
          setSelected(item.id)
          setPhase('selected')
        }}
        selectedId={selected}
      />
    </div>
  )
}

const followUpSuggestionsItems: FollowUpSuggestion[] = [
  { id: 'architecture', label: 'Explain the recommended architecture' },
  { id: 'priorities', label: 'Prioritize the first release' },
  { id: 'compare', label: 'Compare the strongest libraries' },
  {
    id: 'custom',
    label: 'Ask a different question',
    custom: true,
    placeholder: 'What else should I look into?',
  },
]

function FollowUpSuggestionsPreview() {
  const [selected, setSelected] = React.useState(followUpSuggestionsItems[1].id)
  const [auto, setAuto] = React.useState(true)
  const [sent, setSent] = React.useState('')

  React.useEffect(() => {
    if (!auto) return
    const index = followUpSuggestionsItems.findIndex((item) => item.id === selected)
    const timer = setTimeout(
      () => setSelected(followUpSuggestionsItems[(index + 1) % followUpSuggestionsItems.length].id),
      index === followUpSuggestionsItems.length - 1 ? 2600 : 1400,
    )
    return () => clearTimeout(timer)
  }, [auto, selected])

  return (
    <div className="w-full max-w-lg space-y-3" onPointerDown={() => setAuto(false)}>
      <FollowUpSuggestions
        items={followUpSuggestionsItems}
        onDismiss={() => setSent('Dismissed')}
        onSelect={(id, value) =>
          setSent(
            value
              ? `Asked: ${value}`
              : `Selected: ${followUpSuggestionsItems.find((item) => item.id === id)?.label}`,
          )
        }
        onSelectedIdChange={setSelected}
        selectedId={selected}
      />
      <output aria-live="polite" className="block min-h-5 text-xs leading-5 text-muted-foreground">
        {sent}
      </output>
    </div>
  )
}

const editMessageOriginal = 'Focus the next collection on conversation recovery.'

const editMessageRevised =
  'Focus the next collection on conversation recovery and keyboard navigation.'

const editMessageExtra = editMessageRevised.slice(editMessageOriginal.length - 1)

type editMessagePhase = 'idle' | 'editing' | 'saved'

function EditMessagePreview() {
  const [phase, setPhase] = React.useState<editMessagePhase>('editing')
  const [typed, setTyped] = React.useState(12)
  const [versions, setVersions] = React.useState([editMessageOriginal])
  const [active, setActive] = React.useState(0)
  const [draft, setDraft] = React.useState(
    editMessageOriginal.slice(0, -1) + editMessageExtra.slice(0, 12),
  )
  const [auto, setAuto] = React.useState(true)

  React.useEffect(() => {
    if (!auto) return
    if (phase === 'editing' && typed < editMessageExtra.length) {
      const timer = setTimeout(() => {
        setTyped((value) => value + 1)
        setDraft(editMessageOriginal.slice(0, -1) + editMessageExtra.slice(0, typed + 1))
      }, 45)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(
      () => {
        if (phase === 'idle') {
          setDraft(editMessageOriginal)
          setTyped(0)
          setPhase('editing')
        } else if (phase === 'editing') {
          setVersions([editMessageOriginal, editMessageRevised])
          setActive(1)
          setPhase('saved')
        } else {
          setVersions([editMessageOriginal])
          setActive(0)
          setPhase('idle')
        }
      },
      phase === 'saved' ? 3600 : phase === 'idle' ? 1600 : 700,
    )
    return () => clearTimeout(timer)
  }, [auto, phase, typed])

  return (
    <div className="w-full max-w-lg" onPointerDown={() => setAuto(false)}>
      <EditMessage
        activeVersion={active}
        draft={draft}
        editing={phase === 'editing'}
        onActiveVersionChange={setActive}
        onDraftChange={setDraft}
        onEditingChange={(editing) => setPhase(editing ? 'editing' : 'saved')}
        onSave={(value) => setVersions((current) => [...current, value])}
        versions={versions}
      />
    </div>
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
