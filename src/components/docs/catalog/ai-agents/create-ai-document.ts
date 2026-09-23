import { createInstallCommand } from '../create-install-command'
import type { ComponentDocument } from '../types'

type AiDocument = Omit<ComponentDocument, 'group' | 'installation'>

export function createAiDocument(document: AiDocument): ComponentDocument {
  return {
    ...document,
    group: 'AI agents',
    installation: createInstallCommand(document.slug),
  }
}
