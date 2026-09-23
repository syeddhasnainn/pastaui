import { createAiDocument } from './create-ai-document'

export const aiAnswerFormatComponents = [
  createAiDocument({
    slug: 'inline-citation',
    name: 'Inline Citation',
    description: 'A numbered reference inside prose with an inspectable source preview.',
    usage: `import { InlineCitation } from "@/components/ai/inline-citation"

export function Example() {
  return <InlineCitation index={1} title="Agent UI report" source="Pasta Research" />
}`,
    source: `<span>
  <CitationMarker index={index} />
  {open && <CitationPreview title={title} source={source} excerpt={excerpt} />}
</span>`,
    api: [
      {
        name: 'index',
        type: 'number',
        defaultValue: '—',
        description: 'Displays the reference number.',
      },
      {
        name: 'open / onOpenChange',
        type: 'boolean / (open: boolean) => void',
        defaultValue: 'false / —',
        description: 'Controls the citation preview.',
      },
      {
        name: 'onOpenSource',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens the original source.',
      },
    ],
  }),
]
