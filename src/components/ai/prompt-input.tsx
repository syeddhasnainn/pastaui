import { ModelPicker, type ModelOption, type ModelEffort } from '@/components/ai/model-picker'
import { defaultModels, additionalModels } from '@/components/ai/model-options'
import { ArrowUpIcon } from '@solar-icons/react/linear/arrow-up'
import { CloseCircleIcon as CloseIcon } from '@solar-icons/react/linear/close-circle'
import { PromptToolsMenu, promptTools, type PromptTool } from '@/components/ai/prompt-tools-menu'
import { StopIcon as SquareIcon } from '@solar-icons/react/linear/stop'
import * as React from 'react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from 'cn'

interface PromptInputProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  defaultValue?: string
  model?: string
  models?: ModelOption[]
  moreModels?: ModelOption[]
  onModelChange?: (model: string) => void
  effort?: ModelEffort
  onEffortChange?: (effort: ModelEffort) => void
  onSubmit?: (
    value: string,
    selection: { model: string; effort: ModelEffort; tool?: PromptTool; files: File[] },
  ) => void
  onToolSelect?: (tool: PromptTool) => void
  onFilesChange?: (files: File[]) => void
  pending?: boolean
  placeholder?: string
}

const chipEnterClass =
  'transition-[opacity,scale,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-95 starting:opacity-0 motion-reduce:starting:scale-100'

function PromptInput({
  className,
  defaultValue = '',
  model,
  models = defaultModels,
  moreModels = additionalModels,
  onModelChange,
  effort,
  onEffortChange,
  onSubmit,
  onToolSelect,
  onFilesChange,
  pending = false,
  placeholder = 'Ask anything…',
  ...props
}: PromptInputProps) {
  const [value, setValue] = useState(defaultValue)
  const [selectedTool, setSelectedTool] = useState<PromptTool>()
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [internalModel, setInternalModel] = useState(
    models.find((item) => !item.requiresUpgrade)?.id ?? '',
  )
  const [internalEffort, setInternalEffort] = useState<ModelEffort>('medium')
  const selectedModel = model ?? internalModel
  const selectedEffort = effort ?? internalEffort
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function resizeTextarea(element: HTMLTextAreaElement) {
    element.style.height = '0px'
    element.style.height = `${Math.min(element.scrollHeight, 240)}px`
  }

  function submitPrompt() {
    const prompt = value.trim()
    if (!prompt || pending) return
    onSubmit?.(prompt, { model: selectedModel, effort: selectedEffort, tool: selectedTool, files })
    setFiles([])
    onFilesChange?.([])
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = '0px'
  }

  return (
    <form
      data-slot="prompt-input"
      className={cn(
        'w-full rounded-[16px] border-[0.5px] border-border bg-card p-2.5 shadow-[0_1px_0_rgb(0_0_0/0.04),0_6px_8px_-6px_rgb(0_0_0/0.08)] dark:border-transparent',
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault()
        submitPrompt()
      }}
      {...props}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        aria-label="Upload files"
        onChange={(event) => {
          const next = [...files, ...Array.from(event.target.files ?? [])]
          setFiles(next)
          onFilesChange?.(next)
          event.target.value = ''
        }}
      />
      {(files.length > 0 || selectedTool) && (
        <div className="flex flex-wrap gap-2 px-2 py-1">
          {selectedTool && (
            <Button
              type="button"
              variant="secondary"
              size="xs"
              className={chipEnterClass}
              onClick={() => setSelectedTool(undefined)}
              aria-label="Clear selected tool"
            >
              {promptTools.find((tool) => tool.id === selectedTool)?.label}
              <CloseIcon />
            </Button>
          )}
          {files.map((file, index) => (
            <Button
              key={`${file.name}-${index}`}
              type="button"
              variant="secondary"
              size="xs"
              className={cn('max-w-48', chipEnterClass)}
              aria-label={`Remove ${file.name}`}
              onClick={() => {
                const next = files.filter((_, fileIndex) => fileIndex !== index)
                setFiles(next)
                onFilesChange?.(next)
              }}
            >
              <span className="truncate">{file.name}</span>
              <CloseIcon />
            </Button>
          ))}
        </div>
      )}
      <Textarea
        ref={textareaRef}
        aria-label="Message"
        className="min-h-18 resize-none rounded-md border-0 bg-transparent px-2 py-1.5 text-[15px]/6 font-[450] tracking-normal shadow-none placeholder:font-normal focus-visible:ring-0 md:text-[15px]/6 dark:bg-transparent"
        onChange={(event) => {
          setValue(event.target.value)
          resizeTextarea(event.target)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            submitPrompt()
          }
        }}
        placeholder={placeholder}
        rows={1}
        value={value}
      />
      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-1">
          <PromptToolsMenu
            onSelect={(tool) => {
              if (tool === 'files') fileInputRef.current?.click()
              else setSelectedTool(tool)
              onToolSelect?.(tool)
            }}
          />
          <ModelPicker
            models={models}
            moreModels={moreModels}
            value={selectedModel}
            effort={selectedEffort}
            onValueChange={(next) => {
              if (model === undefined) setInternalModel(next)
              onModelChange?.(next)
            }}
            onEffortChange={(next) => {
              if (effort === undefined) setInternalEffort(next)
              onEffortChange?.(next)
            }}
          />
        </div>
        <Button
          aria-label={pending ? 'Stop response' : 'Send message'}
          className="rounded-full border-0 bg-primary bg-linear-to-b from-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_30%)] to-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 dark:bg-none"
          variant="default"
          disabled={!pending && !value.trim()}
          size="icon-lg"
          type={pending ? 'button' : 'submit'}
        >
          <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 *:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:*:transition-opacity">
            <ArrowUpIcon
              aria-hidden="true"
              className={cn('place-self-center', pending && 'scale-75 opacity-0')}
            />
            <SquareIcon
              aria-hidden="true"
              className={cn(
                'size-3 place-self-center fill-current',
                !pending && 'scale-75 opacity-0',
              )}
            />
          </span>
        </Button>
      </div>
    </form>
  )
}

export { PromptInput }
export type { PromptInputProps }
