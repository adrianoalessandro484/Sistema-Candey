import { tableFeatures, useTable } from '@tanstack/react-table'
import EmptyState from './EmptyState.jsx'

const features = tableFeatures({})
const EMPTY_ROWS = []
const SKELETON_ROWS = [0, 1, 2, 3, 4, 5]

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
      <div className="table-shell" role="status" aria-label="Cargando registros">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left" style={{ minWidth }}>
            <thead>
              <tr className="border-b border-line-strong bg-surface-2">
                {columns.map((column, index) => (
                  <th
                    key={column.id ?? index}
                    className={`px-5 py-4 text-[11.5px] font-bold tracking-[0.09em] whitespace-nowrap text-muted uppercase ${
                      column.meta?.headerClassName ?? ''
                    }`}
                  >
                    {typeof column.header === 'string' ? column.header : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SKELETON_ROWS.map((rowIndex) => (
                <tr key={rowIndex} className="border-b border-line last:border-0">
                  {columns.map((column, colIndex) => (
                    <td key={column.id ?? colIndex} className="px-5 py-4">
                      <div
                        className={`h-5 animate-pulse rounded-lg bg-line/70 ${
                          colIndex === 0
                            ? 'w-44'
                            : colIndex === columns.length - 1
                              ? 'ml-auto w-28'
                              : 'w-24'
                        }`}
                      />
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
              <tr key={headerGroup.id} className="border-b border-line-strong bg-surface-2/95">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-5 py-4 text-[11.5px] font-bold tracking-[0.09em] whitespace-nowrap text-muted uppercase ${
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
                className="border-b border-line transition-colors duration-150 last:border-0 hover:bg-candey-50/45"
              >
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-5 py-4 align-middle text-[14px] text-body ${
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
