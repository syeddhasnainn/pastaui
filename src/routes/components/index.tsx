import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/components/')({
  beforeLoad: () => {
    throw redirect({ to: '/docs/component', statusCode: 301, replace: true })
  },
})
