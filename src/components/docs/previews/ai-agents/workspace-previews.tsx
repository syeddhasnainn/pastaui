import type { ComponentType } from 'react'

import { AiSidebar } from '#/components/ai/ai-sidebar'

interface PreviewProps {
  slug: string
}

function AiSidebarPreview() {
  return (
    <AiSidebar
      className="w-full max-w-xs"
      items={[
        { id: 'pasta', label: 'Pasta UI', kind: 'project', expanded: true, meta: '12' },
        { id: 'research', label: 'Research', kind: 'folder', depth: 1, expanded: true },
        { id: 'directory', label: 'Registry directory', kind: 'file', depth: 2 },
        { id: 'taxonomy', label: 'Component taxonomy', kind: 'file', depth: 2, active: true },
        { id: 'build', label: 'Implementation', kind: 'folder', depth: 1, meta: '51' },
        { id: 'reference', label: 'Agent patterns', kind: 'bookmark' },
      ]}
      title="Agent workspace"
    />
  )
}

const workspacePreviews: Record<string, ComponentType> = {
  'ai-sidebar': AiSidebarPreview,
}

export function AiWorkspacePreview({ slug }: PreviewProps) {
  const Preview = workspacePreviews[slug]

  return Preview ? <Preview /> : null
}
