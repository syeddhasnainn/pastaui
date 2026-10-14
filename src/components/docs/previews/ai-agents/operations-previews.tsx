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
import * as React from 'react'
import { type BackgroundRun } from '#/components/ai/background-runs'
import { type ConnectionEvent, type ConnectionStatus } from '#/components/ai/connection-state'

interface PreviewProps {
  slug: string
}

const backgroundRunsJobs = [
  {
    id: 'audit',
    label: 'Audit authentication flows',
    detail: 'Reviewing 18 routes and 42 server functions',
    done: '18 routes reviewed, 2 issues found',
  },
  {
    id: 'tests',
    label: 'Run visual regression tests',
    detail: 'Comparing 116 documentation routes',
    done: '116 routes match the baseline',
  },
  {
    id: 'docs',
    label: 'Draft release notes',
    detail: 'Summarizing 24 merged pull requests',
    done: 'Draft ready for review',
  },
]

function BackgroundRunsPreview() {
  const [active, setActive] = React.useState(0)
  const [progress, setProgress] = React.useState(58)
  const [seconds, setSeconds] = React.useState(18)
  const finished = active >= backgroundRunsJobs.length

  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        if (finished) {
          setActive(0)
          setProgress(6)
          setSeconds(1)
        } else if (progress >= 100) {
          setActive((value) => value + 1)
          setProgress(6)
          setSeconds(1)
        } else {
          setProgress((value) => Math.min(100, value + 10))
          setSeconds((value) => value + 1)
        }
      },
      finished ? 2400 : progress >= 100 ? 250 : 220,
    )
    return () => clearTimeout(timer)
  }, [finished, progress])

  const items: BackgroundRun[] = backgroundRunsJobs.map((job, index) => {
    if (index < active || (index === active && progress >= 100))
      return {
        id: job.id,
        label: job.label,
        detail: job.done,
        status: 'complete',
        updatedAt: 'Just now',
      }
    if (index === active)
      return {
        id: job.id,
        label: job.label,
        detail: job.detail,
        progress,
        status: 'running',
        updatedAt: `${seconds}s`,
      }
    if (index === active + 1 && progress >= 100)
      return {
        id: job.id,
        label: job.label,
        detail: job.detail,
        progress: 2,
        status: 'running',
        updatedAt: '0s',
      }
    return {
      id: job.id,
      label: job.label,
      detail: 'Starts after the current run',
      status: 'queued',
      updatedAt: 'Queued',
    }
  })

  return <BackgroundRuns className="w-full max-w-lg" items={items} />
}

const jobProgressTOTAL_FILES = 3700

const jobProgressSTART_FILES = 1240

const jobProgressFILES_PER_TICK = 140

const jobProgressVERIFY_PER_TICK = 0.08

function JobProgressPreview() {
  const [files, setFiles] = useState(jobProgressSTART_FILES)
  const [verify, setVerify] = useState(0)
  const [paused, setPaused] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const done = files >= jobProgressTOTAL_FILES && verify >= 1

  useEffect(() => {
    if (paused || cancelled) return
    const timer = window.setTimeout(
      () => {
        if (done) {
          setFiles(jobProgressSTART_FILES)
          setVerify(0)
        } else if (files < jobProgressTOTAL_FILES) {
          setFiles((current) =>
            Math.min(current + jobProgressFILES_PER_TICK, jobProgressTOTAL_FILES),
          )
        } else {
          setVerify((current) => Math.min(current + jobProgressVERIFY_PER_TICK, 1))
        }
      },
      done ? 2000 : 300,
    )
    return () => window.clearTimeout(timer)
  }, [cancelled, done, files, paused, verify])

  const embedding = files < jobProgressTOTAL_FILES
  const remainingWeight = 4 * (1 - files / jobProgressTOTAL_FILES) + 2 * (1 - verify)
  const minutes = Math.ceil(remainingWeight / 2)

  return (
    <JobProgress
      className="w-full max-w-lg"
      eta={done ? undefined : `${Math.max(1, minutes)} min`}
      onCancel={() => {
        setCancelled(true)
        setTimeout(() => {
          setFiles(jobProgressSTART_FILES)
          setVerify(0)
          setPaused(false)
          setCancelled(false)
        }, 1500)
      }}
      onPausedChange={setPaused}
      paused={paused || cancelled}
      stages={[
        {
          id: 'scan',
          label: 'Scan the repository',
          status: 'complete',
          weight: 1,
          duration: '12s',
        },
        {
          id: 'index',
          label: 'Build the semantic index',
          status: 'complete',
          weight: 2,
          duration: '48s',
        },
        {
          id: 'embed',
          label: 'Generate embeddings',
          status: embedding ? 'running' : 'complete',
          weight: 4,
          duration: '1m 36s',
          progress: files / jobProgressTOTAL_FILES,
          detail: `${files.toLocaleString()} of ${jobProgressTOTAL_FILES.toLocaleString()} files`,
        },
        {
          id: 'verify',
          label: 'Verify retrieval quality',
          status: embedding ? 'pending' : verify >= 1 ? 'complete' : 'running',
          weight: 2,
          duration: '22s',
          progress: verify,
          detail: `${Math.round(verify * 24)} of 24 test queries`,
        },
      ]}
      title={cancelled ? 'Index repository (stopped)' : 'Index repository'}
    />
  )
}

