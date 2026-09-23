import type { ComponentType } from 'react'
import { useState } from 'react'

import { ApprovalCard } from '#/components/ai/approval-card'
import { CodeBlock } from '#/components/ai/code-block'
import { FileDiff } from '#/components/ai/file-diff'
import { TodoList } from '#/components/ai/todo-list'
import { ToolApproval } from '#/components/ai/tool-approval'
import { ToolResult } from '#/components/ai/tool-result'
import { ToolError } from '#/components/ai/tool-error'

interface PreviewProps {
  slug: string
}

function TodoListPreview() {
  return (
    <TodoList
      className="w-full max-w-lg"
      title="Build agent components"
      items={[
        { id: '1', label: 'Research registry patterns', status: 'complete' },
        { id: '4', label: 'Define design tokens', status: 'complete' },
        {
          id: '2',
          label: 'Author the component API',
          status: 'in-progress',
        },
        { id: '3', label: 'Verify keyboard interactions', status: 'pending' },
        { id: '5', label: 'Review responsive layouts', status: 'pending' },
      ]}
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

function FileDiffPreview() {
  return (
    <FileDiff
      className="w-full max-w-xl"
      filename="src/components/ai/tool-result.tsx"
      lines={[
        {
          content: 'function Message({ children }) {',
          oldNumber: 12,
          newNumber: 12,
          type: 'context',
        },
        { content: '  return <div>{children}</div>', oldNumber: 13, type: 'deletion' },
        { content: '  return <article className="group">', newNumber: 13, type: 'addition' },
        {
          content: '    <MessageBubble>{children}</MessageBubble>',
          newNumber: 14,
          type: 'addition',
        },
        { content: '  </article>', newNumber: 15, type: 'addition' },
        { content: '}', oldNumber: 14, newNumber: 16, type: 'context' },
      ]}
    />
  )
}

function ToolResultPreview() {
  return (
    <ToolResult
      className="w-full max-w-lg"
      defaultOpen
      duration="1.8s"
      name="Search component catalog"
      output={<pre>33 matches across 7 component groups</pre>}
      summary="Found the current implementation set"
    />
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
