// Vite exposes raw file contents as a default export.
// oxlint-disable-next-line import/default
import toolErrorSource from '#/components/ai/tool-error.tsx?raw'
import { createAiDocument } from './create-ai-document'

export const aiExecutionComponents = [
  createAiDocument({
    slug: 'todo-list',
    name: 'Todo List',
    description: 'A live agent plan with completion counts, task states, and expandable detail.',
    usage: `import { TodoList } from "@/components/ai/todo-list"

export function Example() {
  return <TodoList items={tasks} title="Implementation plan" />
}`,
    source: `<Collapsible defaultOpen>
  <CollapsibleTrigger>{complete}/{items.length}</CollapsibleTrigger>
  <CollapsibleContent>{items.map(renderTask)}</CollapsibleContent>
</Collapsible>`,
    api: [
      {
        name: 'items',
        type: 'AgentTodoItem[]',
        defaultValue: '—',
        description: 'Provides pending, running, and completed tasks.',
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Plan',
        description: 'Names the task collection.',
      },
    ],
  }),
  createAiDocument({
    slug: 'code-block',
    name: 'Code Block',
    description:
      'A muted code surface with line numbers, focused rows, filename metadata, and copy feedback.',
    usage: `import { CodeBlock } from "@/components/ai/code-block"

export function Example() {
  return <CodeBlock code={source} filename="agent.ts" language="tsx" />
}`,
    source: `<figure className="overflow-hidden rounded-md bg-muted text-foreground">
  <figcaption>{filename}<CopyAction /></figcaption>
  <Highlight code={code} language={language} theme={codeTheme}>
    {({ tokens }) => <pre>{renderTokens(tokens)}</pre>}
  </Highlight>
</figure>`,
    api: [
      {
        name: 'code',
        type: 'string',
        defaultValue: '—',
        description: 'Provides the displayed source.',
      },
      {
        name: 'highlightLines',
        type: 'number[]',
        defaultValue: '[]',
        description: 'Emphasizes selected line numbers.',
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Toggles the number gutter.',
      },
    ],
  }),
  createAiDocument({
    slug: 'approval-card',
    name: 'Approval Card',
    description:
      'A human-in-the-loop decision surface for questions, review steps, and consequential actions.',
    usage: `import { ApprovalCard } from "@/components/ai/approval-card"

export function Example() {
  return <ApprovalCard title="Publish these changes?" onDecision={console.log} />
}`,
    source: `<section className="rounded-md p-4 ring-1">
  <ApprovalQuestion />
  <div>{options.map(renderDecision)}</div>
</section>`,
    api: [
      {
        name: 'title',
        type: 'string',
        defaultValue: '—',
        description: 'States the decision being requested.',
      },
      {
        name: 'options',
        type: 'ApprovalOption[]',
        defaultValue: 'Approve / Deny',
        description: 'Provides one or more possible responses.',
      },
      {
        name: 'onDecision',
        type: '(value: string) => void',
        defaultValue: '—',
        description: 'Receives the selected decision.',
      },
    ],
  }),
  createAiDocument({
    slug: 'file-diff',
    name: 'File Diff',
    description:
      'A compact code-change surface with old and new line numbers plus live change counts.',
    usage: `import { FileDiff } from "@/components/ai/file-diff"

export function Example() {
  return <FileDiff filename="button.tsx" lines={changes} />
}`,
    source: `<figure className="overflow-hidden rounded-md ring-1">
  <figcaption>{filename} +{added} −{removed}</figcaption>
  <pre>{lines.map(renderDiffLine)}</pre>
</figure>`,
    api: [
      {
        name: 'filename',
        type: 'string',
        defaultValue: '—',
        description: 'Names the changed file.',
      },
      {
        name: 'lines',
        type: 'DiffLine[]',
        defaultValue: '—',
        description: 'Provides context, addition, and deletion rows.',
      },
      {
        name: 'additions / deletions',
        type: 'number',
        defaultValue: 'derived',
        description: 'Overrides calculated change counts.',
      },
    ],
  }),
  createAiDocument({
    slug: 'tool-result',
    name: 'Tool Result',
    description:
      'An execution disclosure for running, successful, or failed tools with optional raw output.',
    usage: `import { ToolResult } from "@/components/ai/tool-result"

export function Example() {
  return <ToolResult name="Search files" summary="Found 12 matches" output="…" />
}`,
    source: `<Collapsible>
  <CollapsibleTrigger><ToolStatus />{name}{summary}</CollapsibleTrigger>
  <CollapsibleContent>{output}</CollapsibleContent>
</Collapsible>`,
    api: [
      {
        name: 'status',
        type: 'complete | error | running',
        defaultValue: 'complete',
        description: 'Sets the execution state.',
      },
      {
        name: 'summary',
        type: 'string',
        defaultValue: '—',
        description: 'Explains the result in one line.',
      },
      {
        name: 'output',
        type: 'ReactNode',
        defaultValue: '—',
        description: 'Adds expandable raw output.',
      },
    ],
  }),
  createAiDocument({
    slug: 'tool-approval',
    name: 'Tool Approval',
    description: 'A permission gate that shows scope and command detail before an agent tool runs.',
    usage: `import { ToolApproval } from "@/components/ai/tool-approval"

export function Example() {
  return <ToolApproval tool="Terminal" description="Run the build" command="pnpm build" />
}`,
    source: `<section className="overflow-hidden rounded-md ring-1">
  <ToolDetails />
  <PermissionActions />
</section>`,
    api: [
      {
        name: 'tool',
        type: 'string',
        defaultValue: '—',
        description: 'Names the requesting tool.',
      },
      {
        name: 'command',
        type: 'string',
        defaultValue: '—',
        description: 'Shows the exact command or action.',
      },
      {
        name: 'onAllow / onDeny',
        type: 'callbacks',
        defaultValue: '—',
        description: 'Handle the user permission decision.',
      },
    ],
  }),
  createAiDocument({
    slug: 'tool-error',
    name: 'Tool Error',
    description:
      'A recoverable connection failure with a clear explanation and compact recovery actions.',
    usage: `import { ToolError } from "@/components/ai/tool-error"

export function Example({ openConnectionSettings, retry }: {
  openConnectionSettings: () => void
  retry: () => void
}) {
  return (
    <ToolError
      tool="Workspace"
      message="Your session expired. Reconnect to continue from where you left off."
      onFix={openConnectionSettings}
      onRetry={retry}
    />
  )
}`,
    source: toolErrorSource,
    api: [
      {
        name: 'tool',
        type: 'string',
        defaultValue: '—',
        description: 'Names the tool in the default error summary.',
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: '—',
        description: 'Overrides the default connection failure summary.',
      },
      {
        name: 'message',
        type: 'string',
        defaultValue: '—',
        description: 'Explains what happened and what was preserved.',
      },
      {
        name: 'onFix',
        type: '() => void',
        defaultValue: '—',
        description: 'Shows the primary recovery action and handles its selection.',
      },
      {
        name: 'fixLabel',
        type: 'string',
        defaultValue: 'Fix connection',
        description: 'Labels the primary recovery action.',
      },
      {
        name: 'onRetry',
        type: '() => void',
        defaultValue: '—',
        description: 'Shows Retry and handles retrying the failed tool call.',
      },
      {
        name: 'code',
        type: 'string',
        defaultValue: '—',
        description: 'Optional diagnostic error code.',
      },
      {
        name: 'attempts',
        type: 'number',
        defaultValue: '—',
        description: 'Optional attempt count.',
      },
    ],
  }),
]
