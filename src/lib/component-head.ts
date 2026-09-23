import type { ComponentDocument } from '#/components/docs/component-catalog'
import { jsonLd, organization, seo, siteName, siteUrl } from '#/lib/seo'

export function componentHead(component: ComponentDocument) {
  const path = `/docs/component/${component.slug}`
  const title = `${component.name} — ${siteName}`

  return {
    ...seo({ title, description: component.description, path, type: 'article' }),
    scripts: [
      jsonLd({
        '@type': 'TechArticle',
        headline: component.name,
        description: component.description,
        url: `${siteUrl}${path}`,
        image: `${siteUrl}/og.png`,
        author: organization,
        publisher: organization,
      }),
      jsonLd({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Components', item: `${siteUrl}/docs/component` },
          { '@type': 'ListItem', position: 2, name: component.name, item: `${siteUrl}${path}` },
        ],
      }),
    ],
  }
}
