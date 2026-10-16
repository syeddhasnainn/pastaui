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
    <div className="mx-auto w-full max-w-[760px] min-w-0 pb-16">
      <h1 className="text-[32px] leading-[1.15] font-[600] tracking-[-0.025em] text-balance text-foreground">
        Blog
      </h1>
      <ul className="mt-6 flex flex-col">
        {blogPosts.map((post) => (
          <li className="border-b-[0.5px] border-border last:border-b-0" key={post.slug}>
            <Link
              className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              params={{ post: post.slug }}
              to="/blog/$post"
            >
              <h2 className="min-w-0 text-[18px] leading-[1.4] font-[500] tracking-[-0.01em] text-foreground transition-colors group-hover:text-foreground/70">
                {post.title}
              </h2>
              <p className="shrink-0 text-[14px] whitespace-nowrap text-muted-foreground tabular-nums">
                <time dateTime={post.updated ?? post.date}>
                  {formatPostDate(post.updated ?? post.date)}
                </time>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
