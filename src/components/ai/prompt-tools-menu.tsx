/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Custom searchable listbox supports rich icon and description rows. */
import { AddIcon as PlusIcon } from '@solar-icons/react/linear/add'
import { PaperclipIcon } from '@solar-icons/react/linear/paperclip'
import { LibraryIcon } from '@solar-icons/react/linear/library'
import { GalleryIcon as ImageIcon } from '@solar-icons/react/linear/gallery'
import { GlobalIcon as GlobeIcon } from '@solar-icons/react/linear/global'
import { MapPointIcon as MapIcon } from '@solar-icons/react/linear/map-point'
import { TelescopeIcon as ResearchIcon } from '@solar-icons/react/linear/telescope'
import { PenNewSquareIcon as SketchIcon } from '@solar-icons/react/linear/pen-new-square'
import { WidgetIcon as VisualizeIcon } from '@solar-icons/react/linear/widget'
import { useId, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from 'cn'

const promptTools = [
  {
    id: 'files',
    label: 'Add photos & files',
    description: 'Upload from computer',
    icon: PaperclipIcon,
    color: '',
  },
  {
    id: 'library',
    label: 'Add from library',
    description: 'Browse and search your files',
    icon: LibraryIcon,
    color: '',
  },
  {
    id: 'image',
    label: 'Create image',
    description: 'Visualize anything',
    icon: ImageIcon,
    color: 'text-sky-500',
  },
  {
    id: 'search',
    label: 'Web search',
    description: 'Find real-time news and info',
    icon: GlobeIcon,
    color: 'text-sky-500',
  },
  {
    id: 'maps',
    label: 'Maps',
    description: 'Find Nearby Places',
    icon: MapIcon,
    color: 'text-blue-500',
  },
  {
    id: 'research',
    label: 'Deep research',
    description: 'Get a detailed report',
    icon: ResearchIcon,
    color: 'text-blue-400',
  },
  {
    id: 'sketch',
    label: 'Sketch',
    description: 'Draw and attach an image',
    icon: SketchIcon,
    color: '',
  },
  {
    id: 'visualize',
    label: 'Visualize',
    description: 'Create visualizations and interactive tools',
    icon: VisualizeIcon,
    color: 'text-pink-400',
  },
] as const

type PromptTool = (typeof promptTools)[number]['id']

function PromptToolsMenu({ onSelect }: { onSelect: (tool: PromptTool) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const filtered = promptTools.filter((tool) =>
    `${tool.label} ${tool.description}`.toLowerCase().includes(query.toLowerCase()),
  )

  function select(tool: PromptTool) {
    setOpen(false)
    onSelect(tool)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        setQuery('')
        setActive(0)
      }}
    >
      <PopoverTrigger
        render={
          <Button
            aria-label="Add files and more"
            className="rounded-full"
            size="icon"
            type="button"
            variant="ghost"
          />
        }
      >
        <PlusIcon className="size-5 transition-[rotate] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] in-data-popup-open:rotate-45" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        initialFocus={inputRef}
        className="z-50 max-h-[var(--available-height)] w-[min(48rem,calc(100vw-2rem))] overflow-y-auto rounded-[16px] bg-card p-2 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card ring-0"
      >
        <div id={listId} role="listbox" aria-label="Files and tools">
          {filtered.map((tool, index) => (
            <div
              role="option"
              tabIndex={-1}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  select(tool.id)
                }
              }}
              aria-selected={active === index}
              aria-label={tool.label}
              id={`${listId}-${index}`}
              key={tool.id}
              onMouseMove={() => setActive(index)}
              onClick={() => select(tool.id)}
              className={cn(
                'flex min-h-9 cursor-pointer items-center gap-3 rounded-md px-2 py-2',
                active === index && 'bg-muted',
              )}
            >
              <tool.icon aria-hidden="true" className={cn('size-4 shrink-0', tool.color)} />
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="shrink-0 text-foreground">{tool.label}</span>
                <span className="text-xs leading-5">{tool.description}</span>
              </span>
            </div>
          ))}
          {filtered.length === 0 && <p className="px-3 py-4 text-xs">No matching tools.</p>}
        </div>
        <input
          ref={inputRef}
          role="combobox"
          aria-label="Search plugins, files, folders and skills"
          aria-controls={listId}
          aria-expanded={open}
          aria-activedescendant={filtered.length ? `${listId}-${active}` : undefined}
          className="mt-1 h-8 w-full bg-transparent px-2 text-xs outline-none placeholder:text-muted-foreground"
          placeholder="Type to search plugins, files, folders & skills"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              setActive((current) =>
                filtered.length
                  ? (current + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) %
                    filtered.length
                  : 0,
              )
            }
            if (event.key === 'Enter') {
              event.preventDefault()
              event.stopPropagation()
              if (filtered[active]) select(filtered[active].id)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { PromptToolsMenu, promptTools }
export type { PromptTool }
