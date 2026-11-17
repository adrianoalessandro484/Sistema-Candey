import { useMemo } from 'react'
import { Ban, CheckCircle2, ClipboardCheck, Eye, PackageCheck, Printer, Truck, XCircle } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import IconButton from '../IconButton.jsx'
import RequestStatusBadge from './RequestStatusBadge.jsx'
import { formatRelativeAge, formatShortDate, hoursSince } from '../../utils/format.js'

export default function BranchRequestsTable({
  requests,
  canReview = false,
  canReceive = false,
  onView,
  onApprove,
  onReject,
  onConfirmReception,
  onCancel,
  onPrintPdf,
  loading,
}) {
  const columns = useMemo(
    () => [
      {
        id: 'code',
        header: 'Requerimiento',
        accessorFn: (row) => row.code,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-ink">{row.original.code}</span>
            <span className="text-[12px] text-muted">{formatShortDate(row.original.date)}</span>
          </div>
        ),
      },
      {
        id: 'branch',
        header: 'Sucursal / Solicitante',
        accessorFn: (row) => row.branchName,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-ink">{row.original.branchName}</span>
            <span className="text-[12px] text-muted">Por {row.original.requestedByUserName}</span>
          </div>
        ),
      },
      {
        id: 'units',
        header: 'Detalle',
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
        cell: ({ row }) => <RequestStatusBadge status={row.original.status} />,
      },
      {
        id: 'tracking',
        header: 'Seguimiento',
        accessorFn: (row) => row.exitCode ?? row.status,
        cell: ({ row }) => {
          const item = row.original

          if (item.status === 'En camino') {
            const delayed = hoursSince(item.dispatchedAt) >= 24
            return (
              <div className="flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-info">
                  <Truck size={14} aria-hidden="true" />
                  {item.exitCode}
                </span>
                <span className={`text-[12px] font-medium ${delayed ? 'text-warn' : 'text-muted'}`}>
                  Salió {formatRelativeAge(item.dispatchedAt)}
                  {delayed ? ' · Sin confirmar' : ''}
                </span>
              </div>
            )
          }

          if (item.status === 'Observado') {
            return (
              <div className="flex flex-col gap-0.5">
                <span className="text-[12.5px] font-semibold text-danger">Incidencia reportada</span>
                <span className="max-w-[220px] truncate text-[12px] text-muted">
                  {item.receptionNote || 'Sin detalle'}
                </span>
              </div>
            )
          }

          if (item.status === 'Recibido') {
            return (
              <div className="flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ok">
                  <PackageCheck size={14} aria-hidden="true" />
                  {item.exitCode || 'Recibido'}
                </span>
                <span className="text-[12px] text-muted">
                  Por {item.receivedByUserName || 'Sucursal'}
                </span>
              </div>
            )
          }

          if (item.status === 'Rechazado') {
            return (
              <span className="block max-w-[220px] truncate text-[12.5px] text-danger">
                {item.rejectionReason || 'Rechazado'}
              </span>
            )
          }

          return <span className="text-[12.5px] text-muted">{item.note || 'En espera de revisión'}</span>
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => {
          const item = row.original
          const isPending = item.status === 'Pendiente'
          const isInTransit = item.status === 'En camino'

          return (
            <div className="flex items-center justify-end gap-2">
              <IconButton title="Ver detalle" onClick={() => onView(item)}>
                <Eye size={16} />
              </IconButton>

              {item.exitId ? (
                <IconButton title="Despacho PDF" tone="gold" onClick={() => onPrintPdf(item)}>
                  <Printer size={16} />
                </IconButton>
              ) : null}

              {canReview && isPending ? (
                <>
                  <IconButton title="Aprobar y despachar" onClick={() => onApprove(item)}>
                    <CheckCircle2 size={16} />
                  </IconButton>
                  <IconButton title="Rechazar" tone="danger" onClick={() => onReject(item)}>
                    <XCircle size={16} />
                  </IconButton>
                </>
              ) : null}

              {canReceive && isInTransit ? (
                <IconButton title="Confirmar llegada" onClick={() => onConfirmReception(item)}>
                  <ClipboardCheck size={16} />
                </IconButton>
              ) : null}

              {canReceive && isPending ? (
                <IconButton title="Cancelar pedido" tone="danger" onClick={() => onCancel(item)}>
                  <Ban size={16} />
                </IconButton>
              ) : null}
            </div>
          )
        },
      },
    ],
    [canReview, canReceive, onView, onApprove, onReject, onConfirmReception, onCancel, onPrintPdf],
  )

  return (
    <DataTable
      columns={columns}
      data={requests}
      loading={loading}
      minWidth="980px"
      emptyIcon={ClipboardCheck}
      emptyTitle="No hay requerimientos"
      emptyDescription="Los pedidos de las sucursales hacia el almacén aparecerán aquí."
    />
  )
}
