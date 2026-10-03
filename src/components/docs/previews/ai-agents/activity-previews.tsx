import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'

import { AgentActivity } from '#/components/ai/agent-activity'
import { ImageGenerationLoader } from '#/components/ai/image-generation-loader'
import { ReasoningText } from '#/components/ai/reasoning-text'
import { ThinkingShimmer } from '#/components/ai/thinking-shimmer'

interface PreviewProps {
  slug: string
}

const generatedGreenhouse =
  'https://images.unsplash.com/photo-1718465280370-7074c2d6404f?auto=format&fit=crop&h=960&q=85&w=960'

const reasoningSentences = [
  'Reviewing the component brief and isolating the interaction states that make the reasoning readable.',
  'The label should shimmer while work is active, then fold into an elapsed-time summary.',
  'New reasoning lines enter on a quiet cadence while the viewport follows the latest step.',
  'Once the stream reaches its cap, soft masks keep both edges from feeling abruptly clipped.',
  'After completion, the disclosure stays compact but remains available for inspection.',
  'Matching the animation to Pasta UI tokens and verifying both light and dark themes.',
]

function ImageGenerationLoaderPreview() {
  const [generation, setGeneration] = useState(0)
  const [progress, setProgress] = useState(18)
  const isComplete = progress >= 100

  useEffect(() => {
    if (isComplete) return

    const timer = window.setInterval(
      () => setProgress((current) => Math.min(current + 2, 100)),
      420,
    )

    return () => window.clearInterval(timer)
  }, [generation, isComplete])

  function restartGeneration() {
    setProgress(18)
    setGeneration((current) => current + 1)
  }

  return (
    <ImageGenerationLoader
      alt="A glass greenhouse reflecting the sunset"
      className="max-w-72"
      imageUrl={generatedGreenhouse}
      key={generation}
      onEdit={restartGeneration}
      onShare={() => void navigator.clipboard.writeText(window.location.href)}
      progress={progress}
      prompt="A small glass greenhouse reflecting the last light of sunset"
      status={isComplete ? 'complete' : 'generating'}
    />
  )
}

function AgentActivityPreview() {
  return (
    <AgentActivity
      className="w-full max-w-lg"
      items={[
        {
          id: '1',
          label: 'Inspected the component inventory',
          status: 'complete',
        },
        {
          id: '2',
          label: 'Searched AI-focused registries',
          detail: '576 directory items compared',
          status: 'complete',
        },
        {
          id: '3',
          label: 'Authoring approval and execution surfaces',
          detail: '4 of 7 surfaces drafted',
          status: 'running',
        },
        { id: '4', label: 'Run production verification', status: 'waiting' },
      ]}
    />
  )
}

function ReasoningTextPreview() {
  return <ReasoningText sentences={reasoningSentences} />
}

function ThinkingShimmerPreview() {
  return <ThinkingShimmer label="Reviewing 576 registry components" />
}

const activityPreviews: Record<string, ComponentType> = {
  'image-generation-loader': ImageGenerationLoaderPreview,
  'agent-activity': AgentActivityPreview,
  'reasoning-text': ReasoningTextPreview,
  'thinking-shimmer': ThinkingShimmerPreview,
}

export function AiActivityPreview({ slug }: PreviewProps) {
  const Preview = activityPreviews[slug]

  return Preview ? <Preview /> : null
}
