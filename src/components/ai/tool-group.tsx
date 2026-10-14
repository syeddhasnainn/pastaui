import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { FilePenIcon } from '@solar-icons/react/linear/file-pen'
import { StarsMinimalisticIcon as SparklesIcon } from '@solar-icons/react/linear/stars-minimalistic'
import { ProgrammingIcon as TerminalIcon } from '@solar-icons/react/linear/programming'
import { ToolboxIcon as WrenchIcon } from '@solar-icons/react/linear/toolbox'
import { LoaderIcon } from '@solar-icons/react/linear/loader'
import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'

import { ToolGroupOutput } from '@/components/ai/tool-group-output'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'

type ToolGroupItemKind = 'command' | 'file' | 'tool'

interface ToolGroupItem {
  id: string
  kind?: ToolGroupItemKind
  name: string
  output?: string
  outputLanguage?: string
  status: 'complete' | 'running'
}

interface ToolGroupProps extends React.ComponentProps<'section'> {
  defaultExpandedIds?: string[]
  duration?: string
  items: ToolGroupItem[]
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title?: string
}

const ease = [0.23, 1, 0.32, 1] as const
const spring = { type: 'spring', stiffness: 500, damping: 30 } as const
const shimmer = 'agent-text-shimmer'

function DoneCheck() {
  return (
    <svg aria-hidden="true" className="size-4 text-emerald-500" viewBox="0 0 16 16">
      <circle cx="8" cy="8" fill="currentColor" r="7.5" />
      <m.path
        animate={{ pathLength: 1 }}
        d="M5 8.25 7 10.25 11 6"
        fill="none"
        initial={{ pathLength: 0 }}
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        transition={{ delay: 0.1, duration: 0.3, ease }}
      />
    </svg>
  )
}

