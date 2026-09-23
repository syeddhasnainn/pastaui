import ArrowRightIcon from '~icons/solar/arrow-right-linear'
import GitForkIcon from '~icons/solar/git-fork-linear'
import TerminalIcon from '~icons/solar/file-terminal-linear'
import { buttonVariants } from '#/components/ui/button'
import { githubUrl } from '#/lib/seo'
import { cn } from '#/lib/utils'

export function OpenSourceSection() {
  return (
    <section id="open-source" className="border-y bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
            <GitForkIcon className="size-4" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
            Open source. No black box.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
            Install only what you need. The component source lands in your app, ready to read, edit,
            and ship under the MIT license.
          </p>
          <a
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'mt-7')}
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub <ArrowRightIcon data-icon="inline-end" />
          </a>
        </div>
        <div id="install" className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="flex items-center gap-2 border-b px-4 py-3 text-sm font-medium">
            <TerminalIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            Install a component
          </div>
          <pre className="overflow-x-auto p-5 text-sm leading-7">
            <code>
              <span className="text-muted-foreground">$</span> pnpm dlx shadcn@latest add{` \\\n`}{' '}
              https://pastaui.dev/r/button.json
            </code>
          </pre>
          <div className="border-t bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            The source is copied into your components directory.
          </div>
        </div>
      </div>
    </section>
  )
}
