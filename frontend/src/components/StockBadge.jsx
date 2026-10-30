import Badge from './Badge.jsx'

export default function StockBadge({ stock, minStock }) {
  if (stock === 0) {
    return (
      <Badge tone="danger" dot>
        Sin stock
      </Badge>
    )
  }

  if (stock <= minStock) {
    return (
      <Badge tone="warn" dot>
        Stock bajo
      </Badge>
    )
  }

  return (
    <Badge tone="ok" dot>
      Disponible
    </Badge>
  )
}
