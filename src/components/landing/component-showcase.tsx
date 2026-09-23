import ArrowRightIcon from '~icons/solar/arrow-right-linear'
import BellIcon from '~icons/solar/bell-linear'
import CheckIcon from '~icons/solar/check-circle-linear'
import CommandIcon from '~icons/solar/command-linear'
import CreditCardIcon from '~icons/solar/card-2-linear'
import SearchIcon from '~icons/solar/magnifier-linear'
import SparklesIcon from '~icons/solar/stars-minimalistic-linear'
import UserPlusIcon from '~icons/solar/user-plus-linear'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { cn } from '#/lib/utils'

const components = [
  {
    title: 'Activity feed',
    description: 'Compact product updates with clear hierarchy, status, and context.',
    preview: <ActivityFeedPreview />,
  },
  {
    title: 'Command menu',
    description: 'A focused command surface for navigation and common actions.',
    preview: <CommandMenuPreview />,
  },
  {
    title: 'Plan card',
    description: 'A polished upgrade card with useful detail and a direct next step.',
    preview: <PlanCardPreview />,
  },
]

export function ComponentShowcase() {
  return (
    <section id="components" className="px-4 py-20 sm:px-6 lg:px-12 lg:py-24">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Components</p>
          <h2 className="mt-3 text-3xl leading-tight font-normal tracking-[-0.025em] sm:text-4xl">
            Designed for real interfaces.
          </h2>
        </div>
        <a
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="/docs/component"
        >
          Browse components <ArrowRightIcon className="size-4" aria-hidden="true" />
        </a>
      </div>

      <div className="mt-10 grid gap-x-5 gap-y-10 lg:grid-cols-3">
        {components.map((component) => (
          <article className="flex flex-col gap-4" key={component.title}>
            <div className="flex min-h-72 items-center justify-center rounded-2xl border bg-muted/40 p-6">
              {component.preview}
            </div>
            <div>
              <h3 className="text-base font-medium">{component.title}</h3>
              <p className="mt-1 max-w-sm text-sm leading-5 text-muted-foreground">
                {component.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ActivityFeedPreview() {
  return (
    <Card size="sm" className="w-full max-w-74 shadow-sm">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Today</CardDescription>
        <CardAction>
          <Badge variant="secondary">3 new</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {[
          { initials: 'AM', label: 'Alex published a new block', time: '2m' },
          { initials: 'SK', label: 'Sara updated Button', time: '18m' },
          { initials: 'JL', label: 'Jon joined the workspace', time: '1h' },
        ].map((item) => (
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted" key={item.label}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
              {item.initials}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs">{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BellIcon className="size-3.5" aria-hidden="true" /> Live updates
        </span>
        <CheckIcon className="size-3.5" aria-hidden="true" />
      </CardFooter>
    </Card>
  )
}

function CommandMenuPreview() {
  const actions = [
    { icon: SparklesIcon, label: 'Create component', shortcut: 'C' },
    { icon: UserPlusIcon, label: 'Invite teammate', shortcut: 'I' },
    { icon: CreditCardIcon, label: 'Manage billing', shortcut: 'B' },
  ]

  return (
    <Card size="sm" className="w-full max-w-74 shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SearchIcon className="size-4" aria-hidden="true" />
          <span className="text-sm">Search actions…</span>
          <kbd className="ml-auto text-xs">⌘ K</kbd>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pt-1">
        <p className="px-2 py-1 text-[11px] tracking-wide text-muted-foreground uppercase">
          Suggestions
        </p>
        {actions.map(({ icon: Icon, label, shortcut }, index) => (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-2.5 py-2',
              index === 0 && 'bg-muted',
            )}
            key={label}
          >
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1 text-sm">{label}</span>
            <kbd className="text-xs text-muted-foreground">{shortcut}</kbd>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CommandIcon className="size-3.5" aria-hidden="true" /> Command menu
        </span>
        <span>3 actions</span>
      </CardFooter>
    </Card>
  )
}

function PlanCardPreview() {
  return (
    <Card size="sm" className="w-full max-w-74 shadow-sm">
      <CardHeader>
        <CardTitle>Pro library</CardTitle>
        <CardDescription>Unlimited access to every component.</CardDescription>
        <CardAction>
          <Badge>Popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-medium tracking-tight">$49</span>
          <span className="pb-1 text-xs text-muted-foreground">one time</span>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
          {['All current components', 'Lifetime updates', 'Commercial license'].map((feature) => (
            <span className="flex items-center gap-2" key={feature}>
              <CheckIcon className="size-3.5 text-foreground" aria-hidden="true" />
              {feature}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="sm">
          Explore Pro <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
