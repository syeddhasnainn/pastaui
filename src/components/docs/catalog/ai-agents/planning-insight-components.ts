import planApprovalCardRegistry from '../../../../../public/r/plan-approval-card.json'
import { createAiDocument } from './create-ai-document'

export const aiPlanningInsightComponents = [
  createAiDocument({
    slug: 'plan-approval-card',
    name: 'Plan Approval Card',
    description:
      'A proposed plan with clear steps and controls to edit, cancel, or start the work.',
    usage: `import { PlanApprovalCard } from "@/components/ai/plan-approval-card"
import { PlanResearchCard } from "@/components/ai/plan-research-card"

export function Example() {
  return (
    <PlanApprovalCard
      title="Research a topic"
      steps={[
        { id: "news", label: "Gather relevant information from trusted sources." },
        { id: "summary", label: "Summarize findings with sources." },
      ]}
      onEdit={() => console.log("Edit plan")}
      onCancel={() => console.log("Cancel plan")}
      onStart={() => console.log("Start plan")}
    />
  )
}

export function ResearchingExample() {
  return (
    <PlanResearchCard
      title="Research a topic"
      steps={[
        { id: "sources", label: "Gather trusted sources.", status: "complete" },
        { id: "verify", label: "Verify the findings.", status: "running" },
        { id: "summary", label: "Write the summary.", status: "pending" },
      ]}
      progress={40}
      searchCount={225}
      statusText="Organizing findings and checking sources…"
      onUpdate={() => console.log("Update research")}
      onStop={() => console.log("Stop research")}
    />
  )
}`,
    source: planApprovalCardRegistry.files
      .map((file) => `// ${file.path}\n${file.content}`)
      .join('\n\n'),
    api: [
      {
        name: 'PlanResearchCard',
        type: 'component',
        defaultValue: '—',
        description: 'Researching variant, imported from components/ai/plan-research-card.',
      },
      {
        name: 'progress / searchCount',
        type: 'number',
        defaultValue: '—',
        description: 'Research variant: progress from 0–100 and number of searches performed.',
      },
      {
        name: 'statusText',
        type: 'string',
        defaultValue: '—',
        description: 'Research variant: current activity or stopped-state message.',
      },
      {
        name: 'onUpdate / onStop',
        type: '() => void',
        defaultValue: '—',
        description: 'Research variant: update and stop callbacks.',
      },
      {
        name: 'steps[].status',
        type: 'pending | running | complete',
        defaultValue: '—',
        description: 'Research variant: controls each step indicator.',
      },
      { name: 'title', type: 'string', defaultValue: '—', description: 'Names the proposed task.' },
      {
        name: 'steps',
        type: 'PlanApprovalStep[]',
        defaultValue: '—',
        description:
          'Ordered steps with a stable id and label. Start is disabled for an empty plan.',
      },
      {
        name: 'onEdit',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens your plan editor.',
      },
      {
        name: 'onCancel',
        type: '() => void',
        defaultValue: '—',
        description: 'Cancels the proposed plan.',
      },
      {
        name: 'onStart',
        type: '() => void',
        defaultValue: '—',
        description: 'Approves and starts the plan.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables all three actions.',
      },
      {
        name: 'countdownSeconds',
        type: 'number',
        defaultValue: '—',
        description:
          'Optional remaining seconds displayed inside Start. Controlled by the parent; never automatically starts the plan.',
      },
      {
        name: 'countdownDuration',
        type: 'number',
        defaultValue: '60',
        description: 'Total countdown duration used to draw the remaining-time ring.',
      },
    ],
  }),
  createAiDocument({
    slug: 'schedule-card',
    name: 'Schedule Card',
    description: 'A recurring agent job with human-readable timing, next run, and pause controls.',
    usage: `import { ScheduleCard } from "@/components/ai/schedule-card"

export function Example() {
  return <ScheduleCard title="Weekly research brief" schedule="Every Monday" nextRun="Mon, 09:00" />
}`,
    source: `<article>
  <ScheduleSummary title={title} status={status} />
  <ScheduleDetails schedule={schedule} nextRun={nextRun} />
  <ScheduleActions />
</article>`,
    api: [
      {
        name: 'schedule',
        type: 'string',
        defaultValue: '—',
        description: 'Describes the recurrence in human-readable language.',
      },
      {
        name: 'nextRun',
        type: 'string',
        defaultValue: '—',
        description: 'Displays the next execution time.',
      },
      {
        name: 'status',
        type: 'active | paused',
        defaultValue: 'active',
        description: 'Communicates whether the scheduled job will run.',
      },
      {
        name: 'onToggle',
        type: '() => void',
        defaultValue: '—',
        description: 'Pauses or resumes the schedule.',
      },
    ],
  }),
]
