import { QuestionCircleIcon as CircleHelpIcon } from '@solar-icons/react/linear/question-circle'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface ApprovalOption {
  description?: string
  label: string
  value: string
}

interface ApprovalCardProps extends React.ComponentProps<'section'> {
  description?: string
  onDecision?: (value: string) => void
  options?: ApprovalOption[]
  status?: 'approved' | 'denied' | 'pending'
  title: string
}

const defaultOptions: ApprovalOption[] = [
  { label: 'Approve', value: 'approve' },
  { label: 'Deny', value: 'deny' },
]

function ApprovalCard({
  className,
  description,
  onDecision,
  options = defaultOptions,
  status = 'pending',
  title,
  ...props
}: ApprovalCardProps) {
  return (
    <section
      data-slot="approval-card"
      className={cn(
        'rounded-[16px] bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <div className="flex gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
          <CircleHelpIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="card-heading">{title}</h3>
            {status !== 'pending' && (
              <span className="rounded-full bg-muted px-2 py-1 text-sm font-[450] text-muted-foreground capitalize">
                {status}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {status === 'pending' && (
        <div
          className={cn(
            'mt-4 gap-2',
            options.some((option) => option.description)
              ? 'grid sm:grid-cols-2'
              : 'flex flex-wrap justify-end',
          )}
        >
          {options.map((option, index) => (
            <Button
              className={cn(
                'border-0 px-3 text-sm font-[450] tracking-[-0.05px] shadow-none',
                option.description
                  ? 'h-auto min-h-9 justify-start rounded-[10px] py-2 text-left whitespace-normal'
                  : 'h-7 rounded-full',
                index === 0 &&
                  'bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] hover:brightness-110 dark:bg-none',
                index !== 0 && 'text-muted-foreground hover:text-muted-foreground',
              )}
              key={option.value}
              onClick={() => onDecision?.(option.value)}
              size="sm"
              variant={index === 0 ? 'default' : 'ghost'}
            >
              <span>
                <span className="block">{option.label}</span>
                {option.description && (
                  <span className="mt-0.5 block text-sm font-[450] opacity-70">
                    {option.description}
                  </span>
                )}
              </span>
            </Button>
          ))}
        </div>
      )}
    </section>
  )
}

export { ApprovalCard }
export type { ApprovalCardProps, ApprovalOption }
