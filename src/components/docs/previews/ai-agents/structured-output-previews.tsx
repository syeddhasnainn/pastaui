import { CheckCircleIcon } from '@solar-icons/react/bold/check-circle'
import { CloseCircleIcon } from '@solar-icons/react/bold/close-circle'
import { MinusCircleIcon } from '@solar-icons/react/bold/minus-circle'
import { RefreshCircleIcon } from '@solar-icons/react/bold/refresh-circle'
import { LikeIcon as LikeBoldIcon } from '@solar-icons/react/bold/like'
import { DislikeIcon as DislikeBoldIcon } from '@solar-icons/react/bold/dislike'
import { AtomIcon } from '@solar-icons/react/linear/atom'
import { BoltIcon } from '@solar-icons/react/linear/bolt'
import { BoltCircleIcon } from '@solar-icons/react/linear/bolt-circle'
import { BoxIcon } from '@solar-icons/react/linear/box'
import { CalendarIcon } from '@solar-icons/react/linear/calendar'
import { ChecklistMinimalisticIcon } from '@solar-icons/react/linear/checklist-minimalistic'
import { ClockCircleIcon } from '@solar-icons/react/linear/clock-circle'
import { CloudIcon } from '@solar-icons/react/linear/cloud'
import { Code2Icon } from '@solar-icons/react/linear/code-2'
import { CpuBoltIcon } from '@solar-icons/react/linear/cpu-bolt'
import { CursorSquareIcon } from '@solar-icons/react/linear/cursor-square'
import { DangerTriangleIcon } from '@solar-icons/react/linear/danger-triangle'
import { DatabaseIcon } from '@solar-icons/react/linear/database'
import { DocumentIcon } from '@solar-icons/react/linear/document'
import { DocumentTextIcon } from '@solar-icons/react/linear/document-text'
import { DollarIcon } from '@solar-icons/react/linear/dollar'
import { FolderIcon } from '@solar-icons/react/linear/folder'
import { GitBranchIcon } from '@solar-icons/react/linear/git-branch'
import { GitCommitIcon } from '@solar-icons/react/linear/git-commit'
import { GlobalIcon } from '@solar-icons/react/linear/global'
import { GraphUpIcon } from '@solar-icons/react/linear/graph-up'
import { HashtagIcon } from '@solar-icons/react/linear/hashtag'
import { HourglassIcon } from '@solar-icons/react/linear/hourglass'
import { LayersIcon } from '@solar-icons/react/linear/layers'
import { LightbulbIcon } from '@solar-icons/react/linear/lightbulb'
import { LikeIcon } from '@solar-icons/react/linear/like'
import { LinkRoundIcon } from '@solar-icons/react/linear/link-round'
import { MagnifierBugIcon } from '@solar-icons/react/linear/magnifier-bug'
import { PulseIcon } from '@solar-icons/react/linear/pulse'
import { RepeatIcon } from '@solar-icons/react/linear/repeat'
import { RulerIcon } from '@solar-icons/react/linear/ruler'
import { ShieldCheckIcon } from '@solar-icons/react/linear/shield-check'
import { ShieldWarningIcon } from '@solar-icons/react/linear/shield-warning'
import { SpeedometerLowIcon } from '@solar-icons/react/linear/speedometer-low'
import { SpeedometerMaxIcon } from '@solar-icons/react/linear/speedometer-max'
import { SpeedometerMiddleIcon } from '@solar-icons/react/linear/speedometer-middle'
import { StarIcon } from '@solar-icons/react/linear/star'
import { StopwatchIcon } from '@solar-icons/react/linear/stopwatch'
import { TargetIcon } from '@solar-icons/react/linear/target'
import { TemperatureIcon } from '@solar-icons/react/linear/temperature'
import { TextFieldIcon } from '@solar-icons/react/linear/text-field'
import { TuningIcon } from '@solar-icons/react/linear/tuning'
import { Tuning2Icon } from '@solar-icons/react/linear/tuning-2'
import { UserCircleIcon } from '@solar-icons/react/linear/user-circle'
import { UsersGroupRoundedIcon } from '@solar-icons/react/linear/users-group-rounded'
import type { ComponentType, ReactNode } from 'react'
import { useState } from 'react'

