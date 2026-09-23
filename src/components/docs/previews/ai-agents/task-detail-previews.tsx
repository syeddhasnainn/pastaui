import type { ComponentType } from 'react'
import { useState } from 'react'

import { AgentStatus } from '#/components/ai/agent-status'
import { TaskCard } from '#/components/ai/task-card'
import { ToolGroup } from '#/components/ai/tool-group'

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

function ToolGroupPreview() {
  const [open, setOpen] = useState(true)

  return (
    <div className="h-56 w-full max-w-lg">
      <ToolGroup
        className="w-full"
        duration="2.1s"
        items={[
          {
            kind: 'command',
            id: 'search',
            name: 'Search assistant-ui metadata',
            status: 'complete',
          },
          {
            id: 'index',
            name: 'Index matching components',
            status: 'complete',
          },
          {
            kind: 'file',
            id: 'inspect',
            name: 'Inspect current Pasta UI catalog',
            status: 'complete',
          },
          {
            kind: 'command',
            id: 'routes',
            name: 'Verify documentation routes',
            status: 'running',
          },
        ]}
        onOpenChange={setOpen}
        open={open}
        title="4 tools, edited 5 files, ran 2 commands"
      />
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
