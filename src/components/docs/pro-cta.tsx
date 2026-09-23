import ArrowUpRightIcon from '~icons/solar/arrow-right-up-linear'
import CheckIcon from '~icons/solar/check-circle-linear'

import { ShaderGlow } from '#/components/docs/shader-glow'
import { buttonVariants } from '#/components/ui/button'

export function ProCta() {
  return (
    <aside className="hidden self-start lg:sticky lg:top-26 lg:block lg:h-[calc(100dvh-6.5rem)]">
      <div className="relative isolate overflow-hidden rounded-md bg-charcoal-black p-5 text-charcoal-foreground shadow-sm [--charcoal-bottom:#101010]">
        <ShaderGlow className="absolute inset-0 -z-10" />
        <p className="text-xs font-medium text-charcoal-foreground/75 uppercase">Pasta UI Pro</p>
        <h2 className="mt-3 text-xl leading-6 font-medium">Premium UI components.</h2>
        <p className="mt-3 text-sm leading-5 text-charcoal-foreground/80">
          Production-ready blocks and advanced components built in the same visual system.
        </p>
        <ul className="mt-5 flex flex-col gap-2.5 text-sm">
          {[
            'Advanced components',
            'Application blocks',
            'Full landing pages',
            'Lifetime updates',
          ].map((feature) => (
            <li className="flex items-center gap-2" key={feature}>
              <CheckIcon className="size-4 text-charcoal-foreground/80" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <a
          className={buttonVariants({
            className:
              'mt-6 w-full rounded-full! bg-charcoal-foreground! text-(color:--charcoal-bottom)! hover:bg-charcoal-foreground/90!',
            size: 'lg',
            variant: 'default',
          })}
          href="/pro"
        >
          Explore Pro <ArrowUpRightIcon data-icon="inline-end" />
        </a>
      </div>
    </aside>
  )
}
