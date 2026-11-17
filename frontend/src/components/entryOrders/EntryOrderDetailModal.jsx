import { Calendar, FileText, PackageCheck, PackagePlus, Truck, UserRound } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import EntryOrderStatusBadge from './EntryOrderStatusBadge.jsx'
import { formatDateTime, formatShortDate } from '../../utils/format.js'

export default function EntryOrderDetailModal({ open, order, onClose }) {
  if (!order) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Orden ${order.code}`}
      description="Detalle de productos solicitados al proveedor y estado de recepción."
      icon={PackagePlus}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <Truck size={18} className="mt-0.5 shrink-0 text-candey" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Proveedor</span>
              <span className="text-[14.5px] font-semibold text-ink">{order.supplierName}</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <span className="text-[12.5px] font-semibold text-muted uppercase">Estado</span>
            <EntryOrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <UserRound size={18} className="mt-0.5 shrink-0 text-candey" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Creada por</span>
              <span className="text-[14px] font-semibold text-ink">{order.createdByUserName}</span>
              <span className="text-[12px] text-muted">{formatShortDate(order.orderDate)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <Calendar size={18} className="mt-0.5 shrink-0 text-candey" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Llegada esperada</span>
              <span className="text-[14px] font-semibold text-ink">
                {order.expectedDate ? formatShortDate(order.expectedDate) : 'Sin fecha definida'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3 sm:col-span-2">
            <FileText size={18} className="mt-0.5 shrink-0 text-muted" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Observación</span>
              <span className="text-[14px] text-body">{order.note || 'Sin observación'}</span>
            </div>
          </div>
        </div>

        {order.entryCode ? (
          <div className="flex items-center gap-3 rounded-2xl border border-ok/25 bg-ok-bg px-4 py-3 text-[13.5px] text-ok">
            <PackageCheck size={18} className="shrink-0" />
            <span>
              Recibida con documento <strong>{order.entryCode}</strong> por{' '}
              <strong>{order.receivedByUserName}</strong> ({formatDateTime(order.receivedAt)}).
            </span>
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[440px] text-left text-sm">
            <thead className="border-b border-line bg-surface-2 text-[11.5px] font-bold tracking-wider text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Unidad</th>
                <th className="px-4 py-3 text-right">Cantidad esperada</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {order.lines.map((line) => (
                <tr key={line.productId} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{line.productName}</td>
                  <td className="px-4 py-3 text-muted">{line.unitName}</td>
                  <td className="px-4 py-3 text-right font-bold text-ink">{line.requestedQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 rounded-2xl border border-candey/20 bg-candey-50/45 px-5 py-3.5 text-[15px] tabular-nums">
          <span className="text-muted">Total unidades esperadas:</span>
          <strong className="text-[18px] text-candey-dark">{order.totalUnits} u.</strong>
        </div>
      </div>
    </Modal>
  )
}
