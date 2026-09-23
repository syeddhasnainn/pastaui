import { createAiDocument } from './create-ai-document'

export const aiBackgroundWorkComponents = [
  createAiDocument({
    slug: 'background-inbox',
    name: 'Background Inbox',
    description: 'Work still running elsewhere and completed results waiting to be collected.',
    usage: `import { BackgroundInbox } from "@/components/ai/background-inbox"

export function Example() {
  return <BackgroundInbox items={jobs} onSelect={openResult} />
}`,
    source: `<section>
  <InboxSummary ready={readyCount} />
  {items.map(item => <BackgroundInboxItem item={item} />)}
</section>`,
    api: [
      {
        name: 'items',
        type: 'BackgroundInboxItem[]',
        defaultValue: '—',
        description: 'Provides result identity, lifecycle state, and recency.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Opens a completed or running item.',
      },
      {
        name: 'onDismiss',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Clears an item from the inbox.',
      },
    ],
  }),
  createAiDocument({
    slug: 'tool-timeline',
    name: 'Tool Timeline',
    description: 'A compact narrative of the verbs, targets, state, and timing in an agent run.',
    usage: `import { ToolTimeline } from "@/components/ai/tool-timeline"

export function Example() {
  return <ToolTimeline items={events} summary="6 files changed" />
}`,
    source: `<ol>
  {items.map(item => <ToolTimelineEvent item={item} />)}
</ol>`,
    api: [
      {
        name: 'items',
        type: 'ToolTimelineItem[]',
        defaultValue: '—',
        description: 'Provides ordered tool actions and execution state.',
      },
      {
        name: 'summary',
        type: 'string',
        defaultValue: '—',
        description: 'Summarizes the run outcome.',
      },
    ],
  }),
  createAiDocument({
    slug: 'quota-banner',
    name: 'Quota Banner',
    description: 'Usage remaining, reset timing, and an upgrade path without hiding the limit.',
    usage: `import { QuotaBanner } from "@/components/ai/quota-banner"

export function Example() {
  return <QuotaBanner used={742} limit={1000} resetsAt="Oct 1" />
}`,
    source: `<aside>
  <QuotaSummary used={used} limit={limit} />
  <QuotaProgress value={used / limit} />
  <UpgradeAction />
</aside>`,
    api: [
      {
        name: 'used / limit',
        type: 'number',
        defaultValue: '—',
        description: 'Defines usage and the maximum allowance.',
      },
      {
        name: 'resetsAt',
        type: 'string',
        defaultValue: '—',
        description: 'Explains when the quota replenishes.',
      },
      {
        name: 'onUpgrade',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens the plan or usage settings.',
      },
    ],
  }),
]
