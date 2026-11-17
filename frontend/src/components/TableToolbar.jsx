import { RotateCw } from 'lucide-react'
import SearchInput from './SearchInput.jsx'
import Button from './Button.jsx'

export default function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  totalCount = 0,
  totalLabel = 'registro(s)',
  onRefresh,
  refreshing = false,
  children,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-[var(--shadow-card)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />
        {children}
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-[13px] font-semibold text-body tabular-nums">
          <strong className="font-bold text-ink">{totalCount}</strong>
          <span className="text-muted">{totalLabel}</span>
        </span>

        {onRefresh ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            title="Actualizar listado"
          >
            <RotateCw size={17} className={refreshing ? 'animate-spin' : ''} />
            <span>Actualizar</span>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