import { AudioPlayer } from '#/components/ai/audio-player'
import { DataTable, type DataTableColumn } from '#/components/ai/data-table'
import { cn } from 'cn'

interface PreviewProps {
  slug: string
}

function AudioPlayerPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(42)

  return (
    <AudioPlayer
      artworkUrl="https://images.unsplash.com/photo-1718465280370-7074c2d6404f?auto=format&fit=crop&h=160&q=85&w=160"
      className="w-full max-w-lg"
      currentTime={currentTime}
      duration={186}
      isPlaying={isPlaying}
      onChange={setCurrentTime}
      onToggle={() => setIsPlaying((current) => !current)}
      subtitle="Generated briefing · 3:06"
      title="Agent UI landscape"
    />
  )
}

interface AgentRun extends Record<string, string | number> {
  id: string
  agent: string
  model: string
  provider: string
  status: string
  environment: string
  region: string
  trigger: string
  started: string
  duration: number
  steps: number
  toolCalls: number
  retries: number
  errors: number
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  reasoningTokens: number
  contextUsed: number
  cost: number
  ttft: number
  p50: number
  p95: number
  p99: number
  throughput: number
  temperature: number
  topP: number
  maxTokens: number
  promptVersion: string
  branch: string
  commit: string
  user: string
  team: string
  evalScore: number
  accuracy: number
  hallucination: number
  feedback: string
  cacheHit: number
  guardrailFlags: number
  traceSize: number
}

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const random = seeded(42)
const pick = <T,>(items: T[]) => items[Math.floor(random() * items.length)]
const between = (min: number, max: number) => min + random() * (max - min)
const integer = (min: number, max: number) => Math.round(between(min, max))

const models = [
  ['claude-opus-5-5', 'Anthropic'],
  ['claude-sonnet-5-5', 'Anthropic'],
  ['claude-haiku-4-5', 'Anthropic'],
  ['gpt-5', 'OpenAI'],
  ['gemini-3-pro', 'Google'],
] as const

const runs: AgentRun[] = Array.from({ length: 10_000 }, (_, index) => {
  const [model, provider] = pick([...models])
  const inputTokens = integer(4_000, 180_000)
  const outputTokens = integer(400, 12_000)
  const p50 = integer(380, 1_400)

  return {
    id: `run_${(0x3a91 + index * 97).toString(16)}`,
    agent: pick(['Research', 'Code review', 'Support triage', 'Data analyst', 'Planner']),
    model,
    provider,
    status: pick(['Succeeded', 'Succeeded', 'Succeeded', 'Running', 'Failed', 'Cancelled']),
    environment: pick(['Production', 'Staging', 'Preview']),
    region: pick(['us-east-1', 'eu-west-1', 'ap-south-1']),
    trigger: pick(['Schedule', 'Webhook', 'Manual', 'API']),
    started: `Oct ${6 - (index % 5)}, ${String(8 + (index % 12)).padStart(2, '0')}:${String(integer(0, 59)).padStart(2, '0')}`,
    duration: integer(4, 940),
    steps: integer(2, 48),
    toolCalls: integer(0, 64),
    retries: integer(0, 4),
    errors: integer(0, 3),
    inputTokens,
    outputTokens,
    cachedTokens: Math.round(inputTokens * between(0, 0.8)),
    reasoningTokens: integer(0, 24_000),
    contextUsed: Math.round((inputTokens / 200_000) * 100),
    cost: Number(((inputTokens * 3 + outputTokens * 15) / 1_000_000).toFixed(3)),
    ttft: integer(120, 900),
    p50,
    p95: Math.round(p50 * between(1.6, 2.4)),
    p99: Math.round(p50 * between(2.6, 4)),
    throughput: integer(40, 180),
    temperature: pick([0, 0.2, 0.7, 1]),
    topP: pick([0.9, 0.95, 1]),
    maxTokens: pick([4_096, 8_192, 16_384, 32_000]),
    promptVersion: `v${integer(1, 4)}.${integer(0, 12)}`,
    branch: pick(['main', 'feat/tools', 'fix/retries', 'exp/planner']),
    commit: Math.floor(random() * 0xfffffff)
      .toString(16)
      .padStart(7, '0'),
    user: pick(['ana', 'jordan', 'sam', 'riley', 'kai', 'morgan']),
    team: pick(['Platform', 'Growth', 'Support', 'Research']),
    evalScore: Number(between(0.62, 0.98).toFixed(2)),
    accuracy: Number(between(78, 99).toFixed(1)),
    hallucination: Number(between(0, 6).toFixed(1)),
    feedback: pick(['up', 'up', 'down', 'none']),
    cacheHit: integer(0, 92),
    guardrailFlags: integer(0, 2),
    traceSize: Number(between(0.2, 18).toFixed(1)),
  }
})

