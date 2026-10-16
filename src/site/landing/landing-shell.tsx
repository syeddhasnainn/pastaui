import { type ReactNode } from 'react'

import { SearchProvider } from '#/site/docs/component-search'
import { ComponentPager } from '#/site/landing/component-view-toggle'
import { SiteHeader } from '#/site/landing/site-header'
interface LandingShellProps {
  activeSlug: string
  children: ReactNode
  heading?: { title: string; description: string }
}

export function LandingShell({ activeSlug, children, heading }: LandingShellProps) {
  const content = (
    <div className="relative mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:mx-0 lg:max-w-none lg:px-16">
      <div className="pt-6 lg:pt-12">{children}</div>
    </div>
  )

  return (
    <SearchProvider>
      <div className="isolate flex min-h-dvh flex-col bg-background text-foreground">
        <SiteHeader />
        {heading && <h1 className="sr-only">{heading.title}</h1>}
        <main className="min-w-0 flex-1 bg-background" id="main-content">
          {content}
        </main>
        {heading && (
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center">
            <ComponentPager
              className="pointer-events-auto rounded-full bg-background/80 p-1 shadow-[0_8px_24px_rgb(0_0_0/0.25)] ring-[0.5px] ring-border backdrop-blur-md"
              slug={activeSlug}
            />
          </div>
        )}
      </div>
    </SearchProvider>
  )
}
