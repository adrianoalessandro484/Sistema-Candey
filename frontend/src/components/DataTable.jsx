import { tableFeatures, useTable } from '@tanstack/react-table'
import EmptyState from './EmptyState.jsx'
import Spinner from './Spinner.jsx'

const features = tableFeatures({})
const EMPTY_ROWS = []

export default function DataTable({
  columns,
  data,
  loading = false,
  minWidth = '900px',
  emptyTitle = 'Sin registros',
  emptyDescription,
  emptyIcon,
}) {
  const table = useTable({
    features,
    columns,
    data: data ?? EMPTY_ROWS,
  })

  if (loading) {
    return (
      <div className="table-shell flex min-h-52 items-center justify-center gap-2 py-16 text-sm text-muted">
        <Spinner className="size-5 text-candey" />
        Cargando registros...
      </div>
    )
  }

  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
    )
  }

  return (
    <div className="table-shell">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left" style={{ minWidth }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-line-strong bg-surface-2">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-5 py-3.5 text-[11px] font-bold tracking-[0.09em] whitespace-nowrap text-muted uppercase ${
                      header.column.columnDef.meta?.headerClassName ?? ''
                    }`}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-line transition-colors last:border-0 hover:bg-candey-50/35"
              >
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-5 py-4 align-middle text-[13.5px] text-body ${
                      cell.column.columnDef.meta?.cellClassName ?? ''
                    }`}
                  >
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
