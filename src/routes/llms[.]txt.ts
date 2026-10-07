import { createFileRoute } from '@tanstack/react-router'

import { componentCatalog, componentGroups } from '#/components/docs/component-catalog'
import { createInstallCommand } from '#/components/docs/catalog/create-install-command'
import { blogPosts } from '#/site/blog/posts'
import { githubUrl, siteDescription, siteName, siteUrl } from '#/lib/seo'

const content = `# ${siteName}

> ${siteDescription}

${siteName} is a free, MIT-licensed library of React components built on shadcn/ui, Base UI, and Tailwind CSS. Components are distributed through a shadcn registry and installed as source code into your project.

## Getting started
- Installation: ${siteUrl}/docs/installation
- Install any component: \`${createInstallCommand('<name>')}\`
- Registry index: ${siteUrl}/r/registry.json

${componentGroups
  .map(
    (group) => `## ${group}
${componentCatalog
  .filter((component) => component.group === group)
  .map(
    (component) =>
      `- [${component.name}](${siteUrl}/docs/component/${component.slug}): ${component.description}`,
  )
  .join('\n')}`,
  )
  .join('\n\n')}

## Guides
${blogPosts.map((post) => `- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.description}`).join('\n')}

## Key facts
- React 19, TypeScript, Tailwind CSS v4
- Compatible with the shadcn CLI and the base-nova style
- Source code is copied into your project, so every component is fully editable

## Links
- Website: ${siteUrl}
- GitHub: ${githubUrl}
- Pasta UI Pro: https://pro.pastaui.com
`

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }),
    },
  },
})
