import { Marked, Renderer } from 'marked'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  readMinutes: number
  html: string
  headings: { id: string; title: string }[]
  faq: { question: string; answer: string }[]
}

const files = import.meta.glob<string>('/src/content/blog/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const stripMarkdown = (value: string) =>
  value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim()

const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      if (depth !== 2 && depth !== 3) return `<h${depth}>${text}</h${depth}>\n`
      return `<h${depth} id="${slugify(text)}">${text}</h${depth}>\n`
    },
    link({ href, tokens }) {
      const text = this.parser.parseInline(tokens)
      const external = href.startsWith('http') && !href.startsWith('https://pastaui.com')
      return external
        ? `<a href="${href}" rel="noreferrer" target="_blank">${text}</a>`
        : `<a href="${href}">${text}</a>`
    },
    table(token): string {
      return `<div class="blog-table">${Renderer.prototype.table.call(this, token)}</div>`
    },
  },
})

function parse(slug: string, raw: string): BlogPost {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`Missing frontmatter in ${slug}.md`)
  const meta = Object.fromEntries(
    match[1].split('\n').map((line) => {
      const index = line.indexOf(':')
      const value = line.slice(index + 1).trim()
      const quoted = /^(['"]).*\1$/.test(value)
      return [
        line.slice(0, index).trim(),
        quoted ? value.slice(1, -1).replaceAll(`${value[0]}${value[0]}`, value[0]) : value,
      ]
    }),
  )
  const body = match[2].replace(/<!--[\s\S]*?-->/g, '').trim()
  const faqBlock = body.split(/^## Frequently asked questions\s*$/m)[1] ?? ''
  const faq = [...faqBlock.matchAll(/^### (.+)\n+([\s\S]*?)(?=^### |^## |(?![\s\S]))/gm)].map(
    ([, question, answer]) => ({
      question: stripMarkdown(question),
      answer: stripMarkdown(answer),
    }),
  )

  return {
    slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    updated: meta.updated || undefined,
    readMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 230)),
    html: marked.parse(body, { async: false }),
    headings: [...body.matchAll(/^## (.+)$/gm)].map(([, title]) => ({
      id: slugify(marked.parseInline(title, { async: false })),
      title: stripMarkdown(title),
    })),
    faq,
  }
}

export const blogPosts = Object.entries(files)
  .map(([path, raw]) => parse(path.split('/').pop()!.replace(/\.md$/, ''), raw))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))

export const getBlogPost = (slug: string) => blogPosts.find((post) => post.slug === slug)

export const formatPostDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  })
