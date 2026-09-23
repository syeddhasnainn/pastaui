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
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`
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
        'w-full rounded-md bg-background p-2 shadow-sm ring-1 ring-foreground/12',
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
              className="max-w-48"
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
        className="min-h-12 resize-none rounded-md border-0 bg-transparent px-2 py-2 text-[15px]/5 font-[450] tracking-normal shadow-none focus-visible:ring-0 md:text-[15px]/5 dark:bg-transparent"
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
      <div className="flex items-center justify-between gap-2 pt-1">
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
          className="rounded-full border-0 bg-linear-to-b from-[color-mix(in_oklch,var(--color-neutral-900),var(--color-neutral-50)_30%)] to-neutral-900 text-neutral-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110"
          variant="default"
          disabled={!pending && !value.trim()}
          size="icon"
          type={pending ? 'button' : 'submit'}
        >
          {pending ? <SquareIcon className="size-3 fill-current" /> : <ArrowUpIcon />}
        </Button>
      </div>
    </form>
  )
}

export { PromptInput }
export type { PromptInputProps }
