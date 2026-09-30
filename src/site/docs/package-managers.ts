export const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const

export type PackageManager = (typeof packageManagers)[number]

export function createCommands(command: string): Record<PackageManager, string> {
  const shadcnCommand = command.replace('pnpm dlx ', '')

  return {
    pnpm: command,
    npm: `npx ${shadcnCommand}`,
    yarn: `yarn dlx ${shadcnCommand}`,
    bun: `bunx --bun ${shadcnCommand}`,
  }
}
