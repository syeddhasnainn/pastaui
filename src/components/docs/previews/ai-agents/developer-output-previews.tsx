import type { ComponentType } from 'react'
import { useState } from 'react'

import { Commit } from '#/components/ai/commit'
import { EnvironmentVariables } from '#/components/ai/environment-variables'

interface PreviewProps {
  slug: string
}

function CommitPreview() {
  const [showDiff, setShowDiff] = useState(false)
  return (
    <div className="w-full max-w-2xl space-y-3">
      <Commit
        files={[
          { path: 'src/components/ai/permission-grant.tsx', additions: 1, deletions: 1 },
          { path: 'DESIGN.md', additions: 1, deletions: 0 },
        ]}
        onOpen={() => setShowDiff((current) => !current)}
      />
      {showDiff && (
        <div className="space-y-3 rounded-[16px] bg-card p-4 text-xs shadow-card">
          <p className="font-mono text-muted-foreground">src/components/ai/permission-grant.tsx</p>
          <pre className="overflow-x-auto leading-6">
            <code>
              <span className="block text-red-600 dark:text-red-400">− text-sm leading-6</span>
              <span className="block text-emerald-600 dark:text-emerald-400">
                + text-xs leading-5
              </span>
            </code>
          </pre>
          <p className="font-mono text-muted-foreground">DESIGN.md</p>
          <pre className="overflow-x-auto leading-6 text-emerald-600 dark:text-emerald-400">
            <code>+ Supporting text: 12px, weight 450.</code>
          </pre>
        </div>
      )}
    </div>
  )
}

function EnvironmentVariablesPreview() {
  const [revealedIds, setRevealedIds] = useState<string[]>([])

  function toggleVariable(id: string) {
    setRevealedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <EnvironmentVariables
      className="w-full max-w-lg"
      items={[
        {
          id: 'database',
          key: 'DATABASE_URL',
          value: 'postgres://pasta:••••@db.internal',
          scope: 'Production',
        },
        {
          id: 'openai',
          key: 'OPENAI_API_KEY',
          value: 'sk-proj-••••••••',
          scope: 'All environments',
        },
        { id: 'site', key: 'PUBLIC_SITE_URL', value: 'https://pastaui.dev', scope: 'Public' },
      ]}
      onToggle={toggleVariable}
      revealedIds={revealedIds}
    />
  )
}

const developerOutputPreviews: Record<string, ComponentType> = {
  commit: CommitPreview,
  'environment-variables': EnvironmentVariablesPreview,
}

export function AiDeveloperOutputPreview({ slug }: PreviewProps) {
  const Preview = developerOutputPreviews[slug]

  return Preview ? <Preview /> : null
}
