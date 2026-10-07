import { Link, createFileRoute } from '@tanstack/react-router'

import { blogPosts, formatPostDate } from '#/site/blog/posts'
import { seo, siteName } from '#/lib/seo'

export const Route = createFileRoute('/_shell/blog/')({
  head: () =>
    seo({
      title: `Blog — ${siteName}`,
      description:
        'Guides and comparisons for building React interfaces with shadcn/ui, Tailwind CSS and AI components.',
      path: '/blog',
    }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  return (
    <div className="mx-auto w-full max-w-[960px] min-w-0 pb-16">
      <p className="sidebar-text-sm text-muted-foreground">Blog</p>
      <h1 className="mt-1 heading-text-sm text-foreground">Guides and comparisons</h1>
      <p className="mt-2 max-w-xl paragraph-text-sm text-muted-foreground">
        How to pick and build React UI for AI products, landing pages and dashboards.
      </p>
      <ul className="mt-9 grid gap-3 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <li className="flex" key={post.slug}>
            <Link
              className="flex w-full flex-col rounded-md bg-card p-4 shadow-card transition-colors hover:bg-muted/60"
              params={{ post: post.slug }}
              to="/blog/$post"
            >
              <h2 className="card-heading text-foreground">{post.title}</h2>
              <p className="mt-1 text-xs leading-5 font-[450] text-muted-foreground">
                {post.description}
              </p>
              <p className="mt-auto pt-2 metadata-label">
                {formatPostDate(post.updated ?? post.date)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
