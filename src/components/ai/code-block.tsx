import { CheckCircleIcon as CheckIcon } from '@solar-icons/react/linear/check-circle'
import { CopyIcon } from '@solar-icons/react/linear/copy'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import * as React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'

const codeTheme: PrismTheme = {
  plain: {
    backgroundColor: 'transparent',
    color: 'var(--foreground)',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--syntax-comment)', fontStyle: 'italic' },
    },
    {
      types: ['keyword', 'atrule'],
      style: { color: 'var(--syntax-keyword)' },
    },
    {
      types: ['string', 'char', 'attr-value', 'inserted'],
      style: { color: 'var(--syntax-string)' },
    },
    {
      types: ['function', 'class-name'],
      style: { color: 'var(--syntax-function)' },
    },
    {
      types: ['number', 'boolean', 'constant'],
      style: { color: 'var(--syntax-number)' },
    },
    {
      types: ['tag', 'property', 'attr-name', 'selector', 'symbol', 'deleted'],
      style: { color: 'var(--syntax-property)' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: 'var(--syntax-punctuation)' },
    },
  ],
}

interface CodeBlockProps extends React.ComponentProps<'figure'> {
  code: string
  filename?: string
  highlightLines?: number[]
  language?: string
  showLineNumbers?: boolean
}

function CodeBlock({
  className,
  code,
  filename,
  highlightLines = [],
  language = 'text',
  showLineNumbers = true,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const highlightedLines = new Set(highlightLines)
  const syntaxLanguage = language === 'shell' ? 'bash' : language

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <figure
      data-slot="agent-code-block"
      className={cn(
        'overflow-hidden rounded-[16px] bg-card font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
        className,
      )}
      {...props}
    >
      <figcaption className="flex h-10 items-center gap-2 px-3 metadata-label">
        {(/\.tsx?$/i.test(filename ?? '') || ['ts', 'tsx', 'typescript'].includes(language)) && (
          <TypeScriptIcon aria-hidden="true" className="size-4 shrink-0 text-[#3178c6]" />
        )}
        <span className="min-w-0 truncate text-[13px]">{filename ?? language}</span>
        <Button
          aria-label="Copy code"
          className="ml-auto"
          onClick={copyCode}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <span className="grid *:col-start-1 *:row-start-1 *:transition-[opacity,scale] *:duration-150 *:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:*:transition-opacity">
            <CopyIcon className={cn(copied && 'scale-75 opacity-0')} />
            <CheckIcon className={cn(!copied && 'scale-75 opacity-0')} />
          </span>
        </Button>
      </figcaption>
      <Highlight code={code.trim()} language={syntaxLanguage} theme={codeTheme}>
        {({ getLineProps, getTokenProps, style, tokens }) => (
          <pre className="overflow-x-auto pb-4 font-mono text-[13px] leading-6" style={style}>
            <code>
              {tokens.map((line, lineIndex) => {
                const lineNumber = lineIndex + 1

                return (
                  <span
                    {...getLineProps({ line })}
                    className={cn(
                      'block min-w-max px-4',
                      highlightedLines.has(lineNumber) && 'bg-foreground/[0.045]',
                    )}
                    key={lineIndex}
                  >
                    {showLineNumbers && (
                      <span
                        aria-hidden="true"
                        className="mr-5 inline-block w-4 text-right text-muted-foreground/55 select-none"
                      >
                        {lineNumber}
                      </span>
                    )}
                    {line.map((token, tokenIndex) => (
                      <span {...getTokenProps({ token })} key={tokenIndex} />
                    ))}
                  </span>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </figure>
  )
}

export { CodeBlock }
export type { CodeBlockProps }

function TypeScriptIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="currentColor" height="1em" viewBox="0 0 24 24" width="1em" {...props}>
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75q.918 0 1.627.111a6.4 6.4 0 0 1 1.306.34v2.458a4 4 0 0 0-.643-.361a5 5 0 0 0-.717-.26a5.5 5.5 0 0 0-1.426-.2q-.45 0-.819.086a2.1 2.1 0 0 0-.623.242q-.254.156-.393.374a.9.9 0 0 0-.14.49q0 .294.156.529q.156.234.443.444c.287.21.423.276.696.41q.41.203.926.416q.705.296 1.266.628q.561.333.963.753q.402.418.614.957q.213.538.214 1.253q0 .986-.373 1.656a3 3 0 0 1-1.012 1.085a4.4 4.4 0 0 1-1.487.596q-.85.18-1.79.18a10 10 0 0 1-1.84-.164a5.5 5.5 0 0 1-1.512-.493v-2.63a5.03 5.03 0 0 0 3.237 1.2q.5 0 .872-.09q.373-.09.623-.25q.249-.162.373-.38a1.02 1.02 0 0 0-.074-1.089a2.1 2.1 0 0 0-.537-.5a5.6 5.6 0 0 0-.807-.444a28 28 0 0 0-1.007-.436q-1.377-.575-2.053-1.405t-.676-2.005q0-.92.369-1.582q.368-.662 1.004-1.089a4.5 4.5 0 0 1 1.47-.629a7.5 7.5 0 0 1 1.77-.201m-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
    </svg>
  )
}
