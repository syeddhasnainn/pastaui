// Vite exposes raw file contents as a default export.
// oxlint-disable-next-line import/default
import dataTableSource from '#/components/ai/data-table.tsx?raw'
import { createAiDocument } from './create-ai-document'

export const aiStructuredOutputComponents = [
  createAiDocument({
    slug: 'audio-player',
    name: 'Audio Player',
    description:
      'A controlled playback surface for speech, generated audio, and recorded tool output.',
    usage: `import { AudioPlayer } from "@/components/ai/audio-player"

export function Example() {
  return <AudioPlayer title="Briefing" currentTime={42} duration={186} />
}`,
    source: `<section>
  <AudioIdentity title={title} subtitle={subtitle} />
  <PlaybackButton isPlaying={isPlaying} />
  <Slider value={currentTime} max={duration} />
</section>`,
    api: [
      {
        name: 'currentTime',
        type: 'number',
        defaultValue: '—',
        description: 'Controls the playback position in seconds.',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '—',
        description: 'Defines the full audio duration.',
      },
      { name: 'onToggle', type: '() => void', defaultValue: '—', description: 'Toggles playback.' },
      {
        name: 'artworkUrl',
        type: 'string',
        defaultValue: '—',
        description: 'Displays cover art beside the track details.',
      },
      {
        name: 'onPrevious',
        type: '() => void',
        defaultValue: '—',
        description: 'Selects the previous track; otherwise rewinds 10 seconds using onChange.',
      },
      {
        name: 'onNext',
        type: '() => void',
        defaultValue: '—',
        description: 'Selects the next track; otherwise advances 10 seconds using onChange.',
      },
      {
        name: 'onOutput',
        type: '() => void',
        defaultValue: '—',
        description: 'Opens your audio-output picker when provided.',
      },
      {
        name: 'onChange',
        type: '(time: number) => void',
        defaultValue: '—',
        description: 'Seeks to a new playback position.',
      },
    ],
  }),
  createAiDocument({
    slug: 'data-table',
    name: 'Data Table',
    description:
      'A virtualized, sortable table with resizable columns, a sticky header, and left or right pinned columns for scanning dozens of fields at once.',
    usage: `import { DataTable } from "@/components/ai/data-table"

export function Example() {
  return (
    <DataTable
      className="max-h-[480px]"
      columns={[
        { key: "id", header: "Run", width: 120, pin: "left" },
        { key: "model", header: "Model" },
        { key: "cost", header: "Cost", align: "end", pin: "right", cell: (row) => \`$\${row.cost.toFixed(2)}\` },
      ]}
      getRowId={(row) => row.id}
      rows={runs}
      title="Agent runs"
    />
  )
}`,
    source: dataTableSource,
    api: [
      {
        name: 'columns',
        type: 'DataTableColumn<Row>[]',
        defaultValue: '—',
        description:
          'Column definitions with key, header, icon, width, minWidth, alignment, pin side, a custom cell renderer, and sortable or resizable flags.',
      },
      {
        name: 'rows',
        type: 'Row[]',
        defaultValue: '—',
        description: 'Flat records keyed by column. Sorting compares these raw values.',
      },
      {
        name: 'getRowId',
        type: '(row: Row, index: number) => string',
        defaultValue: 'index',
        description: 'Returns a stable key for each row.',
      },
      {
        name: 'pinnable',
        type: 'boolean',
        defaultValue: 'true',
        description:
          'Adds Pin to left and Pin to right to each header menu. Column pin sets the initial side.',
      },
      {
        name: 'onColumnPinChange',
        type: "(key: string, pin: 'left' | 'right' | null) => void",
        defaultValue: '—',
        description: 'Called when a column is pinned, moved to the other side, or unpinned.',
      },
      {
        name: 'resizable',
        type: 'boolean',
        defaultValue: 'true',
        description:
          'Shows a resize handle on each header edge. Drag it, use the arrow keys, or double-click to reset.',
      },
      {
        name: 'onColumnResize',
        type: '(key: string, width: number) => void',
        defaultValue: '—',
        description:
          'Called with the final width after a column is resized, for persisting layouts.',
      },
      {
        name: 'rowHeight',
        type: 'number',
        defaultValue: '44',
        description: 'Fixed row height used for virtualization.',
      },
      {
        name: 'sort',
        type: 'DataTableSort | null',
        defaultValue: '—',
        description: 'Controls the active sort. Use defaultSort for uncontrolled sorting.',
      },
      {
        name: 'onSortChange',
        type: '(sort: DataTableSort | null) => void',
        defaultValue: '—',
        description:
          'Called when a sort is chosen from a header menu. Choosing the active sort again clears it.',
      },
      {
        name: 'onRowClick',
        type: '(row: Row) => void',
        defaultValue: '—',
        description: 'Makes rows clickable, for example to open a trace.',
      },
    ],
  }),
]
