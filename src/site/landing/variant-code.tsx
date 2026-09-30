import { Tabs } from '@base-ui/react/tabs'
import { Highlight } from 'prism-react-renderer'
import { useEffect, useState } from 'react'
import CheckIcon from '~icons/solar/check-circle-linear'
import CopyIcon from '~icons/solar/copy-linear'

import { createCommands, packageManagers, type PackageManager } from '#/site/docs/package-managers'
import { mutedCodeTheme } from '#/site/landing/code-theme-muted'
import { focusRing } from '#/site/landing/focus-ring'
import { iconButtonClass } from '#/site/landing/variant-ui'
import { cn } from '#/lib/utils'

const collapsedLines = 18

const slidingPillClass =
  'absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) bg-(--code-surface) shadow-[0_0_0_0.5px_var(--code-control-border)] transition-[left,width] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none'

const pillTabClass = cn(
  'relative z-10 flex cursor-pointer items-center text-[13px] leading-5 font-medium whitespace-nowrap text-muted-foreground transition-[color] hover:text-(--code-ink) data-active:text-(--code-ink)',
  focusRing,
)

const trayCopyClass =
  'text-muted-foreground transition-[color,background-color] hover:bg-(--code-hover) hover:text-(--code-ink)'

export const trayClass = 'min-w-0 rounded-[16px] bg-(--code-tray) px-1.5 pb-1.5'

export const trayHeaderClass = 'flex h-10 items-center justify-between gap-2 pr-0.5 pl-1'

export const trayLabelClass = 'px-1.5 sidebar-text-sm text-muted-foreground'

export const innerCardClass =
  'min-w-0 overflow-hidden rounded-[10px] border-[0.5px] border-(--code-border) bg-(--code-surface)'

interface CopyButtonProps {
  className?: string
  label: string
  text: string
}

function CopyButton({ className, label, text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1400)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <button
      aria-label={copied ? 'Copied' : label}
      className={cn(iconButtonClass, className, focusRing)}
      onClick={copy}
      title={label}
      type="button"
    >
      {copied ? (
        <CheckIcon aria-hidden className="size-4" />
      ) : (
        <CopyIcon aria-hidden className="size-4" />
      )}
    </button>
  )
}

function CodeLines({ code, language }: { code: string; language: string }) {
  return (
    <Highlight code={code} language={language} theme={mutedCodeTheme}>
      {({ getLineProps, getTokenProps, style, tokens }) => (
        <pre
          className="overflow-x-auto overscroll-x-contain px-4 py-4 font-mono text-[13px] leading-[22px]"
          style={style}
        >
          <code>
            {tokens.map((line, lineIndex) => (
              <span {...getLineProps({ line })} key={lineIndex}>
                {line.map((token, tokenIndex) => (
                  <span {...getTokenProps({ token })} key={tokenIndex} />
                ))}
                {'\n'}
              </span>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  )
}

function CollapsibleCode({ code, language = 'tsx' }: { code: string; language?: string }) {
  const [expanded, setExpanded] = useState(false)
  const long = code.split('\n').length > collapsedLines

  return (
    <div className="relative">
      <div className={cn(long && !expanded && 'max-h-[420px] overflow-hidden')}>
        <CodeLines code={code} language={language} />
      </div>
      {long && (
        <div
          className={cn(
            'flex justify-center pb-4',
            !expanded &&
              'absolute inset-x-0 bottom-0 items-end bg-linear-to-t from-(--code-surface) from-35% to-transparent pt-24',
          )}
        >
          <button
            aria-expanded={expanded}
            className={cn(
              'h-8 cursor-pointer rounded-full bg-(--code-surface) px-3.5 text-[13px] font-medium text-(--code-ink) shadow-[0_0_0_0.5px_var(--code-control-border)] transition-[background-color] hover:bg-(--code-hover)',
              focusRing,
            )}
            onClick={() => setExpanded((current) => !current)}
            type="button"
          >
            {expanded ? 'Show less' : 'Show full code'}
          </button>
        </div>
      )}
    </div>
  )
}

export function InstallPanel({ command }: { command: string }) {
  const [manager, setManager] = useState<PackageManager>('pnpm')
  const commands = createCommands(command)

  return (
    <Tabs.Root
      className={trayClass}
      onValueChange={(value) => setManager(value as PackageManager)}
      value={manager}
    >
      <div className={trayHeaderClass}>
        <Tabs.List
          activateOnFocus
          aria-label="Package manager"
          className="relative flex min-w-0 items-center gap-0.5 overflow-x-auto p-0.5"
        >
          <Tabs.Indicator className={cn(slidingPillClass, 'rounded-md')} />
          {packageManagers.map((item) => (
            <Tabs.Tab className={cn(pillTabClass, 'h-6 rounded-md px-2')} key={item} value={item}>
              {item}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <CopyButton
          className={trayCopyClass}
          label="Copy install command"
          text={commands[manager]}
        />
      </div>
      <div className={innerCardClass}>
        {packageManagers.map((item) => (
          <Tabs.Panel
            className={cn('overflow-x-auto overscroll-x-contain px-4 py-3.5', focusRing)}
            key={item}
            keepMounted
            value={item}
          >
            <code className="font-mono text-[13px] leading-[22px] whitespace-nowrap text-(--code-ink)">
              {commands[item]}
            </code>
          </Tabs.Panel>
        ))}
      </div>
    </Tabs.Root>
  )
}

export function CodePanel({
  label,
  code,
  language = 'tsx',
}: {
  label: string
  code: string
  language?: string
}) {
  return (
    <div className={trayClass}>
      <div className={trayHeaderClass}>
        <span className={trayLabelClass}>{label}</span>
        <CopyButton className={trayCopyClass} label={`Copy ${label}`} text={code} />
      </div>
      <div className={innerCardClass}>
        <CollapsibleCode code={code} language={language} />
      </div>
    </div>
  )
}

export function UsageCode({ usage }: { usage: string }) {
  return <CodePanel code={usage} label="Usage" />
}

export interface SourceFile {
  name: string
  code: string
}

export function SourceFiles({ files }: { files: SourceFile[] }) {
  const [active, setActive] = useState<string>()
  const current = files.find((file) => file.name === active) ?? files[0]

  return (
    <Tabs.Root
      className={trayClass}
      onValueChange={(value) => setActive(String(value))}
      value={current.name}
    >
      <div className={trayHeaderClass}>
        <Tabs.List
          activateOnFocus
          aria-label="Source files"
          className="relative flex min-w-0 items-center gap-0.5 overflow-x-auto p-0.5"
        >
          <Tabs.Indicator className={cn(slidingPillClass, 'rounded-md')} />
          {files.map((file) => (
            <Tabs.Tab
              className={cn(pillTabClass, 'h-6 rounded-md px-2 font-mono text-[12px]')}
              key={file.name}
              value={file.name}
            >
              {file.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <CopyButton className={trayCopyClass} label={`Copy ${current.name}`} text={current.code} />
      </div>
      <div className={innerCardClass}>
        {files.map((file) => (
          <Tabs.Panel className={focusRing} key={file.name} value={file.name}>
            <CollapsibleCode
              code={file.code}
              language={file.name.endsWith('.css') ? 'css' : 'tsx'}
            />
          </Tabs.Panel>
        ))}
      </div>
    </Tabs.Root>
  )
}
