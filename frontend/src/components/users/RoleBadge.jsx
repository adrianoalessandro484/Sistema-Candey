import Badge from '../Badge.jsx'
import { roleLabel } from '../../utils/roles.js'

export default function RoleBadge({ role }) {
  const tones = {
    Administrator: 'candey',
    EntryClerk: 'info',
    ExitClerk: 'gold',
  }

  return <Badge tone={tones[role] ?? 'neutral'}>{roleLabel(role)}</Badge>
}
