import { ProgrammingIcon } from '@solar-icons/react/bold-duotone/programming'
import CheckIcon from '~icons/solar/check-circle-linear'
import CopyIcon from '~icons/solar/copy-linear'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'

const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const

type PackageManager = (typeof packageManagers)[number]

interface InstallationCardProps {
  command: string
}

function createCommands(command: string): Record<PackageManager, string> {
  const shadcnCommand = command.replace('pnpm dlx ', '')

  return {
    pnpm: command,
    npm: `npx ${shadcnCommand}`,
    yarn: `yarn dlx ${shadcnCommand}`,
    bun: `bunx --bun ${shadcnCommand}`,
  }
}

export function InstallationCard({ command }: InstallationCardProps) {
  const [copied, setCopied] = useState(false)
  const [packageManager, setPackageManager] = useState<PackageManager>('pnpm')
  const commands = createCommands(command)

  async function copyCommand() {
    await navigator.clipboard.writeText(commands[packageManager])
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <figure className="relative overflow-hidden rounded-md bg-muted">
      <Tabs
        className="gap-0"
        onValueChange={(value) => setPackageManager(value as PackageManager)}
        value={packageManager}
      >
        <div className="flex h-11 items-center gap-1.5 border-b border-border/50 px-3">
          <ProgrammingIcon aria-hidden="true" className="size-4 text-muted-foreground" />
          <TabsList className="h-6 gap-0.5 rounded-none bg-transparent p-0">
            {packageManagers.map((manager) => (
              <TabsTrigger
                className="h-6 rounded-md px-1.5 font-mono text-xs font-medium text-muted-foreground shadow-none data-active:bg-background/70 data-active:text-foreground data-active:shadow-none"
                key={manager}
                value={manager}
              >
                {manager}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {packageManagers.map((manager) => (
          <TabsContent className="m-0 overflow-x-auto px-4 py-3.5" key={manager} value={manager}>
            <pre>
              <code className="relative font-mono text-sm leading-none whitespace-nowrap">
                {commands[manager]}
              </code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>

      <Button
        aria-label="Copy command"
        className="absolute top-2 right-2 opacity-70 hover:opacity-100 focus-visible:opacity-100"
        onClick={copyCommand}
        size="icon-sm"
        variant="ghost"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </figure>
  )
}
