import { AlertTriangle, RotateCw } from 'lucide-react'
import Button from './Button.jsx'

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-warn/35 bg-warn-bg px-5 py-4 text-[14px] text-warn shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warn/12 text-warn">
          <AlertTriangle size={19} aria-hidden="true" />
        </span>
        <span className="pt-1.5 font-medium">{message}</span>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="w-full shrink-0 sm:w-auto">
          <RotateCw size={17} />
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