const agentTones: Record<string, string> = {
  Research: 'bg-violet-500/10 text-violet-700 dark:bg-violet-400/12 dark:text-violet-300',
  'Code review': 'bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300',
  'Support triage': 'bg-pink-500/10 text-pink-700 dark:bg-pink-400/12 dark:text-pink-300',
  'Data analyst': 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300',
  Planner: 'bg-amber-500/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300',
}

function ProviderLogo({ provider }: { provider: string }) {
  if (provider === 'Anthropic')
    return <img alt="" className="size-4 shrink-0" src="/icons/providers/claude.svg" />
  if (provider === 'Google')
    return <img alt="" className="size-3.5 shrink-0" src="/icons/providers/google.svg" />
  return (
    <span aria-hidden="true" className="size-4 shrink-0">
      <img alt="" className="size-4 scale-150 dark:hidden" src="/icons/providers/openai.svg" />
      <img
        alt=""
        className="hidden size-4 scale-150 dark:block"
        src="/icons/providers/openai-dark.svg"
      />
    </span>
  )
}

const statusStyles: Record<string, { icon: ComponentType<{ className?: string }>; tone: string }> =
  {
    Succeeded: {
      icon: CheckCircleIcon,
      tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    },
    Running: { icon: RefreshCircleIcon, tone: 'bg-sky-500/10 text-sky-700 dark:text-sky-300' },
    Failed: { icon: CloseCircleIcon, tone: 'bg-red-500/10 text-red-700 dark:text-red-300' },
    Cancelled: { icon: MinusCircleIcon, tone: 'bg-foreground/6 text-muted-foreground' },
  }

const environmentTone: Record<string, string> = {
  Production: 'text-violet-700 ring-violet-500/25 dark:text-violet-300',
  Staging: 'text-amber-700 ring-amber-500/25 dark:text-amber-300',
  Preview: 'text-sky-700 ring-sky-500/25 dark:text-sky-300',
}

const triggerIcons: Record<string, ComponentType<{ className?: string }>> = {
  Schedule: ClockCircleIcon,
  Webhook: LinkRoundIcon,
  Manual: CursorSquareIcon,
  API: Code2Icon,
}

const avatarTones = [
  'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  'bg-pink-500/15 text-pink-700 dark:text-pink-300',
  'bg-orange-500/15 text-orange-700 dark:text-orange-300',
]

const number = new Intl.NumberFormat('en-US')
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

function Value({ children, unit }: { children: ReactNode; unit?: string }) {
  return (
    <span className="text-foreground/90">
      {children}
      {unit && <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>}
    </span>
  )
}

function Meter({ value, tone }: { value: number; tone: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1 w-10 overflow-hidden rounded-full bg-foreground/8">
        <span
          className={cn('block h-full rounded-full', tone)}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </span>
      <span className="w-8 text-right text-foreground/90">
        {value}
        <span className="text-xs text-muted-foreground">%</span>
      </span>
    </span>
  )
}

function Count({ value, tone }: { value: number; tone: string }) {
  return value === 0 ? (
    <span className="text-muted-foreground/50">0</span>
  ) : (
    <span
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-xs font-medium',
        tone,
      )}
    >
      {value}
    </span>
  )
}

function latencyTone(ms: number) {
  if (ms >= 3_000) return 'text-red-600 dark:text-red-400'
  if (ms >= 2_000) return 'text-amber-600 dark:text-amber-400'
  return 'text-foreground/90'
}

function Latency({ ms }: { ms: number }) {
  return (
    <span className={latencyTone(ms)}>
      {number.format(ms)}
      <span className="ml-0.5 text-xs text-muted-foreground">ms</span>
    </span>
  )
}

