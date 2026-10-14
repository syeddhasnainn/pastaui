import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { ApprovalCard } from '#/components/ai/approval-card'
import { CodeBlock } from '#/components/ai/code-block'
import { FileDiff } from '#/components/ai/file-diff'
import { TodoList, type AgentTodoItem } from '#/components/ai/todo-list'
import { ToolApproval } from '#/components/ai/tool-approval'
import { ToolResult, type ToolResultProps } from '#/components/ai/tool-result'
import { ToolError } from '#/components/ai/tool-error'
import * as React from 'react'
import { type DiffHunk } from '#/components/ai/file-diff'

interface PreviewProps {
  slug: string
}

const todoListSteps = [
  { id: '1', label: 'Research registry patterns', detail: 'Read 12 shadcn registries' },
  { id: '2', label: 'Define design tokens', detail: 'Mapped colors, radius and shadows' },
  { id: '3', label: 'Author the component API', detail: 'Typing props for 3 variants' },
  { id: '4', label: 'Verify keyboard interactions', detail: 'Tabbing through every control' },
  { id: '5', label: 'Review responsive layouts', detail: 'Checking 375px to 1440px' },
]

function TodoListPreview() {
  const [done, setDone] = React.useState(2)
  const [manual, setManual] = React.useState<Record<string, AgentTodoItem['status']> | null>(null)

  React.useEffect(() => {
    if (manual) return
    const timer = setTimeout(
      () => setDone((value) => (value >= todoListSteps.length ? 0 : value + 1)),
      done >= todoListSteps.length ? 2600 : 1600,
    )
    return () => clearTimeout(timer)
  }, [done, manual])

  const auto = (index: number): AgentTodoItem['status'] =>
    index < done ? 'complete' : index === done ? 'in-progress' : 'pending'

  const items: AgentTodoItem[] = todoListSteps.map((step, index) => ({
    ...step,
    status: manual?.[step.id] ?? auto(index),
  }))

  return (
    <TodoList
      className="w-full max-w-lg"
      items={items}
      onItemToggle={(id) =>
        setManual(() => {
          const current = Object.fromEntries(items.map((item) => [item.id, item.status]))
          current[id] = current[id] === 'complete' ? 'pending' : 'complete'
          return current
        })
      }
      title="Build agent components"
    />
  )
}

function CodeBlockPreview() {
  return (
    <CodeBlock
      className="w-full max-w-lg"
      code={`export function AgentStatus({ active }: Props) {
  return (
    <span data-active={active}>
      {active ? "Working" : "Ready"}
    </span>
  )
}`}
      filename="agent-status.tsx"
      highlightLines={[3, 4]}
      language="tsx"
    />
  )
}

function ApprovalCardPreview() {
  const [status, setStatus] = useState<'approved' | 'denied' | 'pending'>('pending')

  return (
    <ApprovalCard
      className="w-full max-w-lg"
      description="The agent will publish 14 locally authored components to the public registry."
      onDecision={(decision) => setStatus(decision === 'approve' ? 'approved' : 'denied')}
      status={status}
      title="Publish this release?"
    />
  )
}

const fileDiffHunks: DiffHunk[] = [
  {
    id: 'imports',
    header: '@@ -1,4 +1,5 @@',
    lines: [
      { content: "import * as React from 'react'", oldNumber: 1, newNumber: 1, type: 'context' },
      {
        content: "import { MessageBubble } from './message-bubble'",
        newNumber: 2,
        type: 'addition',
      },
      { content: "import { cn } from 'cn'", oldNumber: 2, newNumber: 3, type: 'context' },
    ],
  },
  {
    id: 'render',
    header: '@@ -12,4 +13,6 @@ function Message',
    hidden: [
      { content: 'interface MessageProps {', oldNumber: 4, newNumber: 5, type: 'context' },
      { content: '  children: React.ReactNode', oldNumber: 5, newNumber: 6, type: 'context' },
      { content: '}', oldNumber: 6, newNumber: 7, type: 'context' },
    ],
    lines: [
      {
        content: 'function Message({ children }: MessageProps) {',
        oldNumber: 12,
        newNumber: 13,
        type: 'context',
      },
      { content: '  return <div>{children}</div>', oldNumber: 13, type: 'deletion' },
      { content: '  return (', newNumber: 14, type: 'addition' },
      { content: '    <article className="group">', newNumber: 15, type: 'addition' },
      {
        content: '      <MessageBubble>{children}</MessageBubble>',
        newNumber: 16,
        type: 'addition',
      },
      { content: '    </article>', newNumber: 17, type: 'addition' },
      { content: '  )', newNumber: 18, type: 'addition' },
      { content: '}', oldNumber: 14, newNumber: 19, type: 'context' },
    ],
  },
]

function FileDiffPreview() {
  return (
    <FileDiff
      className="w-full max-w-xl"
      filename="src/components/ai/message.tsx"
      hunks={fileDiffHunks}
    />
  )
}

type toolResultCall = Pick<ToolResultProps, 'status' | 'summary'> & { duration?: string }

