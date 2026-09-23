import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/components/$slug')({
  beforeLoad: ({ params, location }) => {
    throw redirect({
      to: '/docs/component/$slug',
      params: { slug: params.slug },
      search: location.search,
      hash: location.hash,
      statusCode: 301,
      replace: true,
    })
  },
})
