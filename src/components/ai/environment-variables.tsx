import { CopyIcon } from '@solar-icons/react/linear/copy'
import { EyeIcon } from '@solar-icons/react/linear/eye'
import { EyeClosedIcon as EyeOffIcon } from '@solar-icons/react/linear/eye-closed'
import { KeyMinimalisticIcon as KeyRoundIcon } from '@solar-icons/react/linear/key-minimalistic'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface EnvironmentVariable {
  id: string
  key: string
  scope?: string
  value: string
}

interface EnvironmentVariablesProps extends Omit<
  React.ComponentProps<'section'>,
  'onCopy' | 'onToggle'
> {
  items: EnvironmentVariable[]
  onCopy?: (id: string) => void
  onToggle?: (id: string) => void
  revealedIds?: string[]
  title?: string
}

function EnvironmentVariables({
  className,
  items,
  onCopy,
  onToggle,
  revealedIds = [],
  title = 'Environment variables',
  ...props
}: EnvironmentVariablesProps) {
  const revealedSet = new Set(revealedIds)

  return (
    <section
      data-slot="environment-variables"
      className={cn(
        'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <header className="relative flex min-h-14 flex-wrap items-center gap-2 px-5 py-3 after:absolute after:right-5 after:bottom-0 after:left-5 after:border-b-[0.5px] after:border-foreground/[0.09] after:content-['']">
        <KeyRoundIcon className="size-4 text-muted-foreground" />
        <h3 className="card-heading">{title}</h3>
        <span className="ml-auto text-xs leading-5 text-muted-foreground">
          {items.length} configured
        </span>
      </header>
      <ul>
        {items.map((item) => {
          const revealed = revealedSet.has(item.id)

          return (
            <li
              className="relative flex min-h-16 items-center gap-3 px-5 py-3 after:absolute after:right-5 after:bottom-0 after:left-5 after:border-b-[0.5px] after:border-foreground/[0.09] after:content-[''] last:after:hidden"
              key={item.id}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="min-w-0 truncate text-[13px] font-[450]">{item.key}</span>
                  {item.scope && (
                    <span className="text-xs leading-5 text-muted-foreground">{item.scope}</span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {revealed ? item.value : '••••••••••••••••'}
                </p>
              </div>
              {onToggle && (
                <Button
                  aria-label={`${revealed ? 'Hide' : 'Reveal'} ${item.key}`}
                  onClick={() => onToggle(item.id)}
                  className="rounded-full text-muted-foreground hover:text-muted-foreground"
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  {revealed ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              )}
              {onCopy && (
                <Button
                  aria-label={`Copy ${item.key}`}
                  onClick={() => onCopy(item.id)}
                  className="rounded-full text-muted-foreground hover:text-muted-foreground"
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <CopyIcon />
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export { EnvironmentVariables }
export type { EnvironmentVariable, EnvironmentVariablesProps }
