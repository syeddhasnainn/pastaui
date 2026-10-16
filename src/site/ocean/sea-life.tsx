import type { CSSProperties } from 'react'

import { cn } from '#/lib/utils'

export function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

type Vars = CSSProperties & Record<`--${string}`, string>

const bubbles = (() => {
  const rand = seeded(7)
  return Array.from({ length: 34 }, () => ({
    left: rand() * 100,
    size: 3 + rand() * 12,
    duration: 9 + rand() * 12,
    delay: -rand() * 20,
  }))
})()

export function Bubbles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((bubble, index) => (
        <div
          className="ocean-bubble absolute top-0"
          key={index}
          style={
            {
              left: `${bubble.left}%`,
              '--duration': `${bubble.duration}s`,
              '--delay': `${bubble.delay}s`,
            } as Vars
          }
        >
          <span
            className="block rounded-full border border-white/50 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(255,255,255,0.08)_45%,transparent_70%)]"
            style={{ width: bubble.size, height: bubble.size }}
          />
        </div>
      ))}
    </div>
  )
}

const snow = (() => {
  const rand = seeded(19)
  return Array.from({ length: 70 }, () => ({
    left: rand() * 100,
    size: 1 + rand() * 2.5,
    duration: 18 + rand() * 24,
    delay: -rand() * 40,
    opacity: 0.25 + rand() * 0.5,
  }))
})()

export function MarineSnow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {snow.map((flake, index) => (
        <span
          className="ocean-snow absolute top-0 rounded-full bg-slate-100"
          key={index}
          style={
            {
              left: `${flake.left}%`,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              '--duration': `${flake.duration}s`,
              '--delay': `${flake.delay}s`,
            } as Vars
          }
        />
      ))}
    </div>
  )
}

const glowColors = ['#5eead4', '#67e8f9', '#a5b4fc', '#f0abfc']

const sparks = (() => {
  const rand = seeded(43)
  return Array.from({ length: 46 }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 2 + rand() * 4,
    color: glowColors[Math.floor(rand() * glowColors.length)],
    duration: 1.8 + rand() * 3,
    delay: -rand() * 4,
  }))
})()

export function Bioluminescence() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((spark, index) => (
        <span
          className="ocean-twinkle absolute rounded-full"
          key={index}
          style={
            {
              left: `${spark.left}%`,
              top: `${spark.top}%`,
              width: spark.size,
              height: spark.size,
              background: spark.color,
              boxShadow: `0 0 ${spark.size * 3}px ${spark.size}px ${spark.color}66`,
              '--duration': `${spark.duration}s`,
              '--delay': `${spark.delay}s`,
            } as Vars
          }
        />
      ))}
    </div>
  )
}

const rays = [
  { left: 6, width: 90, angle: 14, delay: 0 },
  { left: 18, width: 160, angle: 10, delay: -2 },
  { left: 34, width: 70, angle: 6, delay: -5 },
  { left: 47, width: 200, angle: 3, delay: -1 },
  { left: 63, width: 110, angle: -2, delay: -6 },
  { left: 76, width: 180, angle: -6, delay: -3 },
  { left: 90, width: 80, angle: -10, delay: -4 },
]

export function LightRays() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {rays.map((ray, index) => (
        <span
          className="ocean-ray absolute -top-[10vh] h-[130vh] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45),rgba(255,255,255,0.12)_45%,transparent_80%)] mix-blend-soft-light blur-xl"
          key={index}
          style={
            {
              left: `${ray.left}%`,
              width: ray.width,
              animationDelay: `${ray.delay}s`,
              '--ray-angle': `${ray.angle}deg`,
            } as Vars
          }
        />
      ))}
    </div>
  )
}

const fishSpecies = {
  silver: { src: '/ocean/silver-fish.webp', width: 384, height: 192, size: 76 },
  reef: { src: '/ocean/reef-fish.webp', width: 480, height: 320, size: 116 },
  lantern: { src: '/ocean/lanternfish.webp', width: 480, height: 240, size: 124 },
}

