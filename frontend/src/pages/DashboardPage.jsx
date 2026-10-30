import { useSession } from '../context/sessionContext.js'
import AdminDashboard from '../components/dashboard/AdminDashboard.jsx'
import EntryDashboard from '../components/dashboard/EntryDashboard.jsx'
import ExitDashboard from '../components/dashboard/ExitDashboard.jsx'

export default function DashboardPage() {
  const { user } = useSession()
  const name = user?.userName ?? 'Administrador'

  if (user?.role === 'EntryClerk') {
    return <EntryDashboard name={name} />
  }

  if (user?.role === 'ExitClerk') {
    return <ExitDashboard name={name} />
  }

  return <AdminDashboard name={name} />
}
