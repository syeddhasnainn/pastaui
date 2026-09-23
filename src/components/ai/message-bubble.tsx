import * as React from 'react'

import { cn } from 'cn'

interface MessageBubbleProps extends React.ComponentProps<'div'> {
  from?: 'assistant' | 'system' | 'user'
}

function MessageBubble({ children, className, from = 'assistant', ...props }: MessageBubbleProps) {
  return (
    <div
      data-from={from}
      data-slot="message-bubble"
      className={cn(
        'w-fit max-w-[85%] rounded-md px-3.5 py-2.5 text-sm leading-6',
        from === 'user' &&
          'ml-auto rounded-br-md bg-linear-to-b from-[color-mix(in_oklch,var(--color-neutral-900),var(--color-neutral-50)_30%)] to-neutral-900 text-neutral-50',
        from === 'assistant' && 'rounded-bl-md bg-muted text-foreground',
        from === 'system' &&
          'mx-auto max-w-full bg-transparent px-0 py-1 text-center text-xs text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { MessageBubble }
export type { MessageBubbleProps }
