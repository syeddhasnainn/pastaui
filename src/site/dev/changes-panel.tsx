import { useId, useState } from 'react'
import AltArrowRightIcon from '~icons/solar/alt-arrow-right-linear'
import CloseIcon from '~icons/solar/close-linear'
import CopyIcon from '~icons/solar/copy-linear'

import {
  cascadeSummary,
  moveSummary,
  toJson,
  toMarkdown,
  type LoggedCascade,
  type LoggedElement,
} from '#/site/dev/log'
import { buttonClass, focusRing, hairline, hintClass, muted } from '#/site/dev/styles'
import type { Key } from '#/site/dev/values'
import { cn } from '#/lib/utils'

interface ChangesPanelProps {
  log: LoggedElement[]
  onClear: () => void
  onCopy: (text: string, message: string) => void
  onRemoveCascade: (id: string, key: Key) => void
  onRemoveChange: (id: string, key: Key) => void
  onRemoveEntry: (id: string) => void
  onResetAll: () => void
  onResetMove: (id: string) => void
  onRestore: (id: string) => void
  pathname: string
}

export function ChangesPanel({
  log,
  onClear,
  onCopy,
  onRemoveCascade,
  onRemoveChange,
  onRemoveEntry,
  onResetAll,
  onResetMove,
  onRestore,
  pathname,
}: ChangesPanelProps) {
  const empty = !log.length

  return (
    <div className="grid gap-2 px-3 pb-3">
      {empty ? (
        <p className={hintClass}>
          No changes yet. Edits you make are logged here with before and after values.
        </p>
      ) : (
        <ul aria-label="Logged changes" className="grid gap-2">
          {log.map((entry) => (
            <ChangeEntry
              entry={entry}
              key={entry.id}
              onCopy={onCopy}
              onRemoveCascade={onRemoveCascade}
              onRemoveChange={onRemoveChange}
              onRemoveEntry={onRemoveEntry}
              onResetMove={onResetMove}
              onRestore={onRestore}
              pathname={pathname}
            />
          ))}
        </ul>
      )}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          className={buttonClass}
          disabled={empty}
          onClick={() => onCopy(toMarkdown(log), 'Copied all changes')}
          type="button"
        >
          Copy all changes
        </button>
        <button
          className={buttonClass}
          disabled={empty}
          onClick={() => onCopy(toJson(log), 'Copied JSON')}
          type="button"
        >
          Copy as JSON
        </button>
        <button className={buttonClass} disabled={empty} onClick={onClear} type="button">
          Clear log
        </button>
        <button className={buttonClass} disabled={empty} onClick={onResetAll} type="button">
          Reset all
        </button>
      </div>
      <p className={cn(hintClass, 'text-[10.5px]')}>
        Clear log keeps the edits on the page. Reset all reverts them and clears the log.
      </p>
    </div>
  )
}

interface ChangeEntryProps {
  entry: LoggedElement
  onCopy: ChangesPanelProps['onCopy']
  onRemoveCascade: ChangesPanelProps['onRemoveCascade']
  onRemoveChange: ChangesPanelProps['onRemoveChange']
  onRemoveEntry: ChangesPanelProps['onRemoveEntry']
  onResetMove: ChangesPanelProps['onResetMove']
  onRestore: ChangesPanelProps['onRestore']
  pathname: string
}

