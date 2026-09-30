import type { PrismTheme } from 'prism-react-renderer'

export const mutedCodeTheme: PrismTheme = {
  plain: {
    backgroundColor: 'transparent',
    color: 'var(--code-ink)',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--code-comment)', fontStyle: 'italic' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: 'var(--code-punctuation)' },
    },
    {
      types: ['keyword', 'atrule', 'module', 'control-flow'],
      style: { color: 'var(--code-keyword)' },
    },
    {
      types: ['string', 'char', 'attr-value', 'template-string', 'inserted'],
      style: { color: 'var(--code-string)' },
    },
    {
      types: ['number', 'boolean', 'constant'],
      style: { color: 'var(--code-number)' },
    },
    {
      types: ['tag', 'class-name', 'function', 'maybe-class-name', 'selector'],
      style: { color: 'var(--code-component)' },
    },
    {
      types: ['attr-name', 'property', 'property-access', 'symbol', 'deleted'],
      style: { color: 'var(--code-prop)' },
    },
  ],
}
