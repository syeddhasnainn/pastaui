export function createInstallCommand(name: string) {
  return `pnpm dlx shadcn@latest add https://pastaui.com/r/${name}.json`
}
