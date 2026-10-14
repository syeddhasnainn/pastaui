import { CloseCircleIcon } from '@solar-icons/react/linear/close-circle'
import { LoaderIcon } from '@solar-icons/react/linear/loader'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface EmailComposerProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  body: string
  drafting?: boolean
  onBodyChange?: (value: string) => void
  onSubmit?: () => void | Promise<void>
  onSubjectChange?: (value: string) => void
  onRecipientsChange?: (value: string[]) => void
  recipients: string[]
  subject: string
}

const ease = [0.23, 1, 0.32, 1] as const
const spring = { type: 'spring', stiffness: 500, damping: 30 } as const
const shimmer = 'agent-text-shimmer'

function EmailComposer({
  body,
  className,
  drafting = false,
  onBodyChange,
  onSubmit,
  onSubjectChange,
  onRecipientsChange,
  recipients,
  subject,
  ...props
}: EmailComposerProps) {
  const id = React.useId()
  const [draftRecipient, setDraftRecipient] = React.useState('')
  const [sendState, setSendState] = React.useState<'idle' | 'sending' | 'sent'>('idle')
  const fieldClassName =
    'min-w-0 flex-1 rounded-sm bg-transparent py-4 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/60'
  const list = recipients.filter((recipient) => recipient.trim())

  async function send() {
    if (!onSubmit || sendState !== 'idle') return
    setSendState('sending')
    try {
      await onSubmit()
      setSendState('sent')
    } catch {
      setSendState('idle')
    }
  }

  function addRecipient(raw = draftRecipient) {
    const value = raw.trim().replace(/,$/, '')
    if (value && !list.includes(value)) onRecipientsChange?.([...list, value])
    setDraftRecipient('')
  }

  React.useEffect(() => {
    if (sendState !== 'sent') return
    const timer = setTimeout(() => setSendState('idle'), 2200)
    return () => clearTimeout(timer)
  }, [sendState])

  return (
    <MotionConfig reducedMotion="user">
      <form
        data-slot="email-composer"
        className={cn(
          'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
          className,
        )}
        onSubmit={(event) => {
          event.preventDefault()
          void send()
        }}
        {...props}
      >
        <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-1 sm:px-6">
          <h3 className={cn('card-heading', drafting ? shimmer : 'text-muted-foreground')}>
            {drafting ? 'Drafting email…' : 'Email'}
          </h3>
          <div className="flex items-center gap-1">
            <Button
              className={cn(
                'h-7 min-w-[4.75rem] overflow-hidden rounded-full border-0 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none transition-[filter] duration-300 hover:brightness-110',
                'bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary text-primary-foreground dark:bg-none',
              )}
              size="sm"
              variant="default"
              type="submit"
              disabled={
                !onSubmit || drafting || !list.length || !body.trim() || sendState === 'sending'
              }
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5"
                  exit={{ opacity: 0, y: -12 }}
                  initial={{ opacity: 0, y: 12 }}
                  key={sendState}
                  transition={spring}
                >
                  {sendState === 'sending' && (
                    <LoaderIcon className="size-3.5 animate-spin motion-reduce:animate-none" />
                  )}
                  {sendState === 'sent' && (
                    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 16 16">
                      <motion.path
                        animate={{ pathLength: 1 }}
                        d="M3.5 8.5 6.5 11.5 12.5 5"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        transition={{ delay: 0.1, duration: 0.3, ease }}
                      />
                    </svg>
                  )}
                  {sendState === 'idle' ? 'Send' : sendState === 'sending' ? 'Sending' : 'Sent'}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </header>
        <div className="px-5 sm:px-6">
          <div className="flex items-start gap-4 border-b border-border/70">
            <label
              className="w-20 shrink-0 pt-3.5 text-sm leading-5 text-muted-foreground/70"
              htmlFor={`${id}-recipients`}
            >
              Recipients
            </label>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-2.5">
              <AnimatePresence initial={false} mode="popLayout">
                {list.map((recipient) => (
                  <motion.span
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-7 items-center gap-1.5 rounded-full bg-muted py-0.5 pr-1.5 pl-0.5 text-sm"
                    exit={{ opacity: 0, scale: 0.8 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    key={recipient}
                    layout
                    transition={spring}
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-background text-[11px] font-medium uppercase">
                      {recipient[0]}
                    </span>
                    {recipient}
                    {onRecipientsChange && (
                      <button
                        aria-label={`Remove ${recipient}`}
                        className="rounded-full text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() =>
                          onRecipientsChange(list.filter((item) => item !== recipient))
                        }
                        type="button"
                      >
                        <CloseCircleIcon className="size-4" />
                      </button>
                    )}
                  </motion.span>
                ))}
              </AnimatePresence>
              <input
                className={cn(
                  fieldClassName,
                  'h-7 py-0',
                  list.length ? 'w-0 min-w-16' : 'min-w-32',
                )}
                id={`${id}-recipients`}
                aria-label="Recipients"
                placeholder={list.length ? '' : 'Add recipients'}
                value={draftRecipient}
                readOnly={!onRecipientsChange}
                onBlur={() => addRecipient()}
                onChange={(event) =>
                  event.target.value.endsWith(',')
                    ? addRecipient(event.target.value)
                    : setDraftRecipient(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addRecipient()
                  }
                  if (event.key === 'Backspace' && !draftRecipient && list.length)
                    onRecipientsChange?.(list.slice(0, -1))
                }}
              />
            </div>
          </div>
          <div className="flex items-baseline gap-4 border-b border-border/70">
            <label
              className="w-20 shrink-0 text-sm text-muted-foreground/70"
              htmlFor={`${id}-subject`}
            >
              Subject
            </label>
            <input
              className={fieldClassName}
              id={`${id}-subject`}
              placeholder="Add a subject"
              value={subject}
              readOnly={!onSubjectChange}
              onChange={(event) => onSubjectChange?.(event.target.value)}
            />
          </div>
          <textarea
            aria-label="Email message"
            aria-busy={drafting}
            className={cn(
              'block min-h-64 w-full resize-none rounded-sm bg-transparent pt-4 pb-5 text-sm leading-[1.6] text-muted-foreground outline-none placeholder:text-muted-foreground/60',
            )}
            onChange={(event) => onBodyChange?.(event.target.value)}
            readOnly={!onBodyChange || drafting}
            placeholder="Write your message…"
            value={drafting ? `${body}▍` : body}
          />
        </div>
        <output className="sr-only">{sendState === 'sent' ? 'Email sent' : ''}</output>
      </form>
    </MotionConfig>
  )
}

export { EmailComposer }
export type { EmailComposerProps }
export default EmailComposer
