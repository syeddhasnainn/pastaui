import { useId, type CSSProperties } from 'react'

import { cn } from '#/lib/utils'
import { seeded } from '#/site/ocean/sea-life'

const arms = [
  {
    body: 'M121 143 C95 147 91 181 67 186 C40 192 22 168 32 153 C38 144 50 149 46 156 C43 160 39 156 40 153 C28 164 46 184 65 175 C83 167 86 136 111 130 Z',
    edge: 'M111 144 C90 154 93 184 66 184 C43 188 25 168 34 155',
  },
  {
    body: 'M132 158 C106 167 103 210 78 228 C53 246 31 229 35 211 C39 198 51 201 50 209 C47 216 40 208 43 207 C32 228 57 237 74 219 C92 199 89 163 118 143 Z',
    edge: 'M121 158 C102 176 104 210 78 228 C55 242 33 229 39 211',
  },
  {
    body: 'M142 164 C122 197 132 220 117 246 C105 267 76 267 73 249 C71 235 85 232 88 240 C90 246 81 250 80 243 C77 258 100 261 109 241 C119 219 105 189 124 158 Z',
    edge: 'M132 172 C118 197 132 221 116 246 C103 267 76 262 78 245',
  },
  {
    body: 'M151 169 C149 205 157 237 143 268 C132 293 105 307 94 291 C85 278 99 266 106 273 C111 281 101 287 100 279 C93 293 112 300 130 272 C146 246 130 211 135 170 Z',
    edge: 'M142 178 C137 211 153 242 138 272 C126 297 103 304 97 286',
  },
]

const freckles = (() => {
  const rand = seeded(61)
  return Array.from({ length: 32 }, () => ({
    x: 109 + rand() * 77,
    y: 58 + rand() * 96,
    radius: 0.6 + rand() * 1.8,
    opacity: 0.12 + rand() * 0.16,
  }))
})()

const palettes = {
  red: { light: '#ffd0ac', mid: '#e36c5e', shade: '#8b2b45', dark: '#321729', rim: '#ffab8c' },
  dumbo: { light: '#e4ffff', mid: '#9ea9ec', shade: '#6450a2', dark: '#242344', rim: '#8affed' },
}

