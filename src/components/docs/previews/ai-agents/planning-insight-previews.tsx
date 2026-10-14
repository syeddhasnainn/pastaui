import type { ComponentType } from 'react'
import { useState } from 'react'

import { PlanApprovalCard } from '#/components/ai/plan-approval-card'

import { ScheduleCard } from '#/components/ai/schedule-card'
import * as React from 'react'
import { type PlanApprovalStep } from '#/components/ai/plan-approval-card'

interface PreviewProps {
  slug: string
}

const planApprovalCardInitialSteps: PlanApprovalStep[] = [
  { id: 'gather', label: 'Gather relevant information from trusted sources.' },
  { id: 'verify', label: 'Review key details and verify the available information.' },
  { id: 'themes', label: 'Identify common themes and highlight useful insights.' },
  { id: 'outline', label: 'Organize the findings into a clear outline.' },
  { id: 'summary', label: 'Create a concise summary with links to sources.' },
]

const planApprovalCardDuration = 12

function PlanApprovalCardPreview() {
  const [steps, setSteps] = React.useState(planApprovalCardInitialSteps)
  const [seconds, setSeconds] = React.useState(9)
  const [paused, setPaused] = React.useState(false)
  const [status, setStatus] = React.useState('')

  React.useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => {
      if (seconds > 0) return setSeconds((value) => value - 1)
      setStatus('Starting research…')
      setTimeout(() => {
        setStatus('')
        setSeconds(planApprovalCardDuration)
      }, 2200)
    }, 1000)
    return () => clearTimeout(timer)
  }, [paused, seconds])

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <PlanApprovalCard
        className="w-full"
        countdownDuration={planApprovalCardDuration}
        countdownSeconds={paused || status ? undefined : seconds}
        disabled={Boolean(status)}
        onCancel={() => {
          setPaused(true)
          setStatus('Plan cancelled.')
        }}
        onEdit={() => setPaused(true)}
        onStart={() => setStatus('Starting research…')}
        onStepsChange={setSteps}
        steps={steps}
        title="Research a topic"
      />
      <output aria-live="polite" className="min-h-5 text-xs leading-5 text-muted-foreground">
        {status}
      </output>
    </div>
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
