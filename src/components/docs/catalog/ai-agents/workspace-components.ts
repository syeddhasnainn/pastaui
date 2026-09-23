import { createAiDocument } from './create-ai-document'

export const aiWorkspaceComponents = [
  createAiDocument({
    slug: 'ai-sidebar',
    name: 'AI Sidebar',
    description:
      'A compact agent workspace navigator for projects, folders, files, and saved references.',
    usage: `import { AiSidebar } from "@/components/ai/ai-sidebar"

export function Example() {
  return <AiSidebar items={workspaceItems} onSelect={openItem} />
}`,
    source: `<aside>
  <WorkspaceTitle>{title}</WorkspaceTitle>
  {items.map(item => <WorkspaceItem item={item} />)}
</aside>`,
    api: [
      {
        name: 'items',
        type: 'AiSidebarItem[]',
        defaultValue: '—',
        description: 'Provides projects, folders, files, and bookmarks.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Opens the selected workspace item.',
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Workspace',
        description: 'Labels the navigation region.',
      },
    ],
  }),
]
