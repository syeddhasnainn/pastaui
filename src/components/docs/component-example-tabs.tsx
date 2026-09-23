import { CodeBlock } from '#/components/docs/code-block'
import type { ComponentDocument } from '#/components/docs/component-catalog'
import { ComponentPreview } from '#/components/docs/component-preview'
import { cn } from '#/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'

interface ComponentExampleTabsProps {
  component: ComponentDocument
}

export function ComponentExampleTabs({ component }: ComponentExampleTabsProps) {
  return (
    <section className="mt-10 scroll-mt-8" id="examples">
      <Tabs defaultValue="preview">
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

        <TabsContent className="pt-4" value="preview">
          <div
            className={cn(
              'min-h-80 rounded-md border border-foreground/8',
              component.slug === 'research-report'
                ? 'overflow-hidden'
                : 'flex items-center justify-center p-5 sm:p-8',
            )}
          >
            <ComponentPreview slug={component.slug} />
          </div>
          {component.examples?.map((example) => (
            <section key={example.previewSlug} className="mt-8">
              <h3 className="mb-3 flex h-9 items-center text-sm text-foreground">
                {example.title}
              </h3>
              <div className="flex min-h-48 items-center justify-center rounded-md border border-foreground/8 p-5 sm:p-8">
                <ComponentPreview slug={example.previewSlug} />
              </div>
            </section>
          ))}
        </TabsContent>

        <TabsContent className="pt-4" value="usage">
          <CodeBlock code={component.usage} />
        </TabsContent>

        <TabsContent className="pt-4" value="code">
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            The component is ordinary source code. Adjust the structure, states, and tokens in your
            project.
          </p>
          <CodeBlock code={component.source} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
