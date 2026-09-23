import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { LandingFooter } from '#/components/landing/footer'
import { LandingHeader } from '#/components/landing/header'
import { buttonVariants } from '#/components/ui/button'
import { marketingPages } from '#/components/landing/marketing-pages'
import { seo, siteName } from '#/lib/seo'

export const Route = createFileRoute('/$page')({
  component: MarketingPage,
  loader: ({ params }) => {
    const page = marketingPages[params.page]
    if (!page) throw notFound()
    return page
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo({
          title: `${loaderData.eyebrow} — ${siteName}`,
          description: loaderData.description,
          path: `/${params.page}`,
        })
      : {},
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
