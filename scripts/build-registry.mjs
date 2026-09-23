import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const baseUrl = (process.env.REGISTRY_URL ?? 'https://pastaui.com').replace(/\/$/, '')
const aiDir = join(root, 'src/components/ai')
const catalogDir = join(root, 'src/components/docs/catalog/ai-agents')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const css = JSON.parse(readFileSync(join(root, 'registry/css.json'), 'utf8'))
const versions = { ...pkg.devDependencies, ...pkg.dependencies }
const builtIn = new Set(['react', 'react-dom'])
const itemUrl = (name) => `${baseUrl}/r/${name}.json`

function readString(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*\\n?\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`, 's'))
  return match?.[2].replace(/\\'/g, "'")
}

function catalogItems() {
  const items = []
  for (const file of readdirSync(catalogDir)) {
    const source = readFileSync(join(catalogDir, file), 'utf8')
    for (const block of source.split('createAiDocument({').slice(1)) {
      const slug = readString(block, 'slug')
      if (!slug) continue
      const usage = block.match(/usage:\s*`((?:\\`|[^`])*)`/)?.[1] ?? ''
      const usageImports = [
        ...usage.matchAll(/from\s+["']@\/components\/ai\/([a-z0-9-]+)["']/g),
      ].map((match) => match[1])
      items.push({
        slug,
        name: readString(block, 'name'),
        description: readString(block, 'description'),
        usageImports,
      })
    }
  }
  return items
}

function packageName(specifier) {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

function imports(file) {
  return [...readFileSync(file, 'utf8').matchAll(/from\s+'([^']+)'/g)].map((match) => match[1])
}

const catalog = catalogItems()
const itemNames = new Set(catalog.map((item) => item.slug))
const cssItems = css.items

function collect(slug, usageImports = []) {
  const files = new Set()
  const dependencies = new Set()
  const registryDependencies = new Set()
  let usesBaseStyles = false
  const queue = [join(aiDir, `${slug}.tsx`)]
  for (const name of usageImports) {
    if (name === slug) continue
    if (itemNames.has(name)) registryDependencies.add(itemUrl(name))
    else queue.push(['.tsx', '.ts'].map((ext) => join(aiDir, name + ext)).find(existsSync))
  }

  while (queue.length) {
    const file = queue.shift()
    if (files.has(file)) continue
    files.add(file)
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const source = readFileSync(file, 'utf8')
      if (css.base.classes.some((name) => new RegExp(`\\b${name}\\b`).test(source)))
        usesBaseStyles = true
    }
    if (file.endsWith('.css')) continue

    for (const specifier of imports(file)) {
      if (specifier.startsWith('@/components/ui/')) {
        registryDependencies.add(basename(specifier))
      } else if (specifier.startsWith('@/components/ai/')) {
        const name = basename(specifier)
        if (itemNames.has(name) && name !== slug) registryDependencies.add(itemUrl(name))
        else queue.push(['.tsx', '.ts'].map((ext) => join(aiDir, name + ext)).find(existsSync))
      } else if (specifier.startsWith('./')) {
        queue.push(join(dirname(file), specifier))
      } else if (!specifier.startsWith('@/')) {
        const name = packageName(specifier)
        if (!builtIn.has(name))
          dependencies.add(versions[name] ? `${name}@${versions[name]}` : name)
      }
    }
  }

  if (usesBaseStyles) registryDependencies.add(itemUrl(css.base.name))
  return { files: [...files], dependencies, registryDependencies }
}

const items = [
  {
    name: css.base.name,
    type: 'registry:item',
    title: 'Pasta UI Styles',
    description: css.base.description,
    cssVars: css.base.cssVars,
    css: css.base.css,
  },
]

for (const { slug, name, description, usageImports } of catalog.sort((a, b) =>
  a.slug.localeCompare(b.slug),
)) {
  const { files, dependencies, registryDependencies } = collect(slug, usageImports)
  items.push({
    name: slug,
    type: 'registry:component',
    title: name,
    description,
    dependencies: [...dependencies].sort((a, b) => a.localeCompare(b)),
    registryDependencies: [...registryDependencies].sort((a, b) => a.localeCompare(b)),
    files: files.map((file) => ({
      path: file.replace(`${root}`, ''),
      type: 'registry:component',
      target: `@components/ai/${basename(file)}`,
    })),
    ...cssItems[slug],
  })
}

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'pastaui',
  homepage: baseUrl,
  items,
}

writeFileSync(join(root, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`)
console.log(`registry.json: ${items.length} items (base URL ${baseUrl})`)
