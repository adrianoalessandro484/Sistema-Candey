import { useMemo } from 'react'
import { Ban, ClipboardList, Eye } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import IconButton from '../IconButton.jsx'
import { formatCurrency, formatShortDate } from '../../utils/format.js'

export default function EntriesTable({ entries, onView, onCancel, loading }) {
  const columns = useMemo(
    () => [
      {
        id: 'code',
        header: 'Documento',
        accessorFn: (row) => row.code,
        cell: ({ getValue }) => <span className="font-semibold text-ink">{getValue()}</span>,
      },
      {
        id: 'date',
        header: 'Fecha',
        accessorFn: (row) => row.date,
        cell: ({ getValue }) => <span className="text-muted">{formatShortDate(getValue())}</span>,
      },
      {
        id: 'supplier',
        header: 'Proveedor',
        accessorFn: (row) => row.supplierName,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'products',
        header: 'Productos',
        accessorFn: (row) => row.lines.length,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'units',
        header: 'Unidades',
        accessorFn: (row) => row.totalUnits,
        cell: ({ getValue }) => <span className="font-medium text-ink">{getValue()}</span>,
      },
      {
        id: 'totalCost',
        header: 'Costo total',
        accessorFn: (row) => row.totalCost,
        cell: ({ getValue }) => <span className="text-body">{formatCurrency(getValue())}</span>,
      },
      {
        id: 'status',
        header: 'Estado',
        accessorFn: (row) => row.status,
        cell: ({ row }) =>
          row.original.status === 'Anulada' ? (
            <Badge tone="danger" dot>
              Anulada
            </Badge>
          ) : (
            <Badge tone="ok" dot>
              Registrada
            </Badge>
          ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => {
          const entry = row.original
          const isCancelled = entry.status === 'Anulada'

          return (
            <div className="flex items-center justify-end gap-1.5">
              <IconButton title="Ver detalle" onClick={() => onView(entry)}>
                <Eye size={16} />
              </IconButton>
              <IconButton title="Anular" tone="danger" disabled={isCancelled} onClick={() => onCancel(entry)}>
                <Ban size={16} />
              </IconButton>
            </div>
          )
        },
      },
    ],
    [onView, onCancel],
  )

  return (
    <DataTable
      columns={columns}
      data={entries}
      loading={loading}
      minWidth="900px"
      emptyIcon={ClipboardList}
      emptyTitle="No hay entradas"
      emptyDescription="Registra la primera entrada de productos con su lote."
    />
  )
}
