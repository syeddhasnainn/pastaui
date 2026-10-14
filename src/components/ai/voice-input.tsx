import { Microphone2Icon as MicIcon } from '@solar-icons/react/linear/microphone-2'
import { PauseIcon } from '@solar-icons/react/bold/pause'
import { ArrowUpIcon } from '@solar-icons/react/linear/arrow-up'
import { TrashBinMinimalisticIcon as TrashIcon } from '@solar-icons/react/linear/trash-bin-minimalistic'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface VoiceInputProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  duration?: string
  onCancel?: () => void
  onRecordingChange?: (recording: boolean) => void
  onSend?: () => void
  placeholder?: string
  recording?: boolean
  transcript?: string
}

const waveform = [
  32, 23, 10, 54, 54, 46, 32, 23, 12, 55, 98, 46, 54, 33, 23, 34, 54, 46, 32, 23, 13, 45, 64, 54,
]

const ease = [0.23, 1, 0.32, 1] as const

const primaryButton =
  'rounded-full bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] hover:brightness-110 dark:bg-none'

function VoiceInput({
  className,
  duration = '00:00',
  onCancel,
  onRecordingChange,
  onSend,
  placeholder = 'Tap the microphone and start speaking',
  recording,
  transcript,
  ...props
}: VoiceInputProps) {
  const [internalRecording, setInternalRecording] = useState(false)
  const isRecording = recording ?? internalRecording
  const hasTake = Boolean(transcript) || duration !== '00:00'

  function toggleRecording() {
    const next = !isRecording
    if (recording === undefined) setInternalRecording(next)
    onRecordingChange?.(next)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-recording={isRecording}
        data-slot="voice-input"
        className={cn(
          'w-full rounded-[16px] bg-muted p-4 text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
          className,
        )}
        {...props}
      >
        <p aria-live="polite" className="min-h-12 px-1 pb-3 leading-6">
          {transcript ? (
            <AnimatePresence initial={false}>
              {transcript.split(' ').map((word, index) => (
                <motion.span
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  initial={{ opacity: 0, filter: 'blur(3px)' }}
                  key={`${index}-${word}`}
                  transition={{ duration: 0.3, ease }}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </AnimatePresence>
          ) : (
            <span>{isRecording ? 'Listening…' : placeholder}</span>
          )}
        </p>
        <div className="flex items-center gap-4">
          <Button
            aria-label={
              isRecording ? 'Pause recording' : hasTake ? 'Resume recording' : 'Start recording'
            }
            aria-pressed={isRecording}
            type="button"
            variant="default"
            size="icon"
            className={cn('size-12 shrink-0', primaryButton)}
            onClick={toggleRecording}
          >
            <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 *:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:*:transition-opacity">
              <MicIcon
                aria-hidden="true"
                className={cn('size-5', isRecording && 'scale-75 opacity-0')}
              />
              <PauseIcon
                aria-hidden="true"
                className={cn('size-5', !isRecording && 'scale-75 opacity-0')}
              />
            </span>
          </Button>
          <div
            aria-hidden="true"
            className="relative h-20 min-w-0 flex-1 overflow-hidden rounded-[10px] bg-muted"
          >
            <div
              className="absolute inset-x-0 inset-y-[24%]"
              style={{ maskImage: 'linear-gradient(to right, #000 50%, #0003 50%)' }}
            >
              <div
                className="voice-input-waveform flex h-full w-[200%]"
                style={{ animationPlayState: isRecording ? 'running' : 'paused' }}
              >
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    className="flex h-full w-1/2 shrink-0 items-center justify-around"
                  >
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
        </div>
        <div className="mt-3 flex h-8 items-center gap-2 px-1">
          <span className="relative flex size-2" aria-hidden="true">
            {isRecording && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75 motion-reduce:animate-none" />
            )}
            <span
              className={cn(
                'relative inline-flex size-2 rounded-full',
                isRecording ? 'bg-destructive' : 'bg-muted-foreground',
              )}
            />
          </span>
          <span className="text-xs leading-5 tabular-nums">{duration}</span>
          <span className="sr-only">
            {isRecording ? 'Recording' : hasTake ? 'Recording paused' : 'Not recording'}
          </span>
          <AnimatePresence initial={false}>
            {hasTake && (onCancel || onSend) && (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="ml-auto flex items-center gap-1.5"
                exit={{ opacity: 0, x: 6 }}
                initial={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2, ease }}
              >
                {onCancel && (
                  <Button
                    className="h-8 rounded-full px-3 text-muted-foreground hover:text-muted-foreground"
                    onClick={onCancel}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <TrashIcon aria-hidden="true" data-icon="inline-start" /> Discard
                  </Button>
                )}
                {onSend && (
                  <Button
                    aria-label="Send recording"
                    className={cn('size-8', primaryButton)}
                    onClick={onSend}
                    size="icon"
                    type="button"
                    variant="default"
                  >
                    <ArrowUpIcon aria-hidden="true" className="size-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}

export { VoiceInput }
export type { VoiceInputProps }
