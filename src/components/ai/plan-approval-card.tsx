import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface PlanApprovalStep {
  id: string
  label: string
}

interface PlanApprovalCardProps extends React.ComponentProps<'section'> {
  title: string
  steps: PlanApprovalStep[]
  onEdit?: () => void
  onStepsChange?: (steps: PlanApprovalStep[]) => void
  onCancel?: () => void
  onStart?: () => void
  disabled?: boolean
  /** Controlled display only; the card never starts a plan automatically. */
  countdownSeconds?: number
  countdownDuration?: number
}

function PlanApprovalCard({
  className,
  title,
  steps,
  onEdit,
  onStepsChange,
  onCancel,
  onStart,
  disabled = false,
  countdownSeconds,
  countdownDuration = 60,
  ...props
}: PlanApprovalCardProps) {
  const titleId = React.useId()
  const [editing, setEditing] = React.useState(false)
  const inputs = React.useRef(new Map<string, HTMLInputElement>())
  const pendingFocus = React.useRef<string | undefined>(undefined)
  const nextStepId = React.useRef(0)

  React.useEffect(() => {
    const id = pendingFocus.current
    const input = id ? inputs.current.get(id) : undefined
    if (!input) return
    input.focus()
    pendingFocus.current = undefined
  })

  function update(id: string, label: string) {
    onStepsChange?.(steps.map((step) => (step.id === id ? { ...step, label } : step)))
  }

  function addStep() {
    nextStepId.current += 1
    const id = `${titleId}-step-${nextStepId.current}`
    onStepsChange?.([...steps, { id, label: '' }])
    pendingFocus.current = id
  }

  function finishEditing() {
    onStepsChange?.(steps.filter((step) => step.label.trim()))
    setEditing(false)
  }
  const seconds =
    countdownSeconds === undefined || !Number.isFinite(countdownSeconds)
      ? undefined
      : Math.max(0, Math.ceil(countdownSeconds))
  const progress =
    seconds === undefined || !Number.isFinite(countdownDuration) || countdownDuration <= 0
      ? 0
      : Math.min(1, seconds / countdownDuration)

  return (
    <section
      aria-labelledby={titleId}
      data-slot="plan-approval-card"
      className={cn(
        'w-fit max-w-full rounded-[16px] bg-card p-5 font-sans text-sm leading-5 font-[450] tracking-[-0.05px] text-muted-foreground shadow-card transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] sm:p-6 starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0',
        className,
      )}
      {...props}
    >
      <h3 id={titleId} className="card-heading leading-[19.25px]">
        {title}
      </h3>
      <ol className="mt-6 space-y-5">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="group/step flex items-start gap-4 transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:-translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 rounded-full border-2 border-dashed border-muted-foreground/50"
            />
            {editing ? (
              <>
                <label className="sr-only" htmlFor={`${titleId}-${step.id}`}>
                  Step {index + 1}
                </label>
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-muted-foreground outline-none placeholder:text-muted-foreground/50"
                  id={`${titleId}-${step.id}`}
                  onChange={(event) => update(step.id, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      if (index === steps.length - 1) addStep()
                      else inputs.current.get(steps[index + 1].id)?.focus()
                    }
                    if (event.key === 'Escape') finishEditing()
                    if (event.key === 'Backspace' && !step.label && steps.length > 1) {
                      event.preventDefault()
                      onStepsChange?.(steps.filter((item) => item.id !== step.id))
                      pendingFocus.current = steps[Math.max(0, index - 1)].id
                    }
                  }}
                  placeholder="Describe this step"
                  ref={(element) => {
                    if (element) inputs.current.set(step.id, element)
                    else inputs.current.delete(step.id)
                  }}
                  value={step.label}
                />
                <button
                  aria-label={`Remove step ${index + 1}`}
                  className="-my-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity duration-150 outline-none group-focus-within/step:opacity-100 group-hover/step:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/40 pointer-coarse:opacity-100"
                  onClick={() => onStepsChange?.(steps.filter((item) => item.id !== step.id))}
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    viewBox="0 0 16 16"
                  >
                    <path d="m4.5 4.5 7 7m0-7-7 7" />
                  </svg>
                </button>
              </>
            ) : (
              <span className="min-w-0 break-words">{step.label}</span>
            )}
          </li>
        ))}
        {editing && (
          <li>
            <button
              className="-ml-1 flex items-center gap-4 rounded-full px-1 text-sm leading-5 text-muted-foreground transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/40"
              onClick={addStep}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
                viewBox="0 0 16 16"
              >
                <path d="M8 3.5v9M3.5 8h9" />
              </svg>
              Add step
            </button>
          </li>
        )}
      </ol>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          className="h-7 rounded-full px-3 text-sm font-[450] text-muted-foreground hover:text-muted-foreground"
          aria-pressed={editing}
          disabled={disabled}
          onClick={() => {
            if (editing) finishEditing()
            else {
              setEditing(true)
              onEdit?.()
            }
          }}
        >
          {editing ? 'Done' : 'Edit'}
        </Button>
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            className="h-7 rounded-full px-3 text-sm font-[450] text-muted-foreground hover:text-muted-foreground"
            disabled={disabled}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            className="h-7 gap-2 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-sm font-[450] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
            disabled={disabled || editing || steps.length === 0}
            onClick={onStart}
          >
            Start
            {seconds !== undefined && (
              <span
                className="relative flex size-5 items-center justify-center text-[10px] tabular-nums"
                aria-label={`${seconds} seconds remaining`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 32 32"
                  className="absolute inset-0 size-5 -rotate-90 fill-none stroke-current"
                >
                  <circle cx="16" cy="16" r="14" strokeWidth="1.5" className="opacity-15" />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray={`${progress} 1`}
                    className="transition-[stroke-dasharray] duration-1000 ease-linear motion-reduce:transition-none"
                  />
                </svg>
                {seconds}
              </span>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { PlanApprovalCard }
export type { PlanApprovalCardProps, PlanApprovalStep }
