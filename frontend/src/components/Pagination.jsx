import { ChevronLeft, ChevronRight } from 'lucide-react'

function pageNumbers(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b)
  const result = []

  sorted.forEach((value, index) => {
    const previous = sorted[index - 1]
    if (previous && value - previous > 1) result.push('...')
    result.push(value)
  })

  return result
}

export default function Pagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  itemLabel = 'registros',
  disabled = false,
}) {
  if (totalItems === 0) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)
  const pages = pageNumbers(page, Math.max(totalPages, 1))

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px] text-muted">
        <span className="tabular-nums">
          Mostrando <strong className="font-semibold text-ink">{start}</strong>–
          <strong className="font-semibold text-ink">{end}</strong> de{' '}
          <strong className="font-semibold text-ink">{totalItems}</strong> {itemLabel}
        </span>
        <label className="inline-flex items-center gap-2">
          <span className="sr-only">Registros por página</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            disabled={disabled}
            className="h-11 cursor-pointer rounded-xl border border-line-strong bg-white px-3 text-[13.5px] font-semibold text-body outline-none transition-colors hover:border-candey/45 focus:border-candey focus:ring-4 focus:ring-candey/12"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>por página</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Página anterior"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line-strong bg-white px-3.5 text-[13.5px] font-semibold text-body transition-all hover:border-candey/45 hover:bg-candey-50 hover:text-candey active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {pages.map((value, index) =>
          value === '...' ? (
            <span key={`gap-${index}`} className="px-1.5 text-muted">
              …
            </span>
          ) : (
            <button
              key={value}
              type="button"
              onClick={() => onPageChange(value)}
              disabled={disabled}
              aria-current={value === page ? 'page' : undefined}
              className={`inline-flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-[14px] font-semibold tabular-nums transition-all active:scale-95 ${
                value === page
                  ? 'brand-gradient border-transparent text-white shadow-[var(--shadow-brand)]'
                  : 'border-line-strong bg-white text-body hover:border-candey/45 hover:bg-candey-50 hover:text-candey'
              }`}
            >
              {value}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Página siguiente"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line-strong bg-white px-3.5 text-[13.5px] font-semibold text-body transition-all hover:border-candey/45 hover:bg-candey-50 hover:text-candey active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
