import {
  motion,
  transform,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'

import { cn } from '#/lib/utils'
import { BeachScene } from '#/site/ocean/beach-scene'
import { Octopus } from '#/site/ocean/octopus'

import {
  Bioluminescence,
  Bubbles,
  CoralReef,
  FishSchool,
  Jellyfish,
  LightRays,
  MarineSnow,
} from '#/site/ocean/sea-life'

const zones = [
  { name: 'Sunlight zone', from: 0 },
  { name: 'Twilight zone', from: 200 },
  { name: 'Midnight zone', from: 1000 },
  { name: 'Abyssal zone', from: 4000 },
  { name: 'Hadal zone', from: 6000 },
]

const MAX_DEPTH = 10935

function zoneFor(depth: number) {
  return [...zones].reverse().find((zone) => depth >= zone.from) ?? zones[0]
}

export function OceanLanding() {
  const reducedMotion = useReducedMotion()
  const waterRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: entry } = useScroll({
    target: waterRef,
    offset: ['start end', 'start start'],
  })
  const { scrollYProgress: dive } = useScroll({
    target: waterRef,
    offset: ['start start', 'end end'],
  })

  const water = useTransform(dive, (v) =>
    transform(
      v,
      [0, 0.2, 0.4, 0.65, 0.85, 1],
      ['#3eaed3', '#11709f', '#073a66', '#03162b', '#020a16', '#01040a'],
    ),
  )
  const depth = useTransform(dive, (v) =>
    transform(v, [0, 0.2, 0.4, 0.65, 0.85, 1], [0, 200, 1000, 4000, 6000, MAX_DEPTH]),
  )
  const raysOpacity = useTransform(dive, (v) => transform(v, [0, 0.12, 0.32], [1, 0.8, 0]))
  const bubblesOpacity = useTransform([entry, dive], ([e, d]: number[]) =>
    e < 1 ? e : Math.max(0, 1 - d * 2.2),
  )
  const snowOpacity = useTransform(dive, (v) => transform(v, [0.25, 0.5], [0, 1]))
  const glowOpacity = useTransform(dive, (v) => transform(v, [0.45, 0.7], [0, 1]))
  const vignette = useTransform(dive, (v) => transform(v, [0, 1], [0.15, 0.85]))
  const heroFade = useTransform(entry, (v) => transform(v, [0.15, 0.6], [1, 0]))
  const heroLift = useTransform(entry, (v) => (reducedMotion ? 0 : transform(v, [0, 1], [0, -80])))
  const meterOpacity = useTransform(entry, (v) => transform(v, [0.7, 1], [0, 1]))

  return (
    <main className="relative overflow-x-clip bg-white text-white" id="main-content">
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <motion.div className="absolute inset-0" style={{ backgroundColor: water }} />
        <motion.div style={{ opacity: raysOpacity }}>
          <LightRays />
        </motion.div>
        <motion.div style={{ opacity: bubblesOpacity }}>
          <Bubbles />
        </motion.div>
        <motion.div style={{ opacity: snowOpacity }}>
          <MarineSnow />
        </motion.div>
        <motion.div style={{ opacity: glowOpacity }}>
          <Bioluminescence />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#000_100%)]"
          style={{ opacity: vignette }}
        />
      </div>

      <DepthMeter depth={depth} dive={dive} opacity={meterOpacity} />

      <section className="relative z-10 h-[115svh] text-[#143f49]" id="top">
        <BeachScene entry={entry} />
        <header className="absolute inset-x-5 top-5 z-20 mx-auto flex max-w-6xl items-center justify-between rounded-full bg-[#f4fbf7]/80 px-5 py-3 backdrop-blur-sm sm:inset-x-8 sm:top-6 sm:px-6">
          <a
            className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
            href="#top"
          >
            <span className="size-2.5 rounded-full bg-[#168f9c]" />
            Fathom
          </a>
          <nav className="hidden items-center gap-8 text-[14px] text-[#315b61] sm:flex">
            <a className="transition-colors hover:text-[#143f49]" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-[#143f49]" href="#stories">
              Stories
            </a>
            <a className="transition-colors hover:text-[#143f49]" href="#descend">
              Pricing
            </a>
          </nav>
          <a
            className="rounded-full px-4 py-2 text-[14px] font-medium ring-1 ring-[#143f49]/25 transition-colors hover:bg-white/70"
            href="#descend"
          >
            Sign in
          </a>
        </header>

        <motion.div
          className="pointer-events-none sticky top-0 z-10 flex h-svh flex-col items-center px-6 pt-[22svh] text-center"
          style={{ opacity: heroFade, y: heroLift }}
        >
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#315b61] uppercase sm:text-[12px]">
            Sea level
          </p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(3rem,7vw,6.5rem)] leading-[1.02] font-light tracking-[-0.04em] text-balance [text-shadow:0_2px_24px_#d2f0ec80] sm:tracking-[-0.055em]">
            Take a deep breath.
          </h1>
          <p className="mt-6 max-w-[27ch] text-[15px] leading-relaxed text-[#315b61] sm:text-[16px]">
            Everything worth finding is a little further down.
          </p>
          <div className="absolute bottom-[12svh] flex flex-col items-center gap-4 text-[10px] font-semibold tracking-[0.24em] text-[#143f49] uppercase sm:bottom-[10svh] sm:text-[11px]">
            Scroll to descend
            <span className="relative h-12 w-px overflow-hidden bg-[#143f49]/20">
              <span className="ocean-cue absolute inset-0 bg-[#143f49]" />
            </span>
          </div>
        </motion.div>
      </section>

      <div className="relative" ref={waterRef}>
        <SunlightZone />
        <TwilightZone />
        <MidnightZone />
        <AbyssalZone />
        <Seabed />
      </div>
    </main>
  )
}

function DepthMeter({
  depth,
  dive,
  opacity,
}: {
  depth: MotionValue<number>
  dive: MotionValue<number>
  opacity: MotionValue<number>
}) {
  const [zone, setZone] = useState(zones[0].name)
  const label = useTransform(depth, (value) => `${Math.round(value).toLocaleString('en-US')} m`)
  const markerTop = useTransform(dive, (value) => `${value * 100}%`)

  useMotionValueEvent(depth, 'change', (value) => setZone(zoneFor(value).name))

  return (
    <motion.aside
      aria-hidden
      className="pointer-events-none fixed top-1/2 right-6 z-20 hidden -translate-y-1/2 items-center gap-4 md:flex"
      style={{ opacity }}
    >
      <div className="text-right">
        <motion.p className="text-[22px] font-light tracking-tight tabular-nums">{label}</motion.p>
        <p className="mt-1 text-[11px] tracking-[0.18em] text-white/50 uppercase">{zone}</p>
      </div>
      <div className="relative h-56 w-px bg-white/20">
        <motion.span
          className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(165,243,252,0.6)]"
          style={{ top: markerTop }}
        />
      </div>
    </motion.aside>
  )
}

