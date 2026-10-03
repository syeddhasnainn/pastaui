import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { FilePenIcon } from '@solar-icons/react/linear/file-pen'
import { StarsMinimalisticIcon as SparklesIcon } from '@solar-icons/react/linear/stars-minimalistic'
import { ProgrammingIcon as TerminalIcon } from '@solar-icons/react/linear/programming'
import { ToolboxIcon as WrenchIcon } from '@solar-icons/react/linear/toolbox'
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
  duration?: string
  items: ToolGroupItem[]
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title?: string
}

function ToolGroup({
  className,
  duration,
  items,
  onOpenChange,
  open = false,
  title = 'Tool calls',
  ...props
}: ToolGroupProps) {
  const shouldReduceMotion = useReducedMotion()
  const running = items.some((item) => item.status === 'running')

  return (
    <section
      data-slot="tool-group"
      className={cn(
        'bg-transparent font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-1">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-5 shrink-0 -translate-y-px items-center justify-center text-muted-foreground">
            <SparklesIcon className="size-5 [&_*]:[stroke-width:1.5]" />
          </span>
          <h3 className="truncate card-heading leading-5">{title}</h3>
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
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              className="overflow-hidden"
              exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              key="tool-group-disclosure"
              transition={
                shouldReduceMotion
                  ? { duration: 0.12 }
                  : { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
              }
            >
              <ol className="px-1 pt-4">
                {items.map((item, index) => {
                  const ItemIcon =
                    item.kind === 'command'
                      ? TerminalIcon
                      : item.kind === 'file'
                        ? FilePenIcon
                        : WrenchIcon

                  return (
                    <li
                      className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0"
                      key={item.id}
                    >
                      {index < items.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute top-6 bottom-0 left-2.5 w-px -translate-x-1/2 bg-border"
                        />
                      )}
                      <span className="relative flex size-5 items-center justify-center text-muted-foreground">
                        <ItemIcon className="size-4 [&_*]:[stroke-width:1.5]" />
                        <span className="sr-only">{item.status}</span>
                      </span>
                      <p
                        className={cn(
                          'min-w-0 truncate text-sm',
                          item.status === 'running' && 'agent-text-shimmer',
                        )}
                      >
                        {item.name}
                      </p>
                      {item.output && (
                        <ToolGroupOutput
                          className="col-span-2 mt-3"
                          code={item.output}
                          language={item.outputLanguage}
                        />
                      )}
                    </li>
                  )
                })}
                {!running && (
                  <li className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-3 pt-1">
                    <span className="flex size-5 items-center justify-center text-muted-foreground">
                      <CheckIcon className="size-4 [&_*]:[stroke-width:1.5]" />
                    </span>
                    <span className="text-sm">Done</span>
                  </li>
                )}
              </ol>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </section>
  )
}

export { ToolGroup }
export type { ToolGroupItem, ToolGroupItemKind, ToolGroupProps }
