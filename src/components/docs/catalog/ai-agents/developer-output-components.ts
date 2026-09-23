// Vite exposes raw file contents as a default export.
// oxlint-disable-next-line import/default
import commitSource from '#/components/ai/commit.tsx?raw'
import { createAiDocument } from './create-ai-document'

export const aiDeveloperOutputComponents = [
  createAiDocument({
    slug: 'commit',
    name: 'Commit',
    description:
      'An expandable changed-file summary with folder groups, line counts, and a diff action.',
    usage: `import { Commit } from "@/components/ai/commit"

export function Example() {
  return <Commit files={[
    { path: "src/components/ai/permission-grant.tsx", additions: 1, deletions: 1 },
    { path: "DESIGN.md", additions: 1, deletions: 0 },
  ]} onOpen={() => console.log("Open diff")} />
}`,
    source: commitSource,
    api: [
      {
        name: 'files',
        type: 'CommitFile[]',
        defaultValue: '—',
        description:
          'Changed files with path, additions, and deletions. Folder groups and totals are computed automatically.',
      },
      {
        name: 'onOpen',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens your diff view. The action is disabled when omitted.',
      },
    ],
  }),
  createAiDocument({
    slug: 'environment-variables',
    name: 'Environment Variables',
    description:
      'A secret-aware configuration surface with masked values and explicit reveal or copy actions.',
    usage: `import { EnvironmentVariables } from "@/components/ai/environment-variables"

export function Example() {
  return <EnvironmentVariables items={variables} revealedIds={revealed} />
}`,
    source: `<section>
  {items.map(item => <MaskedVariable item={item} revealed={revealedIds.includes(item.id)} />)}
</section>`,
    api: [
      {
        name: 'items',
        type: 'EnvironmentVariable[]',
        defaultValue: '—',
        description: 'Provides keys, secret values, and environment scopes.',
      },
      {
        name: 'revealedIds',
        type: 'string[]',
        defaultValue: '[]',
        description: 'Controls which values are visible.',
      },
      {
        name: 'onToggle',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Reveals or masks a selected value.',
      },
      {
        name: 'onCopy',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Copies a selected value.',
      },
    ],
  }),
]
