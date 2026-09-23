import type { ReactNode } from 'react'
import type { ComponentDocument } from '#/components/docs/component-catalog'
import { ComponentSidebar, MobileComponentNav } from '#/components/docs/component-sidebar'
import { ProCta } from '#/components/docs/pro-cta'
import { LandingHeader } from '#/components/landing/header'

export function DocsLayout({
  children,
  component,
}: {
  children: ReactNode
  component?: ComponentDocument
}) {
  return (
    <main className="docs-page h-dvh overflow-hidden" id="main-content">
      <div
        className="h-full scroll-pt-36 [scrollbar-width:thin] overflow-y-auto overscroll-contain lg:scroll-pt-26"
        id="docs-content"
      >
        <div className="sticky top-0 z-30">
          <LandingHeader />
        </div>
        <div className="pl-4 sm:pl-6 lg:pt-8 lg:pl-12">
          <div className="sticky top-18 z-20 bg-background pt-4 pb-4 lg:hidden">
            <MobileComponentNav activeComponent={component} />
          </div>
          <div className="grid grid-cols-1 gap-12 pr-4 sm:pr-6 lg:grid-cols-[220px_minmax(0,720px)_230px] lg:items-start lg:justify-center lg:gap-10 lg:pr-12 xl:grid-cols-[250px_minmax(0,760px)_260px] xl:gap-14">
            <ComponentSidebar activeComponent={component} />

            {children}

            <ProCta />
          </div>
        </div>
      </div>
    </main>
  )
}
