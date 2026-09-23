import { aiAgentComponents } from './ai-agents'
import type { ComponentDocument } from './types'

export type { ApiProperty, ComponentDocument } from './types'

export const componentCatalog: ComponentDocument[] = aiAgentComponents

export const componentGroups = [...new Set(componentCatalog.map((component) => component.group))]

export function getComponentDocument(slug: string) {
  return componentCatalog.find((component) => component.slug === slug)
}
