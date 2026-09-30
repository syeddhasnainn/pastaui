import { Link, createFileRoute } from '@tanstack/react-router'

import { createInstallCommand } from '#/components/docs/catalog/create-install-command'
import { InstallPanel } from '#/site/landing/variant-code'
import { headingClass } from '#/site/landing/variant-ui'
import { seo, siteName } from '#/lib/seo'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_shell/docs/installation')({
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

function StepHeading({ children, number }: { children: string; number: number }) {
  return (
    <h2 className={cn('mb-1.5 flex items-center gap-2.5', headingClass)}>
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[12px] font-[550] text-muted-foreground tabular-nums">
        {number}
      </span>
      {children}
    </h2>
  )
}

function InstallationPage() {
  return (
    <article className="max-w-3xl min-w-0 pb-16">
      <p className="sidebar-text-sm text-muted-foreground">Getting started</p>
      <h1 className="mt-1 heading-text-sm text-foreground">Installation</h1>
      <p className="mt-2 max-w-xl paragraph-text-sm text-muted-foreground">
        Add Pasta UI components directly to your React project. The source is yours to customize.
      </p>
      <section className="mt-9">
        <StepHeading number={1}>Set up your project</StepHeading>
        <p className="mb-4 paragraph-text-sm text-muted-foreground">
          Start with a React project using Tailwind CSS. If you have not configured shadcn yet,
          initialize it in your project directory.
        </p>
        <InstallPanel command="pnpm dlx shadcn@latest init" />
      </section>
      <section className="mt-9">
        <StepHeading number={2}>Add a component</StepHeading>
        <p className="mb-4 paragraph-text-sm text-muted-foreground">
          Copy the installation command from a component page. For example, add the Plan Approval
          Card:
        </p>
        <InstallPanel command={createInstallCommand('plan-approval-card')} />
      </section>
      <section className="mt-9">
        <StepHeading number={3}>Make it yours</StepHeading>
        <p className="pl-[34px] paragraph-text-sm text-muted-foreground">
          Import the installed component and follow its usage example. Edit the source in your
          project to match your product.
        </p>
        <Link
          className="mt-3 inline-flex sidebar-text-md text-foreground underline underline-offset-4"
          to="/"
        >
          Browse components
        </Link>
      </section>
    </article>
  )
}
