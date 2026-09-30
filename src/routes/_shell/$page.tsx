import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { buttonVariants } from '#/components/ui/button'
import { marketingPages } from '#/site/landing/marketing-pages'
import { seo, siteName } from '#/lib/seo'

export const Route = createFileRoute('/_shell/$page')({
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
    <section className="flex min-h-[60dvh] items-center pb-16">
      <div className="max-w-3xl">
        <p className="text-[13px] font-medium text-muted-foreground">{page.eyebrow}</p>
        <h1 className="mt-4 max-w-2xl heading-text-md text-balance sm:heading-text-lg">
          {page.title}
        </h1>
        <p className="mt-5 max-w-xl paragraph-text-md text-pretty text-muted-foreground sm:paragraph-text-lg">
          {page.description}
        </p>
        {externalAction ? (
          <a
            className={buttonVariants({ className: 'mt-7 rounded-full', size: 'lg' })}
            href={page.actionHref}
            rel="noreferrer"
            target="_blank"
          >
            {page.actionLabel}
          </a>
        ) : (
          <Link
            className={buttonVariants({ className: 'mt-7 rounded-full', size: 'lg' })}
            to={page.actionHref}
          >
            {page.actionLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
