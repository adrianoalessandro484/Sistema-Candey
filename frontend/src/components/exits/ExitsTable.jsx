import { useMemo } from 'react'
import { ArrowUpFromLine, Ban, Eye } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import IconButton from '../IconButton.jsx'
import { formatShortDate } from '../../utils/format.js'

export default function ExitsTable({ exits, onView, onCancel, loading }) {
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
        id: 'reason',
        header: 'Motivo',
        accessorFn: (row) => row.reason,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'branch',
        header: 'Sucursal',
        accessorFn: (row) => row.branchName,
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
          const exit = row.original
          const isCancelled = exit.status === 'Anulada'

          return (
            <div className="flex items-center justify-end gap-1.5">
              <IconButton title="Ver detalle" onClick={() => onView(exit)}>
                <Eye size={16} />
              </IconButton>
              <IconButton title="Anular" tone="danger" disabled={isCancelled} onClick={() => onCancel(exit)}>
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
      data={exits}
      loading={loading}
      minWidth="880px"
      emptyIcon={ArrowUpFromLine}
      emptyTitle="No hay salidas"
      emptyDescription="Registra el primer despacho de productos respetando FEFO."
    />
  )
}
