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
import { headingClass, sectionClass, sectionStackClass } from '#/site/landing/variant-ui'
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
  eager: true,
})

function componentFiles(slug: string): SourceFile[] {
  const item = registry?.items.find((entry) => entry.name === slug)
  return (item?.files ?? []).flatMap(({ path }) => {
    const code = sources[`/${path}`]
    return code ? [{ name: path.split('/').pop() ?? path, code }] : []
  })
}

function PreviewFrame({ slug, tall = true }: { slug: string; tall?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-[16px] border-[0.5px] border-border bg-surface p-5 sm:p-8',
        tall ? 'min-h-[clamp(520px,calc(100dvh-8rem),960px)]' : 'min-h-48',
      )}
      data-preview-frame
    >
      <Suspense fallback={null}>
        <ComponentPreview slug={slug} />
      </Suspense>
    </div>
  )
}

export function ComponentPage({ component }: { component: ComponentDocument }) {
  const files = componentFiles(component.slug)

  return (
    <div className="@container pb-10">
      <div className={sectionStackClass}>
        <section aria-label={`${component.name} preview`} className="flex min-w-0 flex-col gap-2">
          <div className="flex min-h-9 items-center gap-2.5">
            <h1 className="shrink-0 truncate card-text-md font-[550] text-foreground">
              {component.name}
            </h1>
            <span aria-hidden="true" className="h-3.5 w-px shrink-0 bg-border" />
            <p className="min-w-0 truncate paragraph-text-sm font-[500] text-muted-foreground">
              {component.description}
            </p>
          </div>
          <PreviewFrame slug={component.slug} />
        </section>

        {component.examples?.map((example) => (
          <section
            aria-labelledby={`${example.previewSlug}-heading`}
            className={sectionClass}
            key={example.previewSlug}
          >
            <h2 className={headingClass} id={`${example.previewSlug}-heading`}>
              {example.title}
            </h2>
            {example.description && (
              <p className="mt-1.5 max-w-xl paragraph-text-sm text-muted-foreground">
                {example.description}
              </p>
            )}
            <div className="mt-5 flex flex-col gap-4">
              <PreviewFrame slug={example.previewSlug} tall={false} />
              {example.usage && <UsageCode usage={example.usage} />}
            </div>
          </section>
        ))}

        <section aria-labelledby="usage-heading" className={sectionClass}>
          <h2 className={headingClass} id="usage-heading">
            Usage
          </h2>
          <div className="mt-5">
            <UsageCode usage={component.usage} />
          </div>
        </section>

        <section aria-labelledby="install-heading" className={sectionClass}>
          <h2 className={headingClass} id="install-heading">
            Install
          </h2>
          <div className="mt-5">
            <InstallPanel command={component.installation} />
          </div>
        </section>

        {files.length > 0 && (
          <section aria-labelledby="code-heading" className={sectionClass}>
            <h2 className={headingClass} id="code-heading">
              Source
            </h2>
            <div className="mt-5">
              <SourceFiles files={files} />
            </div>
          </section>
        )}

        {component.api.length > 0 && (
          <section aria-labelledby="api-heading" className={sectionClass}>
            <h2 className={headingClass} id="api-heading">
              Props
            </h2>
            <ApiTable api={component.api} name={component.name} />
          </section>
        )}
      </div>
    </div>
  )
}

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
    <div className={cn('mt-5 pt-1.5', trayClass)}>
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
