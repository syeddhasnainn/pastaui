import type { ComponentType } from 'react'
import { useState } from 'react'

import { BackgroundInbox } from '#/components/ai/background-inbox'
import { QuotaBanner } from '#/components/ai/quota-banner'
import { ToolTimeline } from '#/components/ai/tool-timeline'

interface PreviewProps {
  slug: string
}

function BackgroundInboxPreview() {
  const [hiddenIds, setHiddenIds] = useState<string[]>([])
  const items = [
    {
      id: 'audit',
      title: 'Registry audit complete',
      detail: '8 new product patterns are ready to review.',
      status: 'ready' as const,
      time: 'Just now',
    },
    {
      id: 'visual',
      title: 'Visual regression pass',
      detail: 'Comparing 116 documentation routes.',
      status: 'running' as const,
      time: '2m elapsed',
    },
    {
      id: 'report',
      title: 'Market report',
      detail: 'Waiting for two remaining sources.',
      status: 'waiting' as const,
      time: 'Queued 8m',
    },
  ].filter((item) => !hiddenIds.includes(item.id))

  return (
    <BackgroundInbox
      className="w-full max-w-lg"
      items={items}
      onDismiss={(id) => setHiddenIds((current) => [...current, id])}
    />
  )
}

function ToolTimelinePreview() {
  return (
    <ToolTimeline
      className="w-full max-w-lg"
      items={[
        {
          id: 'search',
          verb: 'Searched',
          target: 'assistant-ui registry',
          detail: 'Found 31 search and retrieval patterns.',
          status: 'complete',
          time: '0.8s',
        },
        {
          id: 'create',
          verb: 'Created',
          target: 'background-inbox.tsx',
          detail: 'Authored locally with Pasta UI tokens.',
          status: 'complete',
          time: '1.4s',
        },
        {
          id: 'verify',
          verb: 'Verifying',
          target: 'documentation routes',
          status: 'running',
          time: '3.2s',
        },
        { id: 'preview', verb: 'Preview', target: 'visual states', status: 'pending' },
      ]}
      summary="1 file · 1 check running"
    />
  )
}

function QuotaBannerPreview() {
  return (
    <QuotaBanner
      className="w-full max-w-xl"
      limit={1000}
      onUpgrade={() => undefined}
      resetsAt="October 1"
      unit="runs"
      used={742}
    />
  )
}

const backgroundWorkPreviews: Record<string, ComponentType> = {
  'background-inbox': BackgroundInboxPreview,
  'tool-timeline': ToolTimelinePreview,
  'quota-banner': QuotaBannerPreview,
}

export function AiBackgroundWorkPreview({ slug }: PreviewProps) {
  const Preview = backgroundWorkPreviews[slug]

  return Preview ? <Preview /> : null
}
