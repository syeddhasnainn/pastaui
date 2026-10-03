import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { CloseIcon as XIcon } from '@solar-icons/react/linear/close'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from 'cn'

interface EditMessageProps extends React.ComponentProps<'section'> {
  onCancel?: () => void
  onSave?: () => void
  onValueChange?: (value: string) => void
  value: string
}

function EditMessage({
  className,
  onCancel,
  onSave,
  onValueChange,
  value,
  ...props
}: EditMessageProps) {
  return (
    <section
      data-slot="edit-message"
      className={cn(
        'rounded-[16px] border-0 bg-muted/45 p-3 shadow-none ring-0 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-[0.98] starting:opacity-0 motion-reduce:starting:scale-100',
        className,
      )}
      {...props}
    >
      <label className="sr-only" htmlFor="edit-message-value">
        Edit message
      </label>
      <Textarea
        id="edit-message-value"
        placeholder="Edit your message…"
        className="min-h-20 resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
        onChange={(event) => onValueChange?.(event.target.value)}
        value={value}
      />
      <div className="mt-2 flex items-center justify-end gap-1.5 tracking-[-0.05px]">
        {onCancel && (
          <Button
            className="h-7 rounded-full px-3 text-muted-foreground hover:text-muted-foreground has-data-[icon=inline-start]:pl-3"
            onClick={onCancel}
            size="sm"
            variant="ghost"
          >
            <XIcon data-icon="inline-start" /> Cancel
          </Button>
        )}
        {onSave && (
          <Button
            className="h-7 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 has-data-[icon=inline-start]:pl-3 dark:bg-none"
            onClick={onSave}
            size="sm"
            variant="default"
          >
            <CheckIcon data-icon="inline-start" /> Save and send
          </Button>
        )}
      </div>
    </section>
  )
}

export { EditMessage }
export type { EditMessageProps }
