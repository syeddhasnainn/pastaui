import { createFileRoute, notFound } from '@tanstack/react-router'

import { getComponentDocument } from '#/components/docs/component-catalog'
import { ComponentPage } from '#/site/landing/component-page'
import { componentHead } from '#/lib/component-head'

export const Route = createFileRoute('/_shell/docs/component/$slug')({
  component: ComponentRoute,
  validateSearch: (search: Record<string, unknown>): { view?: 'code' } =>
    search.view === 'code' ? { view: 'code' } : {},
  loader: ({ params }) => {
    const component = getComponentDocument(params.slug)

    if (!component) {
      throw notFound()
    }

    return component
  },
  head: ({ loaderData }) => (loaderData ? componentHead(loaderData) : {}),
})

function ComponentRoute() {
  const component = Route.useLoaderData()

  return <ComponentPage component={component} key={component.slug} />
}
