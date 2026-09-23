import GithubIcon from '~icons/simple-icons/github'
import ArrowUpRightIcon from '~icons/solar/arrow-right-up-linear'
import { BrandMark } from '#/components/brand-mark'
import { ComponentSearch } from '#/components/docs/component-search'
import { ThemeToggle } from '#/components/theme-toggle'
import { buttonVariants } from '#/components/ui/button'
import { githubUrl } from '#/lib/seo'
import { cn } from '#/lib/utils'

const navigation = [
  { label: 'Docs', href: '/docs/installation' },
  { label: 'Components', href: '/docs/component' },
]

export function LandingHeader() {
  return (
    <header className="shrink-0 bg-background">
      <div className="flex h-18 items-center justify-between gap-6 px-4 sm:px-6 lg:px-12">
        <div className="flex min-w-0 items-center gap-8">
          <a
            aria-label="PastaUI home"
            className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/"
          >
            <BrandMark />
          </a>
          <nav
            className="flex items-center gap-4 overflow-hidden text-sm leading-[22px] font-[450] tracking-normal"
            aria-label="Main navigation"
          >
            {navigation.map((item, index) => (
              <a
                className={cn(
                  'shrink-0 text-foreground/85 transition-colors hover:text-foreground',
                  index === 0 && 'hidden sm:inline',
                  index > 1 && 'hidden lg:inline',
                )}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ComponentSearch />
          <a
            aria-label="Pasta UI on GitHub"
            className={buttonVariants({ variant: 'ghost', size: 'icon-lg' })}
            href={githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            <GithubIcon />
          </a>
          <ThemeToggle />
          <a
            className={cn(
              buttonVariants({ size: 'default' }),
              'h-9 gap-2 rounded-full border-0 bg-charcoal-black px-4 tracking-[-0.05px] text-charcoal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] shadow-none hover:brightness-110 has-data-[icon=inline-end]:pr-4',
            )}
            href="https://pro.pastaui.com/"
            rel="noreferrer"
            target="_blank"
          >
            Get Pro
            <ArrowUpRightIcon className="size-4" data-icon="inline-end" />
          </a>
        </div>
      </div>
    </header>
  )
}
