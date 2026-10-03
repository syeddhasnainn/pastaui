import { ClockCircleIcon } from '@solar-icons/react/linear/clock-circle'
import { CloseIcon } from '@solar-icons/react/linear/close'
import { KeyMinimalisticIcon as KeyRoundIcon } from '@solar-icons/react/linear/key-minimalistic'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface PermissionGrantProps extends React.ComponentProps<'section'> {
  capability: string
  description: string
  duration?: string
  onDeny?: () => void
  onGrant?: () => void
  restrictions?: React.ReactNode[]
  scope: React.ReactNode[]
}

const itemClass =
  'flex items-start gap-2.5 text-sm leading-5 text-foreground/80 [&_code]:rounded-[5px] [&_code]:bg-foreground/8 [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[13px]'

function PermissionGroup({
  allowed,
  items,
  label,
}: {
  allowed: boolean
  items: React.ReactNode[]
  label: string
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] leading-5 font-medium text-muted-foreground">{label}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li className={itemClass} key={index}>
            {allowed ? (
              <svg
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-500"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                viewBox="0 0 16 16"
              >
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
            ) : (
              <CloseIcon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />
            )}
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PermissionGrant({
  capability,
  className,
  description,
  duration = 'This session',
  onDeny,
  onGrant,
  restrictions = [],
  scope,
  ...props
}: PermissionGrantProps) {
  return (
    <section
      data-slot="permission-grant"
      className={cn(
        'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0',
        className,
      )}
      {...props}
    >
      <div className="flex gap-3 p-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-foreground/6 text-muted-foreground">
          <KeyRoundIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-6 font-medium tracking-[-0.01em] text-foreground">
            Grant {capability}?
          </h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
          <div className="mt-4 space-y-4 rounded-[12px] bg-foreground/4 p-4">
            {scope.length > 0 && <PermissionGroup allowed items={scope} label="Can" />}
            {restrictions.length > 0 && (
              <PermissionGroup allowed={false} items={restrictions} label="Can't" />
            )}
          </div>
          <p className="mt-3 flex items-center gap-2 text-[13px] leading-5 text-muted-foreground">
            <ClockCircleIcon aria-hidden="true" className="size-4 shrink-0" />
            {duration}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 px-5 pb-5">
        <Button
          className="h-7 rounded-full px-3 text-sm font-[450] tracking-[-0.05px] text-muted-foreground hover:bg-foreground/8 hover:text-foreground"
          onClick={onDeny}
          size="sm"
          type="button"
          variant="ghost"
        >
          Deny
        </Button>
        <Button
          className="h-7 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-sm font-[450] tracking-[-0.05px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
          onClick={onGrant}
          size="sm"
          type="button"
          variant="default"
        >
          Grant access
        </Button>
      </div>
    </section>
  )
}

export { PermissionGrant }
export type { PermissionGrantProps }
