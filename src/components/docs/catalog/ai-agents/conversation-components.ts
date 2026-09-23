// Vite exposes raw file contents as a default export.
// oxlint-disable-next-line import/default
import attachmentsSource from '#/components/ai/attachments.tsx?raw'
// Vite exposes raw file contents as a default export.
// oxlint-disable-next-line import/default
import promptInputSource from '#/components/ai/prompt-input.tsx?raw'
// Vite exposes raw file contents as a default export.
// oxlint-disable-next-line import/default
import modelPickerSource from '#/components/ai/model-picker.tsx?raw'
import { createAiDocument } from './create-ai-document'

export const aiConversationComponents = [
  createAiDocument({
    slug: 'message-bubble',
    name: 'Message Bubble',
    description:
      'A focused conversational surface with distinct user, assistant, and system treatments.',
    usage: `import { MessageBubble } from "@/components/ai/message-bubble"

export function Example() {
  return <MessageBubble from="assistant">I found three matching files.</MessageBubble>
}`,
    source: `<div data-from={from} className="w-fit max-w-[85%] rounded-md px-3.5 py-2.5 text-sm">
  {children}
</div>`,
    api: [
      {
        name: 'from',
        type: 'assistant | system | user',
        defaultValue: 'assistant',
        description: 'Sets alignment and visual tone.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '—',
        description: 'Renders the message content.',
      },
    ],
  }),
  createAiDocument({
    slug: 'message-scroller',
    name: 'Message Scroller',
    description:
      'A compact conversation minimap that navigates user turns while keeping the full thread visible.',
    usage: `import { MessageScroller } from "@/components/ai/message-scroller"

export function Example() {
  return (
    <MessageScroller
      messages={conversationMessages}
      onMessageSelect={(message) => setSelectedMessage(message.id)}
    />
  )
}`,
    source: `<section data-slot="message-scroller">
  <nav aria-label="User message navigation">
    {messages.filter((message) => message.from === "user").map((message) => (
      <Tooltip key={message.id}>
        <TooltipTrigger onClick={() => selectMessage(message)} />
        <TooltipContent side="right">
          <MessageBubble from={message.from}>{message.content}</MessageBubble>
        </TooltipContent>
      </Tooltip>
    ))}
  </nav>
  <div ref={viewportRef} data-slot="message-scroller-viewport">
    {messages.map((message) => (
      <MessageBubble key={message.id} from={message.from}>{message.content}</MessageBubble>
    ))}
  </div>
</section>`,
    api: [
      {
        name: 'messages',
        type: 'MessageScrollerMessage[]',
        defaultValue: '—',
        description: 'Provides the full thread; user turns are represented by minimap strips.',
      },
      {
        name: 'activeId',
        type: 'string',
        defaultValue: '—',
        description: 'Highlights the message currently visible in the conversation.',
      },
      {
        name: 'onMessageSelect',
        type: '(message) => void',
        defaultValue: '—',
        description: 'Runs after a strip scrolls its matching message into view.',
      },
    ],
  }),
  createAiDocument({
    slug: 'prompt-input',
    name: 'Prompt Input',
    description:
      'An auto-growing agent composer with attachment, model, submit, and stop controls.',
    usage: `import { PromptInput } from "@/components/ai/prompt-input"

export function Example() {
  return <PromptInput onSubmit={(message, { model, effort }) => console.log(message, model, effort)} />
}`,
    source: promptInputSource,
    api: [
      {
        name: 'onToolSelect',
        type: '(tool: PromptTool) => void',
        defaultValue: '—',
        description:
          'Handles the plus-menu actions. Connect library, image, search, maps, research, sketch, visualization, and platform tools in your app.',
      },
      {
        name: 'onFilesChange',
        type: '(files: File[]) => void',
        defaultValue: '—',
        description:
          'Receives locally selected files. Files are included in the submit selection; upload them in your app.',
      },

      {
        name: 'models / moreModels',
        type: 'ModelOption[]',
        defaultValue: 'OpenAI and Claude models',
        description: 'Configures the embedded Model Picker options and More models submenu.',
      },
      {
        name: 'onModelChange',
        type: '(model: string) => void',
        defaultValue: '—',
        description: 'Receives model selections.',
      },
      {
        name: 'effort / onEffortChange',
        type: 'ModelEffort / (effort: ModelEffort) => void',
        defaultValue: 'medium / —',
        description: 'Controls reasoning effort in the embedded picker.',
      },
      {
        name: 'onSubmit',
        type: '(value: string, selection: { model: string; effort: ModelEffort; tool?: PromptTool; files: File[] }) => void',
        defaultValue: '—',
        description:
          'Receives a trimmed prompt, selected model and effort, active tool, and local files.',
      },
      {
        name: 'pending',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Changes the submit action into a stop control.',
      },
      {
        name: 'model',
        type: 'string',
        defaultValue: 'First available model',
        description: 'Controls the selected model ID.',
      },
    ],
  }),
  createAiDocument({
    slug: 'citations',
    name: 'Citations',
    description:
      'A compact source summary that expands into grounded references with useful context.',
    usage: `import { Citations } from "@/components/ai/citations"

export function Example() {
  return <Citations items={sources} />
}`,
    source: `<Collapsible>
  <CollapsibleTrigger>{items.length} sources</CollapsibleTrigger>
  <CollapsibleContent>{items.map(renderCitation)}</CollapsibleContent>
</Collapsible>`,
    api: [
      {
        name: 'items',
        type: 'CitationItem[]',
        defaultValue: '—',
        description: 'Provides titles, URLs, domains, and excerpts.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Sets the initial disclosure state.',
      },
    ],
  }),
  createAiDocument({
    slug: 'message-queue',
    name: 'Message Queue',
    description:
      'Pending user turns that remain visible, removable, and immediately sendable while an agent is busy.',
    usage: `import { MessageQueue } from "@/components/ai/message-queue"

export function Example() {
  return <MessageQueue items={queuedMessages} onReorder={setQueuedMessages} onRemove={removeMessage} />
}`,
    source: `<section aria-label="Queued messages">
  {items.map(item => <QueuedMessage item={item} />)}
</section>`,
    api: [
      {
        name: 'items',
        type: 'QueuedMessage[]',
        defaultValue: '—',
        description: 'Provides the pending turns and upload counts.',
      },
      {
        name: 'onRemove',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Removes a queued turn.',
      },
      {
        name: 'onSendNow',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Handles the Steer action to send a queued turn immediately.',
      },
      {
        name: 'onReorder',
        type: '(items: QueuedMessage[]) => void',
        defaultValue: '—',
        description:
          'Receives the reordered queue after dragging a side handle or pressing its arrow keys.',
      },
      {
        name: 'onMoveToTop',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Enables the Move to top action in each message menu.',
      },
    ],
  }),
  createAiDocument({
    slug: 'attachments',
    name: 'Attachments',
    description:
      'File and image attachments with progress, failure recovery, metadata, and removal actions.',
    usage: `import { useState } from "react"
import {
  Attachments,
  type AttachmentItem,
} from "@/components/ai/attachments"

const initialFiles: AttachmentItem[] = [
  { id: "pdf", name: "Project brief.pdf", kind: "pdf", size: "2.4 MB" },
  { id: "document", name: "Notes.docx", kind: "document", size: "128 KB" },
  { id: "image", name: "Cover.png", kind: "image", size: "840 KB" },
  { id: "file", name: "Assets.zip", kind: "file", size: "5.1 MB" },
]

export function AttachmentsExample() {
  const [files, setFiles] = useState(initialFiles)

  return (
    <Attachments
      items={files}
      onRemove={(id) => setFiles((items) => items.filter((item) => item.id !== id))}
    />
  )
}

// Use a variant to set the state for every item in a list.
export function AttachmentVariants() {
  return (
    <div className="space-y-6">
      <Attachments variant="default" items={[initialFiles[0]]} />
      <Attachments
        variant="uploading"
        items={[{ ...initialFiles[0], progress: 64 }]}
      />
      <Attachments variant="failed" items={[initialFiles[0]]} />
    </div>
  )
}

// Item status overrides the variant for mixed states.
// Supply your upload implementation; report progress from your uploader.
export function UploadExample({
  upload,
}: {
  upload: (
    item: AttachmentItem,
    onProgress: (progress: number) => void,
  ) => Promise<void>
}) {
  const [files, setFiles] = useState<AttachmentItem[]>([
    { ...initialFiles[0], status: "error" },
  ])

  function updateFile(id: string, changes: Partial<AttachmentItem>) {
    setFiles((items) => items.map((item) =>
      item.id === id ? { ...item, ...changes } : item
    ))
  }

  async function retryUpload(id: string) {
    const file = files.find((item) => item.id === id)
    if (!file) return

    updateFile(id, { status: "uploading", progress: 0 })
    try {
      await upload(file, (progress) => updateFile(id, { progress }))
      updateFile(id, { status: "ready", progress: 100 })
    } catch {
      updateFile(id, { status: "error" })
    }
  }

  return (
    <Attachments
      items={files}
      onRetry={retryUpload}
      onRemove={(id) => setFiles((items) => items.filter((item) => item.id !== id))}
    />
  )
}`,
    source: attachmentsSource,
    examples: [
      { title: 'Default', previewSlug: 'attachments-default' },
      { title: 'Uploading', previewSlug: 'attachments-uploading' },
      { title: 'Failed', previewSlug: 'attachments-failed' },
    ],
    api: [
      {
        name: 'variant',
        type: '"default" | "uploading" | "failed"',
        defaultValue: 'default',
        description:
          'Sets the attachment state. Individual item status values override this variant.',
      },
      {
        name: 'items',
        type: 'AttachmentItem[]',
        defaultValue: '—',
        description: 'Provides files and their transfer state.',
      },
      {
        name: 'onRemove',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Removes an attachment.',
      },
      {
        name: 'onRetry',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Retries a failed upload.',
      },
    ],
  }),
  createAiDocument({
    slug: 'model-picker',
    name: 'Model Picker',
    description:
      'A compact model menu with descriptions, plan badges, effort controls, and additional models.',
    usage: `import { ModelPicker } from "@/components/ai/model-picker"

export function Example() {
  return <ModelPicker models={[
    { id: "gpt-6-astra", name: "GPT-6 Astra", provider: "openai", description: "Complex reasoning and coding" },
    { id: "claude-sonnet-5", name: "Claude Sonnet 5", provider: "claude", description: "Everyday tasks and coding" },
  ]} defaultValue="claude-sonnet-5" />
}`,
    source: modelPickerSource,
    api: [
      {
        name: 'models[].provider',
        type: 'openai | claude',
        defaultValue: '—',
        description:
          'Shows the SVGL provider icon before the model name. Copy public/icons/providers into your app public directory.',
      },

      {
        name: 'moreModels',
        type: 'ModelOption[]',
        defaultValue: '[]',
        description: 'Models in the More models submenu.',
      },
      {
        name: 'effort / defaultEffort',
        type: 'low | medium | high | extra',
        defaultValue: 'medium',
        description: 'Controlled or initial reasoning effort.',
      },
      {
        name: 'onEffortChange',
        type: '(effort: ModelEffort) => void',
        defaultValue: '—',
        description: 'Receives effort changes.',
      },
      {
        name: 'onUpgrade',
        type: '(modelId: string) => void',
        defaultValue: '—',
        description: 'Handles upgrade requests for gated models without selecting them.',
      },
      {
        name: 'footer',
        type: 'ReactNode',
        defaultValue: '—',
        description: 'Optional supporting plan or availability information.',
      },

      {
        name: 'models',
        type: 'ModelOption[]',
        defaultValue: '—',
        description:
          'Provides model names, descriptions, badges, and optional upgrade requirements.',
      },
      {
        name: 'value',
        type: 'string',
        defaultValue: '—',
        description: 'Controls the selected model id.',
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        defaultValue: '—',
        description: 'Runs when a model is selected.',
      },
    ],
  }),
  createAiDocument({
    slug: 'voice-input',
    name: 'Voice Input',
    description:
      'A tactile recording control with a recessed waveform, red playhead, and pause control.',
    usage: `import { VoiceInput } from "@/components/ai/voice-input"

export function Example() {
  return <VoiceInput onRecordingChange={setRecording} />
}`,
    source: `<div data-recording={isRecording} data-slot="voice-input">
  <RecordingButton aria-label={isRecording ? "Pause recording" : "Start recording"} />
  <div aria-hidden="true">
    <Waveform />
    <Playhead />
  </div>
  <span className="sr-only">{isRecording ? "Recording, " + duration : "Recording paused"}</span>
</div>`,
    api: [
      {
        name: 'recording',
        type: 'boolean',
        defaultValue: '—',
        description: 'Controls the recording state.',
      },
      {
        name: 'duration',
        type: 'string',
        defaultValue: '00:12',
        description: 'Accessible elapsed recording time.',
      },
      {
        name: 'onRecordingChange',
        type: '(recording: boolean) => void',
        defaultValue: '—',
        description: 'Runs when recording starts or pauses.',
      },
    ],
  }),
]
