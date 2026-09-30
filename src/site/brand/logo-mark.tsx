import { cn } from '#/lib/utils'

type LogoMarkVariant = 'default' | 'on-blue' | 'tile'

const cells = [
  [0, 0, 'lit'],
  [1, 0, 'lit'],
  [2, 0, 'unlit'],
  [0, 1, 'lit'],
  [1, 1, 'lit'],
  [2, 1, 'unlit'],
  [0, 2, 'foot'],
  [1, 2, 'unlit'],
  [2, 2, 'unlit'],
] as const

const defaultFill = { lit: '#2B7FFF', foot: '#1A5FD6', unlit: '#8EC5FF' }

function Cells({ onBlue }: { onBlue: boolean }) {
  return cells.map(([col, row, kind]) => (
    <rect
      className={!onBlue && kind === 'unlit' ? 'opacity-55 dark:opacity-45' : undefined}
      fill={onBlue ? '#FFFFFF' : defaultFill[kind]}
      height="14"
      key={`${col}-${row}`}
      opacity={onBlue && kind === 'unlit' ? 0.28 : undefined}
      rx="5"
      width="14"
      x={9 + col * 16}
      y={9 + row * 16}
    />
  ))
}

export function LogoMark({
  size = 22,
  variant = 'default',
  label,
  className,
}: {
  size?: number
  variant?: LogoMarkVariant
  label?: string
  className?: string
}) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }

  return (
    <svg
      {...a11y}
      className={cn('shrink-0', className)}
      fill="none"
      height={size}
      viewBox="0 0 64 64"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === 'tile' ? (
        <>
          <rect fill="#2B7FFF" height="64" rx="14" width="64" />
          <g transform="translate(6.4 6.4) scale(0.8)">
            <Cells onBlue />
          </g>
        </>
      ) : (
        <Cells onBlue={variant === 'on-blue'} />
      )}
    </svg>
  )
}
