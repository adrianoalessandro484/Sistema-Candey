import { Search, X } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Buscar...', className = '' }) {
  return (
    <div className={`relative w-full sm:max-w-md ${className}`.trim()}>
      <Search
        size={19}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-[50px] w-full rounded-2xl border-2 border-line-strong bg-white pr-12 pl-12 text-[15px] text-ink shadow-[inset_0_1px_2px_rgba(27,20,24,0.03)] outline-none transition-all placeholder:text-muted/65 hover:border-candey/55 focus:border-candey focus:ring-4 focus:ring-candey/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute top-1/2 right-2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-muted transition-colors hover:bg-candey-50 hover:text-candey"
        >
          <X size={17} />
        </button>
      ) : null}
    </div>
  )
}
