import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

import { buttonVariants } from '#/components/ui/button'
import { AnalyticsProvider } from '#/site/analytics-provider'
import { getThemeScript, ThemeProvider, themeStorageKey } from '#/site/theme-provider'
import { siteDescription, siteName, siteUrl } from '#/lib/seo'

import appCss from '../styles.css?url'

const DesignInspector = import.meta.env.DEV
  ? lazy(() =>
      import('#/site/dev/design-inspector').then((module) => ({ default: module.DesignInspector })),
    )
  : null

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: `${siteName} — Open-source React components` },
      { name: 'description', content: siteDescription },
      { property: 'og:site_name', content: siteName },
      { property: 'og:image', content: `${siteUrl}/og.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${siteName} — Copy, paste, and ship.` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: `${siteUrl}/og.png` },
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/pastaui-logo.svg',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [{ children: getThemeScript(themeStorageKey, 'dark') }],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function NotFoundPage() {
  return (
    <main className="isolate min-h-dvh bg-background" id="main-content">
      <section className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 pb-18 text-center">
        <p className="text-[13px] font-medium text-muted-foreground">Error 404</p>
        <h1 className="mt-3 heading-text-md sm:heading-text-lg">Page not found</h1>
        <p className="mt-3 paragraph-text-md text-muted-foreground">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link className={buttonVariants({ className: 'mt-6 rounded-full', size: 'lg' })} to="/">
          Back to home
        </Link>
      </section>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <AnalyticsProvider>
          <ThemeProvider defaultTheme="dark" storageKey={themeStorageKey}>
            <a
              className="sr-only fixed top-3 left-3 z-10001 rounded-lg bg-background px-3 py-2 text-[15px] font-medium shadow-lg ring-1 ring-foreground/10 focus:not-sr-only"
              href="#main-content"
            >
              Skip to content
            </a>
            {children}
            {DesignInspector ? (
              <Suspense fallback={null}>
                <DesignInspector />
              </Suspense>
            ) : null}
          </ThemeProvider>
        </AnalyticsProvider>
        <Scripts />
      </body>
    </html>
  )
}
