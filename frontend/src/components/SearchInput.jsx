import { Search, X } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Buscar...', className = '' }) {
  return (
    <div className={`relative w-full sm:max-w-sm ${className}`.trim()}>
      <Search
        size={18}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-xl border border-line-strong bg-white pr-11 pl-11 text-[14.5px] text-ink outline-none transition-all placeholder:text-muted/65 hover:border-candey/40 focus:border-candey focus:ring-4 focus:ring-candey/12 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar busqueda"
          className="absolute top-1/2 right-2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-candey-50 hover:text-candey"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  )
}
