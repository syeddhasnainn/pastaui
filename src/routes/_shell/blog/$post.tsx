import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { formatPostDate, getBlogPost } from '#/site/blog/posts'
import { primaryButtonClass, secondaryButtonClass } from '#/site/landing/variant-ui'
import { jsonLd, organization, seo, siteName, siteUrl } from '#/lib/seo'

export const Route = createFileRoute('/_shell/blog/$post')({
  loader: ({ params }) => {
    const post = getBlogPost(params.post)
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData: post }) => {
    if (!post) return {}
    const path = `/blog/${post.slug}`
    return {
      ...seo({
        title: `${post.title} — ${siteName}`,
        description: post.description,
        path,
        type: 'article',
      }),
      scripts: [
        jsonLd({
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          url: `${siteUrl}${path}`,
          author: organization,
          publisher: organization,
        }),
        ...(post.faq.length
          ? [
              jsonLd({
                '@type': 'FAQPage',
                mainEntity: post.faq.map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: { '@type': 'Answer', text: item.answer },
                })),
              }),
            ]
          : []),
      ],
    }
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const post = Route.useLoaderData()

  return (
    <article className="mx-auto w-full max-w-[680px] min-w-0 pb-16">
      <Link className="sidebar-text-sm text-muted-foreground hover:text-foreground" to="/blog">
        Blog
      </Link>
      <h1 className="mt-1 heading-text-md text-balance text-foreground">{post.title}</h1>
      <p className="mt-2 metadata-label">
        {post.updated ? `Updated ${formatPostDate(post.updated)}` : formatPostDate(post.date)} ·{' '}
        {post.readMinutes} min read
      </p>
      <div className="blog-prose mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
      <aside className="mt-12 rounded-md bg-card p-5 shadow-card">
        <h2 className="card-heading text-foreground">Build your AI interface with Pasta UI</h2>
        <p className="mt-1 text-xs leading-5 font-[450] text-muted-foreground">
          More than 50 free React components for chat and agent UIs, installed as source with the
          shadcn CLI. Pro adds landing page and app blocks for $149 a year or $199 once.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className={primaryButtonClass} to="/docs/installation">
            Install free components
          </Link>
          <a className={secondaryButtonClass} href="https://pro.pastaui.com">
            See Pasta UI Pro
          </a>
        </div>
      </aside>
    </article>
  )
}
