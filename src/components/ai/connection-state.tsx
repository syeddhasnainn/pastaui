import { CheckCircleIcon as CheckCircle2Icon } from '@solar-icons/react/linear/check-circle'
import { CloudCrossIcon as CloudOffIcon } from '@solar-icons/react/linear/cloud-cross'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { RefreshIcon as RefreshCwIcon } from '@solar-icons/react/linear/refresh'
import { WiFiIcon as WifiIcon } from '@solar-icons/react/linear/wi-fi'
import { AltArrowDownIcon as ChevronDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

type ConnectionStatus = 'connected' | 'offline' | 'reconnected' | 'reconnecting'

interface ConnectionEvent {
  id: string
  label: string
  state: ConnectionStatus
  time: string
}

interface ConnectionStateProps extends React.ComponentProps<'div'> {
  attempt?: number
  defaultLogOpen?: boolean
  detail?: string
  events?: ConnectionEvent[]
  maxAttempts?: number
  onRetry?: () => void
  retryDelay?: number
  retryIn?: number
  state: ConnectionStatus
}

const ease = [0.23, 1, 0.32, 1] as const

const copy: Record<ConnectionStatus, string> = {
  connected: 'Connected',
  offline: 'Connection lost',
  reconnected: 'Stream resumed',
  reconnecting: 'Reconnecting',
}

function ConnectionState({
  attempt,
  className,
  defaultLogOpen = false,
  detail,
  events = [],
  maxAttempts,
  onRetry,
  retryDelay,
  retryIn,
  state,
  ...props
}: ConnectionStateProps) {
  const logId = React.useId()
  const [logOpen, setLogOpen] = React.useState(defaultLogOpen)
  const waiting = state === 'reconnecting' && retryIn !== undefined && retryIn > 0
  const status =
    state === 'reconnecting' && attempt !== undefined
      ? `Attempt ${attempt}${maxAttempts ? ` of ${maxAttempts}` : ''}${waiting ? ` · next try in ${retryIn}s` : ''}`
      : undefined

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="connection-state"
        data-state={state}
        className={cn(
          'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card transition-colors duration-200 ease-out',
          className,
        )}
        {...props}
      >
        <div
          aria-live="polite"
          className={cn('flex items-center gap-3 p-3', state === 'offline' && 'text-destructive')}
        >
          <span className="grid size-4 shrink-0 place-items-center">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                animate={{ opacity: 1, scale: 1 }}
                className="col-start-1 row-start-1 flex"
                exit={{ opacity: 0, scale: 0.7 }}
                initial={{ opacity: 0, scale: 0.7 }}
                key={state}
                transition={{ duration: 0.2, ease }}
              >
                <ConnectionIcon state={state} />
              </motion.span>
            </AnimatePresence>
          </span>
          <div className="min-w-0 flex-1">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="card-heading"
                exit={{ opacity: 0, y: -4 }}
                initial={{ opacity: 0, y: 4 }}
                key={state}
                transition={{ duration: 0.2, ease }}
              >
                {copy[state]}
              </motion.p>
            </AnimatePresence>
            {(status || detail) && (
              <p className="mt-0.5 truncate text-xs leading-5 tabular-nums opacity-70">
                {status ?? detail}
              </p>
            )}
          </div>
          {(state === 'offline' || waiting) && onRetry && (
            <Button
              className="transition-[opacity,background-color] duration-150 ease-out starting:opacity-0"
              onClick={onRetry}
              size="sm"
              variant="outline"
            >
              <RefreshCwIcon data-icon="inline-start" /> {waiting ? 'Retry now' : 'Retry'}
            </Button>
          )}
          {events.length > 0 && (
            <Button
              aria-controls={logId}
              aria-expanded={logOpen}
              aria-label={logOpen ? 'Hide connection log' : 'Show connection log'}
              onClick={() => setLogOpen((open) => !open)}
              size="icon-sm"
              variant="ghost"
            >
              <ChevronDownIcon
                className={cn(
                  'transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
                  logOpen && 'rotate-180',
                )}
              />
            </Button>
          )}
        </div>
        <div aria-hidden="true" className="h-0.5 bg-muted">
          <motion.div
            animate={{
              opacity: waiting ? 1 : 0,
              scaleX: waiting && retryDelay ? (retryIn ?? 0) / retryDelay : 0,
            }}
            className="h-full origin-left bg-muted-foreground"
            initial={false}
            transition={{ duration: waiting ? 1 : 0.2, ease: 'linear' }}
          />
        </div>
        <AnimatePresence initial={false}>
          {logOpen && events.length > 0 && (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              id={logId}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease }}
            >
              <ol aria-label="Connection log" className="space-y-2 px-3 py-3">
                <AnimatePresence initial={false}>
                  {events.map((event) => (
                    <motion.li
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex items-center gap-3 text-xs leading-5',
                        event.state === 'offline' && 'text-destructive',
                      )}
                      initial={{ opacity: 0, y: -4 }}
                      key={event.id}
                      layout="position"
                      transition={{ duration: 0.2, ease }}
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        <ConnectionIcon state={event.state} small />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{event.label}</span>
                      <span className="shrink-0 tabular-nums opacity-70">{event.time}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

function ConnectionIcon({ small, state }: { small?: boolean; state: ConnectionStatus }) {
  const size = small ? 'size-3.5' : 'size-4'
  if (state === 'offline') return <CloudOffIcon className={size} />
  if (state === 'reconnecting')
    return <LoaderCircleIcon className={cn(size, 'animate-spin motion-reduce:animate-none')} />
  if (state === 'reconnected') return <CheckCircle2Icon className={cn(size, 'text-emerald-600')} />
  return <WifiIcon className={cn(size, 'text-muted-foreground')} />
}

export { ConnectionState }
export type { ConnectionEvent, ConnectionStateProps, ConnectionStatus }
