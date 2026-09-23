// Vite exposes raw file contents as a default export.
// oxlint-disable-next-line import/default
import followUpSource from '#/components/ai/follow-up.tsx?raw'
import { createAiDocument } from './create-ai-document'

export const aiConversationUtilityComponents = [
  createAiDocument({
    slug: 'follow-up',
    name: 'Follow Up',
    description: 'Compact follow-up prompts that continue the conversation with one click.',
    usage: `import { useState } from "react"
import { FollowUp } from "@/components/ai/follow-up"

export function Example() {
  const [prompt, setPrompt] = useState("")

  return (
    <div className="space-y-4">
      <FollowUp
        items={[
          { id: "copy", label: "What should I focus on first?" },
          { id: "audience", label: "Can you show me a practical example?" },
        ]}
        onSelect={(item) => setPrompt(item.label)}
      />
      <output className="block">{prompt}</output>
    </div>
  )
}`,
    source: followUpSource,
    api: [
      {
        name: 'items',
        type: 'FollowUpItem[]',
        defaultValue: '—',
        description: 'Prompts with an id, label, and optional disabled state.',
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Follow up',
        description: 'The heading above the prompts.',
      },
      {
        name: 'onSelect',
        type: '(item: FollowUpItem) => void',
        defaultValue: '—',
        description:
          'Called with the selected prompt. Connect this to your chat submission handler.',
      },
    ],
  }),
  createAiDocument({
    slug: 'follow-up-suggestions',
    name: 'Follow-up Suggestions',
    description: 'Contextual next-step prompts that invite a useful continuation after an answer.',
    usage: `import { FollowUpSuggestions } from "@/components/ai/follow-up-suggestions"

export function Example() {
  return <FollowUpSuggestions items={suggestions} onSelect={submitSuggestion} />
}`,
    source: `<Card>
  <CardHeader>
    <CardTitle>What would you like to do?</CardTitle>
  </CardHeader>
  <CardContent>
    <ToggleGroup orientation="vertical" value={[selectedId]}>
      {items.map(item => <SuggestionOption key={item.id} item={item} />)}
    </ToggleGroup>
  </CardContent>
  <CardFooter>
    <KeyboardGuide />
    <Button onClick={submitSelection}>Submit</Button>
  </CardFooter>
</Card>`,
    api: [
      {
        name: 'items',
        type: 'FollowUpSuggestion[]',
        defaultValue: '—',
        description: 'Provides the numbered next-step options.',
      },
      {
        name: 'selectedId',
        type: 'string',
        defaultValue: '—',
        description: 'Controls the currently selected suggestion.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Submits a selected suggestion.',
      },
      {
        name: 'onDismiss',
        type: '() => void',
        defaultValue: '—',
        description: 'Dismisses the suggestion card.',
      },
    ],
  }),
  createAiDocument({
    slug: 'edit-message',
    name: 'Edit Message',
    description: 'An in-place message editor with cancel and save actions.',
    usage: `import { EditMessage } from "@/components/ai/edit-message"

export function Example() {
  return <EditMessage value={value} onValueChange={setValue} />
}`,
    source: `<section>
  <Textarea value={value} onChange={onValueChange} />
  <EditActions />
</section>`,
    api: [
      {
        name: 'value',
        type: 'string',
        defaultValue: '—',
        description: 'Controls the edited message.',
      },
      {
        name: 'onSave',
        type: '() => void',
        defaultValue: '—',
        description: 'Saves and resends the edited message.',
      },
    ],
  }),
]
