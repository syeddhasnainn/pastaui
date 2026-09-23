import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

import { LandingHeader } from '#/components/landing/header'
import { ThemeProvider } from '#/components/theme-provider'
import { buttonVariants } from '#/components/ui/button'

import appCss from '../styles.css?url'

const PageEditor = import.meta.env.DEV
  ? lazy(() =>
      import('#/components/editor/page-editor').then((module) => ({ default: module.PageEditor })),
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
      {
        title: 'Pasta UI — Open-source React components',
      },
      {
        name: 'description',
        content:
          'Accessible, composable React components with polished defaults and source code you can make your own.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'Pasta UI',
      },
      {
        property: 'og:title',
        content: 'Pasta UI — Open-source React components',
      },
      {
        property: 'og:description',
        content: 'Accessible, composable React components with polished defaults and source code you can make your own.',
      },
      {
        property: 'og:url',
        content: 'https://pastaui.com',
      },
      {
        property: 'og:image',
        content: 'https://pastaui.com/og.png',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'Pasta UI — Open-source React components',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Pasta UI — Open-source React components',
      },
      {
        name: 'twitter:description',
        content: 'Accessible, composable React components with polished defaults and source code you can make your own.',
      },
      {
        name: 'twitter:image',
        content: 'https://pastaui.com/og.png',
      },
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
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function NotFoundPage() {
  return (
    <main className="min-h-dvh bg-background" id="main-content">
      <LandingHeader />
      <section className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-lg flex-col items-center justify-center px-6 pb-18 text-center">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-normal tracking-[-0.03em]">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link className={buttonVariants({ className: 'mt-6', size: 'lg' })} to="/">
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
        <ThemeProvider defaultTheme="system" storageKey="pastaui-theme">
          <a
            className="sr-only fixed top-3 left-3 z-10001 rounded-lg bg-background px-3 py-2 text-sm font-medium shadow-lg ring-1 ring-foreground/10 focus:not-sr-only"
            href="#main-content"
          >
            Skip to content
          </a>
          {children}
          {PageEditor && (
            <Suspense fallback={null}>
              <PageEditor />
            </Suspense>
          )}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
