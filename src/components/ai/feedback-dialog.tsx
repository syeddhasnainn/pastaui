import { ChatSquareIcon as MessageSquareIcon } from '@solar-icons/react/linear/chat-square'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from 'cn'

interface FeedbackDialogProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  comment?: string
  onCancel?: () => void
  onCommentChange?: (comment: string) => void
  onReasonChange?: (reason: string) => void
  onSubmit?: () => void
  reason?: string
  reasons: string[]
  title?: string
}

function FeedbackDialog({
  className,
  comment = '',
  onCancel,
  onCommentChange,
  onReasonChange,
  onSubmit,
  reason,
  reasons,
  title = 'What could be better?',
  ...props
}: FeedbackDialogProps) {
  const commentId = React.useId()
  const [error, setError] = React.useState('')
  const [sent, setSent] = React.useState(false)

  if (sent) {
    return (
      <output
        data-slot="feedback-dialog"
        className={cn(
          'flex items-center gap-3 rounded-[16px] bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0',
          className,
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-foreground/6">
          <svg
            aria-hidden="true"
            className="size-4 text-emerald-600 dark:text-emerald-500"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            viewBox="0 0 16 16"
          >
            <path d="m3.5 8.5 3 3 6-7" />
          </svg>
        </span>
        <span className="text-[15px] leading-6 text-foreground">Thanks, your feedback was sent.</span>
      </output>
    )
  }

  return (
    <form
      data-slot="feedback-dialog"
      className={cn(
        'rounded-[16px] bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0',
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault()
        if (!reason && !comment.trim()) {
          setError('Pick a reason or add a note.')
          return
        }
        setError('')
        onSubmit?.()
        setSent(true)
      }}
      {...props}
    >
      <header className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-foreground/6 text-muted-foreground">
          <MessageSquareIcon className="size-4" />
        </span>
        <div>
          <h3 className="text-[15px] leading-6 font-medium text-foreground">{title}</h3>
          <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">
            Your feedback helps improve the next response.
          </p>
        </div>
      </header>

      <fieldset className="mt-5">
        <legend className="sr-only">Feedback reason</legend>
        <div className="flex flex-wrap gap-1.5">
          {reasons.map((item) => {
            const selected = reason === item

            return (
              <button
                aria-pressed={selected}
                className={cn(
                  'inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[13px] leading-4 font-[450] transition-[background-color,color,scale] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] motion-reduce:active:scale-100',
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-foreground/6 text-foreground/80 hover:bg-foreground/10',
                )}
                key={item}
                onClick={() => {
                  setError('')
                  onReasonChange?.(item)
                }}
                type="button"
              >
                {selected && (
                  <svg
                    aria-hidden="true"
                    className="-ml-0.5 size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 16 16"
                  >
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                )}
                {item}
              </button>
            )
          })}
        </div>
      </fieldset>

      <label
        className="mt-5 block text-sm leading-5 font-medium text-foreground/85"
        htmlFor={commentId}
      >
        Add a note <span className="font-[450] text-muted-foreground/70">· Optional</span>
      </label>
      <Textarea
        className="mt-2 min-h-20 resize-none rounded-[12px] border-0 bg-foreground/4 px-3 py-2.5 text-sm font-[450] tracking-[-0.05px] text-foreground shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/40 md:text-sm dark:bg-foreground/4"
        id={commentId}
        onChange={(event) => {
          setError('')
          onCommentChange?.(event.target.value)
        }}
        placeholder="What should be different?"
        value={comment}
      />

      <div className="mt-4 flex items-center justify-end gap-2">
        <p aria-live="polite" className="mr-auto text-[13px] leading-5 text-destructive">
          {error}
        </p>
        {onCancel && (
          <Button
            className="h-7 rounded-full px-3 text-sm font-[450] tracking-[-0.05px] text-muted-foreground hover:bg-foreground/8 hover:text-foreground"
            onClick={onCancel}
            size="sm"
            type="button"
            variant="ghost"
          >
            Cancel
          </Button>
        )}
        <Button
          className="h-7 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-sm font-[450] tracking-[-0.05px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
          size="sm"
          type="submit"
          variant="default"
        >
          Send feedback
        </Button>
      </div>
    </form>
  )
}

export { FeedbackDialog }
export type { FeedbackDialogProps }
