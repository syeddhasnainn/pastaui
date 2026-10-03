import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

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
          updatedAt: '1m 12s',
        },
        {
          id: 'index',
          label: 'Index the component catalog',
          detail: '70 pages indexed',
          status: 'complete',
          updatedAt: '4m ago',
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

const TOTAL_FILES = 3700
const START_FILES = 1240
const FILES_PER_TICK = 140
const VERIFY_PER_TICK = 0.08

function JobProgressPreview() {
  const [files, setFiles] = useState(START_FILES)
  const [verify, setVerify] = useState(0)
  const done = files >= TOTAL_FILES && verify >= 1

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        if (done) {
          setFiles(START_FILES)
          setVerify(0)
        } else if (files < TOTAL_FILES) {
          setFiles((current) => Math.min(current + FILES_PER_TICK, TOTAL_FILES))
        } else {
          setVerify((current) => Math.min(current + VERIFY_PER_TICK, 1))
        }
      },
      done ? 2000 : 300,
    )
    return () => window.clearTimeout(timer)
  }, [done, files, verify])

  const embedding = files < TOTAL_FILES
  const remainingWeight = 4 * (1 - files / TOTAL_FILES) + 2 * (1 - verify)
  const minutes = Math.ceil(remainingWeight / 2)

  return (
    <JobProgress
      className="w-full max-w-lg"
      eta={done ? undefined : `${Math.max(1, minutes)} min`}
      stages={[
        { id: 'scan', label: 'Scan the repository', status: 'complete', weight: 1 },
        { id: 'index', label: 'Build the semantic index', status: 'complete', weight: 2 },
        {
          id: 'embed',
          label: 'Generate embeddings',
          status: embedding ? 'running' : 'complete',
          weight: 4,
          progress: files / TOTAL_FILES,
          detail: `${files.toLocaleString()} of ${TOTAL_FILES.toLocaleString()} files`,
        },
        {
          id: 'verify',
          label: 'Verify retrieval quality',
          status: embedding ? 'pending' : verify >= 1 ? 'complete' : 'running',
          weight: 2,
          progress: verify,
          detail: `${Math.round(verify * 24)} of 24 test queries`,
        },
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
      onAdd={() =>
        setItems((current) => [
          ...current,
          {
            id: `memory-${current.length + 1}`,
            category: 'Style',
            value: 'Avoids borders on buttons',
          },
        ])
      }
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
      restrictions={['Access anything outside this repository']}
      scope={[
        <>
          Read and edit files in <code>src/components</code>
        </>,
        <>
          Run <code>pnpm</code> validation commands
        </>,
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
