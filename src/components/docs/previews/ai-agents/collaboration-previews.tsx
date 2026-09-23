import type { ComponentType } from 'react'
import { useState } from 'react'

import { FeedbackDialog } from '#/components/ai/feedback-dialog'

interface PreviewProps {
  slug: string
}

function FeedbackDialogPreview() {
  const [comment, setComment] = useState('')
  const [reason, setReason] = useState<string>()

  return (
    <FeedbackDialog
      className="w-full max-w-lg"
      comment={comment}
      onCommentChange={setComment}
      onReasonChange={setReason}
      reason={reason}
      reasons={['Incorrect', 'Outdated', 'Too vague', 'Missing sources']}
    />
  )
}

const collaborationPreviews: Record<string, ComponentType> = {
  'feedback-dialog': FeedbackDialogPreview,
}

export function AiCollaborationPreview({ slug }: PreviewProps) {
  const Preview = collaborationPreviews[slug]

  return Preview ? <Preview /> : null
}
