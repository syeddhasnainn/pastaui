import { KeyMinimalisticIcon as KeyRoundIcon } from '@solar-icons/react/linear/key-minimalistic'
import { ShieldWarningIcon as ShieldAlertIcon } from '@solar-icons/react/linear/shield-warning'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface PermissionGrantProps extends React.ComponentProps<'section'> {
  capability: string
  description: string
  duration?: string
  onDeny?: () => void
  onGrant?: () => void
  scope: string[]
}

function PermissionGrant({
  capability,
  className,
  description,
  duration = 'This session',
  onDeny,
  onGrant,
  scope,
  ...props
}: PermissionGrantProps) {
  return (
    <section
      data-slot="permission-grant"
      className={cn(
        'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <div className="flex gap-3 p-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
          <KeyRoundIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="card-heading">Grant {capability}?</h3>
          <p className="mt-1 text-xs leading-5 font-[450] text-muted-foreground">{description}</p>
          <div className="mt-3 rounded-[10px] bg-muted/55 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-[450]">
              <ShieldAlertIcon className="size-3.5 text-muted-foreground" /> Access includes
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {scope.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">Duration: {duration}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 px-5 pb-5">
        <Button
          className="h-7 rounded-full px-3 text-sm font-[450] tracking-[-0.05px] text-muted-foreground hover:text-muted-foreground"
          onClick={onDeny}
          size="sm"
          variant="ghost"
        >
          Deny
        </Button>
        <Button
          className="h-7 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-sm font-[450] tracking-[-0.05px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
          onClick={onGrant}
          size="sm"
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
