import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { CopyIcon } from '@solar-icons/react/linear/copy'
import { FileCodeIcon as FileCode2Icon } from '@solar-icons/react/linear/file-code'
import { SortVerticalIcon as ExpandIcon } from '@solar-icons/react/linear/sort-vertical'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { cn } from 'cn'

interface DiffLine {
  content: string
  newNumber?: number
  oldNumber?: number
  type: 'addition' | 'context' | 'deletion'
}

interface DiffHunk {
  header?: string
  hidden?: DiffLine[]
  id: string
  lines: DiffLine[]
}

interface FileDiffProps extends Omit<React.ComponentProps<'figure'>, 'onCopy'> {
  additions?: number
  defaultOpen?: boolean
  deletions?: number
  filename: string
  hunks?: DiffHunk[]
  lines?: DiffLine[]
  onCopy?: (patch: string) => void
  onViewedChange?: (viewed: boolean) => void
  viewed?: boolean
}

const ease = [0.23, 1, 0.32, 1] as const
const sign = { addition: '+', context: ' ', deletion: '−' }

function Row({ line }: { line: DiffLine }) {
  return (
    <span
      className={cn(
        'grid min-w-max grid-cols-[2rem_2rem_1rem_1fr] px-2 transition-colors duration-100 hover:brightness-95 dark:hover:brightness-125',
        line.type === 'addition' && 'bg-emerald-500/10',
        line.type === 'deletion' && 'bg-red-500/10',
      )}
    >
      <span className="text-right text-muted-foreground/60 select-none">
        {line.oldNumber ?? ''}
      </span>
      <span className="text-right text-muted-foreground/60 select-none">
        {line.newNumber ?? ''}
      </span>
      <span className="text-center text-muted-foreground select-none">{sign[line.type]}</span>
      <span className="pr-4 text-foreground">{line.content || ' '}</span>
    </span>
  )
}

