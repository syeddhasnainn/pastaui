import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { cn } from 'cn'

type MessageStatus = 'failed' | 'read' | 'sending' | 'sent'

interface MessageBubbleProps extends React.ComponentProps<'div'> {
  from?: 'assistant' | 'system' | 'user'
  onRetry?: () => void
  status?: MessageStatus
  streaming?: boolean
  time?: string
  typing?: boolean
}

const ease = [0.23, 1, 0.32, 1] as const

const statusCopy: Record<MessageStatus, string> = {
  failed: 'Not sent',
  read: 'Read',
  sending: 'Sending',
  sent: 'Sent',
}

function TypingDots() {
  return (
    <output aria-label="Typing" className="flex h-6 items-center gap-1">
      {[0, 1, 2].map((dot) => (
        <span
          className="message-bubble-typing size-1.5 rounded-full bg-current"
          key={dot}
          style={{ animationDelay: `${dot * 0.15}s` }}
        />
      ))}
    </output>
  )
}

function StatusMark({ status }: { status: MessageStatus }) {
  if (status === 'sending')
    return (
      <svg
        aria-hidden="true"
        className="size-3 animate-spin motion-reduce:animate-none"
        fill="none"
        viewBox="0 0 16 16"
      >
        <circle cx="8" cy="8" opacity="0.25" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 8a6 6 0 0 0-6-6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    )
  if (status === 'failed')
    return (
      <svg
        aria-hidden="true"
        className="size-3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        viewBox="0 0 16 16"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3.5M8 11h.01" />
      </svg>
    )
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 20 12"
    >
      <motion.path
        animate={{ pathLength: 1 }}
        d="m1.5 6.5 3 3 6-7"
        initial={{ pathLength: 0 }}
        transition={{ duration: 0.25, ease }}
      />
      {status === 'read' && (
        <motion.path
          animate={{ pathLength: 1 }}
          d="m8.5 9.5 6-7"
          initial={{ pathLength: 0 }}
          transition={{ delay: 0.1, duration: 0.25, ease }}
        />
      )}
    </svg>
  )
}

function MessageBubble({
  children,
  className,
  from = 'assistant',
  onRetry,
  status,
  streaming = false,
  time,
  typing = false,
  ...props
}: MessageBubbleProps) {
  const isUser = from === 'user'
  const words = typeof children === 'string' && streaming ? children.split(/(\s+)/) : null

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn(
          !time && !status
            ? 'contents'
            : cn(
                'flex w-full flex-col',
                isUser ? 'items-end' : from === 'system' ? 'items-center' : 'items-start',
              ),
        )}
      >
        <div
          aria-busy={typing || streaming}
          data-from={from}
          data-slot="message-bubble"
          className={cn(
            'w-fit max-w-[85%] rounded-[16px] px-3.5 py-2.5 text-sm leading-6 transition-[opacity,translate,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0',
            from !== 'system' &&
              'starting:translate-y-1 starting:scale-[0.97] motion-reduce:starting:translate-y-0 motion-reduce:starting:scale-100',
            isUser &&
              'origin-bottom-right bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary text-primary-foreground dark:bg-none',
            from === 'assistant' && 'origin-bottom-left bg-muted text-foreground',
            from === 'system' &&
              'mx-auto max-w-full bg-transparent px-0 py-1 text-center text-xs text-muted-foreground',
            status === 'failed' && 'opacity-70',
            className,
          )}
          {...props}
        >
          {typing ? (
            <TypingDots />
          ) : words ? (
            words.map((word, index) => (
              <motion.span
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                initial={{ opacity: 0, filter: 'blur(2px)' }}
                key={index}
                transition={{ delay: index * 0.035, duration: 0.25, ease }}
              >
                {word}
              </motion.span>
            ))
          ) : (
            children
          )}
        </div>
        <AnimatePresence initial={false}>
          {(time || status) && !typing && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              aria-live="polite"
              className="mt-1 flex items-center gap-1.5 px-1 text-xs leading-5 text-muted-foreground"
              initial={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2, ease }}
            >
              {time && <time className="tabular-nums">{time}</time>}
              {time && status && <span aria-hidden="true">·</span>}
              {status && (
                <span className="flex items-center gap-1">
                  <StatusMark status={status} />
                  {statusCopy[status]}
                </span>
              )}
              {status === 'failed' && onRetry && (
                <button
                  className="ml-1 rounded-sm underline underline-offset-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                  onClick={onRetry}
                  type="button"
                >
                  Retry
                </button>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export { MessageBubble }
export type { MessageBubbleProps, MessageStatus }
