import { createAiDocument } from './create-ai-document'

export const aiStructuredOutputComponents = [
  createAiDocument({
    slug: 'audio-player',
    name: 'Audio Player',
    description:
      'A controlled playback surface for speech, generated audio, and recorded tool output.',
    usage: `import { AudioPlayer } from "@/components/ai/audio-player"

export function Example() {
  return <AudioPlayer title="Briefing" currentTime={42} duration={186} />
}`,
    source: `<section>
  <AudioIdentity title={title} subtitle={subtitle} />
  <PlaybackButton isPlaying={isPlaying} />
  <Slider value={currentTime} max={duration} />
</section>`,
    api: [
      {
        name: 'currentTime',
        type: 'number',
        defaultValue: '—',
        description: 'Controls the playback position in seconds.',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '—',
        description: 'Defines the full audio duration.',
      },
      { name: 'onToggle', type: '() => void', defaultValue: '—', description: 'Toggles playback.' },
      {
        name: 'artworkUrl',
        type: 'string',
        defaultValue: '—',
        description: 'Displays cover art beside the track details.',
      },
      {
        name: 'onPrevious',
        type: '() => void',
        defaultValue: '—',
        description: 'Selects the previous track; otherwise rewinds 10 seconds using onChange.',
      },
      {
        name: 'onNext',
        type: '() => void',
        defaultValue: '—',
        description: 'Selects the next track; otherwise advances 10 seconds using onChange.',
      },
      {
        name: 'onOutput',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens your audio-output picker when provided.',
      },
      {
        name: 'onChange',
        type: '(time: number) => void',
        defaultValue: '—',
        description: 'Seeks to a new playback position.',
      },
    ],
  }),
]
