import { createFileRoute } from '@tanstack/react-router'

import { OceanLanding } from '#/site/ocean/ocean-landing'
import { seo } from '#/lib/seo'

export const Route = createFileRoute('/ocean')({
  head: () =>
    seo({
      title: 'Fathom — Go deeper than the noise',
      description:
        'An underwater landing page that descends from sea level to the ocean floor as you scroll.',
      path: '/ocean',
    }),
  component: OceanLanding,
})
