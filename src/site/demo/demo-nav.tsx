import { Link } from '@tanstack/react-router'

import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import GithubIcon from '~icons/simple-icons/github'

import { githubUrl } from '#/lib/seo'
import { cn } from '#/lib/utils'

export function DemoNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Primary" className={cn('flex items-center justify-between', className)}>
      <Link
        className="paragraph-text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        to="/docs/installation"
      >
        Installation
      </Link>
      <div className="flex items-center gap-4">
        <a
          aria-label="GitHub"
          className="text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
          href={githubUrl}
          rel="noreferrer"
          target="_blank"
        >
          <GithubIcon aria-hidden="true" />
        </a>
        <a
          className="flex h-8 items-center gap-1 rounded-full bg-foreground px-3.5 text-[13px] font-semibold text-background transition-opacity hover:opacity-85"
          href="https://pro.pastaui.com/"
          rel="noreferrer"
          target="_blank"
        >
          Get Pro
          <ArrowUpRightIcon className="size-4" />
        </a>
      </div>
    </nav>
  )
}