function Eyebrow({ depth, zone }: { depth: string; zone: string }) {
  return (
    <p className="flex items-center gap-3 text-[12px] font-medium tracking-[0.2em] text-white/60 uppercase">
      <span className="tabular-nums">{depth}</span>
      <span className="h-px w-8 bg-white/30" />
      {zone}
    </p>
  )
}

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-15% 0px' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    >
      {children}
    </motion.div>
  )
}

const glass =
  'rounded-3xl border border-white/15 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md'

function SunlightZone() {
  return (
    <section className="relative flex min-h-[130svh] items-center px-6 pt-40 pb-24">
      <FishSchool className="top-[12%]" delay={-12} duration={38} loading="eager" seed={3} />
      <FishSchool
        className="bottom-[12%]"
        count={3}
        delay={-14}
        duration={42}
        loading="eager"
        scale={1.15}
        seed={9}
        species="reef"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <Eyebrow depth="0 m" zone="Sunlight zone" />
          <h2 className="mt-6 text-5xl font-light tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Go deeper than the noise.
          </h2>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/80">
            Fathom is a focus environment that sinks every notification, tab and ping below the
            surface, so the only thing left is the work in front of you.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              className="rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-sky-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.7)] transition-transform hover:-translate-y-0.5"
              href="#descend"
            >
              Start diving, it&apos;s free
            </a>
            <a
              className="rounded-full px-6 py-3 text-[15px] font-medium text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
              href="#features"
            >
              See how it works
            </a>
          </div>
        </Reveal>

        <Reveal>
          <FocusCard />
        </Reveal>
      </div>
    </section>
  )
}

