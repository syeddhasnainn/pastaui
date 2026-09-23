import { useState } from 'react'

import { CodeBlock } from '#/components/docs/code-block'
import type { ComponentDocument } from '#/components/docs/component-catalog'
import { ComponentPreview } from '#/components/docs/component-preview'
import { cn } from '#/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'

interface RegistryItem {
  name: string
  files?: { path: string }[]
}

interface SourceFile {
  name: string
  code: string
}

const registry = Object.values(
  import.meta.glob<{ items: RegistryItem[] }>('/registry.json', { eager: true, import: 'default' }),
)[0]

const sources = import.meta.glob<string>('/src/components/ai/*.{ts,tsx,css}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function componentFiles(slug: string): SourceFile[] {
  const item = registry?.items.find((entry) => entry.name === slug)
  return (item?.files ?? []).flatMap(({ path }) => {
    const code = sources[`/${path}`]
    return code ? [{ name: path.split('/').pop() ?? path, code }] : []
  })
}

interface ComponentExampleTabsProps {
  component: ComponentDocument
}

type ExampleTab = 'preview' | 'usage' | 'code'

interface ExampleCardProps {
  previewSlug: string
  usage: string
  files: SourceFile[]
  minHeight: string
  previewClassName?: string
}

function ExampleCard({ previewSlug, usage, files, minHeight, previewClassName }: ExampleCardProps) {
  const [tab, setTab] = useState<ExampleTab>('preview')

  return (
    <Tabs onValueChange={(value) => setTab(value as ExampleTab)} value={tab}>
      <TabsList variant="showcase">
        <TabsTrigger value="preview" variant="showcase">
          Preview
        </TabsTrigger>
        <TabsTrigger value="usage" variant="showcase">
          Usage
        </TabsTrigger>
        <TabsTrigger value="code" variant="showcase">
          Code
        </TabsTrigger>
      </TabsList>

      <div
        className={cn(
          'relative mt-4 flex flex-col rounded-md border border-foreground/8',
          minHeight,
        )}
      >
        <div
          aria-hidden={tab !== 'preview'}
          className={cn(
            'flex-1',
            previewClassName ?? 'flex items-center justify-center p-5 sm:p-8',
            tab !== 'preview' && 'invisible',
          )}
          inert={tab !== 'preview'}
        >
          <ComponentPreview slug={previewSlug} />
        </div>

        {tab !== 'preview' && (
          <div className="absolute inset-0 scroll-fade-b [scrollbar-width:thin] [scrollbar-color:color-mix(in_oklch,var(--foreground)_18%,transparent)_transparent] overflow-auto overscroll-contain rounded-md bg-muted [&::-webkit-scrollbar]:size-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20">
            {tab === 'usage' ? (
              <CodeBlock code={usage} />
            ) : (
              files.map((file) => (
                <div key={file.name}>
                  {files.length > 1 && (
                    <p className="px-4 pt-4 font-mono text-xs text-muted-foreground">{file.name}</p>
                  )}
                  <CodeBlock
                    code={file.code}
                    language={file.name.endsWith('.css') ? 'css' : 'tsx'}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Tabs>
  )
}

export function ComponentExampleTabs({ component }: ComponentExampleTabsProps) {
  return (
    <section className="mt-10 scroll-mt-8" id="examples">
      <ExampleCard
        minHeight="min-h-80"
        previewClassName={component.slug === 'research-report' ? 'overflow-hidden' : undefined}
        previewSlug={component.slug}
        files={componentFiles(component.slug)}
        usage={component.usage}
      />

      {component.examples?.map((example) => (
        <section className="mt-16" key={example.previewSlug}>
          <h2 className="text-2xl font-medium tracking-[-0.02em] text-foreground">
            {example.title}
          </h2>
          {example.description && (
            <p className="mt-3 max-w-xl text-sm leading-5 text-muted-foreground">
              {example.description}
            </p>
          )}
          <div className="mt-6">
            <ExampleCard
              minHeight="min-h-48"
              previewSlug={example.previewSlug}
              files={componentFiles(component.slug)}
              usage={example.usage ?? component.usage}
            />
          </div>
        </section>
      ))}
    </section>
  )
}
