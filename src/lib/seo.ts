export const siteUrl = 'https://pastaui.com'
export const siteName = 'Pasta UI'
export const siteDescription =
  'Open-source React components with polished defaults and source code you can make your own.'
export const githubUrl = 'https://github.com/syeddhasnainn/pastaui'

interface SeoOptions {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
}

export function seo({ title, description, path, type = 'website' }: SeoOptions) {
  const url = `${siteUrl}${path}`

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

export function jsonLd(data: Record<string, unknown>) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify({ '@context': 'https://schema.org', ...data }),
  }
}

export const organization = {
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/pastaui-logo.svg`,
  sameAs: [githubUrl],
}
