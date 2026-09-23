import { DocsLayout } from '#/components/docs/docs-layout'
import type { ComponentDocument } from '#/components/docs/component-catalog'
import { ComponentExampleTabs } from '#/components/docs/component-example-tabs'
import { InstallationCard } from '#/components/docs/installation-card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'

interface ComponentDocsPageProps {
  component: ComponentDocument
}

export function ComponentDocsPage({ component }: ComponentDocsPageProps) {
  return (
    <DocsLayout component={component}>
      <article className="min-w-0 pb-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs/component">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{component.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-3 text-[28px] leading-[1.1] font-normal tracking-[-0.025em]">
          {component.name}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-5 text-muted-foreground">
          {component.description}
        </p>

        <ComponentExampleTabs component={component} />

        <DocsSection id="installation" title="Installation">
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Add the component source directly to your project.
          </p>
          <InstallationCard command={component.installation} />
        </DocsSection>

        <DocsSection id="api-reference" title="API reference">
          <h3 className="mb-4 text-base font-medium tracking-[-0.05px]">{component.name}</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 border-collapse text-left text-sm font-[450] tracking-[-0.05px]">
              <caption className="sr-only">{component.name} properties</caption>
              <thead>
                <tr className="border-b border-border">
                  {['Prop', 'Type', 'Default', 'Description'].map((label) => (
                    <th
                      scope="col"
                      key={label}
                      className="px-3 py-3 font-medium text-foreground first:pl-0 last:pr-0"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {component.api.map((property) => (
                  <tr className="border-b border-border align-top" key={property.name}>
                    <th scope="row" className="py-3 pr-3 text-left font-normal">
                      <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                        {property.name}
                      </code>
                    </th>
                    <td className="px-3 py-3">
                      <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs leading-6 break-words">
                        {property.type}
                      </code>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {property.defaultValue === '—' ? (
                        '—'
                      ) : (
                        <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs leading-6">
                          {property.defaultValue}
                        </code>
                      )}
                    </td>
                    <td className="py-3 pl-3 leading-6 text-muted-foreground">
                      {property.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocsSection>
      </article>
    </DocsLayout>
  )
}

interface DocsSectionProps {
  children: React.ReactNode
  id: string
  title: string
}

function DocsSection({ children, id, title }: DocsSectionProps) {
  return (
    <section className="mt-16 scroll-mt-8" id={id}>
      <h2 className="mb-5 text-2xl font-medium tracking-[-0.02em]">{title}</h2>
      {children}
    </section>
  )
}
