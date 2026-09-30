import { createFileRoute } from '@tanstack/react-router'

import { ComponentGrid } from '#/site/landing/component-grid'
import { jsonLd, organization, seo, siteDescription, siteName, siteUrl } from '#/lib/seo'

export const Route = createFileRoute('/_shell/')({
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
  component: ComponentGrid,
})
