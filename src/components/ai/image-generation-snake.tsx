import * as React from 'react'

import { cn } from 'cn'

const GRID_SIZE = 17
const TICK_RATE = 120

interface Cell {
  x: number
  y: number
}

interface Direction extends Cell {}

interface GameState {
  direction: Direction
  food: Cell
  gameOver: boolean
  paused: boolean
  queuedDirection: Direction
  snake: Cell[]
}

type GameAction =
  | { direction: Direction; type: 'turn' }
  | { type: 'restart' }
  | { type: 'tick' }
  | { type: 'toggle-pause' }

interface ImageGenerationSnakeProps extends React.ComponentProps<'button'> {
  onExit: () => void
}

const directions = {
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
} satisfies Record<string, Direction>

const initialState: GameState = {
  direction: directions.right,
  food: { x: 3, y: 8 },
  gameOver: false,
  paused: false,
  queuedDirection: directions.right,
  snake: [
    { x: 10, y: 8 },
    { x: 9, y: 8 },
    { x: 8, y: 8 },
    { x: 7, y: 8 },
  ],
}

function cellsMatch(first: Cell, second: Cell) {
  return first.x === second.x && first.y === second.y
}

function nextFood(snake: Cell[]) {
  const offset = snake.length * 7

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const candidate = {
      x: (offset + index * 5) % GRID_SIZE,
      y: (offset * 3 + index * 7) % GRID_SIZE,
    }

    if (!snake.some((cell) => cellsMatch(cell, candidate))) return candidate
  }

  return { x: 0, y: 0 }
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'restart') return initialState

  if (action.type === 'toggle-pause') {
    return state.gameOver ? state : { ...state, paused: !state.paused }
  }

  if (action.type === 'turn') {
    const reversesDirection =
      action.direction.x + state.direction.x === 0 && action.direction.y + state.direction.y === 0

    return reversesDirection ? state : { ...state, queuedDirection: action.direction }
  }

  if (state.paused || state.gameOver) return state

  const direction = state.queuedDirection
  const head = state.snake[0]
  const nextHead = {
    x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
    y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
  }
  const ateFood = cellsMatch(nextHead, state.food)
  const body = ateFood ? state.snake : state.snake.slice(0, -1)

  if (body.some((cell) => cellsMatch(cell, nextHead))) {
    return { ...state, gameOver: true }
  }

  const snake = [nextHead, ...state.snake]
  if (!ateFood) snake.pop()

  return {
    ...state,
    direction,
    food: ateFood ? nextFood(snake) : state.food,
    queuedDirection: direction,
    snake,
  }
}

function ImageGenerationSnake({ className, onExit, ...props }: ImageGenerationSnakeProps) {
  const [state, dispatch] = React.useReducer(gameReducer, initialState)
  const boardRef = React.useRef<HTMLButtonElement>(null)
  const pointerStartRef = React.useRef<Cell | null>(null)

  React.useEffect(() => {
    boardRef.current?.focus()
  }, [])

  React.useEffect(() => {
    const timer = window.setInterval(() => dispatch({ type: 'tick' }), TICK_RATE)
    return () => window.clearInterval(timer)
  }, [])

  function turn(direction: Direction) {
    dispatch({ direction, type: 'turn' })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const direction = {
      ArrowDown: directions.down,
      ArrowLeft: directions.left,
      ArrowRight: directions.right,
      ArrowUp: directions.up,
      a: directions.left,
      d: directions.right,
      s: directions.down,
      w: directions.up,
    }[event.key]

    if (direction) {
      event.preventDefault()
      turn(direction)
      return
    }

    if (event.key === ' ') {
      event.preventDefault()
      dispatch({ type: 'toggle-pause' })
    }

    if (event.key === 'Escape') onExit()
    if (event.key === 'Enter' && state.gameOver) dispatch({ type: 'restart' })
  }

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    pointerStartRef.current = { x: event.clientX, y: event.clientY }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const start = pointerStartRef.current
    pointerStartRef.current = null
    if (!start) return

    const x = event.clientX - start.x
    const y = event.clientY - start.y
    if (Math.max(Math.abs(x), Math.abs(y)) < 18) return

    if (Math.abs(x) > Math.abs(y)) turn(x > 0 ? directions.right : directions.left)
    else turn(y > 0 ? directions.down : directions.up)
  }

  const cellSize = 100 / GRID_SIZE

  return (
    <button
      aria-label="Snake. Use arrow keys, WASD, or swipe to move. Press Space to pause or resume, or Escape to exit."
      className={cn(
        'relative size-full touch-none overflow-hidden border-0 bg-transparent p-0 text-foreground outline-none select-none',
        className,
      )}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      ref={boardRef}
      type="button"
      {...props}
    >
      <DotField />

      {state.snake.map((cell, index) => (
        <span
          className={cn(
            'absolute rounded-full bg-foreground shadow-sm transition-[left,top] duration-100',
            index === 0 &&
              "before:absolute before:top-[28%] before:right-[28%] before:size-[12%] before:rounded-full before:bg-background before:content-[''] after:absolute after:top-[28%] after:left-[28%] after:size-[12%] after:rounded-full after:bg-background after:content-['']",
          )}
          key={`${index}-${cell.x}-${cell.y}`}
          style={{
            height: `${cellSize * 0.64}%`,
            left: `${cell.x * cellSize + cellSize * 0.18}%`,
            top: `${cell.y * cellSize + cellSize * 0.18}%`,
            width: `${cellSize * 0.64}%`,
          }}
        />
      ))}

      <span
        className="absolute rounded-full bg-foreground ring-4 ring-background/20"
        style={{
          height: `${cellSize * 0.55}%`,
          left: `${state.food.x * cellSize + cellSize * 0.225}%`,
          top: `${state.food.y * cellSize + cellSize * 0.225}%`,
          width: `${cellSize * 0.55}%`,
        }}
      />

      <div className="absolute top-4 right-4 rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-medium text-background tabular-nums backdrop-blur-sm">
        {state.snake.length - initialState.snake.length}
      </div>

      {(state.paused || state.gameOver) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/72 backdrop-blur-sm">
          <div className="text-center">
            <p className="card-heading">{state.gameOver ? 'Game over' : 'Paused'}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {state.gameOver ? 'Press Enter to restart' : 'Press Space to continue'}
            </p>
          </div>
        </div>
      )}

      <span aria-live="polite" className="sr-only">
        Score {state.snake.length - initialState.snake.length}
      </span>
    </button>
  )
}

function DotField() {
  return (
    <>
      <div className="absolute inset-0 [background-image:radial-gradient(circle,var(--foreground)_1px,transparent_1.25px)] [mask-image:radial-gradient(ellipse_at_28%_28%,black_0%,transparent_64%)] [background-size:18px_18px] opacity-35" />
      <div className="absolute inset-0 [background-image:radial-gradient(circle,var(--foreground)_1px,transparent_1.25px)] [mask-image:radial-gradient(ellipse_at_72%_72%,black_0%,transparent_64%)] [background-size:18px_18px] opacity-35" />
    </>
  )
}

export { DotField, ImageGenerationSnake }
