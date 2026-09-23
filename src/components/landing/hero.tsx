import ArrowRightIcon from '~icons/solar/arrow-right-linear'

import { cn } from '#/lib/utils'
import { buttonVariants } from '#/components/ui/button'

export function Hero() {
  return (
    <section id="top">
      <div className="flex min-h-[442px] flex-col justify-center px-4 py-20 sm:px-6 lg:px-12 lg:py-24">
        <h1 className="max-w-180 text-4xl leading-10 font-normal tracking-[-0.025em] text-balance sm:text-[42px] sm:leading-11">
          Components for building modern interfaces.
        </h1>
        <p className="mt-6 max-w-160 text-lg leading-[25px] text-muted-foreground">
          Beautiful, accessible components built with React and Tailwind CSS. Copy the source, shape
          the details, and ship interfaces that feel like yours.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-11 gap-2 rounded-full! bg-charcoal-black px-5 text-lg font-normal text-charcoal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.18)] hover:brightness-110 has-data-[icon=inline-end]:pr-4',
            )}
            href="https://pro.pastaui.com/"
            rel="noreferrer"
            target="_blank"
          >
            Explore Pro <ArrowRightIcon data-icon="inline-end" />
          </a>
          <a
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-11 gap-2 rounded-full! border-[0.5px]! border-border bg-muted px-5 text-lg font-normal text-foreground hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_6%)] has-data-[icon=inline-end]:pr-4 aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input',
            )}
            href="/docs/component"
          >
            Browse components
          </a>
        </div>
      </div>
    </section>
  )
}
