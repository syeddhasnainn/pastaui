import { Menu } from '@base-ui/react/menu'
import { PinIcon } from '@solar-icons/react/bold/pin'
import { AltArrowDownIcon } from '@solar-icons/react/linear/alt-arrow-down'
import { ArrowDownIcon } from '@solar-icons/react/linear/arrow-down'
import { ArrowUpIcon } from '@solar-icons/react/linear/arrow-up'
import { TableIcon } from '@solar-icons/react/linear/table'
import * as React from 'react'

import { cn } from 'cn'

type DataTableValue = string | number | boolean | null | undefined

interface DataTableColumn<Row> {
  key: keyof Row & string
  header: string
  align?: 'start' | 'end'
  cell?: (row: Row) => React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  minWidth?: number
  pin?: DataTablePin
  pinnable?: boolean
  resizable?: boolean
  sortable?: boolean
  width?: number
}

type DataTablePin = 'left' | 'right'

interface DataTableSort {
  key: string
  direction: 'asc' | 'desc'
}

interface DataTableProps<Row extends Record<string, DataTableValue>> extends Omit<
  React.ComponentProps<'section'>,
  'title'
> {
  columns: DataTableColumn<Row>[]
  rows: Row[]
  defaultSort?: DataTableSort | null
  getRowId?: (row: Row, index: number) => string
  onColumnPinChange?: (key: string, pin: DataTablePin | null) => void
  onColumnResize?: (key: string, width: number) => void
  onRowClick?: (row: Row) => void
  onSortChange?: (sort: DataTableSort | null) => void
  pinnable?: boolean
  resizable?: boolean
  rowHeight?: number
  sort?: DataTableSort | null
  title?: string
}

const DEFAULT_WIDTH = 140
const MIN_WIDTH = 64
const KEYBOARD_STEP = 16
const OVERSCAN = 8
const COLUMN_OVERSCAN = 2

const collator = new Intl.Collator(undefined, { numeric: true })

const dividerClass = 'border-b-[0.5px] border-foreground/[0.09]'

const headerCellClass =
  'sticky top-0 z-10 h-11 border-b-[0.5px] border-foreground/[0.09] bg-card px-3 text-[13px] font-medium whitespace-nowrap text-foreground/75'

const scrollbarClass =
  '[&::-webkit-scrollbar]:size-[11px] [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[3px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-thumb:hover]:bg-foreground/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track:horizontal]:mx-2 [&::-webkit-scrollbar-track:vertical]:mt-11 [&::-webkit-scrollbar-track:vertical]:mb-2'

const bodyCellClass =
  'bg-card px-3 whitespace-nowrap tabular-nums group-last:border-b-0 group-hover:bg-[color-mix(in_oklch,var(--card),var(--foreground)_3.5%)]'

function compareValues(a: DataTableValue, b: DataTableValue) {
  if (a == null) return b == null ? 0 : 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return collator.compare(String(a), String(b))
}

