import * as React from 'react'

const GRID_GAP = 40 / 3
const BASE_DOT_RADIUS = 1.1
const BASE_ALPHA = 0.2
const ORB_RADIUS_SCALE = 0.5
const MIN_ACTIVE_DOT_DIAMETER = 2
const MAX_ACTIVE_DOT_DIAMETER = 7
const FULL_SIZE_PROGRESS = 0.7
const PROGRESS_NORMALIZER = 0.82
const FRAME_DURATION = 1000 / 30

interface ImageGenerationCanvasProps {
  progress: number
}

interface DrawLoaderOptions {
  accentColor: string
  elapsedMilliseconds: number
  height: number
  progress: number
  reducedMotion: boolean
  width: number
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

function smoothstep(value: number) {
  const clampedValue = clamp(value)
  return clampedValue * clampedValue * (3 - 2 * clampedValue)
}

function pingPong(from: number, to: number, duration: number, elapsed: number) {
  const phase = (elapsed / duration) % 2
  const triangle = phase <= 1 ? phase : 2 - phase
  const easedProgress = (1 - Math.cos(triangle * Math.PI)) / 2

  return from + (to - from) * easedProgress
}

function orbFalloff(radius: number, distance: number) {
  const innerRadius = radius * 0.14
  const broadFalloff = (distance - innerRadius) / Math.max(radius - innerRadius, 0.001)
  const coreFalloff = (distance - innerRadius) / Math.max(radius * 0.32, 0.001)

  return (1 - smoothstep(broadFalloff)) * (1 - smoothstep(coreFalloff) * 0.12)
}

function drawLoader(
  context: CanvasRenderingContext2D,
  { accentColor, elapsedMilliseconds, height, progress, reducedMotion, width }: DrawLoaderOptions,
) {
  context.clearRect(0, 0, width, height)

  if (width < GRID_GAP || height < GRID_GAP) return

  const columns = Math.floor(width / GRID_GAP)
  const rows = Math.floor(height / GRID_GAP)
  const offsetX = (width - (columns - 1) * GRID_GAP) / 2
  const offsetY = (height - (rows - 1) * GRID_GAP) / 2
  const elapsedSeconds = reducedMotion ? 0 : Math.max(0, elapsedMilliseconds) / 1000
  const isCorner = (column: number, row: number) =>
    (column === 0 || column === columns - 1) && (row === 0 || row === rows - 1)

  context.save()
  context.fillStyle = accentColor
  context.globalAlpha = BASE_ALPHA
  context.beginPath()

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      if (isCorner(column, row)) continue

      const x = offsetX + column * GRID_GAP
      const y = offsetY + row * GRID_GAP
      context.moveTo(x + BASE_DOT_RADIUS, y)
      context.arc(x, y, BASE_DOT_RADIUS, 0, Math.PI * 2)
    }
  }

  context.fill()

  const progressFactor = clamp(progress / PROGRESS_NORMALIZER) ** 1.28
  const growth = progressFactor * (0.72 - 0.08 * smoothstep((progressFactor - 0.5) / 0.5))
  const firstOrbX = pingPong(0.18, 0.82, 3.46, elapsedSeconds)
  const firstOrbY = pingPong(0.18, 0.82, 4.87, elapsedSeconds)
  const secondOrbX = pingPong(0.82, 0.18, 4.31, elapsedSeconds)
  const secondOrbY = pingPong(0.82, 0.18, 4.42, elapsedSeconds)
  const firstOrbRadius = pingPong(0.35, 0.6, 3.6, elapsedSeconds) * ORB_RADIUS_SCALE + growth
  const secondOrbRadius = pingPong(0.43, 0.7, 2.4, elapsedSeconds) * ORB_RADIUS_SCALE + growth
  const radiusStrength = reducedMotion ? 0.234 : pingPong(0.105, 0.234, 2.25, elapsedSeconds)
  const minimumBrightAlpha = pingPong(0.58, 0.82, 2.1, elapsedSeconds)
  const maxDotDiameter =
    MIN_ACTIVE_DOT_DIAMETER +
    (MAX_ACTIVE_DOT_DIAMETER - MIN_ACTIVE_DOT_DIAMETER) * smoothstep(progress / FULL_SIZE_PROGRESS)
  const maximumRadius = Math.min(GRID_GAP * 0.48, maxDotDiameter / 2)

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      if (isCorner(column, row)) continue

      const normalizedX = columns === 1 ? 0.5 : column / (columns - 1)
      const normalizedY = rows === 1 ? 0.5 : row / (rows - 1)
      const firstOrbStrength = orbFalloff(
        firstOrbRadius,
        Math.hypot(normalizedX - firstOrbX, normalizedY - firstOrbY),
      )
      const secondOrbStrength = orbFalloff(
        secondOrbRadius,
        Math.hypot(normalizedX - secondOrbX, normalizedY - secondOrbY),
      )
      const fieldStrength = Math.max(firstOrbStrength, secondOrbStrength)
      const brightness = progressFactor * fieldStrength ** (0.85 + progressFactor * 1.1)
      const dotRadius = maximumRadius * fieldStrength ** 1.15 * (radiusStrength / 0.234)

      if (dotRadius <= 0.2) continue

      const x = offsetX + column * GRID_GAP
      const y = offsetY + row * GRID_GAP
      context.globalAlpha = minimumBrightAlpha + (1 - minimumBrightAlpha) * brightness * 0.64
      context.beginPath()
      context.arc(x, y, dotRadius, 0, Math.PI * 2)
      context.fill()
    }
  }

  context.restore()
}

function ImageGenerationCanvas({ progress }: ImageGenerationCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const progressRef = React.useRef(progress)

  React.useEffect(() => {
    progressRef.current = progress
  }, [progress])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const drawingCanvas = canvas
    const drawingContext = context

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startedAt = performance.now()
    let animationFrame = 0
    let reducedMotionTimeout = 0
    let lastFrameAt = Number.NEGATIVE_INFINITY
    let width = 0
    let height = 0

    function resize() {
      const nextWidth = drawingCanvas.clientWidth
      const nextHeight = drawingCanvas.clientHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const backingWidth = Math.round(nextWidth * pixelRatio)
      const backingHeight = Math.round(nextHeight * pixelRatio)

      if (drawingCanvas.width !== backingWidth || drawingCanvas.height !== backingHeight) {
        drawingCanvas.width = backingWidth
        drawingCanvas.height = backingHeight
      }

      width = nextWidth
      height = nextHeight
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    function draw(timestamp: number) {
      if (timestamp - lastFrameAt >= FRAME_DURATION) {
        drawLoader(drawingContext, {
          accentColor: getComputedStyle(drawingCanvas).color,
          elapsedMilliseconds: timestamp - startedAt,
          height,
          progress: clamp(progressRef.current),
          reducedMotion,
          width,
        })
        lastFrameAt = timestamp
      }

      if (reducedMotion) {
        reducedMotionTimeout = window.setTimeout(() => draw(performance.now()), 1000)
      } else {
        animationFrame = window.requestAnimationFrame(draw)
      }
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(drawingCanvas)
    animationFrame = window.requestAnimationFrame(draw)

    return () => {
      resizeObserver.disconnect()
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(reducedMotionTimeout)
    }
  }, [])

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full text-foreground"
      ref={canvasRef}
    />
  )
}

export { ImageGenerationCanvas }
