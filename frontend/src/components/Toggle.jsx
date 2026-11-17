import { forwardRef } from 'react'

const Toggle = forwardRef(function Toggle({ id, label, hint, error, className = '', ...rest }, ref) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-surface-2 px-4 py-4 transition-all hover:border-candey/40 hover:bg-candey-50/45 has-[:checked]:border-candey/30 has-[:checked]:bg-candey-50/35"
      >
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[14.5px] font-semibold text-ink">{label}</span>
          {hint ? <span className="text-[12.5px] leading-snug text-muted">{hint}</span> : null}
        </span>

        <span className="relative inline-flex h-7 w-12 shrink-0 items-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            aria-invalid={Boolean(error)}
            className="peer sr-only"
            {...rest}
          />
          <span
            aria-hidden="true"
            className="h-7 w-12 rounded-full bg-line-strong transition-colors duration-200 peer-checked:bg-candey peer-focus-visible:ring-4 peer-focus-visible:ring-candey/20"
          />
          <span
            aria-hidden="true"
            className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-[0_2px_5px_rgba(27,20,24,0.28)] transition-transform duration-200 peer-checked:translate-x-5"
          />
        </span>
      </label>
      {error ? <p className="mt-1.5 text-[12.5px] font-medium text-danger">{error}</p> : null}
    </div>
  )
})

export default Toggle
