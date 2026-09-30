import { CheckCircleIcon as CheckCircle2Icon } from '@solar-icons/react/linear/check-circle'
import { CloudCrossIcon as CloudOffIcon } from '@solar-icons/react/linear/cloud-cross'
import { LoaderIcon as LoaderCircleIcon } from '@solar-icons/react/linear/loader'
import { RefreshIcon as RefreshCwIcon } from '@solar-icons/react/linear/refresh'
import { WiFiIcon as WifiIcon } from '@solar-icons/react/linear/wi-fi'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface ConnectionStateProps extends React.ComponentProps<'div'> {
  detail?: string
  onRetry?: () => void
  state: 'connected' | 'offline' | 'reconnected' | 'reconnecting'
}

function ConnectionState({ className, detail, onRetry, state, ...props }: ConnectionStateProps) {
  const copy = {
    connected: 'Connected',
    offline: 'Connection lost',
    reconnected: 'Stream resumed',
    reconnecting: 'Reconnecting',
  }[state]

  return (
    <div
      aria-live="polite"
      data-slot="connection-state"
      className={cn(
        'flex items-center gap-3 rounded-[16px] bg-card p-3 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        state === 'offline' && 'text-destructive',
        className,
      )}
      {...props}
    >
      <ConnectionIcon state={state} />
      <div className="min-w-0 flex-1">
        <p className="card-heading">{copy}</p>
        {detail && <p className="mt-0.5 truncate text-xs leading-5 opacity-70">{detail}</p>}
      </div>
      {state === 'offline' && onRetry && (
        <Button onClick={onRetry} size="sm" variant="outline">
          <RefreshCwIcon data-icon="inline-start" /> Retry
        </Button>
      )}
    </div>
  )
}

function ConnectionIcon({ state }: Pick<ConnectionStateProps, 'state'>) {
  if (state === 'offline') return <CloudOffIcon className="size-4" />
  if (state === 'reconnecting') return <LoaderCircleIcon className="size-4 animate-spin" />
  if (state === 'reconnected') return <CheckCircle2Icon className="size-4 text-emerald-600" />
  return <WifiIcon className="size-4 text-muted-foreground" />
}

export { ConnectionState }
export type { ConnectionStateProps }
