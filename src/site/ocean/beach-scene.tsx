import { motion, transform, useReducedMotion, useTransform, type MotionValue } from 'motion/react'

export function BeachScene({ entry }: { entry: MotionValue<number> }) {
  const reducedMotion = useReducedMotion()
  const skyY = useTransform(entry, (v) => (reducedMotion ? 0 : transform(v, [0, 1], [0, 110])))
  const seaY = useTransform(entry, (v) => (reducedMotion ? 0 : transform(v, [0, 1], [0, 45])))
  const palmsY = useTransform(entry, (v) => (reducedMotion ? 0 : transform(v, [0, 1], [0, -150])))
  const leftX = useTransform(entry, (v) =>
    reducedMotion ? '0%' : transform(v, [0, 1], ['0%', '-22%']),
  )
  const rightX = useTransform(entry, (v) =>
    reducedMotion ? '0%' : transform(v, [0, 1], ['0%', '22%']),
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_85%,transparent_100%)]"
    >
      <motion.div className="absolute inset-x-0 -top-[6%] h-[70%]" style={{ y: skyY }}>
        <img
          alt=""
          aria-hidden
          className="ocean-cloud-drift h-full w-full max-w-none object-cover"
          fetchPriority="high"
          height={960}
          loading="eager"
          src="/ocean/beach-sky.webp"
          width={1440}
        />
      </motion.div>

      <div className="absolute inset-x-0 top-[60%] bottom-0 bg-[linear-gradient(to_bottom,#6abfc5_0%,#4bc7cb_9%,#55cbd1_24%,#44bdd0_52%,#3eaed3_85%)]">
        <motion.div className="absolute inset-x-0 top-0 h-[70%]" style={{ y: seaY }}>
          <div className="absolute inset-x-0 top-0 h-px bg-[#d8f4e9]/60" />
          <svg
            className="ocean-surf absolute top-0 -left-[5%] h-full w-[110%]"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
          >
            <g stroke="#eaf9e8" strokeLinecap="round">
              <path d="M48 15h150m80 5h230m300-6h120m140 8h300" opacity=".45" />
              <path
                d="M0 53q100-8 200 0t200 0m160-12q120 6 240 0m260 12h350"
                opacity=".5"
                strokeWidth="2"
              />
              <path
                d="M90 108q80-12 170-1t190 0m430-18q120-9 250 2t200-3"
                opacity=".65"
                strokeWidth="3"
              />
              <path
                d="M-40 178q110-14 235-3t230 0m200-25q80-8 190 0m265 20q110-12 230 0"
                opacity=".45"
                strokeWidth="3"
              />
              <path d="M220 246q80-10 170-2m470-15q170-14 320 4" opacity=".2" strokeWidth="4" />
            </g>
            <g fill="#eaf9e8" opacity=".7">
              <path d="M151 99q28-2 42-14l7 8 9-4 7 10 38 5-56 2z" />
              <path d="M1020 82l34-5 10-14 7 13 12-6 13 13 42 5-70-1z" />
            </g>
          </svg>
          <svg
            className="ocean-sea-shimmer absolute inset-0 h-full w-full"
            fill="none"
            preserveAspectRatio="none"
            stroke="#eaf9e8"
            strokeLinecap="round"
            viewBox="0 0 1440 320"
          >
            <path
              d="M300 32h40m180 44h70m180-49h60m-390 99h42m410 0h27m-100 65h70m-630 16h50m740 40h90m-460 30h40"
              strokeWidth="2"
            />
          </svg>
          <svg
            className="ocean-sailboat absolute -top-12 left-[68%] h-14 w-12 sm:-top-14 sm:h-16 sm:w-14"
            fill="none"
            viewBox="0 0 64 80"
          >
            <path d="M32 4v61" stroke="#567c79" strokeWidth="1.5" />
            <path d="M29 8C24 25 14 44 8 53h21z" fill="#fffbe9" />
            <path d="M35 20v33h20C45 44 40 33 35 20" fill="#eaf3dc" />
            <path d="M9 60h47l-9 8H21z" fill="#f7eed4" />
            <path d="M21 68h26" stroke="#497e83" strokeWidth="2" />
            <path d="M13 74h41" stroke="#eaf9e8" opacity=".5" />
          </svg>
        </motion.div>
      </div>

      <motion.svg
        className="absolute top-[25%] right-[23%] h-20 w-32 text-[#3e777c]/60 sm:right-[28%]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        style={{ y: skyY }}
        viewBox="0 0 140 80"
      >
        <path d="M12 42q8-3 13 5 4-8 12-7M80 15q6-2 10 4 4-5 10-5M111 64q5-1 8 4 4-5 9-3" />
      </motion.svg>

      <motion.div
        className="absolute -top-[4%] -left-[46%] h-[83%] w-[70%] [mask-image:linear-gradient(to_bottom,#000_86%,transparent)] sm:-left-[13%] sm:w-[46%] lg:-left-[8%] lg:w-[38%]"
        style={{ x: leftX, y: palmsY }}
      >
        <img
          alt=""
          aria-hidden
          className="ocean-palm-left h-full w-full max-w-none object-fill"
          height={1152}
          loading="eager"
          src="/ocean/beach-palm-left.webp"
          width={768}
        />
      </motion.div>
      <motion.div
        className="absolute -top-[2%] -right-[46%] h-[82%] w-[70%] [mask-image:linear-gradient(to_bottom,#000_86%,transparent)] sm:-right-[13%] sm:w-[46%] lg:-right-[8%] lg:w-[38%]"
        style={{ x: rightX, y: palmsY }}
      >
        <img
          alt=""
          aria-hidden
          className="ocean-palm-right h-full w-full max-w-none object-fill"
          height={1152}
          loading="eager"
          src="/ocean/beach-palm-right.webp"
          width={768}
        />
      </motion.div>
    </div>
  )
}
