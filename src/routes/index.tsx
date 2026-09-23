import { createFileRoute } from '@tanstack/react-router'

import { ComponentShowcase } from '#/components/landing/component-showcase'
import { LandingFooter } from '#/components/landing/footer'
import { LandingHeader } from '#/components/landing/header'
import { Hero } from '#/components/landing/hero'
import { jsonLd, organization, seo, siteDescription, siteName, siteUrl } from '#/lib/seo'

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
  component: Home,
})

function Home() {
  return (
    <main className="overflow-hidden" id="main-content">
      <LandingHeader />
      <Hero />
      <ComponentShowcase />
      <LandingFooter />
    </main>
  )
}