const runColumns: DataTableColumn<AgentRun>[] = [
  {
    key: 'id',
    pin: 'left',
    header: 'Run',
    icon: HashtagIcon,
    width: 132,
    cell: (row) => (
      <span className="font-mono text-[12.5px] font-medium text-foreground">{row.id}</span>
    ),
  },
  {
    key: 'agent',
    pin: 'left',
    header: 'Agent',
    icon: CpuBoltIcon,
    width: 168,
    cell: (row) => {
      const tone = agentTones[row.agent]
      return (
        <span
          className={cn('inline-flex h-6 items-center rounded-lg px-2 text-xs font-medium', tone)}
        >
          {row.agent}
        </span>
      )
    },
  },
  {
    key: 'model',
    header: 'Model',
    icon: AtomIcon,
    width: 168,
    cell: (row) => <span className="font-mono text-[12.5px] text-foreground/90">{row.model}</span>,
  },
  {
    key: 'provider',
    header: 'Provider',
    icon: CloudIcon,
    width: 128,
    cell: (row) => (
      <span className="inline-flex items-center gap-2 text-foreground/90">
        <span className="flex size-5 items-center justify-center">
          <ProviderLogo provider={row.provider} />
        </span>
        {row.provider}
      </span>
    ),
  },
  {
    key: 'status',
    pin: 'right',
    header: 'Status',
    icon: PulseIcon,
    width: 132,
    cell: (row) => {
      const { icon: Icon, tone } = statusStyles[row.status]
      return (
        <span
          className={cn(
            'inline-flex h-6 items-center gap-1.5 rounded-full pr-2.5 pl-1.5 text-xs font-medium',
            tone,
          )}
        >
          <Icon
            className={cn(
              'size-3.5',
              row.status === 'Running' &&
                'animate-spin [animation-duration:2s] motion-reduce:animate-none',
            )}
          />
          {row.status}
        </span>
      )
    },
  },
  {
    key: 'environment',
    header: 'Environment',
    icon: LayersIcon,
    width: 132,
    cell: (row) => (
      <span
        className={cn(
          'inline-flex h-5 items-center rounded-md px-1.5 text-xs font-medium ring-1 ring-inset',
          environmentTone[row.environment],
        )}
      >
        {row.environment}
      </span>
    ),
  },
  {
    key: 'region',
    header: 'Region',
    icon: GlobalIcon,
    width: 120,
    cell: (row) => <span className="font-mono text-xs">{row.region}</span>,
  },
  {
    key: 'trigger',
    header: 'Trigger',
    icon: BoltIcon,
    width: 120,
    cell: (row) => {
      const Icon = triggerIcons[row.trigger]
      return (
        <span className="inline-flex items-center gap-1.5">
          <Icon className="size-3.5 text-muted-foreground/70" />
          {row.trigger}
        </span>
      )
    },
  },
  { key: 'started', header: 'Started', icon: CalendarIcon, width: 136 },
  {
    key: 'duration',
    header: 'Duration',
    icon: StopwatchIcon,
    align: 'end',
    width: 112,
    cell: (row) =>
      row.duration >= 60 ? (
        <Value>
          {Math.floor(row.duration / 60)}
          <span className="mr-1 ml-0.5 text-xs text-muted-foreground">m</span>
          {row.duration % 60}
          <span className="ml-0.5 text-xs text-muted-foreground">s</span>
        </Value>
      ) : (
        <Value unit="s">{row.duration}</Value>
      ),
  },
  {
    key: 'steps',
    header: 'Steps',
    icon: ChecklistMinimalisticIcon,
    align: 'end',
    width: 96,
    cell: (row) => <Value>{row.steps}</Value>,
  },
  {
    key: 'toolCalls',
    header: 'Tool calls',
    icon: TuningIcon,
    align: 'end',
    width: 112,
    cell: (row) => <Value>{row.toolCalls}</Value>,
  },
  {
    key: 'retries',
    header: 'Retries',
    icon: RepeatIcon,
    align: 'end',
    width: 100,
    cell: (row) => (
      <Count tone="bg-amber-500/12 text-amber-700 dark:text-amber-300" value={row.retries} />
    ),
  },
  {
    key: 'errors',
    header: 'Errors',
    icon: DangerTriangleIcon,
    align: 'end',
    width: 96,
    cell: (row) => <Count tone="bg-red-500/12 text-red-700 dark:text-red-300" value={row.errors} />,
  },
  {
    key: 'inputTokens',
    header: 'Input',
    icon: DocumentTextIcon,
    align: 'end',
    width: 100,
    cell: (row) => <Value>{compact.format(row.inputTokens)}</Value>,
  },
  {
    key: 'outputTokens',
    header: 'Output',
    icon: TextFieldIcon,
    align: 'end',
    width: 100,
    cell: (row) => <Value>{compact.format(row.outputTokens)}</Value>,
  },
  {
    key: 'cachedTokens',
    header: 'Cached',
    icon: DatabaseIcon,
    align: 'end',
    width: 100,
    cell: (row) => <Value>{compact.format(row.cachedTokens)}</Value>,
  },
  {
    key: 'reasoningTokens',
    header: 'Reasoning',
    icon: LightbulbIcon,
    align: 'end',
    width: 116,
    cell: (row) => <Value>{compact.format(row.reasoningTokens)}</Value>,
  },
  {
    key: 'contextUsed',
    header: 'Context',
    icon: BoxIcon,
    width: 120,
    cell: (row) => (
      <Meter
        tone={
          row.contextUsed >= 80
            ? 'bg-red-500'
            : row.contextUsed >= 60
              ? 'bg-amber-500'
              : 'bg-foreground/50'
        }
        value={row.contextUsed}
      />
    ),
  },
  {
    key: 'cost',
    header: 'Cost',
    icon: DollarIcon,
    align: 'end',
    width: 100,
    cell: (row) => (
      <span className="font-medium text-foreground">
        <span className="text-xs font-normal text-muted-foreground">$</span>
        {row.cost.toFixed(3)}
      </span>
    ),
  },
  {
    key: 'ttft',
    header: 'TTFT',
    icon: HourglassIcon,
    align: 'end',
    width: 100,
    cell: (row) => <Latency ms={row.ttft} />,
  },
  {
    key: 'p50',
    header: 'p50',
    icon: SpeedometerLowIcon,
    align: 'end',
    width: 100,
    cell: (row) => <Latency ms={row.p50} />,
  },
  {
    key: 'p95',
    header: 'p95',
    icon: SpeedometerMiddleIcon,
    align: 'end',
    width: 100,
    cell: (row) => <Latency ms={row.p95} />,
  },
  {
    key: 'p99',
    header: 'p99',
    icon: SpeedometerMaxIcon,
    align: 'end',
    width: 100,
    cell: (row) => <Latency ms={row.p99} />,
  },
  {
    key: 'throughput',
    header: 'Throughput',
    icon: GraphUpIcon,
    align: 'end',
    width: 124,
    cell: (row) => <Value unit="tok/s">{row.throughput}</Value>,
  },
  {
    key: 'temperature',
    header: 'Temp',
    icon: TemperatureIcon,
    align: 'end',
    width: 92,
    cell: (row) => <span className="font-mono text-xs">{row.temperature.toFixed(1)}</span>,
  },
  {
    key: 'topP',
    header: 'Top-p',
    icon: Tuning2Icon,
    align: 'end',
    width: 92,
    cell: (row) => <span className="font-mono text-xs">{row.topP.toFixed(2)}</span>,
  },
  {
    key: 'maxTokens',
    header: 'Max tokens',
    icon: RulerIcon,
    align: 'end',
    width: 120,
    cell: (row) => <Value>{compact.format(row.maxTokens)}</Value>,
  },
  {
    key: 'promptVersion',
    header: 'Prompt',
    icon: DocumentIcon,
    width: 100,
    cell: (row) => (
      <span className="inline-flex h-5 items-center rounded-md bg-foreground/6 px-1.5 font-mono text-xs text-foreground/85">
        {row.promptVersion}
      </span>
    ),
  },
  {
    key: 'branch',
    header: 'Branch',
    icon: GitBranchIcon,
    width: 132,
    cell: (row) => <span className="font-mono text-xs text-foreground/85">{row.branch}</span>,
  },
  {
    key: 'commit',
    header: 'Commit',
    icon: GitCommitIcon,
    width: 100,
    cell: (row) => <span className="font-mono text-xs">{row.commit}</span>,
  },
  {
    key: 'user',
    header: 'User',
    icon: UserCircleIcon,
    width: 120,
    cell: (row) => (
      <span className="inline-flex items-center gap-2 text-foreground/90">
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded-full text-[10px] font-semibold uppercase',
            avatarTones[row.user.charCodeAt(0) % avatarTones.length],
          )}
        >
          {row.user[0]}
        </span>
        <span className="capitalize">{row.user}</span>
      </span>
    ),
  },
  { key: 'team', header: 'Team', icon: UsersGroupRoundedIcon, width: 112 },
  {
    key: 'evalScore',
    header: 'Eval score',
    icon: StarIcon,
    width: 124,
    cell: (row) => (
      <Meter
        tone={
          row.evalScore >= 0.85
            ? 'bg-emerald-500'
            : row.evalScore >= 0.72
              ? 'bg-amber-500'
              : 'bg-red-500'
        }
        value={Math.round(row.evalScore * 100)}
      />
    ),
  },
  {
    key: 'accuracy',
    header: 'Accuracy',
    icon: TargetIcon,
    align: 'end',
    width: 108,
    cell: (row) => (
      <span
        className={cn(
          'font-medium',
          row.accuracy >= 95
            ? 'text-emerald-600 dark:text-emerald-400'
            : row.accuracy < 85
              ? 'text-red-600 dark:text-red-400'
              : 'text-foreground/90',
        )}
      >
        {row.accuracy.toFixed(1)}
        <span className="text-xs font-normal text-muted-foreground">%</span>
      </span>
    ),
  },
  {
    key: 'hallucination',
    header: 'Hallucination',
    icon: MagnifierBugIcon,
    align: 'end',
    width: 132,
    cell: (row) => (
      <span
        className={cn(
          row.hallucination >= 4
            ? 'font-medium text-red-600 dark:text-red-400'
            : 'text-foreground/90',
        )}
      >
        {row.hallucination.toFixed(1)}
        <span className="text-xs font-normal text-muted-foreground">%</span>
      </span>
    ),
  },
  {
    key: 'feedback',
    header: 'Feedback',
    icon: LikeIcon,
    width: 104,
    sortable: false,
    cell: (row) =>
      row.feedback === 'none' ? (
        <span className="text-muted-foreground/50">—</span>
      ) : row.feedback === 'up' ? (
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <LikeBoldIcon className="size-3.5" /> Helpful
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400">
          <DislikeBoldIcon className="size-3.5" /> Poor
        </span>
      ),
  },
  {
    key: 'cacheHit',
    header: 'Cache hit',
    icon: BoltCircleIcon,
    width: 120,
    cell: (row) => <Meter tone="bg-sky-500" value={row.cacheHit} />,
  },
  {
    key: 'guardrailFlags',
    header: 'Guardrails',
    icon: ShieldCheckIcon,
    width: 120,
    cell: (row) =>
      row.guardrailFlags > 0 ? (
        <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
          <ShieldWarningIcon className="size-3.5" />
          {row.guardrailFlags} flagged
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheckIcon className="size-3.5 text-emerald-600/70 dark:text-emerald-400/70" />
          Clear
        </span>
      ),
  },
  {
    key: 'traceSize',
    header: 'Trace',
    icon: FolderIcon,
    align: 'end',
    width: 96,
    cell: (row) => <Value unit="MB">{row.traceSize}</Value>,
  },
]

function DataTablePreview() {
  return (
    <DataTable
      className="h-[480px] w-full max-w-4xl"
      columns={runColumns}
      defaultSort={{ key: 'started', direction: 'desc' }}
      getRowId={(row) => row.id}
      rows={runs}
      title="Agent runs"
    />
  )
}

const structuredOutputPreviews: Record<string, ComponentType> = {
  'audio-player': AudioPlayerPreview,
  'data-table': DataTablePreview,
}

export function AiStructuredOutputPreview({ slug }: PreviewProps) {
  const Preview = structuredOutputPreviews[slug]

  return Preview ? <Preview /> : null
}