const connectionStateDelay = 4

interface connectionStateFrame {
  attempt?: number
  event?: Omit<ConnectionEvent, 'id'>
  retryIn?: number
  state: ConnectionStatus
  wait: number
}

const connectionStateFrames: connectionStateFrame[] = [
  {
    state: 'connected',
    wait: 1600,
    event: { label: 'Streaming response', state: 'connected', time: '14:02:11' },
  },
  {
    state: 'offline',
    wait: 1400,
    event: { label: 'Socket closed by network', state: 'offline', time: '14:02:13' },
  },
  ...Array.from({ length: connectionStateDelay }, (_, index) => ({
    state: 'reconnecting' as const,
    attempt: 1,
    retryIn: connectionStateDelay - index,
    wait: 1000,
    event:
      index === 0
        ? { label: 'Retrying with backoff', state: 'reconnecting' as const, time: '14:02:14' }
        : undefined,
  })),
  { state: 'reconnecting', attempt: 2, wait: 1400 },
  {
    state: 'reconnected',
    wait: 3200,
    event: { label: 'Resumed from token 1,284', state: 'reconnected', time: '14:02:19' },
  },
]

function ConnectionStatePreview() {
  const [index, setIndex] = React.useState(3)
  const frame = connectionStateFrames[index]
  const events = connectionStateFrames
    .slice(0, index + 1)
    .flatMap((item, position) => (item.event ? [{ ...item.event, id: String(position) }] : []))
    .reverse()

  React.useEffect(() => {
    const timer = setTimeout(
      () => setIndex((value) => (value + 1) % connectionStateFrames.length),
      frame.wait,
    )
    return () => clearTimeout(timer)
  }, [frame.wait])

  return (
    <ConnectionState
      attempt={frame.attempt}
      className="w-full max-w-md"
      defaultLogOpen
      detail={
        frame.state === 'reconnected'
          ? 'No messages were lost'
          : 'The run continues safely on the server'
      }
      events={events}
      maxAttempts={5}
      onRetry={() => setIndex(connectionStateFrames.length - 2)}
      retryDelay={connectionStateDelay}
      retryIn={frame.retryIn}
      state={frame.state}
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

const contextBreakdownBase = { files: 22180, tools: 12480, instructions: 7840 }

function ContextBreakdownPreview() {
  const [conversation, setConversation] = React.useState(64000)
  const [compacting, setCompacting] = React.useState(false)
  const used =
    conversation +
    contextBreakdownBase.files +
    contextBreakdownBase.tools +
    contextBreakdownBase.instructions
  const full = used / 128000 >= 0.86

  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        if (compacting) {
          setConversation(9200)
          setCompacting(false)
        } else if (full) setCompacting(true)
        else setConversation((value) => value + 6400)
      },
      compacting ? 1600 : full ? 2200 : 650,
    )
    return () => clearTimeout(timer)
  }, [compacting, full, conversation])

  return (
    <ContextBreakdown
      className="w-full max-w-lg"
      compacting={compacting}
      limit={128000}
      onCompact={() => setCompacting(true)}
      segments={[
        { id: 'conversation', label: 'Conversation', tokens: conversation },
        { id: 'files', label: 'Project files', tokens: contextBreakdownBase.files },
        { id: 'tools', label: 'Tool definitions', tokens: contextBreakdownBase.tools },
        { id: 'instructions', label: 'Instructions', tokens: contextBreakdownBase.instructions },
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
