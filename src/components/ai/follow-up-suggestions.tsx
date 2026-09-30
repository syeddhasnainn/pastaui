import * as React from 'react'
import { useId, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Kbd } from '@/components/ui/kbd'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from 'cn'

interface FollowUpSuggestion {
  id: string
  label: string
}

interface FollowUpSuggestionsProps extends Omit<React.ComponentProps<'section'>, 'onSelect'> {
  defaultSelectedId?: string
  items: FollowUpSuggestion[]
  onDismiss?: () => void
  onSelect?: (id: string) => void
  onSelectedIdChange?: (id: string) => void
  selectedId?: string
  title?: string
}

function FollowUpSuggestions({
  className,
  defaultSelectedId,
  items,
  onDismiss,
  onSelect,
  onSelectedIdChange,
  selectedId,
  title = 'What would you like to do?',
  ...props
}: FollowUpSuggestionsProps) {
  const titleId = useId()
  const itemElements = useRef(new Map<string, HTMLButtonElement>())
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState(
    defaultSelectedId ?? items[0]?.id,
  )
  const currentSelectedId = selectedId ?? uncontrolledSelectedId

  function selectSuggestion(id: string, focus = false) {
    if (selectedId === undefined) setUncontrolledSelectedId(id)
    onSelectedIdChange?.(id)
    if (focus) itemElements.current.get(id)?.focus()
  }

  function moveSelection(direction: -1 | 1) {
    const currentIndex = Math.max(
      0,
      items.findIndex((item) => item.id === currentSelectedId),
    )
    const nextIndex = (currentIndex + direction + items.length) % items.length
    const nextItem = items[nextIndex]

    if (nextItem) selectSuggestion(nextItem.id, true)
  }

  function submitSelection() {
    if (currentSelectedId) onSelect?.(currentSelectedId)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveSelection(1)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveSelection(-1)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      submitSelection()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      onDismiss?.()
      return
    }

    const shortcutIndex = Number(event.key) - 1
    const shortcutItem = items[shortcutIndex]
    if (shortcutItem && shortcutIndex >= 0 && shortcutIndex <= 8) {
      event.preventDefault()
      selectSuggestion(shortcutItem.id, true)
    }
  }

  return (
    <section
      aria-labelledby={titleId}
      className={cn('w-full tracking-[-0.05px]', className)}
      data-slot="follow-up-suggestions"
      {...props}
    >
      <Card className="gap-2 rounded-[16px] pt-5 shadow-linear-surface ring-foreground/8" size="sm">
        <CardHeader className="mb-2">
          <CardTitle
            className="pl-3 card-heading leading-[19.25px] text-muted-foreground group-data-[size=sm]/card:text-[15px]"
            id={titleId}
          >
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm leading-5 font-[450]">
          <ToggleGroup
            aria-label={title}
            className="flex w-full flex-col items-stretch gap-1 bg-transparent p-0"
            onKeyDown={handleKeyDown}
            onValueChange={(value) => {
              const nextSelectedId = value[0]
              if (nextSelectedId) selectSuggestion(nextSelectedId)
            }}
            orientation="vertical"
            value={currentSelectedId ? [currentSelectedId] : []}
          >
            {items.map((item, index) => {
              const isSelected = item.id === currentSelectedId

              return (
                <ToggleGroupItem
                  key={item.id}
                  ref={(element) => {
                    if (element) itemElements.current.set(item.id, element)
                    else itemElements.current.delete(item.id)
                  }}
                  className="group/suggestion h-auto min-h-10 w-full justify-start gap-3 rounded-[10px] px-3 py-2 text-left text-sm leading-5 font-[450] text-muted-foreground hover:bg-muted/70 hover:text-muted-foreground data-pressed:bg-muted data-pressed:text-muted-foreground data-pressed:shadow-none"
                  value={item.id}
                >
                  {isSelected ? (
                    <span className="flex size-6 shrink-0 items-center justify-center text-[13px] text-muted-foreground">
                      {index + 1}
                    </span>
                  ) : (
                    <Kbd className="size-6 shrink-0 px-0 text-xs font-[450] shadow-none">
                      {index + 1}
                    </Kbd>
                  )}
                  <span className="truncate">{item.label}</span>
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-between gap-3 border-t-0 bg-transparent pt-1 pb-5">
          <div className="ml-auto flex items-center gap-1.5">
            {onDismiss && (
              <Button
                className="h-7 rounded-full px-3 text-muted-foreground hover:text-muted-foreground"
                onClick={onDismiss}
                size="sm"
                variant="ghost"
              >
                Dismiss
                <Kbd className="ml-1 shadow-none">Esc</Kbd>
              </Button>
            )}
            <Button
              className="h-7 rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary px-3 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
              disabled={!currentSelectedId}
              onClick={submitSelection}
              size="sm"
              variant="default"
            >
              Submit
              <Kbd className="ml-0.5 size-4 min-h-4 min-w-4 bg-primary-foreground/10 p-0 leading-none text-primary-foreground shadow-none">
                <svg aria-hidden="true" className="size-3" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 5v10H4m5-5-5 5 5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">Enter</span>
              </Kbd>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  )
}

export { FollowUpSuggestions }
export type { FollowUpSuggestion, FollowUpSuggestionsProps }
