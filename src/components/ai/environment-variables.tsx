import { Menu } from '@base-ui/react/menu'
import { AddIcon as PlusIcon } from '@solar-icons/react/linear/add'
import { CopyIcon } from '@solar-icons/react/linear/copy'
import { EyeIcon } from '@solar-icons/react/linear/eye'
import { EyeClosedIcon as EyeOffIcon } from '@solar-icons/react/linear/eye-closed'
import { GlobalIcon } from '@solar-icons/react/linear/global'
import { KeyMinimalisticIcon as KeyRoundIcon } from '@solar-icons/react/linear/key-minimalistic'
import { MenuDotsIcon as MoreIcon } from '@solar-icons/react/linear/menu-dots'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface EnvironmentVariable {
  id: string
  key: string
  public?: boolean
  scope?: string
  value: string
}

interface EnvironmentVariablesProps extends Omit<
  React.ComponentProps<'section'>,
  'onCopy' | 'onToggle'
> {
  items: EnvironmentVariable[]
  onAdd?: () => void
  onCopy?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onToggle?: (id: string) => void
  revealedIds?: string[]
  title?: string
}

const REVEAL_DURATION = 10000

const swapClass =
  'grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 *:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:*:transition-opacity'

const actionClass =
  'rounded-full text-muted-foreground opacity-0 transition-[opacity,background-color] duration-150 ease-out group-focus-within:opacity-100 group-hover:opacity-100 hover:text-foreground pointer-coarse:opacity-100 data-popup-open:opacity-100'

function maskValue(value: string) {
  return `••••••••••••${value.slice(-4)}`
}

function EnvironmentVariables({
  className,
  items,
  onAdd,
  onCopy,
  onDelete,
  onEdit,
  onToggle,
  revealedIds,
  title = 'Environment variables',
  ...props
}: EnvironmentVariablesProps) {
  const [revealedId, setRevealedId] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const revealedSet = new Set(revealedIds ?? (revealedId ? [revealedId] : []))

  React.useEffect(() => {
    if (!revealedId) return
    const timer = window.setTimeout(() => setRevealedId(null), REVEAL_DURATION)
    return () => window.clearTimeout(timer)
  }, [revealedId])

  React.useEffect(() => {
    if (!copiedId) return
    const timer = window.setTimeout(() => setCopiedId(null), 1500)
    return () => window.clearTimeout(timer)
  }, [copiedId])

  function toggle(id: string) {
    if (revealedIds) onToggle?.(id)
    else setRevealedId((current) => (current === id ? null : id))
  }

  async function copy(item: EnvironmentVariable) {
    await navigator.clipboard?.writeText(item.value)
    setCopiedId(item.id)
    onCopy?.(item.id)
  }

  return (
    <section
      data-slot="environment-variables"
      className={cn(
        'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="relative flex min-h-14 items-center gap-2 px-5 py-3 after:absolute after:right-5 after:bottom-0 after:left-5 after:border-b-[0.5px] after:border-foreground/[0.09] after:content-['']">
        <KeyRoundIcon className="size-4 text-muted-foreground" />
        <h3 className="text-sm leading-5 font-medium text-muted-foreground">{title}</h3>
        <span className="ml-auto text-[13px] leading-5 text-muted-foreground/70 tabular-nums">
          {items.length} configured
        </span>
        {onAdd && (
          <Button
            className="h-7 rounded-full bg-foreground/8 px-2.5 text-xs text-foreground/85 hover:bg-foreground/12 hover:text-foreground"
            onClick={onAdd}
            size="xs"
            type="button"
            variant="ghost"
          >
            <PlusIcon data-icon="inline-start" /> Add
          </Button>
        )}
      </header>
      <ul>
        {items.map((item) => {
          const revealed = revealedSet.has(item.id)
          const copied = copiedId === item.id

          return (
            <li
              className="group relative flex min-h-16 items-center gap-3 px-5 py-3 after:absolute after:right-5 after:bottom-0 after:left-5 after:border-b-[0.5px] after:border-foreground/[0.09] after:content-[''] last:after:hidden"
              key={item.id}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="min-w-0 truncate font-mono text-[13px] text-foreground">
                    {item.key}
                  </span>
                  {item.scope && (
                    <span className="rounded-md bg-foreground/6 px-1.5 py-px text-xs leading-5 text-muted-foreground">
                      {item.scope}
                    </span>
                  )}
                  {item.public && (
                    <span className="flex items-center gap-1 text-xs leading-5 text-muted-foreground">
                      <GlobalIcon aria-hidden="true" className="size-3.5" />
                      Public
                    </span>
                  )}
                </div>
                <p
                  className="mt-1 truncate font-mono text-[13px] text-muted-foreground transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0"
                  key={revealed || item.public ? 'value' : 'masked'}
                >
                  {item.public || revealed ? item.value : maskValue(item.value)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                {!item.public && (
                  <Button
                    aria-label={`${revealed ? 'Hide' : 'Reveal'} ${item.key}`}
                    className={cn(actionClass, revealed && 'opacity-100')}
                    onClick={() => toggle(item.id)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <span className={swapClass}>
                      <EyeIcon className={cn(revealed && 'scale-75 opacity-0')} />
                      <EyeOffIcon className={cn(!revealed && 'scale-75 opacity-0')} />
                    </span>
                  </Button>
                )}
                <Button
                  aria-label={copied ? `Copied ${item.key}` : `Copy ${item.key}`}
                  className={cn(actionClass, copied && 'opacity-100')}
                  onClick={() => void copy(item)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <span className={swapClass}>
                    <CopyIcon className={cn(copied && 'scale-75 opacity-0')} />
                    <svg
                      aria-hidden="true"
                      className={cn(
                        'size-4 text-emerald-600 dark:text-emerald-500',
                        !copied && 'scale-75 opacity-0',
                      )}
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.75"
                      viewBox="0 0 16 16"
                    >
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                  </span>
                </Button>
                {(onEdit || onDelete) && (
                  <Menu.Root>
                    <Menu.Trigger
                      render={
                        <Button
                          aria-label={`More actions for ${item.key}`}
                          className={actionClass}
                          size="icon-sm"
                          type="button"
                          variant="ghost"
                        />
                      }
                    >
                      <MoreIcon />
                    </Menu.Trigger>
                    <Menu.Portal>
                      <Menu.Positioner align="end" className="z-50" side="bottom" sideOffset={6}>
                        <Menu.Popup className="min-w-32 origin-(--transform-origin) rounded-[14px] bg-card p-1 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-opacity">
                          {onEdit && (
                            <Menu.Item
                              className="cursor-pointer rounded-[10px] px-3 py-2 outline-none data-highlighted:bg-foreground/6 data-highlighted:text-foreground"
                              onClick={() => onEdit(item.id)}
                            >
                              Edit
                            </Menu.Item>
                          )}
                          {onDelete && (
                            <Menu.Item
                              className="cursor-pointer rounded-[10px] px-3 py-2 text-destructive outline-none data-highlighted:bg-destructive/10"
                              onClick={() => onDelete(item.id)}
                            >
                              Delete
                            </Menu.Item>
                          )}
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.Root>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export { EnvironmentVariables }
export type { EnvironmentVariable, EnvironmentVariablesProps }