function PinSideIcon({ side, className }: { side: DataTablePin; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(side === 'right' && '-scale-x-100', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
    >
      <path d="M2.5 3v10M13.5 8H6M9 5 6 8l3 3" />
    </svg>
  )
}

function MenuOption({
  checked,
  children,
  icon,
  onClick,
}: {
  checked: boolean
  children: React.ReactNode
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <Menu.Item
      className="flex cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 py-2 outline-none data-highlighted:bg-foreground/6 data-highlighted:text-foreground"
      onClick={onClick}
    >
      <span className="flex size-4 items-center justify-center text-muted-foreground [&>svg]:size-4">
        {icon}
      </span>
      <span className="flex-1">{children}</span>
      {checked && (
        <svg
          aria-hidden="true"
          className="size-4 text-foreground"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          viewBox="0 0 16 16"
        >
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
      )}
    </Menu.Item>
  )
}

interface DataTableLayout<Row> {
  firstKey?: string
  firstRightKey?: string
  lastKey?: string
  lastLeftKey?: string
  left: DataTableColumn<Row>[]
  middle: DataTableColumn<Row>[]
  middleStarts: number[]
  offsets: Record<string, number>
  ordered: DataTableColumn<Row>[]
  pinnedWidth: number
  right: DataTableColumn<Row>[]
  totalWidth: number
  widths: Record<string, number>
}

function createLayout<Row>(
  sourceColumns: DataTableColumn<Row>[],
  resized: Record<string, number>,
  pins: Record<string, DataTablePin | null>,
): DataTableLayout<Row> {
  const columns = sourceColumns.map((column) =>
    column.key in pins ? { ...column, pin: pins[column.key] ?? undefined } : column,
  )
  const left = columns.filter((column) => column.pin === 'left')
  const right = columns.filter((column) => column.pin === 'right')
  const middle = columns.filter((column) => !column.pin)
  const ordered = [...left, ...middle, ...right]
  const widths: Record<string, number> = {}
  for (const column of ordered)
    widths[column.key] = resized[column.key] ?? column.width ?? DEFAULT_WIDTH

  const offsets: Record<string, number> = {}
  let leftWidth = 0
  for (const column of left) {
    offsets[column.key] = leftWidth
    leftWidth += widths[column.key]
  }
  let rightWidth = 0
  for (const column of [...right].reverse()) {
    offsets[column.key] = rightWidth
    rightWidth += widths[column.key]
  }
  const middleStarts: number[] = []
  let middleWidth = 0
  for (const column of middle) {
    middleStarts.push(middleWidth)
    middleWidth += widths[column.key]
  }

  return {
    firstKey: ordered[0]?.key,
    firstRightKey: right[0]?.key,
    lastKey: ordered.at(-1)?.key,
    lastLeftKey: left.at(-1)?.key,
    left,
    middle,
    middleStarts,
    offsets,
    ordered,
    pinnedWidth: leftWidth + rightWidth,
    right,
    totalWidth: leftWidth + middleWidth + rightWidth,
    widths,
  }
}

function visibleColumns<Row>(layout: DataTableLayout<Row>, scrollLeft: number, width: number) {
  const { middle, middleStarts, widths } = layout
  const visibleEnd = scrollLeft + Math.max(0, width - layout.pinnedWidth)
  let start = 0
  while (start < middle.length && middleStarts[start] + widths[middle[start].key] <= scrollLeft)
    start++
  let end = start
  while (end < middle.length && middleStarts[end] < visibleEnd) end++
  return [
    Math.max(0, start - COLUMN_OVERSCAN),
    Math.min(middle.length, end + COLUMN_OVERSCAN),
  ] as const
}

function cellLayout<Row>(layout: DataTableLayout<Row>, column: DataTableColumn<Row>) {
  return {
    className: cn(
      column.key === layout.firstKey && 'pl-5',
      column.key === layout.lastKey && 'pr-5',
      column.pin && 'sticky',
      column.key === layout.lastLeftKey && 'border-r-[0.5px]',
      column.key === layout.firstRightKey && 'border-l-[0.5px]',
    ),
    style: column.pin ? { [column.pin]: layout.offsets[column.key] } : undefined,
  }
}

function SpacerRow({
  colSpan,
  height,
  rowHeight,
}: {
  colSpan: number
  height: number
  rowHeight: number
}) {
  if (height <= 0) return null
  return (
    <tr aria-hidden="true" style={{ height }}>
      {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label */}
      <td
        colSpan={colSpan}
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${rowHeight - 0.5}px, color-mix(in oklch, var(--foreground) 9%, transparent) ${rowHeight - 0.5}px ${rowHeight}px)`,
        }}
      />
    </tr>
  )
}

function GapCell({ colSpan, header }: { colSpan: number; header?: boolean }) {
  if (colSpan <= 0) return null
  return header ? (
    <th aria-hidden="true" className={headerCellClass} colSpan={colSpan} />
  ) : (
    // oxlint-disable-next-line jsx-a11y/control-has-associated-label
    <td aria-hidden="true" className={cn(bodyCellClass, dividerClass)} colSpan={colSpan} />
  )
}

interface DataTableRowProps<Row> {
  columnEnd: number
  columnStart: number
  layout: DataTableLayout<Row>
  onRowClick?: (row: Row) => void
  row: Row
  rowHeight: number
  sortKey?: string
}

function DataTableRowContent<Row extends Record<string, DataTableValue>>({
  columnEnd,
  columnStart,
  layout,
  onRowClick,
  row,
  rowHeight,
  sortKey,
}: DataTableRowProps<Row>) {
  function renderCell(column: DataTableColumn<Row>) {
    const pin = cellLayout(layout, column)
    const value = row[column.key]

    return (
      <td
        className={cn(
          bodyCellClass,
          dividerClass,
          sortKey === column.key && 'bg-[color-mix(in_oklch,var(--card),var(--foreground)_1.5%)]',
          column.align === 'end' && 'text-right',
          pin.className,
          column.pin && 'z-[5]',
        )}
        key={column.key}
        style={pin.style}
      >
        <div className="truncate">{column.cell ? column.cell(row) : (value ?? '—')}</div>
      </td>
    )
  }

  return (
    <tr
      className={cn('group', onRowClick && 'cursor-pointer')}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      style={{ height: rowHeight }}
    >
      {layout.left.map(renderCell)}
      <GapCell colSpan={columnStart} />
      {layout.middle.slice(columnStart, columnEnd).map(renderCell)}
      <GapCell colSpan={layout.middle.length - columnEnd} />
      {layout.right.map(renderCell)}
    </tr>
  )
}

const DataTableRow = React.memo(DataTableRowContent) as typeof DataTableRowContent

function DataTable<Row extends Record<string, DataTableValue>>({
  className,
  columns,
  defaultSort = null,
  getRowId,
  onColumnResize,
  onRowClick,
  onColumnPinChange,
  onSortChange,
  pinnable = true,
  resizable = true,
  rowHeight = 44,
  rows,
  sort: sortProp,
  title = 'Data',
  ...props
}: DataTableProps<Row>) {
  const [internalSort, setInternalSort] = React.useState(defaultSort)
  const [viewport, setViewport] = React.useState({ top: 0, left: 0, height: 600, width: 1200 })
  const [resized, setResized] = React.useState<Record<string, number>>({})
  const [pins, setPins] = React.useState<Record<string, DataTablePin | null>>({})
  const [resizingKey, setResizingKey] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const sort = sortProp === undefined ? internalSort : sortProp

  const sortedRows = React.useMemo(() => {
    if (!sort) return rows
    const sign = sort.direction === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => sign * compareValues(a[sort.key], b[sort.key]))
  }, [rows, sort])

  const layout = React.useMemo(() => createLayout(columns, resized, pins), [columns, resized, pins])

  React.useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    const observer = new ResizeObserver(() =>
      setViewport((current) => ({
        ...current,
        height: element.clientHeight,
        width: element.clientWidth,
      })),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const start = Math.max(0, Math.floor(viewport.top / rowHeight) - OVERSCAN)
  const end = Math.min(
    sortedRows.length,
    Math.ceil((viewport.top + viewport.height) / rowHeight) + OVERSCAN,
  )
  const [columnStart, columnEnd] = visibleColumns(layout, viewport.left, viewport.width)
  const visibleRows = sortedRows.slice(start, end)
  const paddingTop = start * rowHeight
  const paddingBottom = (sortedRows.length - end) * rowHeight

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollLeft, scrollTop } = event.currentTarget
    setViewport((current) => {
      const sameRows = Math.floor(current.top / rowHeight) === Math.floor(scrollTop / rowHeight)
      const [currentStart, currentEnd] = visibleColumns(layout, current.left, current.width)
      const [nextStart, nextEnd] = visibleColumns(layout, scrollLeft, current.width)
      return sameRows && currentStart === nextStart && currentEnd === nextEnd
        ? current
        : { ...current, top: scrollTop, left: scrollLeft }
    })
  }

  function resizeTo(column: DataTableColumn<Row>, width: number) {
    const next = Math.max(column.minWidth ?? MIN_WIDTH, Math.round(width))
    setResized((current) =>
      current[column.key] === next ? current : { ...current, [column.key]: next },
    )
    return next
  }

  function startResize(event: React.PointerEvent<HTMLButtonElement>, column: DataTableColumn<Row>) {
    if (event.button !== 0) return
    event.preventDefault()
    const handle = event.currentTarget
    const startX = event.clientX
    const startWidth = layout.widths[column.key]
    const direction = column.pin === 'right' ? -1 : 1
    let width = startWidth

    handle.setPointerCapture(event.pointerId)
    setResizingKey(column.key)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    function move(moveEvent: PointerEvent) {
      width = resizeTo(column, startWidth + (moveEvent.clientX - startX) * direction)
    }

    function stop() {
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', stop)
      handle.removeEventListener('pointercancel', stop)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setResizingKey(null)
      if (width !== startWidth) onColumnResize?.(column.key, width)
    }

    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', stop)
    handle.addEventListener('pointercancel', stop)
  }

  function resizeWithKeyboard(
    event: React.KeyboardEvent<HTMLButtonElement>,
    column: DataTableColumn<Row>,
  ) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const grow = (event.key === 'ArrowRight') === (column.pin !== 'right')
    const width = resizeTo(
      column,
      layout.widths[column.key] + (grow ? KEYBOARD_STEP : -KEYBOARD_STEP),
    )
    onColumnResize?.(column.key, width)
  }

  function resetWidth(column: DataTableColumn<Row>) {
    setResized((current) => {
      const next = { ...current }
      delete next[column.key]
      return next
    })
    onColumnResize?.(column.key, column.width ?? DEFAULT_WIDTH)
  }

  const headerColumns: (DataTableColumn<Row> | 'before' | 'after')[] = [
    ...layout.left,
    'before',
    ...layout.middle.slice(columnStart, columnEnd),
    'after',
    ...layout.right,
  ]

  function sortBy(key: string, direction: DataTableSort['direction']) {
    const next = sort?.key === key && sort.direction === direction ? null : { key, direction }
    if (sortProp === undefined) setInternalSort(next)
    onSortChange?.(next)
  }

  function pinTo(column: DataTableColumn<Row>, side: DataTablePin | null) {
    const next = column.pin === side ? null : side
    setPins((current) => ({ ...current, [column.key]: next }))
    onColumnPinChange?.(column.key, next)
  }

  return (
    <section
      data-slot="data-table"
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-[16px] bg-(--table-header) font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card [--table-header:color-mix(in_oklch,var(--card),var(--foreground)_5%)]',
        className,
      )}
      {...props}
    >
      <header className="flex min-h-13 shrink-0 items-center gap-2 px-5 py-3">
        <span className="flex size-7 items-center justify-center rounded-lg bg-foreground/6 text-foreground/80">
          <TableIcon className="size-4" />
        </span>
        <h3 className="card-heading text-foreground">{title}</h3>
      </header>
      <div className="mx-1 mb-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-card shadow-card">
        <div
          className={cn(
            'min-h-0 flex-1 overflow-auto overscroll-contain bg-card [overflow-anchor:none]',
            scrollbarClass,
          )}
          onScroll={handleScroll}
          ref={scrollRef}
        >
          <table
            className="table-fixed border-separate border-spacing-0 text-[13px] leading-5"
            style={{ width: layout.totalWidth }}
          >
            <colgroup>
              {layout.ordered.map((column) => (
                <col key={column.key} style={{ width: layout.widths[column.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {headerColumns.map((column) => {
                  if (column === 'before' || column === 'after')
                    return (
                      <GapCell
                        colSpan={
                          column === 'before' ? columnStart : layout.middle.length - columnEnd
                        }
                        header
                        key={column}
                      />
                    )
                  const pin = cellLayout(layout, column)
                  const canResize = resizable && column.resizable !== false
                  const resizing = resizingKey === column.key
                  const sortable = column.sortable !== false
                  const canPin = pinnable && column.pinnable !== false
                  const direction = sort?.key === column.key ? sort.direction : null
                  const end = column.align === 'end'
                  const Icon = column.icon
                  const label = (
                    <>
                      {Icon && <Icon className="size-3.5 shrink-0 opacity-70" />}
                      <span className="truncate">{column.header}</span>
                    </>
                  )
                  const arrow = direction && (
                    <AltArrowDownIcon
                      aria-hidden="true"
                      className={cn(
                        'size-3.5 shrink-0 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
                        direction === 'asc' && 'rotate-180',
                      )}
                    />
                  )

                  return (
                    <th
                      aria-sort={
                        direction === 'asc'
                          ? 'ascending'
                          : direction === 'desc'
                            ? 'descending'
                            : undefined
                      }
                      className={cn(
                        'group/th',
                        headerCellClass,
                        end ? 'text-right' : 'text-left',
                        pin.className,
                        column.pin && 'z-20',
                        column.pin && canPin && (end ? 'pl-9' : 'pr-9'),
                      )}
                      key={column.key}
                      scope="col"
                      style={pin.style}
                    >
                      {sortable || canPin ? (
                        <Menu.Root>
                          <Menu.Trigger
                            className={cn(
                              '-mx-1.5 inline-flex max-w-[calc(100%+0.75rem)] cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors duration-150 ease-out outline-none hover:bg-foreground/6 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 data-popup-open:bg-foreground/6 data-popup-open:text-foreground',
                              direction && 'text-foreground',
                            )}
                          >
                            {end && arrow}
                            {label}
                            {!end && arrow}
                          </Menu.Trigger>
                          <Menu.Portal>
                            <Menu.Positioner
                              align={end ? 'end' : 'start'}
                              className="z-50"
                              side="bottom"
                              sideOffset={6}
                            >
                              <Menu.Popup className="min-w-44 origin-(--transform-origin) rounded-[14px] bg-card p-1 font-sans text-sm font-[450] tracking-[-0.05px] text-foreground/85 shadow-card transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-opacity">
                                {sortable && (
                                  <>
                                    <MenuOption
                                      checked={direction === 'asc'}
                                      icon={<ArrowUpIcon />}
                                      onClick={() => sortBy(column.key, 'asc')}
                                    >
                                      Asc
                                    </MenuOption>
                                    <MenuOption
                                      checked={direction === 'desc'}
                                      icon={<ArrowDownIcon />}
                                      onClick={() => sortBy(column.key, 'desc')}
                                    >
                                      Desc
                                    </MenuOption>
                                  </>
                                )}
                                {sortable && canPin && (
                                  <Menu.Separator className="mx-1 my-1 h-px bg-foreground/[0.08]" />
                                )}
                                {canPin && (
                                  <>
                                    <MenuOption
                                      checked={column.pin === 'left'}
                                      icon={<PinSideIcon side="left" />}
                                      onClick={() => pinTo(column, 'left')}
                                    >
                                      Pin to left
                                    </MenuOption>
                                    <MenuOption
                                      checked={column.pin === 'right'}
                                      icon={<PinSideIcon side="right" />}
                                      onClick={() => pinTo(column, 'right')}
                                    >
                                      Pin to right
                                    </MenuOption>
                                  </>
                                )}
                              </Menu.Popup>
                            </Menu.Positioner>
                          </Menu.Portal>
                        </Menu.Root>
                      ) : (
                        <span className="inline-flex max-w-full items-center gap-1.5">{label}</span>
                      )}
                      {column.pin && canPin && (
                        <button
                          aria-label={`Unpin ${column.header}`}
                          className={cn(
                            'absolute top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground/70 transition-colors duration-150 ease-out outline-none hover:bg-foreground/6 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40',
                            end ? 'left-3' : 'right-3',
                          )}
                          onClick={() => pinTo(column, null)}
                          type="button"
                        >
                          <PinIcon className="size-3.5" />
                        </button>
                      )}
                      {canResize && (
                        <button
                          aria-label={`Resize ${column.header}`}
                          className={cn(
                            "absolute inset-y-0 z-10 flex w-2.5 cursor-col-resize touch-none justify-center outline-none before:my-2.5 before:w-0.5 before:rounded-full before:bg-foreground/25 before:opacity-0 before:transition-opacity before:duration-150 before:content-[''] group-hover/th:before:opacity-60 hover:before:opacity-100 focus-visible:before:bg-ring focus-visible:before:opacity-100",
                            column.pin === 'right' ? '-left-px' : '-right-px',
                            resizing && 'before:bg-foreground/50 before:opacity-100',
                          )}
                          onDoubleClick={() => resetWidth(column)}
                          onKeyDown={(event) => resizeWithKeyboard(event, column)}
                          onPointerDown={(event) => startResize(event, column)}
                          type="button"
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              <SpacerRow
                colSpan={layout.ordered.length}
                height={paddingTop}
                rowHeight={rowHeight}
              />
              {visibleRows.map((row, offset) => (
                <DataTableRow
                  columnEnd={columnEnd}
                  columnStart={columnStart}
                  key={getRowId?.(row, start + offset) ?? start + offset}
                  layout={layout}
                  onRowClick={onRowClick}
                  row={row}
                  rowHeight={rowHeight}
                  sortKey={sort?.key}
                />
              ))}
              <SpacerRow
                colSpan={layout.ordered.length}
                height={paddingBottom}
                rowHeight={rowHeight}
              />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export { DataTable }
export type { DataTableColumn, DataTablePin, DataTableProps, DataTableSort, DataTableValue }
