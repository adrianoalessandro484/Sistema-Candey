import { ArrowDownToLine, Calendar, FileText, Printer, Truck } from 'lucide-react'
import Badge from '../Badge.jsx'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import { formatCurrency, formatShortDate } from '../../utils/format.js'
import { generateEntryStickerPdf } from '../../utils/pdf.js'

export default function EntryDetailModal({ open, entry, onClose }) {
  if (!entry) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Entrada ${entry.code}`}
      description="Detalle completo de productos, lotes y costos ingresados."
      icon={ArrowDownToLine}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={() => generateEntryStickerPdf(entry)}>
            <Printer size={18} />
            Etiquetas PDF
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <Truck size={18} className="mt-0.5 shrink-0 text-candey" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Proveedor</span>
              <span className="text-[14.5px] font-semibold text-ink">{entry.supplierName}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <Calendar size={18} className="mt-0.5 shrink-0 text-candey" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Fecha</span>
              <span className="text-[14.5px] font-semibold text-ink">{formatShortDate(entry.date)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <span className="text-[12.5px] font-semibold text-muted uppercase">Estado</span>
            <Badge tone={entry.status === 'Anulada' ? 'danger' : 'ok'} dot>
              {entry.status}
            </Badge>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
            <FileText size={18} className="mt-0.5 shrink-0 text-muted" />
            <div className="flex flex-col">
              <span className="text-[11.5px] font-semibold text-muted uppercase">Observación</span>
              <span className="text-[14px] text-body">{entry.note || 'Sin observación'}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-line bg-surface-2 text-[11.5px] font-bold tracking-wider text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Lote</th>
                <th className="px-4 py-3">Cantidad</th>
                <th className="px-4 py-3">Costo</th>
                <th className="px-4 py-3">Vence</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {entry.lines.map((line, index) => (
                <tr key={`${line.productId}-${index}`} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{line.productName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{line.lotCode}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{line.quantity}</td>
                  <td className="px-4 py-3">{formatCurrency(line.unitCost)}</td>
                  <td className="px-4 py-3 text-muted">{formatShortDate(line.expirationDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 rounded-2xl border border-candey/20 bg-candey-50/45 px-5 py-3.5 text-[15px] tabular-nums">
          <span className="text-muted">Total documento:</span>
          <strong className="text-[18px] text-candey-dark">{formatCurrency(entry.totalCost)}</strong>
        </div>
      </div>
    </Modal>
  )
}
