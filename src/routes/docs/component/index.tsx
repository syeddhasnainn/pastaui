import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/docs/component/')({
  beforeLoad: () => {
    throw redirect({ to: '/', statusCode: 301, replace: true })
  },
})
