import * as React from 'react'

import { cn } from 'cn'

interface ButtonGroupProps extends React.ComponentProps<'div'> {
  orientation?: 'horizontal' | 'vertical'
}

function ButtonGroup({ className, orientation = 'horizontal', ...props }: ButtonGroupProps) {
  return (
    <div
      data-orientation={orientation}
      data-slot="button-group"
      className={cn(
        '[&>*]:not(:first-child):rounded-l-none [&>*]:not(:first-child):border-l-0 [&>*]:not(:last-child):rounded-r-none inline-flex w-fit items-stretch [&>*]:focus-visible:z-10',
        orientation === 'vertical' &&
          '[&>*]:not(:first-child):rounded-t-none [&>*]:not(:first-child):border-t-0 [&>*]:not(:last-child):rounded-b-none [&>*]:not(:first-child):border-l flex-col',
        className,
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
