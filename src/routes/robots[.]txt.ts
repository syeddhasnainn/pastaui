import { createFileRoute } from '@tanstack/react-router'

import { siteUrl } from '#/lib/seo'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`,
          { headers: { 'Content-Type': 'text/plain' } },
        ),
    },
  },
})
