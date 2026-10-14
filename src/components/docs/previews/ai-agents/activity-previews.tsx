import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'

import { GlobalIcon } from '@solar-icons/react/linear/global'
import { PenNewSquareIcon } from '@solar-icons/react/linear/pen-new-square'
import { ShieldCheckIcon } from '@solar-icons/react/linear/shield-check'
import { Widget4Icon } from '@solar-icons/react/linear/widget-4'
import { AgentActivity } from '#/components/ai/agent-activity'
import { ImageGenerationLoader } from '#/components/ai/image-generation-loader'
import { ReasoningText } from '#/components/ai/reasoning-text'
import { ThinkingShimmer } from '#/components/ai/thinking-shimmer'
import { CheckCircleIcon } from '@solar-icons/react/linear/check-circle'
import * as React from 'react'
import { type AgentActivityItem } from '#/components/ai/agent-activity'

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

const imageLoaderPrompt = 'A small glass greenhouse reflecting the last light of sunset'

function ImageGenerationLoaderPreview() {
  const [generation, setGeneration] = useState(0)
  const [progress, setProgress] = useState(0)
  const isComplete = progress >= 100

  useEffect(() => {
    new Image().src = generatedGreenhouse
  }, [])

  useEffect(() => {
    const timer = isComplete
      ? window.setTimeout(restartGeneration, 5000)
      : window.setTimeout(
          () =>
            setProgress((current) => Math.min(current + 1 + Math.round(Math.random() * 2), 100)),
          progress < 80 ? 90 : 180,
        )
    return () => window.clearTimeout(timer)
  }, [generation, isComplete, progress])

  function restartGeneration() {
    setProgress(0)
    setGeneration((current) => current + 1)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <p className="ml-auto max-w-[85%] rounded-[16px] rounded-br-md bg-muted px-3.5 py-2 text-sm text-muted-foreground">
        {imageLoaderPrompt}
      </p>
      <ImageGenerationLoader
        alt="A glass greenhouse reflecting the sunset"
        className="max-w-80"
        imageUrl={generatedGreenhouse}
        key={generation}
        onEdit={restartGeneration}
        onShare={() => void navigator.clipboard.writeText(window.location.href)}
        progress={progress}
        prompt={imageLoaderPrompt}
        status={isComplete ? 'complete' : 'generating'}
      />
      <p className="text-xs text-muted-foreground">
        {isComplete ? 'Generated in 5.4s · 1024 × 1024' : 'Generating image…'}
      </p>
    </div>
  )
}

const agentActivitySites = ['21st.dev', 'shadcn.io', 'assistant-ui.com', 'pro.pastaui.com']

const agentActivitySteps = [
  {
    id: 'inventory',
    icon: <Widget4Icon />,
    running: 'Inspecting the component inventory',
    done: 'Inspected the component inventory',
    detail: '51 components indexed',
  },
  {
    id: 'search',
    icon: <GlobalIcon />,
    running: 'Searching AI-focused registries',
    done: 'Searched AI-focused registries',
    detail: '576 directory items compared',
  },
  {
    id: 'author',
    icon: <PenNewSquareIcon />,
    running: 'Authoring approval and execution surfaces',
    done: 'Authored approval and execution surfaces',
    detail: '7 surfaces drafted',
  },
  {
    id: 'verify',
    icon: <ShieldCheckIcon />,
    running: 'Running production verification',
    done: 'Verified the production build',
    detail: '116 routes checked',
  },
  {
    id: 'summary',
    icon: <CheckCircleIcon />,
    running: 'Writing the summary',
    done: 'Wrote the summary',
    detail: 'Ready for review',
  },
]

function AgentActivityPreview() {
  const [count, setCount] = React.useState(3)

  React.useEffect(() => {
    const finished = count > agentActivitySteps.length
    const timer = setTimeout(
      () => setCount((value) => (finished ? 1 : value + 1)),
      finished ? 3200 : 1700,
    )
    return () => clearTimeout(timer)
  }, [count])

  const items: AgentActivityItem[] = agentActivitySteps
    .slice(0, Math.min(count, agentActivitySteps.length))
    .map((step, index) => {
      const running = index === count - 1 && count <= agentActivitySteps.length
      return {
        id: step.id,
        icon: step.icon,
        label: running ? step.running : step.done,
        detail: running ? undefined : step.detail,
        status: running ? 'running' : 'complete',
        sources:
          step.id === 'search'
            ? agentActivitySites.map((site) => ({ id: site, label: site, icon: <GlobalIcon /> }))
            : undefined,
      }
    })

  return (
    <div className="min-h-[19rem] w-full max-w-lg">
      <AgentActivity items={items} />
    </div>
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
