import { createFileRoute, notFound } from '@tanstack/react-router'

import { getComponentDocument } from '#/components/docs/component-catalog'
import { ComponentPage, loadComponentFiles } from '#/site/landing/component-page'
import { componentHead } from '#/lib/component-head'

export const Route = createFileRoute('/_shell/docs/component/$slug')({
  component: ComponentRoute,
  validateSearch: (search: Record<string, unknown>): { view?: 'code' } =>
    search.view === 'code' ? { view: 'code' } : {},
  loader: async ({ params }) => {
    const component = getComponentDocument(params.slug)

    if (!component) {
      throw notFound()
    }

    return { component, files: await loadComponentFiles(component.slug) }
  },
  head: ({ loaderData }) => (loaderData ? componentHead(loaderData.component) : {}),
})

function ComponentRoute() {
  const { component, files } = Route.useLoaderData()

  return <ComponentPage component={component} files={files} key={component.slug} />
}
