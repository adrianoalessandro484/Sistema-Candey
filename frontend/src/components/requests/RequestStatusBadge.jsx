import Badge from '../Badge.jsx'

const STATUS_TONES = {
  Pendiente: 'gold',
  'En camino': 'info',
  Recibido: 'ok',
  Observado: 'danger',
  Rechazado: 'danger',
  Cancelado: 'neutral',
}

export default function RequestStatusBadge({ status }) {
  return (
    <Badge tone={STATUS_TONES[status] ?? 'neutral'} dot>
      {status}
    </Badge>
  )
}
