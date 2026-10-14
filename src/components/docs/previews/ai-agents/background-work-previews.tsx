import type { ComponentType } from 'react'
import { useState } from 'react'

import { BackgroundInbox } from '#/components/ai/background-inbox'
import { QuotaBanner } from '#/components/ai/quota-banner'
import { ToolTimeline } from '#/components/ai/tool-timeline'
import * as React from 'react'
import { type ToolTimelineItem } from '#/components/ai/tool-timeline'

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

const toolTimelineSteps: (Omit<ToolTimelineItem, 'status' | 'time'> & { time: string })[] = [
  {
    id: 'search',
    verb: 'Searched',
    target: 'assistant-ui registry',
    detail: 'Found 31 search and retrieval patterns.',
    time: '0.8s',
    input: '{ "query": "retrieval patterns", "limit": 40 }',
    output: '31 results · top match: citations.tsx',
  },
  {
    id: 'create',
    verb: 'Created',
    target: 'background-inbox.tsx',
    detail: 'Authored locally with Pasta UI tokens.',
    time: '1.4s',
    input: '{ "path": "src/components/ai/background-inbox.tsx" }',
    output: 'Wrote 213 lines',
  },
  {
    id: 'verify',
    verb: 'Verified',
    target: 'documentation routes',
    detail: '116 routes returned 200.',
    time: '3.2s',
    input: 'pnpm test:routes',
    output: '116 passed, 0 failed',
  },
  {
    id: 'preview',
    verb: 'Captured',
    target: 'visual states',
    detail: 'Light and dark screenshots saved.',
    time: '2.1s',
  },
]

function ToolTimelinePreview() {
  const [done, setDone] = React.useState(2)
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        setDone((value) => (value > toolTimelineSteps.length ? 0 : value + 1))
        setTick(0)
      },
      done > toolTimelineSteps.length ? 3000 : 1800,
    )
    return () => clearTimeout(timer)
  }, [done])

  React.useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 0.1), 100)
    return () => clearInterval(timer)
  }, [])

  const items: ToolTimelineItem[] = toolTimelineSteps.map((step, index) => {
    const status = index < done ? 'complete' : index === done ? 'running' : 'pending'
    return {
      ...step,
      detail: status === 'complete' ? step.detail : undefined,
      output: status === 'complete' ? step.output : undefined,
      status,
      time:
        status === 'complete'
          ? step.time
          : status === 'running'
            ? `${tick.toFixed(1)}s`
            : undefined,
    }
  })
  const files = items.filter((item) => item.status === 'complete' && item.verb === 'Created').length
  const running = items.some((item) => item.status === 'running')

  return (
    <ToolTimeline
      className="w-full max-w-lg"
      defaultOpenId="search"
      items={items}
      summary={
        running ? `${files} file · 1 check running` : `${toolTimelineSteps.length} calls finished`
      }
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
