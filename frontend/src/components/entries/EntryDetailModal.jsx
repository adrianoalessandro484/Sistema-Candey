import { Printer } from 'lucide-react'
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
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={() => generateEntryStickerPdf(entry)}>
            <Printer size={16} />
            Etiquetas PDF
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted">Proveedor: </span>
            {entry.supplierName}
          </p>
          <p>
            <span className="text-muted">Fecha: </span>
            {formatShortDate(entry.date)}
          </p>
          <p>
            <span className="text-muted">Estado: </span>
            <Badge tone={entry.status === 'Anulada' ? 'danger' : 'ok'} dot>
              {entry.status}
            </Badge>
          </p>
          <p>
            <span className="text-muted">Observacion: </span>
            {entry.note || '-'}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-surface-2 text-xs text-muted uppercase">
              <tr>
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Lote</th>
                <th className="px-3 py-2">Cantidad</th>
                <th className="px-3 py-2">Costo</th>
                <th className="px-3 py-2">Vence</th>
              </tr>
            </thead>
            <tbody>
              {entry.lines.map((line, index) => (
                <tr key={`${line.productId}-${index}`} className="border-t border-line">
                  <td className="px-3 py-2">{line.productName}</td>
                  <td className="px-3 py-2 font-mono text-xs">{line.lotCode}</td>
                  <td className="px-3 py-2">{line.quantity}</td>
                  <td className="px-3 py-2">{formatCurrency(line.unitCost)}</td>
                  <td className="px-3 py-2">{formatShortDate(line.expirationDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-right text-sm">
          <span className="text-muted">Total: </span>
          <strong className="text-ink">{formatCurrency(entry.totalCost)}</strong>
        </p>
      </div>
    </Modal>
  )
}
