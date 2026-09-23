import AccessibilityIcon from '~icons/solar/accessibility-linear'
import BlocksIcon from '~icons/solar/blocks-linear'
import CodeXmlIcon from '~icons/solar/code-linear'
import Layers3Icon from '~icons/solar/layers-linear'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'

const principles = [
  {
    icon: CodeXmlIcon,
    title: 'You own the source',
    description:
      'Components live in your project, so nothing stands between you and the code you ship.',
  },
  {
    icon: AccessibilityIcon,
    title: 'Accessible by default',
    description:
      'Thoughtful semantics, keyboard behavior, focus states, and screen reader support are built in.',
  },
  {
    icon: Layers3Icon,
    title: 'Designed to compose',
    description:
      'Small, predictable primitives that work together without forcing a rigid design system.',
  },
]

export function ComponentCollection() {
  return (
    <section id="components" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="max-w-2xl">
        <Badge variant="secondary">The library</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
          Familiar pieces, finished properly.
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Start with the components every product needs. Keep the clean defaults or take them
          somewhere completely different.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Every action, clearly expressed.</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-36 flex-wrap content-center items-center gap-2 rounded-lg bg-muted/60 py-5">
            <Button>Continue</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="ghost">Learn more</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Compact context that reads instantly.</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-36 flex-wrap content-center items-center gap-2 rounded-lg bg-muted/60 py-5">
            <Badge>Ready</Badge>
            <Badge variant="secondary">Draft</Badge>
            <Badge variant="outline">Archived</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Command menu</CardTitle>
            <CardDescription>Fast navigation for serious products.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-36 rounded-lg bg-muted/60 py-5">
            <div className="rounded-lg border bg-background p-2 shadow-sm">
              {['Create project', 'Invite members', 'Open settings'].map((item, index) => (
                <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm" key={item}>
                  <BlocksIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  {item}
                  {index === 0 && <kbd className="ml-auto text-xs text-muted-foreground">↵</kbd>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div id="principles" className="mt-24 grid gap-10 border-t pt-16 md:grid-cols-3">
        {principles.map(({ icon: Icon, title, description }) => (
          <div className="flex flex-col gap-3" key={title}>
            <div className="flex size-9 items-center justify-center rounded-lg border bg-muted">
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