export function Octopus({
  className,
  variant = 'red',
  delay = 0,
}: {
  className?: string
  variant?: keyof typeof palettes
  delay?: number
}) {
  const id = useId()
  const color = palettes[variant]
  const dumbo = variant === 'dumbo'
  const paint = (name: string) => `url(#${id}-${name})`
  const mantle =
    'M106 151 C102 134 94 116 98 87 C101 56 120 34 147 33 C180 31 201 58 202 88 C204 118 186 138 186 155 C169 175 127 175 106 151 Z'

  return (
    <div
      aria-hidden
      className={cn('ocean-octopus pointer-events-none absolute select-none', className)}
      data-creature={`${variant}-octopus`}
      style={{ '--delay': `${delay}s` } as CSSProperties}
    >
      <svg
        className="block h-auto w-full overflow-visible"
        height="340"
        viewBox="0 0 300 340"
        width="300"
      >
        <defs>
          <radialGradient cx="32%" cy="25%" id={`${id}-mantle`} r="78%">
            <stop offset="0" stopColor={color.light} />
            <stop offset="0.3" stopColor={color.mid} />
            <stop offset="0.66" stopColor={color.shade} />
            <stop offset="1" stopColor={color.dark} />
          </radialGradient>
          <linearGradient id={`${id}-arm`} x1="0" x2="1" y1="0" y2="0.65">
            <stop offset="0" stopColor={color.dark} />
            <stop offset="0.3" stopColor={color.shade} />
            <stop offset="0.52" stopColor={color.mid} />
            <stop offset="0.7" stopColor={color.rim} />
            <stop offset="1" stopColor={color.shade} />
          </linearGradient>
          <radialGradient cx="35%" cy="26%" id={`${id}-eye`} r="70%">
            <stop offset="0" stopColor="#fff4d5" />
            <stop offset="0.45" stopColor={dumbo ? '#80e5ec' : '#dcb27b'} />
            <stop offset="1" stopColor={color.dark} />
          </radialGradient>
          <radialGradient id={`${id}-gloss`}>
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-aura`}>
            <stop offset="0" stopColor={color.rim} stopOpacity="0.15" />
            <stop offset="1" stopColor={color.rim} stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}-skin`}>
            <path d={mantle} />
          </clipPath>
        </defs>

        {dumbo && <ellipse cx="150" cy="135" fill={paint('aura')} rx="142" ry="155" />}

        {[false, true].map((mirrored) => (
          <g
            key={String(mirrored)}
            transform={mirrored ? 'translate(300 0) scale(-1 1)' : undefined}
          >
            {arms.map((arm, index) => (
              <g
                className="ocean-tentacle"
                key={arm.body}
                style={
                  {
                    '--duration': `${5.5 + index * 0.9}s`,
                    '--delay': `${delay - index * 1.4 - (mirrored ? 2 : 0)}s`,
                    transformOrigin: `${124 + index * 6}px 151px`,
                  } as CSSProperties
                }
              >
                <path d={arm.body} fill={paint('arm')} />
                <path d={arm.edge} fill="none" opacity="0.35" stroke={color.dark} strokeWidth="6" />
                <path
                  d={arm.edge}
                  fill="none"
                  opacity="0.85"
                  stroke={color.light}
                  strokeDasharray="0.1 8"
                  strokeLinecap="round"
                  strokeWidth="3.8"
                />
                <path
                  d={arm.edge}
                  fill="none"
                  opacity="0.5"
                  stroke={color.shade}
                  strokeDasharray="0.1 8"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </g>
            ))}
          </g>
        ))}

        {dumbo && (
          <>
            <path
              d="M106 126 C87 155 84 185 67 198 C90 193 99 208 109 222 C125 212 134 231 149 239 C162 222 175 216 188 222 C200 207 213 193 235 198 C210 177 215 144 188 125 Z"
              fill={paint('mantle')}
              stroke={color.rim}
              strokeOpacity="0.45"
            />
            {[false, true].map((mirrored) => (
              <g
                key={String(mirrored)}
                transform={mirrored ? 'translate(300 0) scale(-1 1)' : undefined}
              >
                <g
                  className="ocean-octopus-fin"
                  style={{ '--delay': `${delay - 1}s` } as CSSProperties}
                >
                  <path
                    d="M109 109 C84 116 51 79 49 45 C48 29 65 36 80 48 C102 65 116 84 109 109 Z"
                    fill={paint('mantle')}
                    stroke={color.rim}
                    strokeOpacity="0.5"
                  />
                  <path
                    d="M99 96 C82 86 67 62 60 46 C72 51 91 69 99 96 Z"
                    fill={color.light}
                    opacity="0.25"
                  />
                </g>
              </g>
            ))}
          </>
        )}

        <path d={mantle} fill={paint('mantle')} />
        <g clipPath={paint('skin')}>
          <ellipse
            cx="126"
            cy="73"
            fill={paint('gloss')}
            rx="35"
            ry="40"
            transform="rotate(24 126 73)"
          />
          {freckles.map((spot, index) => (
            <circle
              cx={spot.x}
              cy={spot.y}
              fill={color.light}
              key={index}
              opacity={spot.opacity}
              r={spot.radius}
            />
          ))}
          <path
            d="M186 59 C209 100 186 133 181 147"
            fill="none"
            opacity="0.4"
            stroke={color.rim}
            strokeWidth="3"
          />
        </g>
        <path
          d="M115 155 Q147 179 178 155"
          fill="none"
          opacity="0.5"
          stroke={color.dark}
          strokeWidth="5"
        />
        {[111, 181].map((x) => (
          <g key={x} transform={`translate(${x} 131)`}>
            <ellipse fill={color.dark} rx="16" ry="18" />
            <ellipse cx="-1" cy="-2" fill={paint('eye')} rx="12" ry="13" />
            <ellipse cx="-3" cy="-1" fill="#020a15" rx={dumbo ? 7 : 9} ry={dumbo ? 10 : 4.5} />
            <ellipse cx="-5" cy="-6" fill="#ffffff" opacity="0.9" rx="3" ry="2" />
            <path
              d="M-14 -8 Q0 -22 14 -8"
              fill="none"
              stroke={color.mid}
              strokeLinecap="round"
              strokeWidth="5"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
