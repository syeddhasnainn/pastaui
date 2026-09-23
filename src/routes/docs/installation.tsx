import { Link, createFileRoute } from '@tanstack/react-router'

import { DocsLayout } from '#/components/docs/docs-layout'
import { InstallationCard } from '#/components/docs/installation-card'
import { createInstallCommand } from '#/components/docs/catalog/create-install-command'
import { seo, siteName } from '#/lib/seo'

export const Route = createFileRoute('/docs/installation')({
  head: () =>
    seo({
      title: `Installation — ${siteName}`,
      description:
        'Add Pasta UI components to your React project with the shadcn CLI. The source is yours to customize.',
      path: '/docs/installation',
      type: 'article',
    }),
  component: InstallationPage,
})

function InstallationPage() {
  return (
    <DocsLayout>
      <article className="min-w-0 pb-16">
        <p className="text-sm text-muted-foreground">Getting started</p>
        <h1 className="mt-3 text-[28px] leading-[1.1] font-normal tracking-[-0.025em]">
          Installation
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Add Pasta UI components directly to your React project. The source is yours to customize.
        </p>
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-medium">1. Set up your project</h2>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Start with a React project using Tailwind CSS. If you have not configured shadcn yet,
            initialize it in your project directory.
          </p>
          <InstallationCard command="pnpm dlx shadcn@latest init" />
        </section>
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-medium">2. Add a component</h2>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Copy the installation command from a component page. For example, add the Plan Approval
            Card:
          </p>
          <InstallationCard command={createInstallCommand('plan-approval-card')} />
        </section>
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-medium">3. Make it yours</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Import the installed component and follow its usage example. Edit the source in your
            project to match your product.
          </p>
          <Link
            className="mt-4 inline-flex text-sm underline underline-offset-4"
            to="/docs/component"
          >
            Browse components
          </Link>
        </section>
      </article>
    </DocsLayout>
  )
}
