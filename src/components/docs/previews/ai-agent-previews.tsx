import { lazy, Suspense, type ComponentType } from 'react'

interface PreviewProps {
  slug: string
}

const AiActivityPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/activity-previews').then((module) => ({
    default: module.AiActivityPreview,
  })),
)
const AiAnswerFormatPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/answer-format-previews').then((module) => ({
    default: module.AiAnswerFormatPreview,
  })),
)
const AiBackgroundWorkPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/background-work-previews').then((module) => ({
    default: module.AiBackgroundWorkPreview,
  })),
)
const AiCollaborationPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/collaboration-previews').then((module) => ({
    default: module.AiCollaborationPreview,
  })),
)
const AiConversationPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/conversation-previews').then((module) => ({
    default: module.AiConversationPreview,
  })),
)
const AiConversationUtilityPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/conversation-utility-previews').then((module) => ({
    default: module.AiConversationUtilityPreview,
  })),
)
const AiDeveloperOutputPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/developer-output-previews').then((module) => ({
    default: module.AiDeveloperOutputPreview,
  })),
)
const AiExecutionPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/execution-previews').then((module) => ({
    default: module.AiExecutionPreview,
  })),
)
const AiOperationsPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/operations-previews').then((module) => ({
    default: module.AiOperationsPreview,
  })),
)
const AiPlanningInsightPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/planning-insight-previews').then((module) => ({
    default: module.AiPlanningInsightPreview,
  })),
)
const AiRichOutputPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/rich-output-previews').then((module) => ({
    default: module.AiRichOutputPreview,
  })),
)
const AiStructuredOutputPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/structured-output-previews').then((module) => ({
    default: module.AiStructuredOutputPreview,
  })),
)
const AiTaskDetailPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/task-detail-previews').then((module) => ({
    default: module.AiTaskDetailPreview,
  })),
)
const AiToolOutputPreview = lazy(() =>
  import('#/components/docs/previews/ai-agents/tool-output-previews').then((module) => ({
    default: module.AiToolOutputPreview,
  })),
)

const aiPreviewCollections: Record<string, ComponentType<PreviewProps>> = {
  'message-bubble': AiConversationPreview,
  'message-scroller': AiConversationPreview,
  'prompt-input': AiConversationPreview,
  citations: AiConversationPreview,
  'message-queue': AiConversationPreview,
  attachments: AiConversationPreview,
  'attachments-default': AiConversationPreview,
  'attachments-uploading': AiConversationPreview,
  'attachments-failed': AiConversationPreview,
  'model-picker': AiConversationPreview,
  'voice-input': AiConversationPreview,
  'todo-list': AiExecutionPreview,
  'code-block': AiExecutionPreview,
  'approval-card': AiExecutionPreview,
  'file-diff': AiExecutionPreview,
  'tool-result': AiExecutionPreview,
  'tool-approval': AiExecutionPreview,
  'tool-error': AiExecutionPreview,
  'image-generation-loader': AiActivityPreview,
  'agent-activity': AiActivityPreview,
  'reasoning-text': AiActivityPreview,
  'thinking-shimmer': AiActivityPreview,
  'background-runs': AiOperationsPreview,
  'job-progress': AiOperationsPreview,
  'connection-state': AiOperationsPreview,
  'cost-meter': AiOperationsPreview,
  'context-breakdown': AiOperationsPreview,
  memory: AiOperationsPreview,
  'permission-grant': AiOperationsPreview,
  'file-tree': AiRichOutputPreview,
  'retrieval-chunks': AiRichOutputPreview,
  'document-reference': AiRichOutputPreview,
  'research-report': AiRichOutputPreview,
  'audio-player': AiStructuredOutputPreview,
  'link-preview': AiRichOutputPreview,
  commit: AiDeveloperOutputPreview,
  'environment-variables': AiDeveloperOutputPreview,
  'reasoning-effort': AiOperationsPreview,
  'follow-up': AiConversationUtilityPreview,
  'follow-up-suggestions': AiConversationUtilityPreview,
  'edit-message': AiConversationUtilityPreview,
  'plan-approval-card': AiPlanningInsightPreview,
  'schedule-card': AiPlanningInsightPreview,
  'background-inbox': AiBackgroundWorkPreview,
  'tool-timeline': AiBackgroundWorkPreview,
  'quota-banner': AiBackgroundWorkPreview,
  'feedback-dialog': AiCollaborationPreview,
  'inline-citation': AiAnswerFormatPreview,
  'agent-status': AiTaskDetailPreview,
  'task-card': AiTaskDetailPreview,
  'tool-group': AiTaskDetailPreview,
  'video-player': AiToolOutputPreview,
  'search-results-tabs': AiToolOutputPreview,
  'email-composer': AiToolOutputPreview,
}

export function AiAgentPreview({ slug }: PreviewProps) {
  const Preview = aiPreviewCollections[slug]

  return Preview ? (
    <Suspense
      fallback={<div className="text-sm text-muted-foreground">Loading component preview…</div>}
    >
      <Preview slug={slug} />
    </Suspense>
  ) : null
}
