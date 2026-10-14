import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'

import {
  timelineDetailTone,
  timelineLabelTone,
  type TimelineStatus,
} from '@/components/ai/timeline-status'
import { cn } from 'cn'

const timelineStatusLabel: Record<TimelineStatus, string> = {
  complete: 'Complete',
  pending: 'Pending',
  running: 'Running',
}

const spring = { type: 'spring', visualDuration: 0.4, bounce: 0 } as const
const pop = { type: 'spring', visualDuration: 0.3, bounce: 0.35 } as const

function TimelineStatusIcon({ className, status }: { className?: string; status: TimelineStatus }) {
  return (
    <span className={cn('flex size-4 shrink-0 items-center justify-center', className)}>
      {status === 'complete' ? (
        <svg
          aria-hidden="true"
          className="size-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 16 16"
        >
          <motion.path
            animate={{ pathLength: 1 }}
            d="m3.5 8.5 3 3 6-7"
            initial={{ pathLength: 0 }}
            transition={spring}
          />
        </svg>
      ) : status === 'running' ? (
        <LoaderCircleIcon
          aria-hidden="true"
          className="size-4 animate-spin text-blue-500 motion-reduce:animate-none dark:text-blue-400 [&_*]:[stroke-width:2]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="size-3 rounded-full border-2 border-muted-foreground/45"
        />
      )}
      <span className="sr-only">{timelineStatusLabel[status]}</span>
    </span>
  )
}

function TimelineConnector({ reached }: { reached: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-6 bottom-1 left-2 w-px -translate-x-1/2 overflow-hidden bg-foreground/8"
    >
      <motion.span
        animate={{ scaleY: reached ? 1 : 0 }}
        className="absolute inset-0 origin-top bg-foreground/25"
        initial={false}
        transition={{ ...spring, visualDuration: 0.6 }}
      />
    </span>
  )
}

interface AgentActivitySource {
  icon?: React.ReactNode
  id: string
  label: string
}

interface AgentActivityItem {
  detail?: string
  icon?: React.ReactNode
  id: string
  label: string
  sources?: AgentActivitySource[]
  status: 'complete' | 'running' | 'waiting'
}

interface AgentActivityProps extends React.ComponentProps<'ol'> {
  items: AgentActivityItem[]
}

const iconTone: Record<TimelineStatus, string> = {
  complete: 'text-muted-foreground',
  pending: 'text-muted-foreground/45',
  running: 'animate-pulse text-blue-500 motion-reduce:animate-none dark:text-blue-400',
}

const statusLabel: Record<TimelineStatus, string> = {
  complete: 'Complete',
  pending: 'Pending',
  running: 'Running',
}

function AgentActivityIcon({ icon, status }: { icon: React.ReactNode; status: TimelineStatus }) {
  return (
    <span
      className={cn(
        'relative mt-0.5 grid size-4 shrink-0 place-items-center transition-colors duration-200 ease-out [&_svg]:size-4 [&_svg_*]:[stroke-width:2]',
        iconTone[status],
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ opacity: 1, scale: 1 }}
          className="col-start-1 row-start-1 flex"
          exit={{ opacity: 0, scale: 0.6 }}
          initial={{ opacity: 0, scale: 0.6 }}
          key={status}
          transition={pop}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only">{statusLabel[status]}</span>
    </span>
  )
}

const toTimelineStatus = (status: AgentActivityItem['status']): TimelineStatus =>
  status === 'waiting' ? 'pending' : status

function AgentActivity({ className, items, ...props }: AgentActivityProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ol
        data-slot="agent-activity"
        className={cn(
          'font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
          className,
        )}
        {...props}
      >
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const status = toTimelineStatus(item.status)
            const next = items[index + 1]

            return (
              <motion.li
                animate={{ height: 'auto', opacity: 1 }}
                className="relative overflow-hidden"
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
                key={item.id}
                transition={{ height: spring, opacity: { duration: 0.2 } }}
              >
                <motion.div
                  animate={{ y: 0, filter: 'blur(0px)' }}
                  className={cn('relative flex gap-3', next && 'pb-5')}
                  initial={{ y: 8, filter: 'blur(4px)' }}
                  transition={spring}
                >
                  {next && <TimelineConnector reached={next.status !== 'waiting'} />}
                  {item.icon ? (
                    <AgentActivityIcon icon={item.icon} status={status} />
                  ) : (
                    <TimelineStatusIcon className="mt-0.5" status={status} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline gap-3">
                      <span className="relative grid min-w-0 flex-1">
                        <AnimatePresence initial={false} mode="popLayout">
                          <motion.span
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            className={cn(
                              'col-start-1 row-start-1 text-sm leading-5',
                              timelineLabelTone[status],
                            )}
                            exit={{ opacity: 0, filter: 'blur(2px)' }}
                            initial={{ opacity: 0, filter: 'blur(2px)' }}
                            key={item.label}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    </p>
                    <AnimatePresence initial={false}>
                      {item.detail && (
                        <motion.p
                          animate={{ height: 'auto', opacity: 1 }}
                          className={cn(
                            'overflow-hidden text-xs leading-4',
                            timelineDetailTone[status],
                          )}
                          exit={{ height: 0, opacity: 0 }}
                          initial={{ height: 0, opacity: 0 }}
                          key="detail"
                          transition={spring}
                        >
                          <span className="block pt-0.5">{item.detail}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {item.sources && item.sources.length > 0 && (
                      <motion.ul
                        animate={{ height: 'auto' }}
                        aria-label="Sources"
                        className="flex flex-wrap gap-1.5 overflow-hidden pt-2"
                        initial={{ height: 0 }}
                        transition={spring}
                      >
                        <AnimatePresence initial={false}>
                          {item.sources.map((source, sourceIndex) => (
                            <motion.li
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              className="flex h-6 items-center gap-1.5 rounded-full bg-muted px-2 text-xs leading-4 text-muted-foreground [&_svg]:size-3"
                              initial={{ opacity: 0, scale: 0.92, y: 4 }}
                              key={source.id}
                              layout="position"
                              transition={{ ...pop, delay: sourceIndex * 0.05 }}
                            >
                              {source.icon}
                              {source.label}
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </motion.ul>
                    )}
                  </div>
                </motion.div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ol>
    </MotionConfig>
  )
}

export { AgentActivity }
export type { AgentActivityItem, AgentActivityProps, AgentActivitySource }
