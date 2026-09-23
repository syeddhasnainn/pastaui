import { Menu } from '@base-ui/react/menu'
import { CheckReadIcon as CheckIcon } from '@solar-icons/react/linear/check-read'
import { AltArrowDownIcon as ChevronDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

interface ModelOption {
  description?: string
  provider?: 'openai' | 'claude'
  family?: string
  id: string
  name: string
  price?: string
  badge?: string
  requiresUpgrade?: boolean
}

type ModelEffort = 'low' | 'medium' | 'high' | 'extra'

interface ModelPickerProps {
  className?: string
  defaultValue?: string
  models: ModelOption[]
  moreModels?: ModelOption[]
  onValueChange?: (value: string) => void
  value?: string
  effort?: ModelEffort
  defaultEffort?: ModelEffort
  onEffortChange?: (effort: ModelEffort) => void
  onUpgrade?: (modelId: string) => void
  footer?: ReactNode
}

const surface =
  'w-80 max-h-[var(--available-height)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[8px] bg-card p-1.5 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card outline-none'
const row =
  'flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left outline-none data-highlighted:bg-muted data-disabled:cursor-default data-disabled:opacity-50'
const effortLabels: Record<ModelEffort, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  extra: 'Extra',
}

function ModelProviderIcon({ provider }: { provider?: ModelOption['provider'] }) {
  if (!provider) return null
  if (provider === 'claude')
    return <img src="/icons/providers/claude.svg" alt="" className="size-4 shrink-0" />
  return (
    <span aria-hidden="true" className="size-4 shrink-0">
      <img src="/icons/providers/openai.svg" alt="" className="size-4 scale-150 dark:hidden" />
      <img
        src="/icons/providers/openai-dark.svg"
        alt=""
        className="hidden size-4 scale-150 dark:block"
      />
    </span>
  )
}

function ModelPicker({
  className,
  defaultValue,
  models,
  moreModels = [],
  onValueChange,
  value,
  effort,
  defaultEffort = 'medium',
  onEffortChange,
  onUpgrade,
  footer,
}: ModelPickerProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? models.find((model) => !model.requiresUpgrade)?.id ?? '',
  )
  const [internalEffort, setInternalEffort] = useState(defaultEffort)
  const selectedValue = value ?? internalValue
  const selectedEffort = effort ?? internalEffort
  const selectedModel = [...models, ...moreModels].find((model) => model.id === selectedValue)

  function selectModel(id: string) {
    if (value === undefined) setInternalValue(id)
    onValueChange?.(id)
  }

  function modelRows(items: ModelOption[]) {
    return items.map((model) => {
      const content = (
        <>
          <ModelProviderIcon provider={model.provider} />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2 text-sm">
              {model.name}
              {(model.badge || model.family) && (
                <span className="rounded-sm bg-muted px-1.5 text-xs leading-5">
                  {model.badge ?? model.family}
                </span>
              )}
            </span>
            {model.description && (
              <span className="mt-0.5 block text-xs leading-5">{model.description}</span>
            )}
          </span>
        </>
      )
      return model.requiresUpgrade ? (
        <Menu.Item
          className={row}
          key={model.id}
          disabled={!onUpgrade}
          onClick={() => onUpgrade?.(model.id)}
        >
          {content}
          <span className="shrink-0 rounded-full bg-linear-to-b from-[color-mix(in_oklch,var(--color-neutral-900),var(--color-neutral-50)_30%)] to-neutral-900 px-2.5 py-1 text-xs leading-4 text-neutral-50">
            Upgrade
          </span>
        </Menu.Item>
      ) : (
        <Menu.RadioItem className={row} key={model.id} value={model.id} closeOnClick>
          {content}
          {model.price && <span className="text-xs">{model.price}</span>}
          <Menu.RadioItemIndicator className="ml-auto shrink-0">
            <CheckIcon className="size-4" />
          </Menu.RadioItemIndicator>
        </Menu.RadioItem>
      )
    })
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button
            className={cn(
              'h-8 gap-2 rounded-full px-3 text-sm font-[450] tracking-[-0.05px] text-muted-foreground',
              className,
            )}
            variant="ghost"
          />
        }
      >
        <ModelProviderIcon provider={selectedModel?.provider} />
        <span className="max-w-40 truncate">{selectedModel?.name ?? 'Select model'}</span>
        <span className="text-muted-foreground/80">{effortLabels[selectedEffort]}</span>
        <ChevronDownIcon className="size-3.5" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
          <Menu.Popup className={surface}>
            <Menu.RadioGroup value={selectedValue} onValueChange={selectModel}>
              {modelRows(models)}
            </Menu.RadioGroup>
            <Menu.Separator className="mx-3 my-1 h-px bg-border/60" />
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger className={row}>
                Effort <span className="ml-auto text-xs">{effortLabels[selectedEffort]}</span>
                <ChevronRightIcon className="size-3.5" />
              </Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner side="right" align="start" sideOffset={6} className="z-50">
                  <Menu.Popup className={cn(surface, 'w-64')}>
                    <p className="px-3 py-2 text-xs leading-5">
                      Higher effort gives the model more time to work through complex tasks.
                    </p>
                    <Menu.RadioGroup
                      value={selectedEffort}
                      onValueChange={(next: ModelEffort) => {
                        if (effort === undefined) setInternalEffort(next)
                        onEffortChange?.(next)
                      }}
                    >
                      {(Object.keys(effortLabels) as ModelEffort[]).map((level) => (
                        <Menu.RadioItem className={row} key={level} value={level}>
                          {effortLabels[level]}
                          <Menu.RadioItemIndicator className="ml-auto">
                            <CheckIcon className="size-4" />
                          </Menu.RadioItemIndicator>
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioGroup>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
            {moreModels.length > 0 && (
              <>
                <Menu.Separator className="mx-3 my-1 h-px bg-border/60" />
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger className={row}>
                    More models
                    <ChevronRightIcon className="ml-auto size-3.5" />
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner side="right" align="start" sideOffset={6} className="z-50">
                      <Menu.Popup className={surface}>
                        <Menu.RadioGroup value={selectedValue} onValueChange={selectModel}>
                          {modelRows(moreModels)}
                        </Menu.RadioGroup>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
              </>
            )}
            {footer && (
              <>
                <Menu.Separator className="mx-3 my-1 h-px bg-border/60" />
                <div className="px-3 py-2 text-xs leading-5">{footer}</div>
              </>
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export { ModelPicker }
export type { ModelOption, ModelPickerProps, ModelEffort }
