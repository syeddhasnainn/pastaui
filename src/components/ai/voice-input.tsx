import { Microphone2Icon as MicIcon } from '@solar-icons/react/linear/microphone-2'
import { PauseIcon } from '@solar-icons/react/bold/pause'
import * as React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface VoiceInputProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  duration?: string
  onRecordingChange?: (recording: boolean) => void
  recording?: boolean
}

const waveform = [
  32, 23, 10, 54, 54, 46, 32, 23, 12, 55, 98, 46, 54, 33, 23, 34, 54, 46, 32, 23, 13, 45, 64, 54,
]

function VoiceInput({
  className,
  duration = '00:12',
  onRecordingChange,
  recording,
  ...props
}: VoiceInputProps) {
  const [internalRecording, setInternalRecording] = useState(false)
  const isRecording = recording ?? internalRecording

  function toggleRecording() {
    const next = !isRecording
    if (recording === undefined) setInternalRecording(next)
    onRecordingChange?.(next)
  }

  return (
    <div
      data-recording={isRecording}
      data-slot="voice-input"
      className={cn(
        'flex w-full items-center gap-4 rounded-[16px] bg-muted p-4 text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <Button
        aria-label={isRecording ? 'Pause recording' : 'Start recording'}
        aria-pressed={isRecording}
        type="button"
        variant="default"
        size="icon"
        className="size-12 rounded-full bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] hover:brightness-110 dark:bg-none"
        onClick={toggleRecording}
      >
        {isRecording ? (
          <PauseIcon aria-hidden="true" className="size-5" />
        ) : (
          <MicIcon aria-hidden="true" className="size-5" />
        )}
      </Button>
      <div
        aria-hidden="true"
        className="relative h-20 min-w-0 flex-1 overflow-hidden rounded-[10px] bg-muted"
      >
        <div
          className="absolute inset-x-0 inset-y-[24%]"
          style={{
            maskImage: 'linear-gradient(to right, #000 50%, #0003 50%)',
          }}
        >
          <div
            className="voice-input-waveform flex h-full w-[200%]"
            style={{ animationPlayState: isRecording ? 'running' : 'paused' }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex h-full w-1/2 shrink-0 items-center justify-around">
                {waveform.map((height, index) => (
                  <span
                    className="h-full w-0.5 shrink-0 rounded-full bg-muted-foreground"
                    key={`${index}-${height}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-y-0 left-1/2 w-px bg-destructive">
          <span className="absolute bottom-0 left-1/2 size-0 -translate-x-1/2 border-x-[5px] border-b-[6px] border-x-transparent border-b-destructive" />
        </div>
      </div>
      <span className="sr-only">{isRecording ? `Recording, ${duration}` : 'Recording paused'}</span>
    </div>
  )
}

export { VoiceInput }
export type { VoiceInputProps }
