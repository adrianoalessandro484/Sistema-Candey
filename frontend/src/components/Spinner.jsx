import { Loader2 } from 'lucide-react'

export default function Spinner({ className = 'size-5' }) {
  return <Loader2 className={`animate-spin ${className}`.trim()} role="status" aria-label="Cargando" />
}
