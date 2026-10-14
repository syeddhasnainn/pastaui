import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

import { AgentStatus } from '#/components/ai/agent-status'
import { TaskCard } from '#/components/ai/task-card'
import { ToolGroup, type ToolGroupItem } from '#/components/ai/tool-group'

interface PreviewProps {
  slug: string
}

function AgentStatusPreview() {
  return (
    <AgentStatus
      className="w-full max-w-lg"
      detail="Building the answer-format collection"
      tasks={[
        { id: 'research', label: 'Audit registry metadata', status: 'complete' },
        { id: 'components', label: 'Author eight components', status: 'running' },
        { id: 'verify', label: 'Verify every documentation route', status: 'pending' },
      ]}
      title="Preparing the next Pasta UI collection"
    />
  )
}

function TaskCardPreview() {
  return (
    <TaskCard
      agent="Research subagent"
      className="w-full max-w-lg"
      description="Compare the remaining AI-focused registries and remove overlapping patterns."
      duration="3m 42s"
      result="Found 8 distinct answer and execution-detail patterns worth implementing."
      status="complete"
      title="Audit remaining registry patterns"
    />
  )
}

const toolGroupSteps: (Omit<ToolGroupItem, 'status'> & { ms: number })[] = [
  {
    id: 'search',
    name: 'Search the component registry',
    ms: 1300,
    output: '{\n  "query": "tool group",\n  "matches": 12,\n  "top": "@pastaui/tool-group"\n}',
    outputLanguage: 'json',
  },
  { id: 'read', kind: 'file', name: 'Read tool-group.tsx', ms: 900 },
  { id: 'edit', kind: 'file', name: 'Edit tool-group.tsx', ms: 1400 },
  {
    id: 'test',
    kind: 'command',
    name: 'Run pnpm test tool-group',
    ms: 1600,
    output: 'pnpm test tool-group\n24 passed, 0 failed (1.2s)',
    outputLanguage: 'shell',
  },
]

function ToolGroupPreview() {
  const [open, setOpen] = useState(true)
  const [done, setDone] = useState(2)
  const [elapsed, setElapsed] = useState(2.4)
  const finished = done >= toolGroupSteps.length

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (finished) {
          setDone(0)
          setElapsed(0)
        } else setDone((value) => value + 1)
      },
      finished ? 3500 : toolGroupSteps[done].ms,
    )
    return () => clearTimeout(timer)
  }, [done, finished])

  useEffect(() => {
    if (finished) return
    const timer = setInterval(() => setElapsed((value) => value + 0.1), 100)
    return () => clearInterval(timer)
  }, [finished])

  const items: ToolGroupItem[] = toolGroupSteps
    .slice(0, Math.min(done + 1, toolGroupSteps.length))
    .map(({ ms: _ms, output, ...step }, index) => ({
      ...step,
      output: index < done ? output : undefined,
      status: index < done ? 'complete' : 'running',
    }))

  return (
    <div className="flex min-h-[28rem] w-full max-w-lg flex-col gap-4 font-sans text-sm tracking-[-0.05px]">
      <p className="ml-auto w-fit max-w-[85%] rounded-[16px] bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3.5 py-2.5 leading-6 text-primary-foreground dark:bg-none">
        Add a tool group component and make sure the tests pass.
      </p>
      <ToolGroup
        className="w-full"
        duration={`${elapsed.toFixed(1)}s`}
        items={items}
        onOpenChange={setOpen}
        open={open}
        title={
          finished
            ? '4 tools, edited 1 file, ran 1 command'
            : `Working on step ${done + 1} of ${toolGroupSteps.length}`
        }
      />
      <p
        className={`leading-6 font-[450] text-muted-foreground transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${finished ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
      >
        Added the tool group with collapsible outputs. All 24 tests pass.
      </p>
    </div>
  )
}

const taskDetailPreviews: Record<string, ComponentType> = {
  'agent-status': AgentStatusPreview,
  'task-card': TaskCardPreview,
  'tool-group': ToolGroupPreview,
}

export function AiTaskDetailPreview({ slug }: PreviewProps) {
  const Preview = taskDetailPreviews[slug]

  return Preview ? <Preview /> : null
}
