import { ChatSquareIcon as MessageSquareIcon } from '@solar-icons/react/linear/chat-square'
import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { CopyIcon } from '@solar-icons/react/linear/copy'
import { DislikeIcon } from '@solar-icons/react/linear/dislike'
import { LikeIcon } from '@solar-icons/react/linear/like'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from 'cn'

interface FeedbackFormProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  comment?: string
  onCancel?: () => void
  onCommentChange?: (comment: string) => void
  onReasonChange?: (reason: string) => void
  onSubmit?: () => void
  reason?: string
  reasons: string[]
  title?: string
}

function FeedbackForm({
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
}: FeedbackFormProps) {
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
        <span className="text-[15px] leading-6 text-foreground">
          Thanks, your feedback was sent.
        </span>
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

type FeedbackRating = 'down' | 'up' | null

interface FeedbackDialogProps extends Omit<FeedbackFormProps, 'onSubmit'> {
  defaultRating?: FeedbackRating
  onCopy?: () => void
  onRatingChange?: (rating: FeedbackRating) => void
  onSubmit?: (feedback: { comment: string; rating: 'down'; reason?: string }) => void
  rating?: FeedbackRating
}

const ease = [0.23, 1, 0.32, 1] as const

function FeedbackDialog({
  className,
  comment,
  defaultRating = null,
  onCancel,
  onCommentChange,
  onCopy,
  onRatingChange,
  onReasonChange,
  onSubmit,
  rating,
  reason,
  ...props
}: FeedbackDialogProps) {
  const [internalRating, setInternalRating] = React.useState<FeedbackRating>(defaultRating)
  const [internalReason, setInternalReason] = React.useState<string>()
  const [internalComment, setInternalComment] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const current = rating === undefined ? internalRating : rating
  const currentReason = reason ?? internalReason
  const currentComment = comment ?? internalComment

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1400)
    return () => clearTimeout(timer)
  }, [copied])

  function rate(next: FeedbackRating) {
    const value = current === next ? null : next
    if (rating === undefined) setInternalRating(value)
    onRatingChange?.(value)
  }

  const actionClass =
    'text-muted-foreground hover:text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground'

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="feedback-dialog"
        className={cn('w-full font-sans text-sm tracking-[-0.05px]', className)}
      >
        <div
          aria-label="Rate this response"
          className="flex items-center gap-0.5 text-muted-foreground"
          role="toolbar"
        >
          <Button
            aria-label={copied ? 'Copied' : 'Copy response'}
            className={actionClass}
            onClick={() => {
              setCopied(true)
              onCopy?.()
            }}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 motion-reduce:*:transition-opacity">
              <CopyIcon className={cn('size-4', copied && 'scale-75 opacity-0')} />
              <CheckIcon className={cn('size-4', !copied && 'scale-75 opacity-0')} />
            </span>
          </Button>
          <Button
            aria-label="Good response"
            aria-pressed={current === 'up'}
            className={actionClass}
            onClick={() => rate('up')}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <motion.span
              animate={
                current === 'up'
                  ? { scale: [1, 1.25, 1], rotate: [0, -12, 0] }
                  : { scale: 1, rotate: 0 }
              }
              className="flex"
              transition={{ duration: 0.35, ease }}
            >
              <LikeIcon className="size-4" />
            </motion.span>
          </Button>
          <Button
            aria-label="Bad response"
            aria-pressed={current === 'down'}
            className={actionClass}
            onClick={() => rate('down')}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <motion.span
              animate={
                current === 'down'
                  ? { scale: [1, 1.25, 1], rotate: [0, 12, 0] }
                  : { scale: 1, rotate: 0 }
              }
              className="flex"
              transition={{ duration: 0.35, ease }}
            >
              <DislikeIcon className="size-4" />
            </motion.span>
          </Button>
          <AnimatePresence initial={false}>
            {current === 'up' && (
              <motion.span
                animate={{ opacity: 1, x: 0 }}
                aria-live="polite"
                className="ml-2 text-[13px] leading-5 font-[450]"
                exit={{ opacity: 0, x: -4 }}
                initial={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.2, ease }}
              >
                Thanks for the feedback
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence initial={false}>
          {current === 'down' && (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
            >
              <div className="p-px pt-3">
                <FeedbackForm
                  comment={currentComment}
                  onCancel={() => {
                    rate('down')
                    onCancel?.()
                  }}
                  onCommentChange={(value) => {
                    if (comment === undefined) setInternalComment(value)
                    onCommentChange?.(value)
                  }}
                  onReasonChange={(value) => {
                    if (reason === undefined) setInternalReason(value)
                    onReasonChange?.(value)
                  }}
                  onSubmit={() =>
                    onSubmit?.({ comment: currentComment, rating: 'down', reason: currentReason })
                  }
                  reason={currentReason}
                  {...props}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export { FeedbackDialog }
export type { FeedbackDialogProps, FeedbackRating }
