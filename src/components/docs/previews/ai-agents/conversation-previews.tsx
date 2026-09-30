import { defaultModels, additionalModels } from '#/components/ai/model-options'
import type { ComponentType } from 'react'
import { useState } from 'react'

import { Attachments, type AttachmentItem } from '#/components/ai/attachments'
import { Citations } from '#/components/ai/citations'
import { MessageBubble } from '#/components/ai/message-bubble'
import { MessageScroller } from '#/components/ai/message-scroller'
import type { MessageScrollerMessage } from '#/components/ai/message-scroller'
import { MessageQueue } from '#/components/ai/message-queue'
import { ModelPicker } from '#/components/ai/model-picker'
import { PromptInput } from '#/components/ai/prompt-input'
import { VoiceInput } from '#/components/ai/voice-input'

interface PreviewProps {
  slug: string
}

function MessageBubblePreview() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <MessageBubble from="user">Find the accessibility issue in this form.</MessageBubble>
      <MessageBubble>
        The email field is missing a persistent label. I can add one and preserve the current
        layout.
      </MessageBubble>
    </div>
  )
}

function MessageScrollerPreview() {
  const messages: MessageScrollerMessage[] = [
    { id: '1', content: 'Open the component catalog.' },
    { id: '2', content: 'The catalog is open. Which patterns should I show?', from: 'assistant' },
    { id: '3', content: 'Show only the AI-native patterns.', from: 'user' },
    { id: '4', content: 'Done. I found nine AI-native components.', from: 'assistant' },
    { id: '5', content: 'Group the sidebar into clear sections.' },
    { id: '6', content: 'I grouped them by conversation, input, and output.', from: 'assistant' },
    { id: '7', content: 'Make the navigation more compact.' },
    { id: '8', content: 'The spacing and labels are now tighter.', from: 'assistant' },
    { id: '9', content: 'Update the prompt input styling.' },
    { id: '10', content: 'Updated to match the rest of the catalog.', from: 'assistant' },
    { id: '11', content: 'Use the same radius across every card.' },
    { id: '12', content: 'All cards now share the same radius.', from: 'assistant' },
    { id: '13', content: 'Remove the extra metadata chips.' },
    { id: '14', content: 'Removed. The output reads more cleanly now.', from: 'assistant' },
    { id: '15', content: 'Add a subtle shadow to the output.' },
    { id: '16', content: 'Added a low-contrast shadow.', from: 'assistant' },
    { id: '17', content: 'Turn the message scroller into a conversation minimap.' },
  ]

  return <MessageScroller className="max-w-lg" messages={messages} />
}

function PromptInputPreview() {
  const [submitted, setSubmitted] = useState('')
  return (
    <div className="w-full max-w-xl space-y-3">
      <PromptInput
        placeholder="Describe what you want to build…"
        onSubmit={(message, selection) =>
          setSubmitted(`Sent with ${selection.model} · ${selection.effort} effort: ${message}`)
        }
      />
      <output className="block text-xs leading-5 text-muted-foreground">{submitted}</output>
    </div>
  )
}

function CitationsPreview() {
  return (
    <Citations
      className="w-fit max-w-lg"
      items={[
        {
          id: 'figma',
          title: 'Figma',
          domain: 'figma.com',
          description: 'Collaborative interface design and prototyping.',
          url: 'https://www.figma.com/',
          icon: <img src="/icons/companies/figma.svg" alt="" />,
        },
        {
          id: 'linear',
          title: 'Linear',
          domain: 'linear.app',
          description: 'Project planning and issue tracking for product teams.',
          url: 'https://linear.app/',
          icon: <img src="/icons/companies/linear.svg" alt="" />,
        },
        {
          id: 'notion',
          title: 'Notion',
          domain: 'notion.so',
          description: 'A shared workspace for documents and team knowledge.',
          url: 'https://www.notion.so/',
          icon: <img src="/icons/companies/notion.svg" alt="" className="bg-white" />,
        },
      ]}
    />
  )
}

function MessageQueuePreview() {
  const [items, setItems] = useState([
    { id: 'queue-1', content: 'Compare the mobile navigation states.' },
    { id: 'queue-2', content: 'Add the results to the implementation plan.' },
    { id: 'queue-3', content: 'Check the spacing in dark mode.' },
  ])
  const [status, setStatus] = useState('')

  return (
    <div className="w-full max-w-2xl">
      <MessageQueue
        className="w-full"
        items={items}
        onReorder={setItems}
        onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
        onSendNow={(id) => {
          setStatus(`Steered: ${items.find((item) => item.id === id)?.content}`)
          setItems((current) => current.filter((item) => item.id !== id))
        }}
        onMoveToTop={(id) =>
          setItems((current) => {
            const selected = current.find((item) => item.id === id)
            return selected ? [selected, ...current.filter((item) => item.id !== id)] : current
          })
        }
      />
      <output className="mt-2 block text-xs leading-5 text-muted-foreground">{status}</output>
    </div>
  )
}

function AttachmentVariantPreview({
  variant,
  showAll = false,
}: {
  variant: 'default' | 'uploading' | 'failed'
  showAll?: boolean
}) {
  const [items, setItems] = useState<AttachmentItem[]>(() => {
    const examples: AttachmentItem[] = [
      { id: 'design', kind: 'image', name: 'component-layout.png', size: '2.4 MB', progress: 72 },
      { id: 'spec', kind: 'pdf', name: 'agent-spec.pdf', size: '1.8 MB', progress: 45 },
      { id: 'notes', kind: 'document', name: 'project-notes.docx', size: '340 KB', progress: 88 },
      { id: 'trace', kind: 'file', name: 'trace.json', size: '24 KB', progress: 28 },
    ]
    return showAll ? examples : [examples[1]]
  })
  return (
    <div className={showAll ? 'w-full max-w-xl' : 'w-full max-w-sm'}>
      <Attachments
        className={showAll ? undefined : 'sm:grid-cols-1'}
        variant={variant}
        items={items}
        onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
        onRetry={(id) =>
          setItems((current) =>
            current.map((item) =>
              item.id === id ? { ...item, status: 'uploading', progress: 0 } : item,
            ),
          )
        }
      />
    </div>
  )
}

function AttachmentsPreview() {
  return <AttachmentVariantPreview variant="default" showAll />
}

function ModelPickerPreview() {
  return (
    <ModelPicker
      defaultValue="claude-sonnet-5"
      models={defaultModels}
      moreModels={additionalModels}
      footer="Choose a model from OpenAI or Anthropic. Availability depends on your provider."
    />
  )
}

function VoiceInputPreview() {
  const [recording, setRecording] = useState(true)

  return (
    <VoiceInput className="max-w-[460px]" recording={recording} onRecordingChange={setRecording} />
  )
}

const conversationPreviews: Record<string, ComponentType> = {
  'message-bubble': MessageBubblePreview,
  'message-scroller': MessageScrollerPreview,
  'prompt-input': PromptInputPreview,
  citations: CitationsPreview,
  'message-queue': MessageQueuePreview,
  attachments: AttachmentsPreview,
  'model-picker': ModelPickerPreview,
  'voice-input': VoiceInputPreview,
}

export function AiConversationPreview({ slug }: PreviewProps) {
  if (
    slug === 'attachments-default' ||
    slug === 'attachments-uploading' ||
    slug === 'attachments-failed'
  ) {
    const variant = slug.replace('attachments-', '') as 'default' | 'uploading' | 'failed'
    return <AttachmentVariantPreview variant={variant} />
  }
  const Preview = conversationPreviews[slug]

  return Preview ? <Preview /> : null
}
