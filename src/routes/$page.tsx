import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { LandingFooter } from '#/components/landing/footer'
import { LandingHeader } from '#/components/landing/header'
import { buttonVariants } from '#/components/ui/button'

interface MarketingPageContent {
  actionHref: string
  actionLabel: string
  description: string
  eyebrow: string
  title: string
}

const marketingPages: Record<string, MarketingPageContent> = {
  blocks: {
    actionHref: '/docs/component',
    actionLabel: 'Explore components',
    description:
      'Production-ready application sections composed from Pasta UI components are currently in development.',
    eyebrow: 'Blocks',
    title: 'Complete interface sections are coming.',
  },
  charts: {
    actionHref: '/docs/component',
    actionLabel: 'Explore components',
    description:
      'Chart primitives and complete analytical views are being refined for a future release.',
    eyebrow: 'Charts',
    title: 'Clear data without visual noise.',
  },
  templates: {
    actionHref: '/docs/component',
    actionLabel: 'Browse components',
    description:
      'Full product templates built with the same component system are currently in development.',
    eyebrow: 'Templates',
    title: 'A stronger starting point is coming.',
  },
  pro: {
    actionHref: '/docs/component',
    actionLabel: 'Explore the free library',
    description:
      'Advanced components, application blocks, and full landing pages are currently being prepared for launch.',
    eyebrow: 'Pasta UI Pro',
    title: 'Premium interface building blocks.',
  },
  changelog: {
    actionHref: '/docs/component',
    actionLabel: 'Browse components',
    description: 'Release notes will appear here as the public component library evolves.',
    eyebrow: 'Changelog',
    title: 'Follow what changes.',
  },
  about: {
    actionHref: '/docs/component',
    actionLabel: 'Explore the library',
    description:
      'Pasta UI is an open-source collection of polished React components designed to be copied, adapted, and owned.',
    eyebrow: 'About',
    title: 'Components made for real products.',
  },
  license: {
    actionHref: 'https://github.com/pastaui/pastaui',
    actionLabel: 'View on GitHub',
    description:
      'The public Pasta UI component library is open source under the MIT License. Pro assets will include separate commercial terms.',
    eyebrow: 'License',
    title: 'Clear terms for every component.',
  },
  contact: {
    actionHref: 'https://github.com/pastaui/pastaui',
    actionLabel: 'Open GitHub',
    description:
      'Use the GitHub repository for component requests, bug reports, and project discussions.',
    eyebrow: 'Contact',
    title: 'Start a conversation.',
  },
  privacy: {
    actionHref: '/',
    actionLabel: 'Back to home',
    description:
      'The privacy policy is being prepared ahead of the public launch. Pasta UI does not currently collect account or payment information.',
    eyebrow: 'Privacy',
    title: 'Privacy information.',
  },
  terms: {
    actionHref: '/',
    actionLabel: 'Back to home',
    description:
      'The terms of service are being prepared ahead of the public launch. The open-source library remains governed by its repository license.',
    eyebrow: 'Terms',
    title: 'Terms of service.',
  },
}

export const Route = createFileRoute('/$page')({
  component: MarketingPage,
  loader: ({ params }) => {
    const page = marketingPages[params.page]
    if (!page) throw notFound()
    return page
  },
})

function MarketingPage() {
  const page = Route.useLoaderData()
  const externalAction = page.actionHref.startsWith('https://')

  return (
    <main className="flex min-h-dvh flex-col overflow-hidden" id="main-content">
      <LandingHeader />
      <section className="flex min-h-[34rem] flex-1 items-center px-4 py-20 sm:px-6 lg:px-12 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {page.eyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight font-normal tracking-[-0.03em] text-balance sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
            {page.description}
          </p>
          {externalAction ? (
            <a
              className={buttonVariants({ className: 'mt-7', size: 'lg' })}
              href={page.actionHref}
              rel="noreferrer"
              target="_blank"
            >
              {page.actionLabel}
            </a>
          ) : (
            <Link
              className={buttonVariants({ className: 'mt-7', size: 'lg' })}
              to={page.actionHref}
            >
              {page.actionLabel}
            </Link>
          )}
        </div>
      </section>
      <LandingFooter />
    </main>
  )
}
