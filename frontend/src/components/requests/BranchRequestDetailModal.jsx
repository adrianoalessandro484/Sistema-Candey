import { AlertTriangle, Calendar, CheckCircle2, ClipboardList, FileText, Printer, Store, Truck, UserRound } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import RequestStatusBadge from './RequestStatusBadge.jsx'
import { formatDateTime, formatShortDate } from '../../utils/format.js'

export default function BranchRequestDetailModal({ open, request, onClose, onPrintPdf }) {
  if (!request) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Requerimiento ${request.code}`}
      description="Trazabilidad completa desde la solicitud hasta la confirmación de llegada."
      icon={ClipboardList}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          {request.exitId ? (
            <Button onClick={() => onPrintPdf(request)}>
              <Printer size={18} />
              Despacho PDF ({request.exitCode})
            </Button>
          ) : null}
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <Store size={18} className="mt-0.5 shrink-0 text-candey" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Sucursal</span>
              <span className="text-[14.5px] font-semibold text-ink">{request.branchName}</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <span className="text-[12.5px] font-semibold text-muted uppercase">Estado</span>
            <RequestStatusBadge status={request.status} />
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <UserRound size={18} className="mt-0.5 shrink-0 text-candey" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Solicitado por</span>
              <span className="text-[14px] font-semibold text-ink">{request.requestedByUserName}</span>
              <span className="text-[12px] text-muted">{formatShortDate(request.date)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <FileText size={18} className="mt-0.5 shrink-0 text-muted" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Observación</span>
              <span className="text-[14px] text-body">{request.note || 'Sin observación'}</span>
            </div>
          </div>
        </div>

        {(request.dispatchedAt || request.rejectionReason || request.receivedAt) ? (
          <div className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface-2 p-4">
            <p className="text-[11.5px] font-bold tracking-wider text-muted uppercase">
              Historial de seguimiento
            </p>

            {request.dispatchedAt ? (
              <div className="flex items-start gap-2.5 text-[13.5px]">
                <Truck size={17} className="mt-0.5 shrink-0 text-info" />
                <div>
                  <span className="font-semibold text-ink">
                    Despachado ({request.exitCode}) por {request.reviewedByUserName}
                  </span>
                  <span className="ml-2 text-muted">{formatDateTime(request.dispatchedAt)}</span>
                </div>
              </div>
            ) : null}

            {request.rejectionReason ? (
              <div className="flex items-start gap-2.5 text-[13.5px] text-danger">
                <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold">
                    Rechazado por {request.reviewedByUserName}:
                  </span>{' '}
                  {request.rejectionReason}
                </div>
              </div>
            ) : null}

            {request.receivedAt ? (
              <div
                className={`flex items-start gap-2.5 text-[13.5px] ${
                  request.status === 'Observado' ? 'text-danger' : 'text-ok'
                }`}
              >
                {request.status === 'Observado' ? (
                  <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="font-semibold">
                    {request.status === 'Observado' ? 'Incidencia reportada' : 'Recepción confirmada'} por{' '}
                    {request.receivedByUserName}
                  </span>
                  <span className="ml-2 text-muted">{formatDateTime(request.receivedAt)}</span>
                  {request.receptionNote ? (
                    <p className="mt-0.5 text-body">{request.receptionNote}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[460px] text-left text-sm">
            <thead className="border-b border-line bg-surface-2 text-[11.5px] font-bold tracking-wider text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Unidad</th>
                <th className="px-4 py-3 text-right">Cantidad solicitada</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {request.lines.map((line) => (
                <tr key={line.productId} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{line.productName}</td>
                  <td className="px-4 py-3 text-muted">{line.unitName}</td>
                  <td className="px-4 py-3 text-right font-bold text-ink">{line.requestedQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-candey/20 bg-candey-50/45 px-5 py-3.5 text-[14.5px] tabular-nums">
          <span className="inline-flex items-center gap-2 text-muted">
            <Calendar size={16} /> Total unidades solicitadas
          </span>
          <strong className="text-[18px] text-candey-dark">{request.totalUnits} u.</strong>
        </div>
      </div>
    </Modal>
  )
}
