import { createAiDocument } from './create-ai-document'

export const imageGenerationLoaderComponent = createAiDocument({
  slug: 'image-generation-loader',
  name: 'Image Generation Loader',
  isNew: true,
  description:
    'A streaming image surface with live progress, a playable Snake diversion, and an in-place completed result.',
  usage: `import { ImageGenerationLoader } from "@/components/ai/image-generation-loader"

export function Example() {
  return (
    <ImageGenerationLoader
      imageUrl="/generated-image.jpg"
      prompt="A quiet editorial workspace"
      status="generating"
      progress={62}
    />
  )
}`,
  source: `<figure className="w-full max-w-[30rem]">
  <div className="relative aspect-square overflow-hidden rounded-md">
    {status === "complete" ? (
      <GeneratedImage src={imageUrl} />
    ) : isPlaying ? (
      <SnakeGame />
    ) : (
      <StreamingImage progress={progress} onClick={() => setIsPlaying(true)} />
    )}
  </div>
</figure>`,
  api: [
    {
      name: 'status',
      type: 'complete | generating | queued',
      defaultValue: 'complete',
      description: 'Sets the generation state.',
    },
    {
      name: 'progress',
      type: 'number',
      defaultValue: '0',
      description: 'Displays refinement progress.',
    },
    {
      name: 'imageUrl',
      type: 'string',
      defaultValue: '—',
      description: 'Displays the completed image.',
    },
    {
      name: 'playable',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Lets people open Snake while generation is in progress.',
    },
    {
      name: 'onEdit',
      type: '() => void',
      defaultValue: '—',
      description: 'Handles the completed-image edit action.',
    },
  ],
})

export const aiActivityComponents = [
  createAiDocument({
    slug: 'agent-activity',
    name: 'Agent Activity',
    description:
      'A chronological stream for reasoning, searches, terminal work, and tool execution.',
    usage: `import { AgentActivity } from "@/components/ai/agent-activity"

export function Example() {
  return <AgentActivity items={activity} />
}`,
    source: `<ol className="space-y-1">
  {items.map(item => <ActivityRow item={item} />)}
</ol>`,
    api: [
      {
        name: 'items',
        type: 'AgentActivityItem[]',
        defaultValue: '—',
        description: 'Provides chronological activity, status, and an optional per-step icon.',
      },
    ],
  }),
  createAiDocument({
    slug: 'reasoning-text',
    name: 'Reasoning Text',
    description:
      'A timed reasoning stream that follows the latest thought, then folds into an inspectable duration summary.',
    usage: `import { ReasoningText } from "@/components/ai/reasoning-text"

export function Example() {
  return <ReasoningText sentences={reasoningSteps} />
}`,
    source: `<ReasoningText
  sentences={reasoningSteps}
  delays={[700, 900, 800, 850, 800, 900]}
/>`,
    api: [
      {
        name: 'sentences',
        type: 'readonly string[]',
        defaultValue: '—',
        description: 'Provides the reasoning steps revealed by the stream.',
      },
      {
        name: 'delays',
        type: 'readonly number[]',
        defaultValue: '[700, 900, 800, 850, 800, 900]',
        description: 'Controls the reveal cadence for each reasoning step.',
      },
      {
        name: 'collapseDelay',
        type: 'number',
        defaultValue: '360',
        description: 'Waits before folding the completed reasoning into its summary.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Keeps completed reasoning expanded by default.',
      },
      {
        name: 'thinkingLabel',
        type: 'string',
        defaultValue: 'Thinking…',
        description: 'Labels the active reasoning state.',
      },
    ],
  }),
  createAiDocument({
    slug: 'thinking-shimmer',
    name: 'Thinking Shimmer',
    description:
      'A quiet live status that keeps the agent current action readable while work continues.',
    usage: `import { ThinkingShimmer } from "@/components/ai/thinking-shimmer"

export function Example() {
  return <ThinkingShimmer label="Reviewing the repository" />
}`,
    source: `<div aria-live="polite" className="flex items-center gap-2 text-sm">
  <SparklesIcon />
  <span className="bg-clip-text text-transparent animate-pulse">{label}</span>
</div>`,
    api: [
      {
        name: 'label',
        type: 'string',
        defaultValue: 'Thinking',
        description: 'Describes the current agent activity.',
      },
    ],
  }),
]
