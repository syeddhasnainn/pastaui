import { createAiDocument } from './create-ai-document'

export const aiToolOutputComponents = [
  createAiDocument({
    slug: 'video-player',
    name: 'Video Player',
    description: 'A compact video result with controllable playback, seek position, and metadata.',
    usage: `import { VideoPlayer } from "@/components/ai/video-player"

export function Example() {
  return <VideoPlayer title="Generated demo" duration={74} currentTime={time} onSeek={setTime} />
}`,
    source: `<VideoPlayer
  title="Launch film"
  duration={74}
  currentTime={currentTime}
  playing={playing}
/>`,
    api: [
      {
        name: 'title',
        type: 'ReactNode',
        defaultValue: '—',
        description: 'Labels the generated or retrieved video.',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '—',
        description: 'Sets the duration in seconds.',
      },
      {
        name: 'currentTime',
        type: 'number',
        defaultValue: '—',
        description: 'Controls the playhead position.',
      },
      {
        name: 'playing',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Controls the playback state.',
      },
      {
        name: 'poster',
        type: 'ReactNode',
        defaultValue: '—',
        description: 'Renders a custom poster surface.',
      },
    ],
  }),
  createAiDocument({
    slug: 'search-results-tabs',
    name: 'Search Results Tabs',
    description:
      'Ranked search results with site icons, titles, source URLs, and plain text category tabs.',
    usage: `import { SearchResultsTabs } from "@/components/ai/search-results-tabs"

export function Example() {
  return <SearchResultsTabs query={query} items={items} activeType={type} showTabs onActiveTypeChange={setType} />
}`,
    source: `<SearchResultsTabs
  query="Agent interface patterns"
  items={results}
  activeType="web"
/>`,
    api: [
      {
        name: 'query',
        type: 'string',
        defaultValue: '—',
        description: 'Names the search results for assistive technology.',
      },
      {
        name: 'items',
        type: 'SearchResultItem[]',
        defaultValue: '—',
        description:
          'Supplies typed search results. News items support publishedLabel for relative time and optional publishedAt for an ISO timestamp.',
      },
      {
        name: 'activeType',
        type: '"web" | "images" | "news"',
        defaultValue: '—',
        description: 'Filters results by type. Defaults to web.',
      },
      {
        name: 'showTabs',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Shows optional Web, Images, and News filters.',
      },
      {
        name: 'onOpen',
        type: '(id: string) => void',
        defaultValue: '—',
        description: 'Opens a result.',
      },
    ],
  }),
  createAiDocument({
    slug: 'email-composer',
    name: 'Email Composer',
    description:
      'A minimal email draft with inline fields, a spacious message, and copy, expand, and send actions.',
    usage: `import { EmailComposer } from "@/components/ai/email-composer"

export function Example() {
  return <EmailComposer recipients={recipients} subject={subject} body={body} onSubmit={sendEmail} />
}`,
    source: `<EmailComposer
  recipients={recipients}
  subject={subject}
  body={body}
  onSubmit={sendEmail}
/>`,
    api: [
      {
        name: 'recipients',
        type: 'string[]',
        defaultValue: '—',
        description: 'Displays recipient addresses separated by commas.',
      },
      {
        name: 'subject',
        type: 'string',
        defaultValue: '—',
        description: 'Controls the subject line.',
      },
      { name: 'body', type: 'string', defaultValue: '—', description: 'Controls the email body.' },
      {
        name: 'onRecipientsChange',
        type: '(value: string[]) => void',
        defaultValue: '—',
        description: 'Updates the recipient addresses.',
      },
      {
        name: 'onSubmit',
        type: '() => void',
        defaultValue: '—',
        description: 'Handles sending the draft. Send is disabled when omitted.',
      },
    ],
  }),
]
