import { createFileRoute } from '@tanstack/react-router'

import { componentCatalog } from '#/components/docs/component-catalog'
import { ComponentDocsPage } from '#/components/docs/component-docs-page'
import { componentHead } from '#/lib/component-head'

export const Route = createFileRoute('/docs/component/')({
  head: () => componentHead(componentCatalog[0]),
  component: ComponentsIndex,
})

function ComponentsIndex() {
  return <ComponentDocsPage component={componentCatalog[0]} />
}
