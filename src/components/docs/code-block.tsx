import CheckIcon from '~icons/solar/check-circle-linear'
import CopyIcon from '~icons/solar/copy-linear'
import { Highlight } from 'prism-react-renderer'
import type { PrismTheme } from 'prism-react-renderer'
import { useState } from 'react'

import { Button } from '#/components/ui/button'

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

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const syntaxLanguage = language === 'shell' ? 'bash' : language

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="relative overflow-hidden rounded-md bg-muted text-foreground">
      <Button
        aria-label="Copy code"
        className="absolute top-3 right-3"
        onClick={copyCode}
        size="icon-sm"
        variant="ghost"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <Highlight code={code} language={syntaxLanguage} theme={codeTheme}>
        {({ getLineProps, getTokenProps, style, tokens }) => (
          <pre
            className="overflow-x-auto px-4 py-5 pr-14 font-mono text-[13px] leading-6"
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
    </div>
  )
}
