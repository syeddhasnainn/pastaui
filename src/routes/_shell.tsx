import { Outlet, createFileRoute, useParams } from '@tanstack/react-router'

import { getComponentDocument } from '#/components/docs/component-catalog'
import { LandingShell } from '#/site/landing/landing-shell'

export const Route = createFileRoute('/_shell')({
  component: ShellLayout,
})

function ShellLayout() {
  const { slug } = useParams({ strict: false })
  const component = slug ? getComponentDocument(slug) : undefined

  return (
    <LandingShell
      activeSlug={slug ?? ''}
      heading={component && { title: component.name, description: component.description }}
    >
      <Outlet />
    </LandingShell>
  )
}
