import { componentCatalog } from '#/components/docs/component-catalog'

export type SearchSection = 'Components' | 'Docs'

export interface SearchItem {
  id: string
  title: string
  subtitle: string
  section: SearchSection
  href: string
  keywords: string[]
  description: string
}

export interface SearchGroup {
  section: SearchSection
  items: SearchItem[]
}

const sections: SearchSection[] = ['Components', 'Docs']

function normalize(value: string) {
  return value.toLocaleLowerCase().replaceAll(/[-_]+/g, ' ')
}

function createSearchIndex() {
  const items: SearchItem[] = [
    {
      id: 'docs:installation',
      title: 'Installation',
      subtitle: 'Getting started',
      section: 'Docs',
      href: '/docs/installation',
      keywords: ['getting started', 'setup', 'shadcn', 'registry'],
      description: 'Install Pasta UI components with the shadcn CLI.',
    },
  ]

  for (const component of componentCatalog) {
    items.push({
      id: `component:${component.slug}`,
      title: component.name,
      subtitle: component.category ?? component.group,
      section: 'Components',
      href: `/docs/component/${component.slug}`,
      keywords: [component.name, component.slug, component.group, component.category ?? ''],
      description: component.description,
    })
  }

  return items.map((item) => ({
    item,
    haystack: normalize([item.title, ...item.keywords, item.description].join(' ')),
    title: normalize(item.title),
  }))
}

const index = createSearchIndex()

export function searchDocs(query: string): SearchGroup[] {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean)
  const matches = index
    .filter((entry) => terms.every((term) => entry.haystack.includes(term)))
    .map((entry) => ({
      item: entry.item,
      rank: terms.length && terms.every((term) => entry.title.includes(term)) ? 0 : 1,
    }))
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => entry.item)

  return sections
    .map((section) => ({ section, items: matches.filter((item) => item.section === section) }))
    .filter((group) => group.items.length > 0)
}
