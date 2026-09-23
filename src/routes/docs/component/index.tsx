import { createFileRoute } from '@tanstack/react-router'

import { componentCatalog } from '#/components/docs/component-catalog'
import { ComponentDocsPage } from '#/components/docs/component-docs-page'

export const Route = createFileRoute('/docs/component/')({ component: ComponentsIndex })

function ComponentsIndex() {
  return <ComponentDocsPage component={componentCatalog[0]} />
}
