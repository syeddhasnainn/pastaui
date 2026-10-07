import { createFileRoute } from '@tanstack/react-router'

import { componentCatalog } from '#/components/docs/component-catalog'
import { marketingPages } from '#/site/landing/marketing-pages'
import { blogPosts } from '#/site/blog/posts'
import { siteUrl } from '#/lib/seo'

const paths = [
  '/',
  '/docs/installation',
  ...componentCatalog.map((component) => `/docs/component/${component.slug}`),
  '/blog',
  ...blogPosts.map((post) => `/blog/${post.slug}`),
  '/privacy',
  ...Object.keys(marketingPages).map((page) => `/${page}`),
]

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n')}
</urlset>`,
          { headers: { 'Content-Type': 'application/xml' } },
        ),
    },
  },
})