function FileDiff({
  additions,
  className,
  defaultOpen = true,
  deletions,
  filename,
  hunks,
  lines = [],
  onCopy,
  onViewedChange,
  viewed,
  ...props
}: FileDiffProps) {
  const bodyId = React.useId()
  const groups = hunks ?? [{ id: 'all', lines }]
  const all = groups.flatMap((hunk) => hunk.lines)
  const added = additions ?? all.filter((line) => line.type === 'addition').length
  const removed = deletions ?? all.filter((line) => line.type === 'deletion').length
  const [internalViewed, setInternalViewed] = React.useState(false)
  const isViewed = viewed ?? internalViewed
  const [open, setOpen] = React.useState(defaultOpen && !isViewed)
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1400)
    return () => clearTimeout(timer)
  }, [copied])

  function toggleViewed() {
    const next = !isViewed
    if (viewed === undefined) setInternalViewed(next)
    if (next) setOpen(false)
    onViewedChange?.(next)
  }

  function copy() {
    const patch = all
      .map((line) => `${sign[line.type] === '−' ? '-' : sign[line.type]}${line.content}`)
      .join('\n')
    void navigator.clipboard?.writeText(patch).catch(() => undefined)
    setCopied(true)
    onCopy?.(patch)
  }

  const iconButton =
    'flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40'

  return (
    <MotionConfig reducedMotion="user">
      <figure
        data-slot="file-diff"
        data-viewed={isViewed}
        className={cn(
          'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
          className,
        )}
        {...props}
      >
        <figcaption className="flex h-10 items-center gap-2 pr-2 pl-1.5 metadata-label">
          <button
            aria-controls={bodyId}
            aria-expanded={open}
            aria-label={open ? `Collapse ${filename}` : `Expand ${filename}`}
            className={iconButton}
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <ChevronRightIcon
              className={cn(
                'size-3.5 transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
                open && 'rotate-90',
              )}
            />
          </button>
          {/\.tsx?$/i.test(filename) ? (
            <TypeScriptIcon aria-hidden="true" className="size-4 shrink-0 text-[#3178c6]" />
          ) : (
            <FileCode2Icon aria-hidden="true" className="size-4 shrink-0" />
          )}
          <span className={cn('min-w-0 truncate transition-opacity', isViewed && 'opacity-60')}>
            {filename}
          </span>
          <span className="ml-auto text-emerald-600 tabular-nums">+{added}</span>
          <span className="text-red-500 tabular-nums">−{removed}</span>
          <button
            aria-label={copied ? 'Copied' : 'Copy patch'}
            className={iconButton}
            onClick={copy}
            type="button"
          >
            <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 motion-reduce:*:transition-opacity">
              <CopyIcon className={cn('size-3.5', copied && 'scale-75 opacity-0')} />
              <CheckIcon className={cn('size-3.5', !copied && 'scale-75 opacity-0')} />
            </span>
          </button>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors hover:bg-muted">
            <input
              checked={isViewed}
              className="size-3.5 accent-current"
              onChange={toggleViewed}
              type="checkbox"
            />
            Viewed
          </label>
        </figcaption>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              id={bodyId}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease }}
            >
              <pre className="overflow-x-auto border-t border-foreground/8 py-2 text-[12px] leading-5">
                <code className="block">
                  {groups.map((hunk) => {
                    const showHidden = expanded.has(hunk.id)
                    return (
                      <React.Fragment key={hunk.id}>
                        {hunk.header && (
                          <span className="flex min-w-max items-center gap-2 px-2 text-muted-foreground/60">
                            {hunk.hidden?.length ? (
                              <button
                                aria-expanded={showHidden}
                                className="-ml-0.5 flex items-center gap-1.5 rounded-md px-1 text-muted-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40"
                                onClick={() =>
                                  setExpanded((current) => {
                                    const next = new Set(current)
                                    if (next.has(hunk.id)) next.delete(hunk.id)
                                    else next.add(hunk.id)
                                    return next
                                  })
                                }
                                type="button"
                              >
                                <ExpandIcon aria-hidden="true" className="size-3.5" />
                                {showHidden ? 'Hide' : 'Show'} {hunk.hidden.length} unchanged lines
                              </button>
                            ) : null}
                            <span className="select-none">{hunk.header}</span>
                          </span>
                        )}
                        <AnimatePresence initial={false}>
                          {showHidden && hunk.hidden && (
                            <motion.span
                              animate={{ height: 'auto', opacity: 1 }}
                              className="block overflow-hidden"
                              exit={{ height: 0, opacity: 0 }}
                              initial={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease }}
                            >
                              {hunk.hidden.map((line, index) => (
                                <Row key={`hidden-${index}-${line.content}`} line={line} />
                              ))}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {hunk.lines.map((line, index) => (
                          <Row key={`${line.type}-${index}-${line.content}`} line={line} />
                        ))}
                      </React.Fragment>
                    )
                  })}
                </code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </figure>
    </MotionConfig>
  )
}

function TypeScriptIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em" {...props}>
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75q.918 0 1.627.111a6.4 6.4 0 0 1 1.306.34v2.458a4 4 0 0 0-.643-.361a5 5 0 0 0-.717-.26a5.5 5.5 0 0 0-1.426-.2q-.45 0-.819.086a2.1 2.1 0 0 0-.623.242q-.254.156-.393.374a.9.9 0 0 0-.14.49q0 .294.156.529q.156.234.443.444c.287.21.423.276.696.41q.41.203.926.416q.705.296 1.266.628q.561.333.963.753q.402.418.614.957q.213.538.214 1.253q0 .986-.373 1.656a3 3 0 0 1-1.012 1.085a4.4 4.4 0 0 1-1.487.596q-.85.18-1.79.18a10 10 0 0 1-1.84-.164a5.5 5.5 0 0 1-1.512-.493v-2.63a5.03 5.03 0 0 0 3.237 1.2q.5 0 .872-.09q.373-.09.623-.25q.249-.162.373-.38a1.02 1.02 0 0 0-.074-1.089a2.1 2.1 0 0 0-.537-.5a5.6 5.6 0 0 0-.807-.444a28 28 0 0 0-1.007-.436q-1.377-.575-2.053-1.405t-.676-2.005q0-.92.369-1.582q.368-.662 1.004-1.089a4.5 4.5 0 0 1 1.47-.629a7.5 7.5 0 0 1 1.77-.201m-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
    </svg>
  )
}

export { FileDiff }
export type { DiffHunk, DiffLine, FileDiffProps }
