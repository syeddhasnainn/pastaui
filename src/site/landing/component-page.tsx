import { Suspense } from 'react'

import type { ApiProperty, ComponentDocument } from '#/components/docs/component-catalog'
import { ComponentPreview } from '#/components/docs/component-preview'
import {
  InstallPanel,
  innerCardClass,
  SourceFiles,
  trayClass,
  UsageCode,
  type SourceFile,
} from '#/site/landing/variant-code'
import { useComponentView } from '#/site/landing/component-view-toggle'
import { sectionClass, sectionStackClass } from '#/site/landing/variant-ui'
import { cn } from '#/lib/utils'

interface RegistryItem {
  name: string
  files?: { path: string }[]
}

const registry = Object.values(
  import.meta.glob<{ items: RegistryItem[] }>('/registry.json', { eager: true, import: 'default' }),
)[0]

const sources = import.meta.glob<string>('/src/components/ai/*.{ts,tsx,css}', {
  query: '?raw',
  import: 'default',
})

export async function loadComponentFiles(slug: string): Promise<SourceFile[]> {
  const item = registry?.items.find((entry) => entry.name === slug)
  const files = await Promise.all(
    (item?.files ?? []).map(async ({ path }) => {
      const load = sources[`/${path}`]
      return load ? { name: path.split('/').pop() ?? path, code: await load() } : null
    }),
  )
  return files.filter((file) => file !== null)
}

const previewFrameSizes = {
  full: 'min-h-[520px] p-5 sm:p-8 lg:h-[calc(100dvh-11.5rem)] lg:min-h-0',
  compact: 'min-h-48 p-5 sm:p-8',
}

function PreviewFrame({
  slug,
  size = 'full',
}: {
  slug: string
  size?: keyof typeof previewFrameSizes
}) {
  return (
    <div
      className={cn(
        'flex items-center-safe justify-center-safe overflow-y-auto overscroll-contain',
        previewFrameSizes[size],
      )}
      data-preview-frame
    >
      <Suspense fallback={null}>
        <ComponentPreview slug={slug} />
      </Suspense>
    </div>
  )
}

export function ComponentPage({
  component,
  files,
}: {
  component: ComponentDocument
  files: SourceFile[]
}) {
  const view = useComponentView()

  return (
    <div
      className={cn(
        '@container animate-in pb-20 duration-300 fade-in-0 motion-reduce:animate-none',
      )}
    >
      {view === 'preview' ? (
        <section aria-label={`${component.name} preview`} className="min-w-0">
          <PreviewFrame slug={component.slug} />
        </section>
      ) : (
        <div className={cn(sectionStackClass, 'mx-auto w-full max-w-[960px]')}>
          {component.examples?.map((example) => (
            <section aria-label={example.title} className={sectionClass} key={example.previewSlug}>
              <div className="flex flex-col gap-4">
                <PreviewFrame slug={example.previewSlug} size="compact" />
                {example.usage && <UsageCode usage={example.usage} />}
              </div>
            </section>
          ))}

          <section aria-labelledby="usage-heading" className={sectionClass}>
            <h2 className={sectionHeadingClass} id="usage-heading">
              Usage
            </h2>
            <div className="mt-2.5">
              <UsageCode usage={component.usage} />
            </div>
          </section>

          <section aria-labelledby="install-heading" className={sectionClass}>
            <h2 className={sectionHeadingClass} id="install-heading">
              Install
            </h2>
            <div className="mt-2.5">
              <InstallPanel command={component.installation} />
            </div>
          </section>

          {files.length > 0 && (
            <section aria-labelledby="code-heading" className={sectionClass}>
              <h2 className={sectionHeadingClass} id="code-heading">
                Source
              </h2>
              <div className="mt-2.5">
                <SourceFiles files={files} />
              </div>
            </section>
          )}

          {component.api.length > 0 && (
            <section aria-labelledby="api-heading" className={sectionClass}>
              <h2 className={sectionHeadingClass} id="api-heading">
                Props
              </h2>
              <ApiTable api={component.api} name={component.name} />
            </section>
          )}
        </div>
      )}
    </div>
  )
}

const sectionHeadingClass = 'text-[15px] leading-[1.5] font-[600] text-foreground'

const apiCellClass =
  'px-4 py-2.5 @max-[640px]:p-0 @min-[640px]:border-b-[0.5px] @min-[640px]:border-(--code-border)'

const apiCodeClass = 'font-mono text-[13px] leading-5 break-words'

const apiColumns = [
  { label: 'Prop', width: '@min-[640px]:w-[17%]' },
  { label: 'Type', width: '@min-[640px]:w-[24%]' },
  { label: 'Default', width: '@min-[640px]:w-[21%]' },
  { label: 'Description', width: '' },
]

const apiChipClass =
  '@max-[640px]:rounded-md @max-[640px]:bg-(--code-tray) @max-[640px]:px-1.5 @max-[640px]:py-0.5'

function ApiTable({ api, name }: { api: ApiProperty[]; name: string }) {
  return (
    <div className={cn('mt-2.5', trayClass)}>
      <div className={innerCardClass}>
        <table className="w-full border-collapse text-left @max-[640px]:block @min-[640px]:table-fixed">
          <caption className="sr-only">{name} props</caption>
          <thead className="@max-[640px]:sr-only">
            <tr>
              {apiColumns.map(({ label, width }) => (
                <th
                  className={cn(
                    'border-b-[0.5px] border-(--code-border) px-4 py-2.5 paragraph-text-sm font-medium text-muted-foreground',
                    width,
                  )}
                  key={label}
                  scope="col"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="@max-[640px]:block">
            {api.map((property) => {
              const hasDefault = property.defaultValue !== '' && property.defaultValue !== '—'
              return (
                <tr
                  className="align-top @max-[640px]:flex @max-[640px]:flex-wrap @max-[640px]:gap-x-1.5 @max-[640px]:gap-y-2 @max-[640px]:border-b-[0.5px] @max-[640px]:border-(--code-border) @max-[640px]:px-4 @max-[640px]:py-3.5 @max-[640px]:last:border-b-0 last:[&>*]:border-b-0"
                  key={property.name}
                >
                  <th
                    className={cn(
                      apiCellClass,
                      apiCodeClass,
                      'font-medium text-(--code-keyword) @max-[640px]:w-full',
                    )}
                    scope="row"
                  >
                    {property.name}
                  </th>
                  <td
                    className={cn(
                      apiCellClass,
                      apiChipClass,
                      apiCodeClass,
                      'max-w-full text-(--code-component)',
                    )}
                  >
                    {property.type}
                  </td>
                  <td
                    className={cn(
                      apiCellClass,
                      apiChipClass,
                      apiCodeClass,
                      'max-w-full text-muted-foreground',
                    )}
                  >
                    <span className="text-muted-foreground @min-[640px]:hidden">= </span>
                    {hasDefault ? property.defaultValue : '—'}
                  </td>
                  <td
                    className={cn(
                      apiCellClass,
                      'paragraph-text-sm text-muted-foreground @max-[640px]:w-full',
                    )}
                  >
                    {property.description}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
