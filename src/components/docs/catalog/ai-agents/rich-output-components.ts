import { createAiDocument } from './create-ai-document'

export const aiRichOutputComponents = [
  createAiDocument({
    slug: 'file-tree',
    name: 'File Tree',
    description: 'A compact repository tree with selection, nesting, expansion, and change status.',
    usage: `import { FileTree } from "@/components/ai/file-tree"

export function Example() {
  return <FileTree items={files} selectedId="prompt-input" />
}`,
    source: `<ul>
  {items.map(item => <FileTreeRow item={item} selected={item.id === selectedId} />)}
</ul>`,
    api: [
      {
        name: 'items',
        type: 'FileTreeItem[]',
        defaultValue: '—',
        description: 'Provides visible files, folders, nesting, and change state.',
      },
      {
        name: 'selectedId',
        type: 'string',
        defaultValue: '—',
        description: 'Marks the currently selected node.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Handles file or folder selection.',
      },
    ],
  }),
  createAiDocument({
    slug: 'retrieval-chunks',
    name: 'Retrieval Chunks',
    description: 'Ranked source passages that make retrieval-augmented answers inspectable.',
    usage: `import { RetrievalChunks } from "@/components/ai/retrieval-chunks"

export function Example() {
  return <RetrievalChunks query="How are approvals handled?" items={chunks} />
}`,
    source: `<section>
  <RetrievalQuery>{query}</RetrievalQuery>
  {items.map(item => <RankedChunk item={item} />)}
</section>`,
    api: [
      {
        name: 'query',
        type: 'string',
        defaultValue: '—',
        description: 'Shows the retrieval query used for the search.',
      },
      {
        name: 'items',
        type: 'RetrievalChunk[]',
        defaultValue: '—',
        description: 'Provides ranked source passages and relevance scores.',
      },
      {
        name: 'onOpen',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Opens a selected source passage.',
      },
    ],
  }),
  createAiDocument({
    slug: 'document-reference',
    name: 'Document Reference',
    description:
      'A source card that preserves document identity, location, metadata, and the cited excerpt.',
    usage: `import { DocumentReference } from "@/components/ai/document-reference"

export function Example() {
  return <DocumentReference title="Agent design guide" location="Page 14" excerpt="…" />
}`,
    source: `<article>
  <DocumentIdentity title={title} location={location} />
  {excerpt && <blockquote>{excerpt}</blockquote>}
</article>`,
    api: [
      {
        name: 'title',
        type: 'string',
        defaultValue: '—',
        description: 'Names the referenced document.',
      },
      {
        name: 'location',
        type: 'string',
        defaultValue: '—',
        description: 'Identifies a page, line range, or section.',
      },
      {
        name: 'excerpt',
        type: 'string',
        defaultValue: '—',
        description: 'Displays the cited source passage.',
      },
      {
        name: 'onOpen',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens the original document.',
      },
    ],
  }),
  createAiDocument({
    slug: 'research-report',
    name: 'Research Report',
    description: 'A structured, citation-ready report for research agents and deep-search results.',
    usage: `import { ResearchReport } from "@/components/ai/research-report"

export function Example() {
  return <ResearchReport title="Market landscape" summary="…" sections={sections} />
}`,
    source: `<article>
  <ReportSummary title={title} summary={summary} />
  {sections.map(section => <ReportSection section={section} />)}
  <SourceList sources={sources} />
</article>`,
    api: [
      {
        name: 'sections',
        type: 'ResearchReportSection[]',
        defaultValue: '—',
        description: 'Provides the report body as named sections.',
      },
      {
        name: 'sources',
        type: 'ResearchReportSource[]',
        defaultValue: '[]',
        description: 'Lists supporting sources.',
      },
      {
        name: 'onOpenSource',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Opens a selected report source.',
      },
    ],
  }),
  createAiDocument({
    slug: 'link-preview',
    name: 'Link Preview',
    description:
      'A horizontal link preview with an image, seller details, and optional product pricing and ratings.',
    usage: `import { LinkPreview } from "@/components/ai/link-preview"

export function Example() {
  return <LinkPreview url="https://www.amazon.com/s?k=eau+de+parfum" title="Eau de Parfum" siteName="Amazon.com" price="$75.65" rating={4.7} reviewCount="38K" />
}`,
    source: `<article>
  <LinkImage src={imageSrc} />
  <LinkMetadata title={title} description={description} url={url} />
</article>`,
    api: [
      {
        name: 'url',
        type: 'string',
        defaultValue: '—',
        description: 'Identifies the destination and displayed hostname.',
      },
      {
        name: 'imageSrc',
        type: 'string',
        defaultValue: '—',
        description: 'Displays an optional preview image.',
      },
      {
        name: 'price',
        type: 'string',
        defaultValue: '—',
        description: 'Displays a formatted price, including its currency.',
      },
      {
        name: 'seller',
        type: 'string',
        defaultValue: '—',
        description: 'Displays the seller beside the site name.',
      },
      {
        name: 'rating',
        type: 'number',
        defaultValue: '—',
        description: 'Displays a star rating out of five.',
      },
      {
        name: 'reviewCount',
        type: 'string',
        defaultValue: '—',
        description: 'Displays the formatted review count beside the rating.',
      },
      {
        name: 'onOpen',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens the destination.',
      },
    ],
  }),
]
