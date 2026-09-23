import { ChatSquareIcon as MessageSquareIcon } from '@solar-icons/react/linear/chat-square'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from 'cn'

interface FeedbackDialogProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  comment?: string
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
  onCommentChange,
  onReasonChange,
  onSubmit,
  reason,
  reasons,
  title = 'What could be better?',
  ...props
}: FeedbackDialogProps) {
  const commentId = React.useId()

  return (
    <form
      data-slot="feedback-dialog"
      className={cn(
        'rounded-md bg-card p-5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
      {...props}
    >
      <header className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <MessageSquareIcon className="size-4" />
        </span>
        <div>
          <h3 className="card-heading">{title}</h3>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            Your feedback helps improve the next response.
          </p>
        </div>
      </header>

      <fieldset className="mt-4">
        <legend className="sr-only">Feedback reason</legend>
        <div className="flex flex-wrap gap-1.5">
          {reasons.map((item) => (
            <button
              aria-pressed={reason === item}
              className={cn(
                'inline-flex h-6 items-center rounded-md px-2 text-xs leading-4 font-[450] ring-1 ring-foreground/10 transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                reason === item && 'bg-muted text-muted-foreground ring-foreground/20',
              )}
              key={item}
              onClick={() => onReasonChange?.(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block text-sm font-[450]" htmlFor={commentId}>
        Add a note{' '}
        <span className="text-xs leading-5 font-[450] text-muted-foreground">Optional</span>
      </label>
      <Textarea
        className="mt-1.5 min-h-20 resize-none rounded-md bg-transparent px-3 text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-none dark:bg-transparent"
        id={commentId}
        onChange={(event) => onCommentChange?.(event.target.value)}
        placeholder="Tell us what was missing…"
        value={comment}
      />

      <div className="mt-4 flex justify-end">
        <Button
          className="h-7 rounded-full border-0 bg-linear-to-b from-[color-mix(in_oklch,var(--color-neutral-900),var(--color-neutral-50)_30%)] to-neutral-900 px-3 text-sm font-[450] tracking-[-0.05px] text-neutral-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110"
          disabled={!reason}
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
