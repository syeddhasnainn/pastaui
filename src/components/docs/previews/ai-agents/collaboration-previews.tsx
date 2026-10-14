import type { ComponentType } from 'react'

import { FeedbackDialog } from '#/components/ai/feedback-dialog'
import * as React from 'react'
import { type FeedbackRating } from '#/components/ai/feedback-dialog'

interface PreviewProps {
  slug: string
}

const feedbackDialogNote = 'The pricing numbers are from last year.'

const feedbackDialogScript: {
  comment: number
  rating: FeedbackRating
  reason?: string
  wait: number
}[] = [
  { rating: null, comment: 0, wait: 1000 },
  { rating: 'up', comment: 0, wait: 1600 },
  { rating: 'down', comment: 0, wait: 900 },
  { rating: 'down', reason: 'Outdated', comment: 0, wait: 700 },
]

function FeedbackDialogPreview() {
  const [step, setStep] = React.useState(3)
  const [typed, setTyped] = React.useState(feedbackDialogNote.length)
  const [auto, setAuto] = React.useState(true)
  const [rating, setRating] = React.useState<FeedbackRating>('down')
  const [reason, setReason] = React.useState<string | undefined>('Outdated')
  const [comment, setComment] = React.useState(feedbackDialogNote)

  React.useEffect(() => {
    if (!auto) return
    const typing = step === feedbackDialogScript.length - 1 && typed < feedbackDialogNote.length
    const timer = setTimeout(
      () => {
        if (typing) {
          setTyped((value) => value + 1)
          setComment(feedbackDialogNote.slice(0, typed + 1))
          return
        }
        const next = (step + 1) % (feedbackDialogScript.length + 1)
        if (next === feedbackDialogScript.length) return setStep(next)
        const frame = feedbackDialogScript[next]
        setStep(next)
        setRating(frame.rating)
        setReason(frame.reason)
        setTyped(0)
        setComment('')
      },
      typing ? 40 : step === feedbackDialogScript.length ? 3200 : feedbackDialogScript[step].wait,
    )
    return () => clearTimeout(timer)
  }, [auto, step, typed])

  return (
    <div className="w-full max-w-lg" onPointerDown={() => setAuto(false)}>
      <p className="mb-2 text-sm leading-6 font-[450] tracking-[-0.05px] text-muted-foreground">
        The Pro plan costs $18 per seat each month and includes unlimited projects, priority
        support, and audit logs.
      </p>
      <FeedbackDialog
        comment={comment}
        onCommentChange={setComment}
        onRatingChange={setRating}
        onReasonChange={setReason}
        rating={rating}
        reason={reason}
        reasons={['Incorrect', 'Outdated', 'Too vague', 'Missing sources']}
      />
    </div>
  )
}

const collaborationPreviews: Record<string, ComponentType> = {
  'feedback-dialog': FeedbackDialogPreview,
}

export function AiCollaborationPreview({ slug }: PreviewProps) {
  const Preview = collaborationPreviews[slug]

  return Preview ? <Preview /> : null
}
