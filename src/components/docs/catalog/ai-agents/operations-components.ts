import { createAiDocument } from './create-ai-document'

export const aiOperationsComponents = [
  createAiDocument({
    slug: 'background-runs',
    name: 'Background Runs',
    description: 'Ongoing and completed agent jobs collected in one actionable inbox.',
    usage: `import { BackgroundRuns } from "@/components/ai/background-runs"

export function Example() {
  return <BackgroundRuns items={runs} onCancel={cancelRun} />
}`,
    source: `<section>
  <RunSummary active={active} />
  {items.map(item => <BackgroundRun item={item} />)}
</section>`,
    api: [
      {
        name: 'items',
        type: 'BackgroundRun[]',
        defaultValue: '—',
        description: 'Provides queued, running, failed, and completed jobs.',
      },
      {
        name: 'onCancel',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Cancels an active run.',
      },
      {
        name: 'onOpen',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Opens a run or its result.',
      },
    ],
  }),
  createAiDocument({
    slug: 'job-progress',
    name: 'Job Progress',
    description:
      'A weighted multi-stage progress surface for work measured in minutes rather than seconds.',
    usage: `import { JobProgress } from "@/components/ai/job-progress"

export function Example() {
  return <JobProgress title="Index repository" stages={stages} eta="2 min" />
}`,
    source: `<section>
  <JobSummary progress={progress} eta={eta} />
  <WeightedProgress stages={stages} />
  <StageList stages={stages} />
</section>`,
    api: [
      {
        name: 'stages',
        type: 'JobStage[]',
        defaultValue: '—',
        description: 'Defines weighted pending, running, and completed stages.',
      },
      {
        name: 'eta',
        type: 'string',
        defaultValue: '—',
        description: 'Displays expected remaining time.',
      },
      {
        name: 'onCancel',
        type: '() => void',
        defaultValue: '—',
        description: 'Cancels the long-running job.',
      },
    ],
  }),
  createAiDocument({
    slug: 'connection-state',
    name: 'Connection State',
    description:
      'Clear connected, reconnecting, resumed, and offline states for resumable agent streams.',
    usage: `import { ConnectionState } from "@/components/ai/connection-state"

export function Example() {
  return <ConnectionState state="reconnecting" detail="The run continues on the server" />
}`,
    source: `<div aria-live="polite" data-state={state}>
  <ConnectionIcon state={state} />
  <ConnectionCopy state={state} />
</div>`,
    api: [
      {
        name: 'state',
        type: 'connected | offline | reconnected | reconnecting',
        defaultValue: '—',
        description: 'Selects the connection state and message.',
      },
      {
        name: 'detail',
        type: 'string',
        defaultValue: '—',
        description: 'Adds recovery or server-state context.',
      },
      {
        name: 'onRetry',
        type: '() => void',
        defaultValue: '—',
        description: 'Retries an offline connection.',
      },
    ],
  }),
  createAiDocument({
    slug: 'cost-meter',
    name: 'Cost Meter',
    description: 'Run cost split by model or task and compared against an optional session budget.',
    usage: `import { CostMeter } from "@/components/ai/cost-meter"

export function Example() {
  return <CostMeter items={costs} budget={0.10} />
}`,
    source: `return (
  <section>
    <CostSummary total={total} budget={budget} />
    {items.map(item => <CostRow item={item} />)}
  </section>
)`,
    api: [
      {
        name: 'items',
        type: 'CostItem[]',
        defaultValue: '—',
        description: 'Provides cost and token attribution.',
      },
      {
        name: 'budget',
        type: 'number',
        defaultValue: '—',
        description: 'Adds a session budget comparison.',
      },
      {
        name: 'currency',
        type: 'string',
        defaultValue: '$',
        description: 'Sets the displayed currency symbol.',
      },
    ],
  }),
  createAiDocument({
    slug: 'context-breakdown',
    name: 'Context Breakdown',
    description:
      'Where an agent context window went, with token attribution and remaining capacity.',
    usage: `import { ContextBreakdown } from "@/components/ai/context-breakdown"

export function Example() {
  return <ContextBreakdown segments={segments} limit={128000} />
}`,
    source: `<section>
  <ContextSummary used={used} limit={limit} />
  <SegmentedMeter segments={segments} />
  <ContextLegend segments={segments} />
</section>`,
    api: [
      {
        name: 'segments',
        type: 'ContextSegment[]',
        defaultValue: '—',
        description: 'Provides token counts by context source.',
      },
      {
        name: 'limit',
        type: 'number',
        defaultValue: '—',
        description: 'Defines the full model context window.',
      },
    ],
  }),
  createAiDocument({
    slug: 'memory',
    name: 'Memory',
    description: 'Visible, removable facts an agent retains about the user or ongoing work.',
    usage: `import { Memory } from "@/components/ai/memory"

export function Example() {
  return <Memory items={memories} onRemove={forget} />
}`,
    source: `<section>
  <MemoryHeader count={items.length} />
  {items.map(item => <MemoryChip item={item} />)}
</section>`,
    api: [
      {
        name: 'items',
        type: 'MemoryItem[]',
        defaultValue: '—',
        description: 'Provides categorized remembered facts.',
      },
      {
        name: 'onRemove',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Forgets a selected fact.',
      },
      {
        name: 'onAdd',
        type: '() => void',
        defaultValue: '—',
        description: 'Starts a new memory flow.',
      },
    ],
  }),
  createAiDocument({
    slug: 'permission-grant',
    name: 'Permission Grant',
    description:
      'A capability-level consent surface that explains reach and duration before access is granted.',
    usage: `import { PermissionGrant } from "@/components/ai/permission-grant"

export function Example() {
  return <PermissionGrant capability="Repository write" scope={scope} description="…" />
}`,
    source: `<section>
  <CapabilityDetails />
  <ScopeList scope={scope} />
  <GrantActions />
</section>`,
    api: [
      {
        name: 'capability',
        type: 'string',
        defaultValue: '—',
        description: 'Names the requested ongoing capability.',
      },
      {
        name: 'scope',
        type: 'string[]',
        defaultValue: '—',
        description: 'Spells out the reach of the grant.',
      },
      {
        name: 'duration',
        type: 'string',
        defaultValue: 'This session',
        description: 'States how long access lasts.',
      },
    ],
  }),
  createAiDocument({
    slug: 'reasoning-effort',
    name: 'Reasoning Effort',
    description: 'A compact dropdown for choosing how much reasoning power a response should use.',
    usage: `import { ReasoningEffort } from "@/components/ai/reasoning-effort"

export function Example() {
  return <ReasoningEffort value={1} onChange={setEffort} />
}`,
    source: `<Popover>
  <PopoverTrigger>{effortLabel}</PopoverTrigger>
  <PopoverContent>
    <Slider min={0} max={4} step={1} value={value} onValueChange={onChange} />
  </PopoverContent>
</Popover>`,
    api: [
      {
        name: 'value',
        type: 'number',
        defaultValue: '—',
        description: 'Controls one of five reasoning-effort levels from 0 to 4.',
      },
      {
        name: 'onChange',
        type: '(value: number) => void',
        defaultValue: '—',
        description: 'Updates the selected reasoning budget.',
      },
    ],
  }),
]
