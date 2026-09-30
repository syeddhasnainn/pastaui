export function createInstallCommand(name: string) {
  return `pnpm dlx shadcn@latest add @pastaui/${name}`
}
