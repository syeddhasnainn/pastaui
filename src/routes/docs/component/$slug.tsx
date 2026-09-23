import { createFileRoute, notFound } from '@tanstack/react-router'

import { getComponentDocument } from '#/components/docs/component-catalog'
import { ComponentDocsPage } from '#/components/docs/component-docs-page'

export const Route = createFileRoute('/docs/component/$slug')({
  component: ComponentRoute,
  loader: ({ params }) => {
    const component = getComponentDocument(params.slug)

    if (!component) {
      throw notFound()
    }

    return component
  },
})

function ComponentRoute() {
  const component = Route.useLoaderData()

  return <ComponentDocsPage component={component} />
}
