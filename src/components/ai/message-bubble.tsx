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
        'w-fit max-w-[85%] rounded-[16px] px-3.5 py-2.5 text-sm leading-6 transition-[opacity,translate,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:opacity-0',
        from !== 'system' &&
          'starting:translate-y-1 starting:scale-[0.97] motion-reduce:starting:translate-y-0 motion-reduce:starting:scale-100',
        from === 'user' &&
          'ml-auto origin-bottom-right bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary text-primary-foreground dark:bg-none',
        from === 'assistant' && 'origin-bottom-left bg-muted text-foreground',
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
