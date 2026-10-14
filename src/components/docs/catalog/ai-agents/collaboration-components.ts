import { createAiDocument } from './create-ai-document'

export const aiCollaborationComponents = [
  createAiDocument({
    slug: 'feedback-dialog',
    name: 'Feedback Dialog',
    description: 'Response feedback with copy, thumbs up and thumbs down actions that expands into a reason picker and an optional note.',
    usage: `import { FeedbackDialog } from "@/components/ai/feedback-dialog"

export function Example() {
  return <FeedbackDialog reasons={reasons} reason={reason} onReasonChange={setReason} />
}`,
    source: `<form onSubmit={handleSubmit}>
  <FeedbackReasons reasons={reasons} value={reason} />
  <Textarea value={comment} />
  <Button type="submit">Send feedback</Button>
</form>`,
    api: [
      {
        name: 'reasons',
        type: 'string[]',
        defaultValue: '—',
        description: 'Provides the structured feedback reasons.',
      },
      {
        name: 'reason',
        type: 'string',
        defaultValue: '—',
        description: 'Controls the selected reason.',
      },
      {
        name: 'comment',
        type: 'string',
        defaultValue: "''",
        description: 'Controls the optional written feedback.',
      },
      {
        name: 'onSubmit',
        type: '() => void',
        defaultValue: '—',
        description: 'Submits the structured feedback.',
      },
      {
        name: 'onCancel',
        type: '() => void',
        defaultValue: '—',
        description: 'Shows a Cancel button that dismisses the form.',
      },
      {
        name: 'rating / defaultRating',
        type: '\'up\' | \'down\' | null',
        defaultValue: 'null',
        description: 'Controls the thumbs up or down selection.',
      },
      {
        name: 'onRatingChange',
        type: '(rating) => void',
        defaultValue: 'undefined',
        description: 'Runs when the rating changes.',
      },
      {
        name: 'onCopy',
        type: '() => void',
        defaultValue: 'undefined',
        description: 'Runs when the response is copied.',
      },
    ],
  }),
]
