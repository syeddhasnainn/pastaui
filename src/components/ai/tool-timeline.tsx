import { ToolboxIcon as WrenchIcon } from '@solar-icons/react/linear/toolbox'
import { AnimatePresence, motion } from 'motion/react'
import * as React from 'react'

import { TimelineStatusIcon } from '@/components/ai/timeline-status'
import { cn } from 'cn'

function TimelineConnector({ reached }: { reached: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-6 bottom-1 left-2 w-px -translate-x-1/2 overflow-hidden bg-foreground/8"
    >
      <span
        className={cn(
          'absolute inset-0 origin-top bg-foreground/25 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
          reached ? 'scale-y-100' : 'scale-y-0',
        )}
      />
    </span>
  )
}

interface ToolTimelineItem {
  detail?: string
  id: string
  input?: string
  output?: string
  status: 'complete' | 'pending' | 'running'
  target?: string
  time?: string
  verb: string
}

interface ToolTimelineProps extends React.ComponentProps<'section'> {
  defaultOpenId?: string
  items: ToolTimelineItem[]
  summary?: string
  title?: string
}

const rowTone = {
  complete: { verb: 'text-muted-foreground', target: 'text-foreground/70' },
  running: { verb: 'text-muted-foreground', target: 'text-foreground' },
  pending: { verb: 'text-muted-foreground/55', target: 'text-muted-foreground/55' },
}

function ToolTimeline({
  className,
  defaultOpenId,
  items,
  summary,
  title = 'Tool timeline',
  ...props
}: ToolTimelineProps) {
  const [openId, setOpenId] = React.useState<string | undefined>(defaultOpenId)
  return (
    <section
      data-slot="tool-timeline"
      className={cn(
        'rounded-[16px] bg-card p-4 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2">
        <WrenchIcon className="size-4 text-muted-foreground" />
        <h3 className="text-sm leading-5 font-medium text-muted-foreground">{title}</h3>
        {summary && (
          <span className="ml-auto text-[13px] leading-5 text-muted-foreground/70">{summary}</span>
        )}
      </header>

      <ol className="mt-4">
        {items.map((item, index) => {
          const next = items[index + 1]
          const tone = rowTone[item.status]
          const isFile = item.target ? /\.[a-z0-9]+$/i.test(item.target) : false

          return (
            <li
              className="relative flex gap-3 pb-5 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] last:pb-0 starting:opacity-0"
              key={item.id}
            >
              {next && <TimelineConnector reached={next.status !== 'pending'} />}
              <TimelineStatusIcon className="mt-0.5" status={item.status} />
              <div className="min-w-0 flex-1">
                <button
                  aria-expanded={item.input || item.output ? openId === item.id : undefined}
                  className="group/row -mx-1.5 -my-0.5 flex w-[calc(100%+0.75rem)] items-baseline gap-3 rounded-md px-1.5 py-0.5 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40 enabled:hover:bg-muted disabled:cursor-default"
                  disabled={!item.input && !item.output}
                  onClick={() =>
                    setOpenId((current) => (current === item.id ? undefined : item.id))
                  }
                  type="button"
                >
                  <p className="min-w-0 flex-1 truncate text-sm leading-5">
                    <span className={tone.verb}>{item.verb}</span>
                    {item.target && (
                      <>
                        {' '}
                        <span
                          className={cn(
                            'font-medium',
                            tone.target,
                            isFile && 'font-mono text-[13px] font-normal',
                          )}
                        >
                          {item.target}
                        </span>
                      </>
                    )}
                  </p>
                  {item.time && (
                    <time
                      className={cn(
                        'shrink-0 font-mono text-[11px] tabular-nums',
                        item.status === 'running'
                          ? 'text-foreground/70'
                          : 'text-muted-foreground/70',
                      )}
                    >
                      {item.time}
                      {item.status === 'running' && '…'}
                    </time>
                  )}
                </button>
                {item.detail && (
                  <p className="mt-0.5 text-xs leading-4 text-muted-foreground/70">{item.detail}</p>
                )}
                <AnimatePresence initial={false}>
                  {openId === item.id && (item.input || item.output) && (
                    <motion.dl
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="mt-2 space-y-2 rounded-[10px] bg-muted p-3 font-mono text-[11px] leading-4">
                        {item.input && (
                          <div>
                            <dt className="font-sans text-muted-foreground/70">Input</dt>
                            <dd className="mt-0.5 break-all whitespace-pre-wrap text-foreground/70">
                              {item.input}
                            </dd>
                          </div>
                        )}
                        {item.output && (
                          <div>
                            <dt className="font-sans text-muted-foreground/70">Output</dt>
                            <dd className="mt-0.5 break-all whitespace-pre-wrap text-foreground/70">
                              {item.output}
                            </dd>
                          </div>
                        )}
                      </div>
                    </motion.dl>
                  )}
                </AnimatePresence>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export { ToolTimeline }
export type { ToolTimelineItem, ToolTimelineProps }
