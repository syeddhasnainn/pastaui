import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

import { EmailComposer } from '#/components/ai/email-composer'
import { SearchResultsTabs, type SearchResultItem } from '#/components/ai/search-results-tabs'
import { VideoPlayer } from '#/components/ai/video-player'

interface PreviewProps {
  slug: string
}

const videoPlayerDuration = 74

const videoPlayerChapters = [
  { start: 0, title: 'Arrival' },
  { start: 14, title: 'Into the forest' },
  { start: 38, title: 'The ridge' },
  { start: 58, title: 'Last light' },
]

function VideoPlayerPreview() {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(18)

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(
      () => setCurrentTime((time) => (time + 0.25 >= videoPlayerDuration ? 0 : time + 0.25)),
      250,
    )
    return () => clearInterval(timer)
  }, [playing])

  return (
    <div className="w-full max-w-2xl space-y-3">
      <VideoPlayer
        chapters={videoPlayerChapters}
        className="w-full"
        currentTime={currentTime}
        duration={videoPlayerDuration}
        onPlayingChange={setPlaying}
        onSeek={setCurrentTime}
        playing={playing}
        subtitle="A moment outdoors"
        title="Into the wild"
      />
      <p className="text-center text-xs leading-5 font-[450] text-muted-foreground">
        Space to play · ← → to seek 10s · M to mute · F for fullscreen
      </p>
    </div>
  )
}

const searchItems: SearchResultItem[] = [
  {
    id: 'postqued',
    type: 'web',
    source: 'Postqued',
    title: 'Postqued - Social Media Workspace for Teams and AI Agents',
    description:
      'Postqued is a shared social media workspace where teams and AI agents plan, approve, and publish across 10 networks using the dashboard, API or MCP.',
    url: 'https://postqued.com/',
    icon: (
      <img
        src="/icons/companies/postqued.svg"
        alt=""
        className="size-4 object-contain dark:invert"
      />
    ),
  },
  {
    id: 'studyboost',
    type: 'web',
    source: 'Studyboost',
    title: 'Studyboost \u2014 AI-Powered Study Tools for Students',
    description:
      'Upload your notes, textbooks, and slides. Get AI-generated flashcards, quizzes, summaries, and answers that cite your exact sources.',
    url: 'https://studyboost.org/',
    icon: (
      <img
        src="/icons/companies/studyboost.svg"
        alt=""
        className="size-4 scale-150 object-contain dark:invert"
      />
    ),
  },
  {
    id: 'aismartdecor',
    type: 'web',
    source: 'AI Smart Decor',
    title: 'AI Smart Decor - Transform Your Interior Design in Seconds',
    description:
      'Transform your interior design with AI. Upload a photo to redesign any room in seconds: virtual staging, sketch-to-render, wall recoloring, 50+ styles.',
    url: 'https://aismartdecor.com/',
    icon: <img src="/icons/companies/aismartdecor.svg" alt="" className="size-4 object-contain" />,
  },
  {
    id: 'workspace-1',
    type: 'images',
    source: 'Unsplash',
    icon: (
      <img
        src="/icons/companies/unsplash.svg"
        alt=""
        className="size-4 object-contain dark:invert"
      />
    ),
    title: 'Minimal home office',
    url: 'https://unsplash.com/photos/modern-laptop-and-keyboard-on-a-home-office-desk-vR2kup7Uyds',
    image: '/images/search/workspace-1.jpg',
    imageAlt: 'Minimal home office',
  },
  {
    id: 'workspace-2',
    type: 'images',
    source: 'Unsplash',
    icon: (
      <img
        src="/icons/companies/unsplash.svg"
        alt=""
        className="size-4 object-contain dark:invert"
      />
    ),
    title: 'A creative workspace',
    url: 'https://unsplash.com/photos/modern-workspace-with-a-laptop-and-desk-setup-JGKPDKiqJVw',
    image: '/images/search/workspace-2.jpg',
    imageAlt: 'A creative workspace',
  },
  {
    id: 'workspace-3',
    type: 'images',
    source: 'Unsplash',
    icon: (
      <img
        src="/icons/companies/unsplash.svg"
        alt=""
        className="size-4 object-contain dark:invert"
      />
    ),
    title: 'Desk setup with books',
    url: 'https://unsplash.com/photos/a-modern-desk-setup-with-laptop-and-books-xjyHDnA93Pk',
    image: '/images/search/workspace-3.jpg',
    imageAlt: 'Desk setup with books',
  },
  {
    type: 'news',
    id: 'bbc',
    source: 'BBC',
    title: 'Shaun the Sheep creators say AI will never replace storytelling as new film launches',
    description:
      'The Bristol animation studio explores the craft of storytelling as the latest Shaun the Sheep film arrives in cinemas.',
    url: '#',
    publishedLabel: '16 hours ago',
    icon: <img src="/icons/companies/bbc.svg" alt="" className="size-4 object-contain" />,
  },
  {
    type: 'news',
    id: 'sky-news',
    source: 'Sky News',
    title: 'AI latest: King joins debate as ChatGPT maker discovers concerning message',
    description:
      'King Charles brings AI leaders together for a summit as companies face fresh questions about safety and control.',
    url: '#',
    publishedLabel: '1 day ago',
    icon: <img src="/icons/companies/sky-news.svg" alt="" className="size-4 object-contain" />,
  },
  {
    type: 'news',
    id: 'cnbc',
    source: 'CNBC',
    title:
      'OpenAI\u2019s latest AI revelation is a serious situation, Microsoft\u2019s Suleyman tells CNBC',
    description:
      'Microsoft AI chief Mustafa Suleyman discusses new safety concerns and the need to keep increasingly powerful AI systems aligned with people.',
    url: '#',
    publishedLabel: '14 hours ago',
    icon: <img src="/icons/companies/cnbc.svg" alt="" className="size-4 object-contain" />,
  },
]

