import { createFileRoute, Link } from '@tanstack/react-router'
import { Fragment, Suspense, useState } from 'react'

import { componentCatalog, componentGroups } from '#/components/docs/component-catalog'
import { ComponentPreview } from '#/components/docs/component-preview'
import { LogoMark } from '#/site/brand/logo-mark'
import { DemoNav } from '#/site/demo/demo-nav'
import { useDarkDocument } from '#/site/demo/use-dark-document'
import { jsonLd, organization, seo, siteDescription, siteName, siteUrl } from '#/lib/seo'
import { cn } from '#/lib/utils'

const excluded = new Set(['image-generation-loader', 'citations'])
const pool = componentCatalog.filter((component) => !excluded.has(component.slug))

const categories = componentGroups
  .flatMap((group) => {
    const inGroup = pool.filter((component) => component.group === group)
    return [...new Set(inGroup.map((component) => component.category ?? group))].map(
      (category) => ({
        name: category,
        components: inGroup.filter((component) => (component.category ?? group) === category),
      }),
    )
  })
  .filter((category) => category.components.length > 0)

const MAX_TILES = 6

const featuredSlugs = [
  'prompt-input',
  'file-diff',
  'context-breakdown',
  'voice-input',
  'background-runs',
  'email-composer',
]
const featured = featuredSlugs.flatMap((slug) =>
  pool.filter((component) => component.slug === slug),
)

export const Route = createFileRoute('/')({
  head: () => ({
    ...seo({
      title: `${siteName} — Open-source React components`,
      description: siteDescription,
      path: '/',
    }),
    scripts: [
      jsonLd({
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        publisher: organization,
      }),
    ],
  }),
  component: HomePage,
})

function HomePage() {
  useDarkDocument()
  const [active, setActive] = useState<string | null>(null)
  const visible = (
    active ? (categories.find((category) => category.name === active)?.components ?? []) : featured
  ).slice(0, MAX_TILES)

  return (
    <div className="dark flex min-h-dvh bg-neutral-900 text-foreground">
      <main className="min-w-0 flex-1 px-6 pt-4 pb-24" id="main-content">
        <DemoNav className="mb-28" />
        <span className="mx-auto mb-6 flex w-fit items-center gap-2 text-sm font-medium text-foreground">
          <LogoMark size={22} />
          Pasta UI
        </span>
        <h1 className="mx-auto max-w-md text-center heading-text-md font-medium text-balance text-foreground">
          Beautifully crafted interfaces for AI agents
        </h1>

        <nav
          aria-label="Filter components"
          className="mx-auto mt-16 flex w-fit max-w-3xl [scrollbar-width:none] items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {[
            { name: 'All', value: null },
            ...categories.map((c) => ({ name: c.name, value: c.name })),
          ].map((chip) => (
            <Fragment key={chip.name}>
              <button
                aria-pressed={active === chip.value}
                className={cn(
                  'h-8 shrink-0 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap transition-colors',
                  active === chip.value
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-foreground hover:bg-muted/70',
                )}
                onClick={() => setActive(chip.value)}
                type="button"
              >
                {chip.name}
              </button>
              {chip.value === null && (
                <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-border" />
              )}
            </Fragment>
          ))}
        </nav>

        <ul className="mt-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((component) => (
            <li key={component.slug}>
              <p className="mb-2 metadata-label font-medium">{component.name}</p>
              <Link
                aria-label={component.name}
                className="flex aspect-[4/3] w-full overflow-hidden rounded-md preview-stage shadow-card transition-opacity hover:opacity-90"
                params={{ slug: component.slug }}
                to="/docs/component/$slug"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none flex size-full items-center justify-center p-4 [:where(&>*)]:max-h-full [:where(&>*)]:max-w-full"
                  inert
                >
                  <Suspense fallback={null}>
                    <ComponentPreview slug={component.slug} />
                  </Suspense>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
