import { useMemo } from 'react'
import { Ban, Eye, PackageCheck, PackagePlus, Truck } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import IconButton from '../IconButton.jsx'
import EntryOrderStatusBadge from './EntryOrderStatusBadge.jsx'
import { formatShortDate } from '../../utils/format.js'

export default function EntryOrdersTable({
  orders,
  canReceive = false,
  canCancel = false,
  onView,
  onReceive,
  onCancel,
  loading,
}) {
  const columns = useMemo(
    () => [
      {
        id: 'code',
        header: 'Orden',
        accessorFn: (row) => row.code,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-ink">{row.original.code}</span>
            <span className="text-[12px] text-muted">{formatShortDate(row.original.orderDate)}</span>
          </div>
        ),
      },
      {
        id: 'supplier',
        header: 'Proveedor',
        accessorFn: (row) => row.supplierName,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-candey-50 text-candey">
              <Truck size={17} />
            </span>
            <span className="font-semibold text-ink">{row.original.supplierName}</span>
          </div>
        ),
      },
      {
        id: 'expected',
        header: 'Entrega esperada',
        accessorFn: (row) => row.expectedDate,
        cell: ({ getValue }) => (
          <span className="text-muted">{getValue() ? formatShortDate(getValue()) : 'Sin fecha'}</span>
        ),
      },
      {
        id: 'units',
        header: 'Pedido',
        accessorFn: (row) => row.totalUnits,
        cell: ({ row }) => (
          <div className="flex flex-col tabular-nums">
            <span className="font-semibold text-ink">{row.original.totalUnits} u.</span>
            <span className="text-[12px] text-muted">{row.original.lines.length} producto(s)</span>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Estado',
        accessorFn: (row) => row.status,
        cell: ({ row }) => <EntryOrderStatusBadge status={row.original.status} />,
      },
      {
        id: 'entry',
        header: 'Recepción',
        accessorFn: (row) => row.entryCode ?? '',
        cell: ({ row }) =>
          row.original.entryCode ? (
            <div className="flex flex-col">
              <span className="font-semibold text-ok">{row.original.entryCode}</span>
              <span className="text-[12px] text-muted">
                Por {row.original.receivedByUserName || 'Almacén'}
              </span>
            </div>
          ) : (
            <span className="text-[12.5px] text-muted">{row.original.note || 'Pendiente de ingreso'}</span>
          ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => {
          const order = row.original
          const isPending = order.status === 'Pendiente'

          return (
            <div className="flex items-center justify-end gap-2">
              <IconButton title="Ver detalle" onClick={() => onView(order)}>
                <Eye size={16} />
              </IconButton>

              {canReceive && isPending ? (
                <IconButton title="Recibir mercadería" onClick={() => onReceive(order)}>
                  <PackageCheck size={16} />
                </IconButton>
              ) : null}

              {canCancel && isPending ? (
                <IconButton title="Cancelar orden" tone="danger" onClick={() => onCancel(order)}>
                  <Ban size={16} />
                </IconButton>
              ) : null}
            </div>
          )
        },
      },
    ],
    [canReceive, canCancel, onView, onReceive, onCancel],
  )

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={loading}
      minWidth="920px"
      emptyIcon={PackagePlus}
      emptyTitle="No hay órdenes de ingreso"
      emptyDescription="Las órdenes de compra pendientes por recibir en almacén aparecerán aquí."
    />
  )
}
