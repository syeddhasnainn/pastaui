import type { ComponentType } from 'react'
import { useState } from 'react'

import { AudioPlayer } from '#/components/ai/audio-player'

interface PreviewProps {
  slug: string
}

function AudioPlayerPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(42)

  return (
    <AudioPlayer
      artworkUrl="https://images.unsplash.com/photo-1718465280370-7074c2d6404f?auto=format&fit=crop&h=160&q=85&w=160"
      className="w-full max-w-lg"
      currentTime={currentTime}
      duration={186}
      isPlaying={isPlaying}
      onChange={setCurrentTime}
      onToggle={() => setIsPlaying((current) => !current)}
      subtitle="Generated briefing · 3:06"
      title="Agent UI landscape"
    />
  )
}

const structuredOutputPreviews: Record<string, ComponentType> = {
  'audio-player': AudioPlayerPreview,
}

export function AiStructuredOutputPreview({ slug }: PreviewProps) {
  const Preview = structuredOutputPreviews[slug]

  return Preview ? <Preview /> : null
}
