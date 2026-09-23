import type { ComponentType } from 'react'
import { useState } from 'react'

import { BackgroundRuns } from '#/components/ai/background-runs'
import { ConnectionState } from '#/components/ai/connection-state'
import { ContextBreakdown } from '#/components/ai/context-breakdown'
import { CostMeter } from '#/components/ai/cost-meter'
import { JobProgress } from '#/components/ai/job-progress'
import { Memory, type MemoryItem } from '#/components/ai/memory'
import { PermissionGrant } from '#/components/ai/permission-grant'
import { ReasoningEffort } from '#/components/ai/reasoning-effort'

interface PreviewProps {
  slug: string
}

function BackgroundRunsPreview() {
  return (
    <BackgroundRuns
      className="w-full max-w-lg"
      items={[
        {
          id: 'audit',
          label: 'Audit authentication flows',
          detail: 'Reviewing 18 routes and 42 server functions',
          progress: 64,
          status: 'running',
          updatedAt: 'Now',
        },
        {
          id: 'index',
          label: 'Index the component catalog',
          detail: '70 pages indexed',
          status: 'complete',
          updatedAt: '4m',
        },
        {
          id: 'tests',
          label: 'Run visual regression tests',
          detail: 'Starts after the audit',
          status: 'queued',
          updatedAt: 'Queued',
        },
      ]}
    />
  )
}

function JobProgressPreview() {
  return (
    <JobProgress
      className="w-full max-w-lg"
      eta="2 min"
      stages={[
        { id: 'scan', label: 'Scan the repository', status: 'complete', weight: 1 },
        { id: 'index', label: 'Build the semantic index', status: 'complete', weight: 2 },
        { id: 'embed', label: 'Generate embeddings', status: 'running', weight: 4 },
        { id: 'verify', label: 'Verify retrieval quality', status: 'pending', weight: 2 },
      ]}
      title="Index repository"
    />
  )
}

function ConnectionStatePreview() {
  return (
    <ConnectionState
      className="w-full max-w-lg"
      detail="The run continues safely on the server"
      state="reconnecting"
    />
  )
}

function CostMeterPreview() {
  return (
    <CostMeter
      budget={0.1}
      className="w-full max-w-lg"
      items={[
        {
          cost: 0.0284,
          id: 'reasoning',
          label: 'Reasoning',
          tokens: 18240,
        },
        {
          cost: 0.0162,
          id: 'generation',
          label: 'Response generation',
          tokens: 4620,
        },
        {
          cost: 0.0078,
          id: 'tools',
          label: 'Tool calls',
          tokens: 2380,
        },
      ]}
    />
  )
}

function ContextBreakdownPreview() {
  return (
    <ContextBreakdown
      className="w-full max-w-lg"
      limit={128000}
      segments={[
        { id: 'conversation', label: 'Conversation', tokens: 28640 },
        { id: 'files', label: 'Project files', tokens: 22180 },
        { id: 'tools', label: 'Tool definitions', tokens: 12480 },
        { id: 'instructions', label: 'Instructions', tokens: 7840 },
      ]}
    />
  )
}

const initialMemories: MemoryItem[] = [
  { id: 'package-manager', category: 'Project', value: 'Uses pnpm' },
  { id: 'design', category: 'Design', value: 'Prefers neutral colors' },
  { id: 'stack', category: 'Stack', value: 'TanStack Start and Tailwind CSS' },
]

function MemoryPreview() {
  const [items, setItems] = useState(initialMemories)

  return (
    <Memory
      className="w-full max-w-lg"
      items={items}
      onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
    />
  )
}

function PermissionGrantPreview() {
  return (
    <PermissionGrant
      capability="repository write access"
      className="w-full max-w-lg"
      description="The coding agent needs permission to edit the files required for this task."
      duration="Until this task ends"
      scope={[
        'Read and edit files in src/components',
        'Run pnpm validation commands',
        'No access outside this repository',
      ]}
    />
  )
}

function ReasoningEffortPreview() {
  const [value, setValue] = useState(1)

  return <ReasoningEffort onChange={setValue} value={value} />
}

const operationsPreviews: Record<string, ComponentType> = {
  'background-runs': BackgroundRunsPreview,
  'job-progress': JobProgressPreview,
  'connection-state': ConnectionStatePreview,
  'cost-meter': CostMeterPreview,
  'context-breakdown': ContextBreakdownPreview,
  memory: MemoryPreview,
  'permission-grant': PermissionGrantPreview,
  'reasoning-effort': ReasoningEffortPreview,
}

export function AiOperationsPreview({ slug }: PreviewProps) {
  const Preview = operationsPreviews[slug]

  return Preview ? <Preview /> : null
}