function ToolGroup({
  className,
  defaultExpandedIds = [],
  duration,
  items,
  onOpenChange,
  open = false,
  title = 'Tool calls',
  ...props
}: ToolGroupProps) {
  const shouldReduceMotion = useReducedMotion()
  const running = items.some((item) => item.status === 'running')
  const [expanded, setExpanded] = React.useState(() => new Set(defaultExpandedIds))
  const seen = React.useRef(new Set<string>())

  React.useEffect(() => {
    const fresh = items.filter((item) => item.output && !seen.current.has(item.id))
    if (!fresh.length) return
    fresh.forEach((item) => seen.current.add(item.id))
    setExpanded(new Set([fresh.at(-1)!.id]))
  }, [items])

  function toggleItem(id: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section
      data-slot="tool-group"
      className={cn(
        'bg-transparent font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      <LazyMotion features={domAnimation} strict>
        <header className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-1">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-5 shrink-0 -translate-y-px items-center justify-center text-muted-foreground">
              <SparklesIcon
                className={cn(
                  'size-5 [&_*]:[stroke-width:1.5]',
                  running && 'animate-pulse motion-reduce:animate-none',
                )}
              />
            </span>
            <AnimatePresence initial={false} mode="popLayout">
              <m.h3
                animate={{ opacity: 1, y: 0 }}
                className="truncate card-heading leading-5"
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: 6 }}
                key={title}
                transition={{ duration: 0.2, ease }}
              >
                {title}
              </m.h3>
            </AnimatePresence>
          </div>
          <Button
            aria-label={open ? 'Collapse tool calls' : 'Expand tool calls'}
            aria-expanded={open}
            className="aria-expanded:bg-transparent"
            onClick={() => onOpenChange?.(!open)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronRightIcon
              className={cn(
                'size-4 transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [&_*]:[stroke-width:1.5]',
                open && 'rotate-90',
              )}
            />
          </Button>
          {duration && (
            <span className="min-w-14 text-right text-xs leading-5 text-muted-foreground tabular-nums">
              {duration}
            </span>
          )}
        </header>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              className="overflow-hidden"
              exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              key="tool-group-disclosure"
              transition={shouldReduceMotion ? { duration: 0.12 } : { duration: 0.2, ease }}
            >
              <ol className="px-1 pt-4">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => {
                    const ItemIcon =
                      item.kind === 'command'
                        ? TerminalIcon
                        : item.kind === 'file'
                          ? FilePenIcon
                          : WrenchIcon

                    return (
                      <m.li
                        animate={{ opacity: 1, y: 0 }}
                        className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0"
                        exit={{ opacity: 0 }}
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                        key={item.id}
                        transition={{ duration: 0.3, ease }}
                      >
                        {(index < items.length - 1 || !running) && (
                          <m.span
                            animate={{ scaleY: 1 }}
                            aria-hidden="true"
                            className="absolute top-6 bottom-0 left-2.5 w-px origin-top -translate-x-1/2 bg-border"
                            initial={{ scaleY: 0 }}
                            transition={{ duration: 0.35, ease }}
                          />
                        )}
                        <span className="relative flex size-5 items-center justify-center text-muted-foreground">
                          <AnimatePresence initial={false} mode="popLayout">
                            <m.span
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex"
                              exit={{ opacity: 0, scale: 0.6 }}
                              initial={{ opacity: 0, scale: 0.6 }}
                              key={item.status}
                              transition={spring}
                            >
                              {item.status === 'running' ? (
                                <LoaderIcon className="size-4 animate-spin motion-reduce:animate-none" />
                              ) : (
                                <ItemIcon className="size-4 [&_*]:[stroke-width:1.5]" />
                              )}
                            </m.span>
                          </AnimatePresence>
                          <span className="sr-only">{item.status}</span>
                        </span>
                        {item.output ? (
                          <button
                            aria-expanded={expanded.has(item.id)}
                            className="group/row -mx-1 flex min-w-0 items-center gap-1.5 rounded-md px-1 text-left text-sm transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                            onClick={() => toggleItem(item.id)}
                            type="button"
                          >
                            <span className="min-w-0 truncate">{item.name}</span>
                            <ChevronRightIcon
                              className={cn(
                                'size-3.5 shrink-0 opacity-60 transition-[rotate,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/row:opacity-100 motion-reduce:transition-none [&_*]:[stroke-width:1.5]',
                                expanded.has(item.id) && 'rotate-90',
                              )}
                            />
                          </button>
                        ) : (
                          <p
                            className={cn(
                              'min-w-0 truncate text-sm transition-colors duration-300',
                              item.status === 'running' && shimmer,
                            )}
                          >
                            {item.name}
                          </p>
                        )}
                        <AnimatePresence initial={false}>
                          {item.output && expanded.has(item.id) && (
                            <m.div
                              animate={{ height: 'auto', opacity: 1 }}
                              className="col-span-2 overflow-hidden"
                              exit={{ height: 0, opacity: 0 }}
                              initial={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease }}
                            >
                              <ToolGroupOutput
                                className="mx-px mt-3 mb-px"
                                code={item.output}
                                language={item.outputLanguage}
                              />
                            </m.div>
                          )}
                        </AnimatePresence>
                      </m.li>
                    )
                  })}
                  {!running && items.length > 0 && (
                    <m.li
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-3 pt-1"
                      exit={{ opacity: 0 }}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      key="done"
                      transition={{ duration: 0.3, ease }}
                    >
                      <m.span
                        animate={{ scale: 1 }}
                        className="flex size-5 items-center justify-center"
                        initial={{ scale: 0.5 }}
                        transition={spring}
                      >
                        <DoneCheck />
                      </m.span>
                      <span className="text-sm">Done</span>
                    </m.li>
                  )}
                </AnimatePresence>
              </ol>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </section>
  )
}

export { ToolGroup }
export type { ToolGroupItemKind, ToolGroupItem, ToolGroupProps }
export default ToolGroup