function FocusCard() {
  const radius = 84
  const circumference = 2 * Math.PI * radius

  return (
    <div className={cn(glass, 'mx-auto w-full max-w-sm p-7')}>
      <div className="flex items-center justify-between text-[13px] text-white/70">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_8px_2px_rgba(110,231,183,0.6)]" />
          Deep session
        </span>
        <span>Kelp forest</span>
      </div>
      <div className="relative mx-auto mt-6 size-52">
        <svg className="size-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            fill="none"
            r={radius}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="100"
            fill="none"
            r={radius}
            stroke="#ffffff"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.32}
            strokeLinecap="round"
            strokeWidth="6"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-light tracking-tight tabular-nums">47:12</span>
          <span className="mt-1 text-[12px] tracking-[0.16em] text-white/60 uppercase">
            remaining
          </span>
        </div>
      </div>
      <div className="mt-6 flex h-10 items-end justify-center gap-1">
        {[30, 55, 40, 80, 62, 95, 70, 45, 85, 58, 36, 66, 90, 50, 28].map((height, index) => (
          <span
            className="w-1.5 rounded-full bg-white/70"
            key={index}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-3 text-center text-[12px] text-white/60">
        <span>
          <strong className="block text-[15px] font-semibold text-white">0</strong>pings
        </span>
        <span>
          <strong className="block text-[15px] font-semibold text-white">14</strong>sites sealed
        </span>
        <span>
          <strong className="block text-[15px] font-semibold text-white">3</strong>dives today
        </span>
      </div>
    </div>
  )
}

const features = [
  {
    title: 'Pressure seal',
    body: 'The apps and sites you choose lock the moment a session starts. No willpower required.',
    icon: (
      <path d="M12 3a6 6 0 0 0-6 6v3H5v9h14v-9h-1V9a6 6 0 0 0-6-6Zm-4 9V9a4 4 0 0 1 8 0v3H8Z" />
    ),
  },
  {
    title: 'Ambient currents',
    body: 'Generative soundscapes tuned to your pace, from shallow reef to distant whale song.',
    icon: (
      <path
        d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0M2 7c2-3 4-3 6 0s4 3 6 0 4-3 6 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    ),
  },
  {
    title: 'Depth log',
    body: 'Every dive is charted, so you can see how deep you went and how long you stayed.',
    icon: (
      <path
        d="M4 4v16h16M8 8l3 5 3-2 4 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    ),
  },
]

function TwilightZone() {
  return (
    <section className="relative min-h-[140svh] px-6 pt-40 pb-80" id="features">
      <Octopus className="right-[9%] bottom-2 w-44 sm:w-60" />
      <Jellyfish className="top-[8%] right-[8%] h-44 w-24" color="#f0abfc" duration={8} />
      <Jellyfish
        className="top-[55%] left-[4%] h-32 w-16"
        color="#a5b4fc"
        delay={-3}
        duration={6}
      />
      <Jellyfish
        className="right-[30%] bottom-[6%] h-24 w-12 opacity-70"
        color="#67e8f9"
        delay={-5}
        duration={7}
      />
      <FishSchool
        className="bottom-[14%]"
        count={6}
        delay={-22}
        duration={48}
        scale={0.6}
        seed={17}
      />

      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <Eyebrow depth="200 m" zone="Twilight zone" />
          <h2 className="mt-6 text-4xl font-light tracking-[-0.035em] text-balance sm:text-6xl">
            The light fades. Distractions go with it.
          </h2>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/70">
            Past two hundred metres, the world above stops reaching you. Fathom recreates that quiet
            on demand.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title}>
              <article
                className={cn(glass, 'h-full p-7 transition-colors hover:bg-white/[0.09]')}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-cyan-100 ring-1 ring-white/15">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </span>
                <h3 className="mt-8 text-xl font-medium tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/65">{feature.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const stats = [
  { value: '4.6h', label: 'of deep work a day, on average', color: '#5eead4' },
  { value: '92%', label: 'fewer context switches', color: '#a5b4fc' },
  { value: '180k', label: 'divers since launch', color: '#f0abfc' },
]

function MidnightZone() {
  return (
    <section className="relative flex min-h-[150svh] items-center px-6 py-40">
      <FishSchool
        className="top-[12%]"
        count={3}
        delay={-24}
        duration={62}
        scale={1.2}
        seed={29}
        species="lantern"
      />
      <FishSchool
        className="bottom-[12%] opacity-60"
        count={2}
        delay={-41}
        duration={76}
        scale={0.75}
        seed={31}
        species="lantern"
      />
      <div
        aria-hidden
        className="ocean-glow-pulse absolute top-[30%] left-[12%] size-3 rounded-full bg-cyan-200 shadow-[0_0_40px_18px_rgba(103,232,249,0.35)]"
      />
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <Eyebrow depth="1,000 m" zone="Midnight zone" />
          </div>
          <h2 className="mt-6 text-4xl font-light tracking-[-0.035em] text-balance sm:text-6xl">
            Down here, your own light is all you need.
          </h2>
        </Reveal>

        <div className="mt-24 grid gap-14 sm:grid-cols-3">
          {stats.map((stat) => (
            <Reveal className="text-center" key={stat.value}>
              <p
                className="ocean-glow-pulse text-6xl font-extralight tracking-tight sm:text-7xl"
                style={{ color: stat.color, textShadow: `0 0 32px ${stat.color}aa` }}
              >
                {stat.value}
              </p>
              <p className="mt-4 text-[15px] text-white/55">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function AbyssalZone() {
  return (
    <section className="relative min-h-[150svh] px-6 pt-40 pb-80" id="stories">
      <Octopus className="bottom-0 left-[10%] w-40 sm:w-56" delay={-5} variant="dumbo" />
      <FishSchool
        className="top-0 opacity-80"
        count={2}
        delay={-44}
        duration={82}
        seed={47}
        species="lantern"
      />
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <Eyebrow depth="4,000 m" zone="Abyssal zone" />
          <blockquote className="mt-10 text-3xl leading-snug font-light tracking-[-0.02em] text-white/90 sm:text-[42px]">
            &ldquo;I didn&apos;t realise how loud my day was until Fathom turned it off. It&apos;s
            the only app I open to close all the others.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-teal-300 to-indigo-400 text-[14px] font-semibold text-slate-950">
              MO
            </span>
            <div>
              <p className="text-[15px] font-medium">Mara Okafor</p>
              <p className="text-[13px] text-white/50">Staff engineer, Tidewater</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-48">
          <div
            className={cn(glass, 'relative overflow-hidden p-10 text-center sm:p-14')}
            id="descend"
          >
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl"
            />
            <h2 className="relative text-4xl font-light tracking-[-0.035em] sm:text-5xl">
              Ready to hold your breath?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-white/65">
              Free for your first hundred dives. No card, no surface noise.
            </p>
            <form
              className="relative mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="sr-only" htmlFor="ocean-email">
                Email address
              </label>
              <input
                className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-[15px] text-white placeholder:text-white/40 focus:border-cyan-200/60 focus:outline-none"
                id="ocean-email"
                placeholder="you@surface.com"
                type="email"
              />
              <button
                className="h-12 rounded-full bg-cyan-200 px-6 text-[15px] font-semibold text-slate-950 shadow-[0_0_30px_-4px_rgba(165,243,252,0.7)] transition-transform hover:-translate-y-0.5"
                type="submit"
              >
                Begin descent
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const footerLinks = [
  { title: 'Product', links: ['Sessions', 'Soundscapes', 'Depth log', 'Pricing'] },
  { title: 'Company', links: ['About', 'Field notes', 'Careers', 'Press'] },
  { title: 'Support', links: ['Help centre', 'Status', 'Privacy', 'Terms'] },
]

function Seabed() {
  return (
    <footer className="relative pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Eyebrow depth="10,935 m" zone="Challenger Deep" />
          </div>
          <p className="mt-6 text-4xl font-light tracking-[-0.035em] sm:text-5xl">
            You&apos;ve reached the bottom.
          </p>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50">
            Few make it this far. The reef has been expecting you.
          </p>
        </Reveal>
      </div>

      <div className="relative mt-24 flex min-h-[640px] flex-col sm:aspect-[2/1] sm:min-h-[560px]">
        <CoralReef className="absolute inset-0" />
        <div className="relative z-10 px-6">
          <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <a className="flex items-center gap-2 text-[15px] font-semibold" href="#top">
                <span className="size-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_3px_rgba(103,232,249,0.6)]" />
                Fathom
              </a>
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/45">
                Deep work, without the noise. Made by people who like it quiet.
              </p>
            </div>
            {footerLinks.map((column) => (
              <div key={column.title}>
                <p className="text-[12px] font-medium tracking-[0.18em] text-white/40 uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5 text-[14px] text-white/70">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a className="transition-colors hover:text-cyan-200" href="#top">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 mt-auto px-6 pb-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-[13px] text-white/45">
            <p>© 2026 Fathom Labs</p>
            <a className="transition-colors hover:text-white/80" href="#top">
              Back to the surface ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
