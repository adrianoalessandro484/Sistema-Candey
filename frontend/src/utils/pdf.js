import { jsPDF } from 'jspdf'
import JsBarcode from 'jsbarcode'
import { formatShortDate } from './format.js'

function barcodeDataUrl(value) {
  const canvas = document.createElement('canvas')
  JsBarcode(canvas, value, {
    format: 'CODE128',
    displayValue: false,
    width: 2,
    height: 60,
    margin: 4,
  })
  return canvas.toDataURL('image/png')
}

export function generateEntryStickerPdf(entry) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 10
  const width = 190
  let y = margin

  doc.setFontSize(14)
  doc.text(`Entrada ${entry.code} - Etiquetas de lote`, margin, y)
  y += 6
  doc.setFontSize(10)
  doc.text(
    `Proveedor: ${entry.supplierName ?? '-'}   |   Fecha: ${formatShortDate(entry.date)}`,
    margin,
    y,
  )
  y += 8

  entry.lines.forEach((line) => {
    if (y > 250) {
      doc.addPage()
      y = margin
    }

    doc.setDrawColor(200)
    doc.rect(margin, y, width, 34)

    doc.setFontSize(10)
    doc.text(String(line.productName).slice(0, 50), margin + 3, y + 7)
    doc.setFontSize(11)
    doc.text(`Lote: ${line.lotCode}`, margin + 3, y + 15)
    doc.setFontSize(9)
    doc.text(`Cantidad: ${line.quantity}`, margin + 3, y + 22)
    doc.text(
      `Vence: ${line.expirationDate ? formatShortDate(line.expirationDate) : '-'}`,
      margin + 3,
      y + 28,
    )

    const code = `${entry.code}-${line.lotCode}`
    doc.addImage(barcodeDataUrl(code), 'PNG', margin + 90, y + 5, 96, 24)
    y += 38
  })

  doc.save(`etiquetas-${entry.code}.pdf`)
}

export function generateExitPdf(exit) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('Candey - Documento de salida', 14, 18)
  doc.setFontSize(10)
  doc.text(`Documento: ${exit.code}`, 14, 28)
  doc.text(`Fecha: ${formatShortDate(exit.date)}`, 14, 34)
  doc.text(`Sucursal destino: ${exit.branchName ?? '-'}`, 14, 40)
  doc.text(`Motivo: ${exit.reason}`, 14, 46)
  doc.text(`Observacion: ${exit.note || '-'}`, 14, 52)
  doc.text(`Estado: ${exit.status}`, 14, 58)

  let y = 68
  doc.setFontSize(9)
  doc.text('Producto', 14, y)
  doc.text('Lote', 120, y)
  doc.text('Cantidad', 196, y, { align: 'right' })
  y += 2
  doc.line(14, y, 196, y)
  y += 6

  exit.lines.forEach((line) => {
    if (y > 275) {
      doc.addPage()
      y = 20
    }
    doc.text(String(line.productName).slice(0, 55), 14, y)
    doc.text(String(line.lotCode ?? line.lotId), 120, y)
    doc.text(String(line.quantity), 196, y, { align: 'right' })
    y += 6
  })

  y += 2
  doc.line(14, y, 196, y)
  y += 6
  doc.setFontSize(10)
  doc.text(`Total unidades: ${exit.totalUnits}`, 196, y, { align: 'right' })

  doc.save(`salida-${exit.code}.pdf`)
}

export function generateRequestPdf(items, { supplier = '' } = {}) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('Candey - Solicitud de productos', 14, 18)
  doc.setFontSize(10)
  doc.text(`Fecha: ${formatShortDate(new Date())}`, 14, 26)
  if (supplier) doc.text(`Proveedor: ${supplier}`, 14, 32)

  let y = 44
  doc.setFontSize(9)
  doc.text('Producto', 14, y)
  doc.text('Categoria', 104, y)
  doc.text('Stock', 162, y, { align: 'right' })
  doc.text('Solicitar', 196, y, { align: 'right' })
  y += 2
  doc.line(14, y, 196, y)
  y += 6

  items.forEach((item) => {
    if (y > 275) {
      doc.addPage()
      y = 20
    }
    const request = item.missing > 0 ? item.missing : Math.max((item.minStock ?? 0) - (item.stock ?? 0), 0)
    doc.text(String(item.productName).slice(0, 45), 14, y)
    doc.text(String(item.categoryName ?? ''), 104, y)
    doc.text(String(item.stock), 162, y, { align: 'right' })
    doc.text(String(request), 196, y, { align: 'right' })
    y += 6
  })

  doc.save('solicitud-proveedor.pdf')
}
