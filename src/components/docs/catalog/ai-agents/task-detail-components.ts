import { createAiDocument } from './create-ai-document'

export const aiTaskDetailComponents = [
  createAiDocument({
    slug: 'agent-status',
    name: 'Agent Status',
    description: 'A compact task summary with the current activity and an optional task tray.',
    usage: `import { AgentStatus } from "@/components/ai/agent-status"

export function Example() {
  return <AgentStatus title="Preparing release" detail="Running verification" tasks={tasks} />
}`,
    source: `<section>
  <CurrentAgentStatus title={title} detail={detail} />
  <TaskTray tasks={tasks} />
</section>`,
    api: [
      {
        name: 'title / detail',
        type: 'string',
        defaultValue: '—',
        description: 'Describes the active task and current activity.',
      },
      {
        name: 'tasks',
        type: 'AgentStatusTask[]',
        defaultValue: '[]',
        description: 'Provides the thread task tray.',
      },
    ],
  }),
  createAiDocument({
    slug: 'task-card',
    name: 'Task Card',
    description: 'One delegated task with state, timing, assigned agent, and returned result.',
    usage: `import { TaskCard } from "@/components/ai/task-card"

export function Example() {
  return <TaskCard title="Audit registries" status="complete" result="8 patterns found" />
}`,
    source: `<article>
  <TaskSummary title={title} status={status} />
  {result && <TaskResult>{result}</TaskResult>}
  <TaskMetadata agent={agent} duration={duration} />
</article>`,
    api: [
      {
        name: 'status',
        type: 'complete | queued | running',
        defaultValue: '—',
        description: 'Communicates the delegated task lifecycle.',
      },
      {
        name: 'result',
        type: 'string',
        defaultValue: '—',
        description: 'Displays the returned task summary.',
      },
      {
        name: 'onOpen',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens the full task transcript.',
      },
    ],
  }),
  createAiDocument({
    slug: 'tool-group',
    name: 'Tool Group',
    description: 'Consecutive tool calls collapsed into one readable execution group.',
    usage: `import { ToolGroup } from "@/components/ai/tool-group"

export function Example() {
  return (
    <ToolGroup
      items={calls}
      open={open}
      onOpenChange={setOpen}
      title="4 tools, edited 5 files, ran 2 commands"
    />
  )
}`,
    source: `<section>
  <ToolGroupTrigger summary={title} running={running} />
  {open && (
    <ToolTimeline>
      {items.map(item => <GroupedToolCall item={item} />)}
    </ToolTimeline>
  )}
</section>`,
    api: [
      {
        name: 'items',
        type: 'ToolGroupItem[]',
        defaultValue: '—',
        description: 'Provides consecutive tool calls and their states.',
      },
      {
        name: 'open / onOpenChange',
        type: 'boolean / (open: boolean) => void',
        defaultValue: 'false / —',
        description: 'Controls the grouped-call disclosure.',
      },
      {
        name: 'duration',
        type: 'string',
        defaultValue: '—',
        description: 'Shows the total group duration.',
      },
      {
        name: 'ToolGroupItem.kind',
        type: '"command" | "file" | "tool"',
        defaultValue: '"tool"',
        description: 'Selects the timeline icon for the tool call.',
      },
      {
        name: 'ToolGroupItem.output',
        type: 'string',
        defaultValue: '—',
        description: 'Adds a syntax-highlighted, copyable tool result.',
      },
    ],
  }),
]
