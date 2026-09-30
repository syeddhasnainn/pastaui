import { Outlet, createFileRoute, useParams } from '@tanstack/react-router'

import { LandingShell } from '#/site/landing/landing-shell'

export const Route = createFileRoute('/_shell')({
  component: ShellLayout,
})

function ShellLayout() {
  const { slug } = useParams({ strict: false })

  return (
    <LandingShell activeSlug={slug ?? ''}>
      <Outlet />
    </LandingShell>
  )
}
