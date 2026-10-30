import { Printer } from 'lucide-react'
import Badge from '../Badge.jsx'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import { formatShortDate } from '../../utils/format.js'
import { generateExitPdf } from '../../utils/pdf.js'

export default function ExitDetailModal({ open, exit, onClose }) {
  if (!exit) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Salida ${exit.code}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={() => generateExitPdf(exit)}>
            <Printer size={16} />
            Despacho PDF
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted">Sucursal: </span>
            {exit.branchName}
          </p>
          <p>
            <span className="text-muted">Fecha: </span>
            {formatShortDate(exit.date)}
          </p>
          <p>
            <span className="text-muted">Motivo: </span>
            {exit.reason}
          </p>
          <p>
            <span className="text-muted">Estado: </span>
            <Badge tone={exit.status === 'Anulada' ? 'danger' : 'ok'} dot>
              {exit.status}
            </Badge>
          </p>
          <p className="sm:col-span-2">
            <span className="text-muted">Observacion: </span>
            {exit.note || '-'}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-surface-2 text-xs text-muted uppercase">
              <tr>
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Lote</th>
                <th className="px-3 py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {exit.lines.map((line, index) => (
                <tr key={`${line.productId}-${index}`} className="border-t border-line">
                  <td className="px-3 py-2">{line.productName}</td>
                  <td className="px-3 py-2 font-mono text-xs">{line.lotCode}</td>
                  <td className="px-3 py-2">{line.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-right text-sm">
          <span className="text-muted">Total unidades: </span>
          <strong className="text-ink">{exit.totalUnits}</strong>
        </p>
      </div>
    </Modal>
  )
}
