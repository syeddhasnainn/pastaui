import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { CloseIcon as XIcon } from '@solar-icons/react/linear/close'
import { AltArrowLeftIcon as ChevronLeftIcon } from '@solar-icons/react/linear/alt-arrow-left'
import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { CopyIcon } from '@solar-icons/react/linear/copy'
import { PenIcon } from '@solar-icons/react/linear/pen'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from 'cn'

interface EditMessageProps extends Omit<React.ComponentProps<'div'>, 'onCopy'> {
  activeVersion?: number
  defaultVersions?: string[]
  draft?: string
  editing?: boolean
  onActiveVersionChange?: (index: number) => void
  onCopy?: (value: string) => void
  onDraftChange?: (value: string) => void
  onEditingChange?: (editing: boolean) => void
  onSave?: (value: string) => void
  versions?: string[]
}

const ease = [0.23, 1, 0.32, 1] as const

function useControllable<T>(value: T | undefined, initial: T, onChange?: (next: T) => void) {
  const [internal, setInternal] = React.useState(initial)
  const current = value === undefined ? internal : value
  const set = (next: T) => {
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }
  return [current, set] as const
}

function EditMessage({
  activeVersion,
  className,
  defaultVersions = [''],
  draft,
  editing,
  onActiveVersionChange,
  onCopy,
  onDraftChange,
  onEditingChange,
  onSave,
  versions,
  ...props
}: EditMessageProps) {
  const editorId = React.useId()
  const editorRef = React.useRef<HTMLTextAreaElement>(null)
  const focusOnOpen = React.useRef(false)
  const [internalVersions, setInternalVersions] = React.useState(defaultVersions)
  const allVersions = versions ?? internalVersions
  const [active, setActive] = useControllable(
    activeVersion,
    allVersions.length - 1,
    onActiveVersionChange,
  )
  const [isEditing, setEditing] = useControllable(editing, false, onEditingChange)
  const [value, setValue] = useControllable(draft, '', onDraftChange)
  const [copied, setCopied] = React.useState(false)
  const index = Math.min(active, allVersions.length - 1)
  const message = allVersions[index] ?? ''

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1400)
    return () => clearTimeout(timer)
  }, [copied])

  React.useEffect(() => {
    if (!isEditing || !focusOnOpen.current) return
    focusOnOpen.current = false
    editorRef.current?.focus({ preventScroll: true })
  }, [isEditing])

  function startEditing() {
    focusOnOpen.current = true
    setValue(message)
    setEditing(true)
  }

  function save() {
    const next = value.trim()
    if (!next || next === message) return setEditing(false)
    if (versions === undefined) setInternalVersions([...allVersions, next])
    setActive(allVersions.length)
    setEditing(false)
    onSave?.(next)
  }

  function copy() {
    void navigator.clipboard?.writeText(message).catch(() => undefined)
    setCopied(true)
    onCopy?.(message)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-editing={isEditing}
        data-slot="edit-message"
        className={cn(
          'group/message flex w-full flex-col items-end font-sans text-sm tracking-[-0.05px]',
          className,
        )}
        {...props}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {isEditing ? (
            <motion.section
              animate={{ opacity: 1, scale: 1 }}
              className="w-full origin-top-right rounded-[16px] border-0 bg-muted/45 p-3 shadow-none ring-0"
              exit={{ opacity: 0, scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.98 }}
              key="editor"
              transition={{ duration: 0.2, ease }}
            >
              <label className="sr-only" htmlFor={editorId}>
                Edit message
              </label>
              <Textarea
                ref={editorRef}
                id={editorId}
                placeholder="Edit your message…"
                className="min-h-20 resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
                onChange={(event) => setValue(event.target.value)}
                onFocus={(event) =>
                  event.currentTarget.setSelectionRange(
                    event.currentTarget.value.length,
                    event.currentTarget.value.length,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setEditing(false)
                  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) save()
                }}
                value={value}
              />
              <div className="mt-2 flex items-center justify-end gap-1.5 tracking-[-0.05px]">
                <Button
                  className="h-7 rounded-full px-3 text-muted-foreground hover:text-muted-foreground has-data-[icon=inline-start]:pl-3"
                  onClick={() => setEditing(false)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <XIcon data-icon="inline-start" /> Cancel
                </Button>
                <Button
                  className="h-7 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 has-data-[icon=inline-start]:pl-3 dark:bg-none"
                  disabled={!value.trim()}
                  onClick={save}
                  size="sm"
                  type="button"
                  variant="default"
                >
                  <CheckIcon data-icon="inline-start" /> Save and send
                </Button>
              </div>
            </motion.section>
          ) : (
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex max-w-[85%] origin-bottom-right flex-col items-end"
              exit={{ opacity: 0, scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.97, y: 4 }}
              key="message"
              transition={{ duration: 0.2, ease }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  className="w-fit rounded-[16px] bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3.5 py-2.5 text-sm leading-6 whitespace-pre-wrap text-primary-foreground dark:bg-none"
                  exit={{ opacity: 0, filter: 'blur(2px)' }}
                  initial={{ opacity: 0, filter: 'blur(2px)' }}
                  key={`${index}-${message}`}
                  transition={{ duration: 0.2, ease }}
                >
                  {message}
                </motion.div>
              </AnimatePresence>
              <div
                className={cn(
                  'mt-1 flex items-center gap-0.5 text-muted-foreground transition-opacity duration-150 group-focus-within/message:opacity-100 group-hover/message:opacity-100',
                  allVersions.length > 1 ? 'opacity-100' : 'opacity-0',
                )}
              >
                {allVersions.length > 1 && (
                  <nav aria-label="Message versions" className="mr-1 flex items-center">
                    <Button
                      aria-label="Previous version"
                      className="text-muted-foreground hover:text-muted-foreground"
                      disabled={index === 0}
                      onClick={() => setActive(index - 1)}
                      size="icon-xs"
                      variant="ghost"
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <span
                      aria-live="polite"
                      className="min-w-8 text-center text-xs leading-5 tabular-nums"
                    >
                      {index + 1}/{allVersions.length}
                    </span>
                    <Button
                      aria-label="Next version"
                      className="text-muted-foreground hover:text-muted-foreground"
                      disabled={index === allVersions.length - 1}
                      onClick={() => setActive(index + 1)}
                      size="icon-xs"
                      variant="ghost"
                    >
                      <ChevronRightIcon />
                    </Button>
                  </nav>
                )}
                <Button
                  aria-label={copied ? 'Copied' : 'Copy message'}
                  className="text-muted-foreground hover:text-muted-foreground"
                  onClick={copy}
                  size="icon-xs"
                  variant="ghost"
                >
                  <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 motion-reduce:*:transition-opacity">
                    <CopyIcon className={cn(copied && 'scale-75 opacity-0')} />
                    <CheckIcon className={cn(!copied && 'scale-75 opacity-0')} />
                  </span>
                </Button>
                <Button
                  aria-label="Edit message"
                  className="text-muted-foreground hover:text-muted-foreground"
                  onClick={startEditing}
                  size="icon-xs"
                  variant="ghost"
                >
                  <PenIcon />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export { EditMessage }
export type { EditMessageProps }
