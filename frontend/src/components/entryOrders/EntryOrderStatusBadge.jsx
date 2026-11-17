import Badge from '../Badge.jsx'

const STATUS_TONES = {
  Pendiente: 'gold',
  Recibida: 'ok',
  Cancelada: 'neutral',
}

export default function EntryOrderStatusBadge({ status }) {
  return (
    <Badge tone={STATUS_TONES[status] ?? 'neutral'} dot>
      {status}
    </Badge>
  )
}
