import { aiActivityComponents, imageGenerationLoaderComponent } from './activity-components'
import { aiAnswerFormatComponents } from './answer-format-components'
import { aiBackgroundWorkComponents } from './background-work-components'
import { aiCollaborationComponents } from './collaboration-components'
import { aiConversationComponents } from './conversation-components'
import { aiConversationUtilityComponents } from './conversation-utility-components'
import { aiDeveloperOutputComponents } from './developer-output-components'
import { aiExecutionComponents } from './execution-components'
import { aiOperationsComponents } from './operations-components'
import { aiPlanningInsightComponents } from './planning-insight-components'
import { aiRichOutputComponents } from './rich-output-components'
import { aiStructuredOutputComponents, dataTableComponent } from './structured-output-components'
import { aiTaskDetailComponents } from './task-detail-components'
import { aiToolOutputComponents } from './tool-output-components'
import type { ComponentDocument } from '../types'

function withCategory(category: string, components: ComponentDocument[]) {
  return components.map((component) => ({ ...component, category }))
}

export const aiAgentComponents = [
  ...withCategory('Featured', [dataTableComponent, imageGenerationLoaderComponent]),
  ...withCategory('Conversation', aiConversationComponents),
  ...withCategory('Conversation', aiConversationUtilityComponents),
  ...withCategory('Tools & execution', aiExecutionComponents),
  ...withCategory('Tools & execution', aiTaskDetailComponents),
  ...withCategory('Agent activity', aiActivityComponents),
  ...withCategory('Runs & operations', aiBackgroundWorkComponents),
  ...withCategory('Runs & operations', aiOperationsComponents),
  ...withCategory('Runs & operations', aiPlanningInsightComponents),
  ...withCategory('Coordination', aiCollaborationComponents),
  ...withCategory('Rich output', aiAnswerFormatComponents),
  ...withCategory('Rich output', aiRichOutputComponents),
  ...withCategory('Rich output', aiStructuredOutputComponents),
  ...withCategory('Rich output', aiToolOutputComponents),
  ...withCategory('Developer', aiDeveloperOutputComponents),
]
