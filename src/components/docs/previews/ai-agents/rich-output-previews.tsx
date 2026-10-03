import type { ComponentType } from 'react'

import { DocumentReference } from '#/components/ai/document-reference'
import { FileTree } from '#/components/ai/file-tree'
import { LinkPreview } from '#/components/ai/link-preview'
import { ResearchReport } from '#/components/ai/research-report'
import { RetrievalChunks } from '#/components/ai/retrieval-chunks'

interface PreviewProps {
  slug: string
}

function FileTreePreview() {
  return (
    <FileTree
      className="w-full max-w-sm"
      items={[
        { id: 'src', name: 'src', kind: 'folder', expanded: true },
        { id: 'components', name: 'components', kind: 'folder', depth: 1, expanded: true },
        {
          id: 'prompt-input',
          name: 'prompt-input.tsx',
          kind: 'file',
          depth: 2,
          status: 'modified',
        },
        { id: 'artifact', name: 'artifact.tsx', kind: 'file', depth: 2, status: 'added' },
        { id: 'routes', name: 'routes', kind: 'folder', depth: 1 },
        { id: 'package', name: 'package.json', kind: 'file', status: 'modified' },
        { id: 'readme', name: 'README.md', kind: 'file' },
      ]}
      selectedId="artifact"
      title="Repository"
    />
  )
}

function RetrievalChunksPreview() {
  return (
    <RetrievalChunks
      className="w-full max-w-xl"
      items={[
        {
          id: 'permissions',
          source: 'Agent security guide',
          location: '§ Permissions',
          score: 0.94,
          content:
            'Request the narrowest capability that completes the task and make its duration visible before execution.',
        },
        {
          id: 'approval',
          source: 'Human-in-the-loop patterns',
          location: 'Page 8',
          score: 0.87,
          content:
            'Approval surfaces should explain the proposed action, scope, and likely consequence in plain language.',
        },
      ]}
      onOpen={() => undefined}
      query="How should agent permissions be presented?"
    />
  )
}

function DocumentReferencePreview() {
  return (
    <DocumentReference
      className="w-full max-w-lg"
      excerpt="A permission request should expose capability, scope, duration, and the exact action that proceeds after consent."
      location="Page 14"
      metadata="Updated Sep 2026"
      title="Agent interface design guide.pdf"
    />
  )
}

function ResearchReportPreview() {
  return (
    <ResearchReport
      className="w-full"
      sections={[
        {
          id: 'finding',
          title: 'The opportunity',
          content:
            'Most libraries stop at chat primitives. Product teams still rebuild approvals, tool execution, recovery, and durable output from scratch.',
        },
        {
          id: 'execution',
          title: 'Tool execution and approvals',
          content:
            'A tool call needs to show what will happen, which resources it can access, and whether the user can stop it. Approval belongs beside the proposed action so the decision stays connected to its consequences.\n\nOnce execution starts, the same surface should show progress and the result. If a call fails, keep the attempted action visible and offer a specific recovery step.',
        },
        {
          id: 'recovery',
          title: 'Failure and recovery',
          level: 3,
          content:
            'Distinguish a temporary connection problem from an action that needs new input. Preserve completed work when retrying, and make it clear which step will run again.',
        },
        {
          id: 'outputs',
          title: 'Reports and durable output',
          content:
            'Long-form results need a reading surface with stable headings, source links, and navigation. Keep the report readable independently of the conversation that produced it.\n\nA compact contents rail lets readers move between findings without keeping a sidebar open. The active section should follow the reader as they scroll.',
        },
        {
          id: 'context',
          title: 'Context and memory',
          content:
            'Readers need to understand which documents, decisions, and preferences informed a result. Show the relevant context beside the work and let people correct an outdated assumption before it shapes the next step.',
        },
        {
          id: 'context-limits',
          title: 'Context limits',
          level: 3,
          content:
            'When a conversation grows too long, explain what remains available and what has been summarized. Keep important constraints visible so users can confirm that the agent still understands the task.',
        },
        {
          id: 'background',
          title: 'Background work',
          content:
            'Long-running tasks should remain accessible after the user leaves the conversation. Give each run a stable name, a current state, and a clear place to review its output. Progress updates should describe completed work and the next meaningful step.',
        },
        {
          id: 'notifications',
          title: 'Notifications and handoffs',
          level: 3,
          content:
            'Notify people when a decision is needed or a result is ready. Include enough context to resume the task without rereading the entire conversation, and distinguish requests for input from routine progress updates.',
        },
        {
          id: 'collaboration',
          title: 'Collaboration and ownership',
          content:
            'Shared work needs a visible owner and a record of decisions. Make it clear who requested an action, who approved it, and which version of the result is current. Comments should stay attached to the section or artifact they discuss.',
        },
        {
          id: 'accessibility',
          title: 'Accessibility and navigation',
          content:
            'Every action should be reachable with a keyboard. Long reports need consistent heading levels, visible focus, and a contents menu that can scroll independently. Respect reduced-motion preferences when moving between sections.',
        },
        {
          id: 'small-screens',
          title: 'Small-screen reading',
          level: 3,
          content:
            'Keep the reading column comfortable on narrow screens. Navigation can temporarily cover the report, but it should dismiss predictably after selecting a section and leave the reader at the chosen heading.',
        },
        {
          id: 'evaluation',
          title: 'Evaluating the experience',
          content:
            'Test complete tasks rather than isolated controls. Check whether people can identify the current state, find a supporting source, recover from a failed action, and return to a previous result without losing their place.',
        },
        {
          id: 'direction',
          title: 'Recommended direction',
          content:
            'Lead with complete agent workflows, keep state legible, and give generated work a durable place in the interface.',
        },
      ]}
      sources={[
        { id: 'directory', label: 'shadcn registry directory' },
        { id: 'agentui', label: 'Agent UI component catalog' },
      ]}
      summary="The strongest product gap is not another set of buttons. It is a coherent interface system for software that thinks and acts over time."
      title="Agent UI landscape"
    />
  )
}

function LinkPreviewExample() {
  return (
    <LinkPreview
      className="w-full max-w-lg"
      imageSrc="https://images.unsplash.com/photo-1587304655801-beb15c4dfd25?auto=format&fit=crop&w=400&h=400&q=85"
      price="$75.65"
      rating={4.7}
      reviewCount="38K"
      seller="Amazon.com-Seller"
      siteName="Amazon.com"
      title="Eau de Parfum"
      url="https://www.amazon.com/s?k=eau+de+parfum"
    />
  )
}

const richOutputPreviews: Record<string, ComponentType> = {
  'file-tree': FileTreePreview,
  'retrieval-chunks': RetrievalChunksPreview,
  'document-reference': DocumentReferencePreview,
  'research-report': ResearchReportPreview,
  'link-preview': LinkPreviewExample,
}

export function AiRichOutputPreview({ slug }: PreviewProps) {
  const Preview = richOutputPreviews[slug]

  return Preview ? <Preview /> : null
}