function SearchResultsTabsPreview() {
  const [activeType, setActiveType] = useState<SearchResultItem['type']>('web')
  return (
    <div className="min-h-[37rem] w-full max-w-3xl">
      <SearchResultsTabs
        showTabs
        activeType={activeType}
        onActiveTypeChange={setActiveType}
        items={searchItems}
        query="Tools for product teams"
      />
    </div>
  )
}

const emailComposerDraft =
  'Hi team,\n\nThe new agent component collection is ready for review. It focuses on complete application workflows rather than low-level primitives.\n\nCould you share feedback by Friday?\n\nThanks,\nSam'

const emailComposerTeam = ['design@pastaui.dev', 'maya@pastaui.dev']

function EmailComposerPreview() {
  const [recipients, setRecipients] = useState<string[]>(emailComposerTeam)
  const [subject, setSubject] = useState('Launch review for Pasta UI')
  const [body, setBody] = useState(emailComposerDraft.slice(0, 140))
  const [typed, setTyped] = useState(140)
  const drafting = typed < emailComposerDraft.length

  useEffect(() => {
    if (recipients.length >= emailComposerTeam.length || typed > 0) return
    const timer = setTimeout(
      () => setRecipients(emailComposerTeam.slice(0, recipients.length + 1)),
      450,
    )
    return () => clearTimeout(timer)
  }, [recipients, typed])

  useEffect(() => {
    if (!drafting || recipients.length < emailComposerTeam.length) return
    const timer = setTimeout(() => {
      const next = Math.min(typed + 3, emailComposerDraft.length)
      setTyped(next)
      setBody(emailComposerDraft.slice(0, next))
    }, 22)
    return () => clearTimeout(timer)
  }, [drafting, recipients, typed])

  return (
    <EmailComposer
      body={body}
      className="w-full max-w-2xl"
      drafting={drafting}
      onBodyChange={setBody}
      onRecipientsChange={setRecipients}
      onSubjectChange={setSubject}
      onSubmit={() => new Promise((resolve) => setTimeout(resolve, 1100))}
      recipients={recipients}
      subject={subject}
    />
  )
}

const toolOutputPreviews: Record<string, ComponentType> = {
  'video-player': VideoPlayerPreview,
  'search-results-tabs': SearchResultsTabsPreview,
  'email-composer': EmailComposerPreview,
}

export function AiToolOutputPreview({ slug }: PreviewProps) {
  const Preview = toolOutputPreviews[slug]
  return Preview ? <Preview /> : null
}
