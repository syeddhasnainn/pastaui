import { createAiDocument } from './create-ai-document'

export const aiConversationUtilityComponents = [
  createAiDocument({
    slug: 'follow-up',
    name: 'Follow Up',
    description:
      'Follow-up prompts that stagger in after an answer, with number key shortcuts and a selected state.',
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
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows placeholder chips while suggestions load.',
      },
      {
        name: 'selectedId',
        type: 'string',
        defaultValue: 'undefined',
        description: 'Marks the chosen suggestion and fades the rest.',
      },
      {
        name: 'shortcuts',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables number key shortcuts while focus is inside.',
      },
    ],
  }),
  createAiDocument({
    slug: 'follow-up-suggestions',
    name: 'Follow-up Suggestions',
    description:
      'A keyboard-driven next step picker with numbered options and a free text custom question.',
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
      {
        name: 'items[].custom',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Turns an item into a free text question field.',
      },
    ],
  }),
  createAiDocument({
    slug: 'edit-message',
    name: 'Edit Message',
    description:
      'A user message with copy and edit actions, inline editing with keyboard shortcuts, and switching between edited versions.',
    usage: `import { EditMessage } from "@/components/ai/edit-message"

export function Example() {
  return <EditMessage defaultVersions={["Summarize the release notes."]} onSave={resend} />
}`,
    source: `<div>
  <MessageBubble>{versions[active]}</MessageBubble>
  <MessageActions versions copy edit />
  <InlineEditor draft onSave onCancel />
</div>`,
    api: [
      {
        name: 'versions / defaultVersions',
        type: 'string[]',
        defaultValue: "['']",
        description: 'Holds each edited version of the message.',
      },
      {
        name: 'activeVersion',
        type: 'number',
        defaultValue: 'last version',
        description: 'Controls which version is shown.',
      },
      {
        name: 'editing / onEditingChange',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controls the inline editor.',
      },
      {
        name: 'draft / onDraftChange',
        type: 'string',
        defaultValue: "''",
        description: 'Controls the editor text.',
      },
      {
        name: 'onSave',
        type: '(value: string) => void',
        defaultValue: 'undefined',
        description: 'Saves the edit as a new version.',
      },
      {
        name: 'onCopy',
        type: '(value: string) => void',
        defaultValue: 'undefined',
        description: 'Runs after the message is copied.',
      },
    ],
  }),
]
