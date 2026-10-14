import { AltArrowRightIcon as ChevronRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { FileCodeIcon as FileCode2Icon } from '@solar-icons/react/linear/file-code'
import { FileIcon } from '@solar-icons/react/linear/file'
import { FolderIcon } from '@solar-icons/react/linear/folder'
import { FolderOpenIcon } from '@solar-icons/react/linear/folder-open'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import * as React from 'react'

import { cn } from 'cn'

interface FileTreeItem {
  depth?: number
  expanded?: boolean
  id: string
  kind: 'file' | 'folder'
  name: string
  status?: 'added' | 'deleted' | 'modified'
}

interface FileTreeProps extends Omit<React.ComponentProps<'section'>, 'onSelect'> {
  defaultSelectedId?: string
  items: FileTreeItem[]
  onSelect?: (id: string) => void
  selectedId?: string
  title?: string
}

interface TreeNode extends FileTreeItem {
  children: TreeNode[]
  changes: number
  parentId?: string
}

const statusCopy = { added: 'A', deleted: 'D', modified: 'M' }
const statusLabel = { added: 'Added', deleted: 'Deleted', modified: 'Modified' }
const ease = [0.23, 1, 0.32, 1] as const

function buildTree(items: FileTreeItem[]) {
  const roots: TreeNode[] = []
  const stack: TreeNode[] = []
  for (const item of items) {
    const depth = item.depth ?? 0
    stack.length = Math.min(stack.length, depth)
    const parent = stack[depth - 1]
    const node: TreeNode = {
      ...item,
      children: [],
      changes: item.status ? 1 : 0,
      parentId: parent?.id,
    }
    ;(parent ? parent.children : roots).push(node)
    stack[depth] = node
  }
  const count = (node: TreeNode): number => {
    if (node.kind === 'folder')
      node.changes = node.children.reduce((sum, child) => sum + count(child), 0)
    return node.changes
  }
  roots.forEach(count)
  return roots
}

function FileTree({
  className,
  defaultSelectedId,
  items,
  onSelect,
  selectedId,
  title = 'Files',
  ...props
}: FileTreeProps) {
  const tree = React.useMemo(() => buildTree(items), [items])
  const [expanded, setExpanded] = React.useState(
    () =>
      new Set(
        items.filter((item) => item.kind === 'folder' && item.expanded).map((item) => item.id),
      ),
  )
  const [internalSelected, setInternalSelected] = React.useState(defaultSelectedId)
  const selected = selectedId ?? internalSelected
  const [focusedId, setFocusedId] = React.useState(selected ?? items[0]?.id)
  const refs = React.useRef(new Map<string, HTMLLIElement>())
  const rows = React.useRef(new Map<string, HTMLDivElement>())
  const listRef = React.useRef<HTMLDivElement>(null)
  const indicatorRef = React.useRef<HTMLSpanElement>(null)
  const [hoveredId, setHoveredId] = React.useState<string>()
  const [indicator, setIndicator] = React.useState<{ height: number; top: number }>()
  const totalChanges = tree.reduce((sum, node) => sum + node.changes, 0)

  const visible: TreeNode[] = []
  const walk = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      visible.push(node)
      if (node.kind === 'folder' && expanded.has(node.id)) walk(node.children)
    }
  }
  walk(tree)

  const indicatorId = hoveredId ?? selected

  const measure = React.useCallback(() => {
    const container = listRef.current
    const row = indicatorId ? rows.current.get(indicatorId) : undefined
    if (!container || !row) return setIndicator(undefined)
    const top = row.getBoundingClientRect().top - container.getBoundingClientRect().top
    setIndicator({ height: row.offsetHeight, top })
  }, [indicatorId])

  React.useLayoutEffect(() => {
    measure()
  }, [measure, expanded, items])

  React.useEffect(() => {
    const container = listRef.current
    if (!container) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(container.firstElementChild ?? container)
    return () => observer.disconnect()
  }, [measure])

  React.useEffect(() => {
    const frame = requestAnimationFrame(() =>
      indicatorRef.current?.setAttribute('data-ready', 'true'),
    )
    return () => cancelAnimationFrame(frame)
  }, [])

  function toggle(id: string, open?: boolean) {
    setExpanded((current) => {
      const next = new Set(current)
      if (open ?? !next.has(id)) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function select(node: TreeNode) {
    if (node.kind === 'folder') return toggle(node.id)
    if (selectedId === undefined) setInternalSelected(node.id)
    onSelect?.(node.id)
  }

  function focus(id: string | undefined) {
    if (!id) return
    setFocusedId(id)
    refs.current.get(id)?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent, node: TreeNode) {
    const index = visible.findIndex((item) => item.id === node.id)
    const open = node.kind === 'folder' && expanded.has(node.id)
    const keys: Record<string, () => void> = {
      ArrowDown: () => focus(visible[index + 1]?.id),
      ArrowUp: () => focus(visible[index - 1]?.id),
      Home: () => focus(visible[0]?.id),
      End: () => focus(visible.at(-1)?.id),
      ArrowRight: () =>
        node.kind !== 'folder'
          ? undefined
          : open
            ? focus(node.children[0]?.id)
            : toggle(node.id, true),
      ArrowLeft: () => (open ? toggle(node.id, false) : focus(node.parentId)),
      Enter: () => select(node),
      ' ': () => select(node),
    }
    if (!keys[event.key]) return
    event.preventDefault()
    keys[event.key]()
  }

  function renderNodes(nodes: TreeNode[]): React.ReactNode {
    return nodes.map((node) => {
      const depth = node.depth ?? 0
      const isFolder = node.kind === 'folder'
      const isOpen = isFolder && expanded.has(node.id)
      const isSelected = node.id === selected
      const tabbable =
        node.id === (visible.some((item) => item.id === focusedId) ? focusedId : visible[0]?.id)
      const FileGlyph = /\.tsx?$/.test(node.name) ? FileCode2Icon : FileIcon

      return (
        <li
          aria-expanded={isFolder ? isOpen : undefined}
          aria-level={depth + 1}
          aria-selected={isFolder ? undefined : isSelected}
          className="outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-ring/30"
          key={node.id}
          onBlur={(event) => {
            event.stopPropagation()
            if (!event.currentTarget.closest('[role="tree"]')?.contains(event.relatedTarget))
              setHoveredId(undefined)
          }}
          onFocus={(event) => {
            event.stopPropagation()
            setFocusedId(node.id)
            if (event.currentTarget.matches(':focus-visible')) setHoveredId(node.id)
          }}
          onKeyDown={(event) => {
            event.stopPropagation()
            onKeyDown(event, node)
          }}
          ref={(element) => {
            if (element) refs.current.set(node.id, element)
            else refs.current.delete(node.id)
          }}
          role="treeitem"
          tabIndex={tabbable ? 0 : -1}
        >
          {/* Keyboard input is handled by the treeitem; the row only adds pointer selection. */}
          {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className={cn(
              'relative z-10 flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-sm transition-[color] duration-150 ease-[ease] hover:text-foreground',
              isSelected && 'text-foreground',
            )}
            onMouseEnter={() => setHoveredId(node.id)}
            ref={(element) => {
              if (element) rows.current.set(node.id, element)
              else rows.current.delete(node.id)
            }}
            onClick={() => {
              setFocusedId(node.id)
              select(node)
            }}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            {isFolder ? (
              <>
                <ChevronRightIcon
                  aria-hidden="true"
                  className={cn(
                    'size-3.5 text-muted-foreground transition-[rotate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
                    isOpen && 'rotate-90',
                  )}
                />
                {isOpen ? (
                  <FolderOpenIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                ) : (
                  <FolderIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5" />
                <FileGlyph aria-hidden="true" className="size-4 text-muted-foreground" />
              </>
            )}
            <span className="min-w-0 flex-1 truncate">{node.name}</span>
            {node.status ? (
              <span
                className={cn(
                  'text-[10px] font-medium',
                  node.status === 'added' && 'text-emerald-600',
                  node.status === 'deleted' && 'text-destructive',
                  node.status === 'modified' && 'text-amber-600',
                )}
              >
                <span aria-hidden="true">{statusCopy[node.status]}</span>
                <span className="sr-only">{statusLabel[node.status]}</span>
              </span>
            ) : (
              isFolder &&
              node.changes > 0 &&
              !isOpen && (
                <span className="text-[10px] font-medium tabular-nums">
                  {node.changes}
                  <span className="sr-only"> changes</span>
                </span>
              )
            )}
          </div>
          {isFolder && (
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  animate={{ height: 'auto', opacity: 1 }}
                  className="overflow-hidden"
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease }}
                >
                  {/* role="group" is the ARIA tree pattern for nested items. */}
                  {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
                  <ul className="space-y-0.5 pt-0.5" role="group">
                    {renderNodes(node.children)}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </li>
      )
    })
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        data-slot="file-tree"
        className={cn(
          'rounded-[16px] bg-card p-2 font-sans text-sm font-[450] tracking-[-0.05px] text-muted-foreground shadow-card',
          className,
        )}
        {...props}
      >
        <header className="flex items-center gap-2 px-2 py-1.5">
          <h3 className="card-heading text-muted-foreground">{title}</h3>
          {totalChanges > 0 && (
            <span className="ml-auto text-xs leading-5 tabular-nums">
              {totalChanges} {totalChanges === 1 ? 'change' : 'changes'}
            </span>
          )}
        </header>
        <div className="relative mt-1" onMouseLeave={() => setHoveredId(undefined)} ref={listRef}>
          <ul aria-label={title} className="space-y-0.5" role="tree">
            {renderNodes(tree)}
          </ul>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-0 rounded-md bg-[color-mix(in_oklch,var(--foreground)_7%,transparent)] data-[ready=true]:transition-[top,height,opacity] data-[ready=true]:duration-[220ms] data-[ready=true]:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:data-[ready=true]:transition-opacity dark:bg-muted"
            ref={indicatorRef}
            style={{
              height: indicator?.height ?? 0,
              opacity: indicator ? 1 : 0,
              top: indicator?.top ?? 0,
            }}
          />
        </div>
      </section>
    </MotionConfig>
  )
}

export { FileTree }
export type { FileTreeItem, FileTreeProps }
