import { Link } from '@tanstack/react-router'

import { ArrowRightUpIcon as ArrowUpRightIcon } from '@solar-icons/react/linear/arrow-right-up'
import GithubIcon from '~icons/simple-icons/github'

import { LogoMark } from '#/site/brand/logo-mark'
import { githubUrl } from '#/lib/seo'
import { cn } from '#/lib/utils'

const pillLinkClass =
  'flex h-7 items-center rounded-full px-3 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-foreground/10 data-[status=active]:text-foreground'

const roundButtonClass =
  'flex h-9 items-center justify-center rounded-full bg-foreground/7 text-foreground transition-colors hover:bg-foreground/10'

export function DemoNav({ className }: { className?: string }) {
  return (
    <header className={cn('relative z-10 flex items-center gap-3', className)}>
      <Link aria-label="Pasta UI home" className="shrink-0" to="/">
        <LogoMark size={36} />
      </Link>
      <nav
        aria-label="Primary"
        className="flex h-9 items-center gap-0.5 rounded-full bg-foreground/7 p-1"
      >
        <Link className={pillLinkClass} to="/docs/installation">
          Installation
        </Link>
        <Link className={pillLinkClass} to="/docs/component">
          Components
        </Link>
        <Link className={pillLinkClass} to="/blog">
          Blog
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <a
          aria-label="GitHub"
          className={cn(roundButtonClass, 'w-9 text-muted-foreground hover:text-foreground')}
          href={githubUrl}
          rel="noreferrer"
          target="_blank"
        >
          <GithubIcon aria-hidden="true" className="size-4" />
        </a>
        <a
          className={cn(roundButtonClass, 'gap-1 px-4 text-[14px] font-semibold')}
          href="https://pro.pastaui.com/"
          rel="noreferrer"
          target="_blank"
        >
          Get Pro
          <ArrowUpRightIcon aria-hidden="true" className="size-4" />
        </a>
      </div>
    </header>
  )
}