export function FishSchool({
  className,
  species = 'silver',
  count = 8,
  duration = 34,
  delay = 0,
  scale = 1,
  seed = 3,
  loading = 'lazy',
}: {
  className?: string
  species?: keyof typeof fishSpecies
  count?: number
  duration?: number
  delay?: number
  scale?: number
  seed?: number
  loading?: 'eager' | 'lazy'
}) {
  const rand = seeded(seed)
  const art = fishSpecies[species]
  const fish = Array.from({ length: count }, (_, index) => ({
    x: (index / count) * 340 + rand() * 35,
    y: rand() * 100,
    size: 0.65 + rand() * 0.45,
    delay: -rand() * 4,
  }))

  return (
    <div
      aria-hidden
      className={cn('ocean-school pointer-events-none absolute left-0 h-44', className)}
      data-species={species}
      style={{ width: 520 * scale, '--duration': `${duration}s`, '--delay': `${delay}s` } as Vars}
    >
      {fish.map((item, index) => (
        <img
          alt=""
          aria-hidden
          className="ocean-fish absolute h-auto select-none"
          decoding="async"
          draggable={false}
          height={art.height}
          key={index}
          loading={loading}
          src={art.src}
          style={
            {
              left: item.x * scale,
              top: item.y * scale,
              width: art.size * item.size * scale,
              opacity: 0.45 + item.size * 0.5,
              '--delay': `${item.delay}s`,
            } as Vars
          }
          width={art.width}
        />
      ))}
    </div>
  )
}

export function Jellyfish({
  className,
  color = '#f0abfc',
  duration = 7,
  delay = 0,
}: {
  className?: string
  color?: string
  duration?: number
  delay?: number
}) {
  return (
    <div
      aria-hidden
      className={cn('ocean-jelly pointer-events-none absolute', className)}
      style={{ '--duration': `${duration}s`, '--delay': `${delay}s` } as Vars}
    >
      <svg
        className="h-full w-full overflow-visible"
        style={{ filter: `drop-shadow(0 0 18px ${color}88)` }}
        viewBox="0 0 100 180"
      >
        <defs>
          <radialGradient cx="50%" cy="35%" id={`jelly-${color}`} r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="45%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0.12" />
          </radialGradient>
        </defs>
        <path
          d="M6 52 C6 18 28 4 50 4 C72 4 94 18 94 52 C86 48 80 56 72 52 C64 58 58 50 50 55 C42 50 36 58 28 52 C20 56 14 48 6 52 Z"
          fill={`url(#jelly-${color})`}
        />
        {[20, 36, 50, 64, 80].map((x, index) => (
          <path
            className="ocean-sway"
            d={`M${x} 54 C${x - 8} 84 ${x + 8} 110 ${x} 140 C${x - 6} 156 ${x + 4} 168 ${x} 178`}
            fill="none"
            key={x}
            stroke={color}
            strokeLinecap="round"
            strokeOpacity={0.55}
            strokeWidth={index % 2 ? 1.2 : 2}
            style={{ '--duration': `${2.6 + index * 0.4}s`, transformOrigin: 'top center' } as Vars}
          />
        ))}
      </svg>
    </div>
  )
}

export function CoralReef({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none isolate overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_35%)]',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,#123249_0%,#0b1a2e66_40%,transparent_72%)]" />
      <img
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover object-bottom select-none"
        decoding="async"
        draggable={false}
        height={887}
        loading="lazy"
        src="/ocean/deep-reef.webp"
        width={1774}
      />
      <div className="ocean-reef-shimmer absolute inset-0 bg-[radial-gradient(ellipse_at_18%_70%,#f472b61c,transparent_26%),radial-gradient(ellipse_at_76%_60%,#2dd4bf20,transparent_30%)] mix-blend-screen" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#01040a] to-transparent" />
    </div>
  )
}