function ChangeEntry({
  entry,
  onCopy,
  onRemoveCascade,
  onRemoveChange,
  onRemoveEntry,
  onResetMove,
  onRestore,
  pathname,
}: ChangeEntryProps) {
  const name = `${entry.tag}${entry.text ? ` “${entry.text}”` : ''}`

  return (
    <li className={cn('grid gap-1.5 rounded-lg border-[0.5px] p-2', hairline)}>
      <div className="flex items-start gap-1">
        <div className="grid min-w-0 flex-1 gap-0.5">
          <p className="truncate font-[600]">{name}</p>
          <p className={cn('truncate font-mono text-[10px] leading-4', muted)}>{entry.selector}</p>
          {entry.component ? (
            <p className={cn('truncate text-[10px] leading-4', muted)}>{entry.component}</p>
          ) : null}
          {entry.url === pathname ? null : (
            <p className={cn('text-[10px] leading-4', muted)}>{`on ${entry.url}`}</p>
          )}
        </div>
        <button
          aria-label={`Copy changes for ${name}`}
          className={cn(buttonClass, 'size-7 shrink-0 px-0')}
          onClick={() => onCopy(toMarkdown([entry]), 'Copied element changes')}
          type="button"
        >
          <CopyIcon aria-hidden="true" className="size-3.5" />
        </button>
        <button
          aria-label={`Revert and remove ${name}`}
          className={cn(buttonClass, 'size-7 shrink-0 px-0')}
          onClick={() => onRemoveEntry(entry.id)}
          type="button"
        >
          <CloseIcon aria-hidden="true" className="size-3.5" />
        </button>
      </div>
      <ul aria-label={`Changes for ${name}`} className="grid gap-1">
        {entry.removed ? (
          <li className="flex items-center gap-1 font-mono text-[10.5px] leading-4">
            <span className="min-w-0 flex-1 text-red-600 dark:text-red-400">
              removed{entry.changes.length ? ' (supersedes style edits)' : ''}
            </span>
            <button
              aria-label={`Restore ${name}`}
              className={cn(buttonClass, 'size-6 shrink-0 border-transparent px-0')}
              onClick={() => onRestore(entry.id)}
              type="button"
            >
              <CloseIcon aria-hidden="true" className="size-3" />
            </button>
          </li>
        ) : null}
        {entry.moved ? (
          <li className="flex items-center gap-1 font-mono text-[10.5px] leading-4">
            <span className="min-w-0 flex-1 break-all">
              <span className={muted}>moved: </span>
              {`Δx ${entry.moved.dx}, Δy ${entry.moved.dy} px (${moveSummary(entry.moved)})`}
              {entry.moved.grid ? (
                <span className={cn('block', muted)}>{entry.moved.grid.text}</span>
              ) : null}
            </span>
            <button
              aria-label={`Undo move on ${name}`}
              className={cn(buttonClass, 'size-6 shrink-0 border-transparent px-0')}
              onClick={() => onResetMove(entry.id)}
              type="button"
            >
              <CloseIcon aria-hidden="true" className="size-3" />
            </button>
          </li>
        ) : null}
        {entry.cascades?.map((cascade) => (
          <CascadeRow
            cascade={cascade}
            key={cascade.key}
            name={name}
            onRemove={() => onRemoveCascade(entry.id, cascade.key)}
          />
        ))}
        {entry.changes.map((change) => (
          <li
            className="flex items-center gap-1 font-mono text-[10.5px] leading-4"
            key={change.key}
          >
            <span className="min-w-0 flex-1 break-all">
              <span className={muted}>{`${change.property}: `}</span>
              {`${change.before} → ${change.after}`}
            </span>
            <button
              aria-label={`Revert ${change.property} on ${name}`}
              className={cn(buttonClass, 'size-6 shrink-0 border-transparent px-0')}
              onClick={() => onRemoveChange(entry.id, change.key)}
              type="button"
            >
              <CloseIcon aria-hidden="true" className="size-3" />
            </button>
          </li>
        ))}
      </ul>
    </li>
  )
}

interface CascadeRowProps {
  cascade: LoggedCascade
  name: string
  onRemove: () => void
}

function CascadeRow({ cascade, name, onRemove }: CascadeRowProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const shown = cascade.children.slice(0, 100)

  return (
    <li className="grid gap-1 font-mono text-[10.5px] leading-4" data-cascade={cascade.key}>
      <div className="flex items-start gap-1">
        <button
          aria-controls={id}
          aria-expanded={open}
          aria-label={`${open ? 'Hide' : 'Show'} affected elements for ${cascade.property}`}
          className={cn(
            'mt-px flex size-4 shrink-0 items-center justify-center rounded',
            muted,
            focusRing,
          )}
          onClick={() => setOpen(!open)}
          type="button"
        >
          <AltArrowRightIcon aria-hidden="true" className={cn('size-3', open && 'rotate-90')} />
        </button>
        <span className="min-w-0 flex-1 break-words">
          {cascadeSummary(cascade)}
          <span className={cn('block', muted)}>
            {cascade.mode === 'exact' ? 'exact' : 'proportional'}
          </span>
          {cascade.skipped ? (
            <span className="block text-amber-700 dark:text-amber-400">
              {`Capped: ${cascade.skipped} text elements skipped`}
            </span>
          ) : null}
        </span>
        <button
          aria-label={`Revert ${cascade.property} on all text in ${name}`}
          className={cn(buttonClass, 'size-6 shrink-0 border-transparent px-0')}
          onClick={onRemove}
          type="button"
        >
          <CloseIcon aria-hidden="true" className="size-3" />
        </button>
      </div>
      {open ? (
        <ul
          aria-label={`Elements affected by ${cascade.property}`}
          className={cn('grid max-h-40 gap-0.5 overflow-auto overscroll-contain pl-5', muted)}
          id={id}
        >
          {shown.map((child) => (
            <li className="break-all" key={child.selector} title={child.selector}>
              <span className="text-neutral-900/88 dark:text-neutral-100/90">{child.label}</span>
              {` ${child.before} → ${child.after}`}
            </li>
          ))}
          {cascade.children.length > shown.length ? (
            <li>{`…and ${cascade.children.length - shown.length} more`}</li>
          ) : null}
        </ul>
      ) : null}
    </li>
  )
}
