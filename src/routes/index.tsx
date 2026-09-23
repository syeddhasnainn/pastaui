import { createFileRoute } from '@tanstack/react-router'

import { ComponentShowcase } from '#/components/landing/component-showcase'
import { LandingFooter } from '#/components/landing/footer'
import { LandingHeader } from '#/components/landing/header'
import { Hero } from '#/components/landing/hero'

export const Route = createFileRoute('/')({ component: Home })

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
