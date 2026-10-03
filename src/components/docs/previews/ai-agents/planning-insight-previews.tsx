import type { ComponentType } from 'react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { PlanApprovalCard } from '#/components/ai/plan-approval-card'
import { PlanResearchCard } from '#/components/ai/plan-research-card'
import { ScheduleCard } from '#/components/ai/schedule-card'

interface PreviewProps {
  slug: string
}

const initialPlanSteps = [
  { id: 'news', label: 'Gather relevant information from trusted sources.' },
  {
    id: 'official',
    label: 'Review key details and verify the available information.',
  },
  { id: 'social', label: 'Identify common themes and highlight useful insights.' },
  {
    id: 'disruptions',
    label: 'Organize the findings into a clear outline.',
  },
  { id: 'summary', label: 'Create a concise summary with links to sources.' },
]

function PlanApprovalCardPreview() {
  const [steps, setSteps] = useState(initialPlanSteps)
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState('')

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <PlanApprovalCard
        title="Research a topic"
        steps={steps}
        disabled={editing || Boolean(status)}
        onEdit={() => setEditing(true)}
        onCancel={() => setStatus('Plan cancelled.')}
        onStart={() => setStatus('Plan approved. Ready to start research.')}
      />
      {editing && (
        <form
          className="w-full space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            setEditing(false)
          }}
        >
          {steps.map((step, index) => (
            <label key={step.id} className="block space-y-1 text-sm">
              <span>Step {index + 1}</span>
              <textarea
                required
                value={step.label}
                className="min-h-20 w-full rounded-md border border-border bg-background p-3 focus-visible:outline-2 focus-visible:outline-ring"
                onChange={(event) =>
                  setSteps((current) =>
                    current.map((item) =>
                      item.id === step.id ? { ...item, label: event.target.value } : item,
                    ),
                  )
                }
              />
            </label>
          ))}
          <Button type="submit">Save plan</Button>
        </form>
      )}
      {status && (
        <div className="flex w-full items-center justify-between gap-3">
          <output className="text-sm text-muted-foreground">{status}</output>
          <Button
            variant="outline"
            onClick={() => {
              setStatus('')
              setSteps(initialPlanSteps)
            }}
          >
            Reset
          </Button>
        </div>
      )}
      <PlanResearchCardPreview />
    </div>
  )
}

function PlanResearchCardPreview() {
  const [stopped, setStopped] = useState(false)
  const [updated, setUpdated] = useState(false)

  return (
    <section className="w-fit max-w-full pt-6">
      <h3 className="mb-4 text-sm font-[450] tracking-[-0.05px] text-muted-foreground">
        Researching
      </h3>
      <PlanResearchCard
        title="Research a topic"
        steps={initialPlanSteps.map((step, index) => ({
          ...step,
          status:
            index === 0 || (updated && index === 1)
              ? 'complete'
              : index === initialPlanSteps.length - 1
                ? 'pending'
                : 'running',
        }))}
        progress={updated ? 65 : 40}
        searchCount={updated ? 248 : 225}
        statusText={
          stopped
            ? 'Research stopped.'
            : updated
              ? 'Reviewing sources and refining the summary…'
              : 'Organizing findings and checking sources…'
        }
        disabled={stopped}
        onUpdate={() => setUpdated(true)}
        onStop={() => setStopped(true)}
      />
      {stopped && (
        <Button
          className="mt-3 h-7 rounded-full px-3 text-sm font-[450] text-muted-foreground"
          variant="ghost"
          onClick={() => {
            setStopped(false)
            setUpdated(false)
          }}
        >
          Reset preview
        </Button>
      )}
    </section>
  )
}

function ScheduleCardPreview() {
  const [status, setStatus] = useState<'active' | 'paused'>('active')

  return (
    <ScheduleCard
      className="w-full max-w-lg"
      description="Research new agent-interface patterns and summarize meaningful changes."
      nextRun="Mon, Oct 5 · in 2 days"
      onToggle={() => setStatus((current) => (current === 'active' ? 'paused' : 'active'))}
      schedule="Every Monday at 09:00"
      status={status}
      timezone="London"
      title="Weekly component landscape"
    />
  )
}

const planningInsightPreviews: Record<string, ComponentType> = {
  'plan-approval-card': PlanApprovalCardPreview,
  'schedule-card': ScheduleCardPreview,
}

export function AiPlanningInsightPreview({ slug }: PreviewProps) {
  const Preview = planningInsightPreviews[slug]

  return Preview ? <Preview /> : null
}
