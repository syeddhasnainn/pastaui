import { Link, createFileRoute } from '@tanstack/react-router'

import { createInstallCommand } from '#/components/docs/catalog/create-install-command'
import { InstallPanel } from '#/site/landing/variant-code'
import { seo, siteName } from '#/lib/seo'

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

const steps = [
  {
    title: 'Set up your project',
    body: (
      <>
        <p>
          Start with a React project using Tailwind CSS. If you have not configured shadcn yet,
          initialize it in your project directory.
        </p>
        <InstallPanel command="pnpm dlx shadcn@latest init" size="large" />
      </>
    ),
  },
  {
    title: 'Add a component',
    body: (
      <>
        <p>
          Copy the installation command from a component page. For example, add the Plan Approval
          Card:
        </p>
        <InstallPanel command={createInstallCommand('plan-approval-card')} size="large" />
      </>
    ),
  },
  {
    title: 'Make it yours',
    body: (
      <p>
        Import the installed component and follow its usage example. Edit the source in your project
        to match your product. <Link to="/">Browse components</Link>.
      </p>
    ),
  },
]

function InstallationPage() {
  return (
    <article className="mx-auto w-full max-w-[680px] min-w-0 pb-16">
      <h1 className="text-[32px] leading-[1.15] font-[600] tracking-[-0.025em] text-balance text-foreground">
        Installation
      </h1>
      <div className="blog-prose mt-10 [&>section:first-child>h2]:mt-0">
        {steps.map((step, index) => (
          <section key={step.title}>
            <h2>
              {index + 1}. {step.title}
            </h2>
            <div className="mt-2 flex flex-col gap-4">{step.body}</div>
          </section>
        ))}
      </div>
    </article>
  )
}