const toolResultPhases: { calls: toolResultCall[]; ms: number }[] = [
  { ms: 1300, calls: [{ status: 'running', summary: 'Searching 576 registry components' }] },
  {
    ms: 1000,
    calls: [
      { status: 'complete', summary: 'Found 33 matches across 7 groups', duration: '1.3s' },
      { status: 'running', summary: 'Reading src/components/ui' },
    ],
  },
  {
    ms: 1500,
    calls: [
      { status: 'complete', summary: 'Found 33 matches across 7 groups', duration: '1.3s' },
      { status: 'complete', summary: 'Read 214 lines from 3 files', duration: '1.0s' },
      { status: 'running', summary: 'Building preview deployment' },
    ],
  },
  {
    ms: 1600,
    calls: [
      { status: 'complete', summary: 'Found 33 matches across 7 groups', duration: '1.3s' },
      { status: 'complete', summary: 'Read 214 lines from 3 files', duration: '1.0s' },
      { status: 'error', summary: 'Build timed out after 30s', duration: '1.5s' },
    ],
  },
  {
    ms: 1400,
    calls: [
      { status: 'complete', summary: 'Found 33 matches across 7 groups', duration: '1.3s' },
      { status: 'complete', summary: 'Read 214 lines from 3 files', duration: '1.0s' },
      { status: 'running', summary: 'Retrying with a clean cache' },
    ],
  },
  {
    ms: 4000,
    calls: [
      { status: 'complete', summary: 'Found 33 matches across 7 groups', duration: '1.3s' },
      { status: 'complete', summary: 'Read 214 lines from 3 files', duration: '1.0s' },
      { status: 'complete', summary: 'Live at preview.pastaui.dev', duration: '2.9s' },
    ],
  },
]

const toolResultNames = ['Search component catalog', 'Read source files', 'Deploy preview']

const toolResultMatches = [
  ['tool-result.tsx', 'ai-agents'],
  ['tool-group.tsx', 'ai-agents'],
  ['tool-approval.tsx', 'ai-agents'],
]

function ToolResultPreview() {
  const [phase, setPhase] = useState(2)
  const [elapsed, setElapsed] = useState(0)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = (phase + 1) % toolResultPhases.length
      setElapsed(0)
      if (next <= 1) setOpen(next === 1)
      setPhase(next)
    }, toolResultPhases[phase].ms)
    const tick = setInterval(() => setElapsed((value) => value + 0.1), 100)
    return () => {
      clearTimeout(timer)
      clearInterval(tick)
    }
  }, [phase])

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-3">
      <AnimatePresence initial={false}>
        {toolResultPhases[phase].calls.map((call, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: 10 }}
            key={toolResultNames[index]}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <ToolResult
              duration={call.status === 'running' ? `${elapsed.toFixed(1)}s` : call.duration}
              copyText={
                index === 0 ? toolResultMatches.map(([file]) => file).join('\n') : undefined
              }
              error={
                call.status === 'error'
                  ? 'vite build exceeded the 30s limit while bundling 1,284 modules.'
                  : undefined
              }
              input={
                index === 0 ? '{ "query": "tool", "group": "ai-agents", "limit": 40 }' : undefined
              }
              name={toolResultNames[index]}
              onRetry={call.status === 'error' ? () => setPhase(4) : undefined}
              onOpenChange={index === 0 ? setOpen : undefined}
              open={index === 0 ? open : undefined}
              output={
                index === 0 ? (
                  <ul className="space-y-1">
                    {toolResultMatches.map(([file, group], row) => (
                      <motion.li
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between"
                        initial={{ opacity: 0, x: -6 }}
                        key={file}
                        transition={{ delay: 0.15 + row * 0.08 }}
                      >
                        <span>{file}</span>
                        <span>{group}</span>
                      </motion.li>
                    ))}
                    <li className="pt-1">+ 30 more</li>
                  </ul>
                ) : undefined
              }
              status={call.status}
              summary={call.summary}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToolApprovalPreview() {
  return (
    <ToolApproval
      className="w-full max-w-lg"
      command="pnpm build"
      description="Run the production build to validate the newly generated component routes."
      scope="This command only"
      tool="Terminal"
    />
  )
}

function ToolErrorPreview() {
  const [action, setAction] = useState('')
  return (
    <div className="w-full max-w-xl space-y-3">
      <ToolError
        message="Your session expired. Reconnect to continue from where you left off."
        tool="Workspace"
        onFix={() => setAction('Connection settings opened.')}
        onRetry={() => setAction('Retry requested.')}
      />
      {action && (
        <output className="block text-xs leading-5 text-muted-foreground">{action}</output>
      )}
    </div>
  )
}

const executionPreviews: Record<string, ComponentType> = {
  'todo-list': TodoListPreview,
  'code-block': CodeBlockPreview,
  'approval-card': ApprovalCardPreview,
  'file-diff': FileDiffPreview,
  'tool-result': ToolResultPreview,
  'tool-approval': ToolApprovalPreview,
  'tool-error': ToolErrorPreview,
}

export function AiExecutionPreview({ slug }: PreviewProps) {
  const Preview = executionPreviews[slug]

  return Preview ? <Preview /> : null
}
