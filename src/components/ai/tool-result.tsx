import { AltArrowDownIcon as ChevronDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import { DangerCircleIcon as CircleAlertIcon } from '@solar-icons/react/linear/danger-circle'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { ToolboxIcon as WrenchIcon } from '@solar-icons/react/linear/toolbox'
import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { CopyIcon } from '@solar-icons/react/linear/copy'
import * as React from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from 'cn'

interface ToolResultProps extends React.ComponentProps<typeof Collapsible> {
  copyText?: string
  duration?: string
  error?: string
  input?: React.ReactNode
  name: string
  onRetry?: () => void
  output?: React.ReactNode
  status?: 'complete' | 'error' | 'running'
  summary: string
}

const ease = [0.23, 1, 0.32, 1] as const
const spring = { type: 'spring', stiffness: 500, damping: 30 } as const
const shimmer = 'agent-text-shimmer'

function ToolResult({
  className,
  copyText,
  defaultOpen = false,
  duration,
  error,
  input,
  name,
  onRetry,
  output,
  status = 'complete',
  summary,
  ...props
}: ToolResultProps) {
  const [copied, setCopied] = React.useState(false)
  const expandable = Boolean(output || input)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1400)
    return () => clearTimeout(timer)
  }, [copied])
  return (
    <MotionConfig reducedMotion="user">
      <Collapsible
        data-slot="tool-result"
        data-status={status}
        className={cn(
          'rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card transition-shadow duration-300 data-[status=error]:shadow-[0_0_0_1px_color-mix(in_oklch,var(--destructive)_35%,transparent),0_3px_6px_-2px_rgb(0_0_0/0.02),0_1px_1px_0_rgb(0_0_0/0.04)]',
          className,
        )}
        defaultOpen={defaultOpen}
        {...props}
      >
        <CollapsibleTrigger
          className="group flex w-full items-center gap-3 p-3 text-left"
          render={<button aria-label={`Toggle ${name} result`} type="button" />}
        >
          <ToolStatus status={status} />
          <div className="min-w-0 flex-1">
            <p className={cn('truncate card-heading', status === 'running' && shimmer)}>{name}</p>
            <div className="relative h-5 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('truncate text-xs leading-5', 'text-muted-foreground')}
                  exit={{ opacity: 0, y: -12 }}
                  initial={{ opacity: 0, y: 12 }}
                  key={summary}
                  transition={{ duration: 0.25, ease }}
                >
                  {summary}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          {duration && (
            <span className="text-xs leading-5 text-muted-foreground tabular-nums">{duration}</span>
          )}
          {expandable && (
            <ChevronDownIcon className="size-4 text-muted-foreground transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-panel-open:rotate-180 motion-reduce:transition-none" />
          )}
        </CollapsibleTrigger>
        <AnimatePresence initial={false}>
          {status === 'error' && (error || onRetry) && (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
            >
              <div className="flex items-center gap-3 px-3 pb-3 pl-10">
                {error && (
                  <p className="min-w-0 flex-1 text-xs leading-5 text-destructive">{error}</p>
                )}
                {onRetry && (
                  <button
                    className="ml-auto h-7 shrink-0 rounded-full bg-foreground/8 px-3 text-xs leading-5 text-foreground/80 transition-[background-color,scale] duration-150 outline-none hover:bg-foreground/12 focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97]"
                    onClick={onRetry}
                    type="button"
                  >
                    Retry
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {expandable && (
          <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-opacity">
            <div className="space-y-3 border-t border-foreground/8 p-3 font-mono text-xs leading-5 text-muted-foreground">
              {input && (
                <div>
                  <p className="mb-1 font-sans text-[11px] leading-4 text-muted-foreground/70">
                    Input
                  </p>
                  <div className="break-all whitespace-pre-wrap">{input}</div>
                </div>
              )}
              {output && (
                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    {input && (
                      <p className="font-sans text-[11px] leading-4 text-muted-foreground/70">
                        Output
                      </p>
                    )}
                    {copyText && (
                      <button
                        aria-label={copied ? 'Copied' : 'Copy output'}
                        className="ml-auto flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-foreground/8 focus-visible:ring-2 focus-visible:ring-ring/40"
                        onClick={() => {
                          void navigator.clipboard?.writeText(copyText).catch(() => undefined)
                          setCopied(true)
                        }}
                        type="button"
                      >
                        <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 motion-reduce:*:transition-opacity">
                          <CopyIcon className={cn('size-3.5', copied && 'scale-75 opacity-0')} />
                          <CheckIcon className={cn('size-3.5', !copied && 'scale-75 opacity-0')} />
                        </span>
                      </button>
                    )}
                  </div>
                  {output}
                </div>
              )}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </MotionConfig>
  )
}

function ToolStatus({ status }: Pick<ToolResultProps, 'status'>) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="flex"
          exit={{ opacity: 0, scale: 0.6 }}
          initial={
            status === 'error' ? { opacity: 0, scale: 0.6, x: -3 } : { opacity: 0, scale: 0.6 }
          }
          key={status}
          transition={status === 'error' ? { ...spring, stiffness: 700, damping: 12 } : spring}
        >
          {status === 'running' ? (
            <LoaderCircleIcon
              aria-label="Running"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
          ) : status === 'error' ? (
            <CircleAlertIcon aria-label="Failed" className="size-4 text-destructive" />
          ) : (
            <>
              <svg
                aria-hidden="true"
                className="size-4 text-emerald-500"
                viewBox="0 0 16 16"
              >
                <circle cx="8" cy="8" fill="currentColor" r="7.5" />
                <motion.path
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
              <span className="sr-only">Complete</span>
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function ToolResultIcon() {
  return <WrenchIcon className="size-4" />
}

export { ToolResult, ToolResultIcon }
export type { ToolResultProps }
export default ToolResult
