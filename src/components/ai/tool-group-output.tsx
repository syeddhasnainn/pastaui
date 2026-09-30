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

interface ToolGroupOutputProps extends React.ComponentProps<'figure'> {
  code: string
  language?: string
}

function ToolGroupOutput({ className, code, language = 'json', ...props }: ToolGroupOutputProps) {
  const [copied, setCopied] = useState(false)
  const syntaxLanguage = language === 'shell' ? 'bash' : language

  async function copyOutput() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <figure
      className={cn('relative z-10 overflow-hidden rounded-[16px] bg-card shadow-card', className)}
      {...props}
    >
      <figcaption className="flex h-10 items-center px-4 text-xs leading-5 font-[450] text-muted-foreground uppercase">
        {language}
        <Button
          aria-label={copied ? 'Copied output' : 'Copy output'}
          className="ml-auto"
          onClick={copyOutput}
          size="icon-sm"
          title={copied ? 'Copied' : 'Copy'}
          type="button"
          variant="ghost"
        >
          {copied ? (
            <CheckIcon className="size-4 [&_*]:[stroke-width:1.5]" />
          ) : (
            <CopyIcon className="size-4 [&_*]:[stroke-width:1.5]" />
          )}
        </Button>
      </figcaption>
      <Highlight code={code.trim()} language={syntaxLanguage} theme={codeTheme}>
        {({ getLineProps, getTokenProps, style, tokens }) => (
          <pre className="overflow-x-auto px-4 pt-1 pb-4 font-mono text-xs leading-6" style={style}>
            <code>
              {tokens.map((line, lineIndex) => (
                <span {...getLineProps({ line })} className="block min-w-max" key={lineIndex}>
                  {line.map((token, tokenIndex) => (
                    <span {...getTokenProps({ token })} key={tokenIndex} />
                  ))}
                </span>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </figure>
  )
}

export { ToolGroupOutput }
export type { ToolGroupOutputProps }
