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
        'flex items-center gap-3 rounded-[16px] bg-card p-3 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card transition-colors duration-200 ease-out',
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
        <Button
          className="transition-[opacity,background-color] duration-150 ease-out starting:opacity-0"
          onClick={onRetry}
          size="sm"
          variant="outline"
        >
          <RefreshCwIcon data-icon="inline-start" /> Retry
        </Button>
      )}
    </div>
  )
}

const iconEnterClass =
  'transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-90 starting:opacity-0 motion-reduce:starting:scale-100'

function ConnectionIcon({ state }: Pick<ConnectionStateProps, 'state'>) {
  if (state === 'offline') return <CloudOffIcon className={cn('size-4', iconEnterClass)} />
  if (state === 'reconnecting')
    return <LoaderCircleIcon className="size-4 animate-spin motion-reduce:animate-none" />
  if (state === 'reconnected')
    return <CheckCircle2Icon className={cn('size-4 text-emerald-600', iconEnterClass)} />
  return <WifiIcon className={cn('size-4 text-muted-foreground', iconEnterClass)} />
}

export { ConnectionState }
export type { ConnectionStateProps }
