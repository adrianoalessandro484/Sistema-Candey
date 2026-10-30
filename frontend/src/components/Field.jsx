import { CircleAlert } from 'lucide-react'

export default function Field({
  id,
  label,
  error,
  hint,
  required = false,
  children,
  className = '',
}) {
  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`.trim()}>
      {label ? (
        <label htmlFor={id} className="text-[13.5px] font-semibold tracking-[0.005em] text-body">
          {label}
          {required ? <span className="ml-0.5 text-candey">*</span> : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[12.5px] font-medium text-danger">
          <CircleAlert size={14} className="mt-px shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="text-[12.5px] leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export const controlClasses = (hasError, extra = '') =>
  [
    'w-full rounded-xl border bg-white text-[15px] text-ink shadow-[inset_0_1px_2px_rgba(27,20,24,0.03)] outline-none transition-all duration-150 placeholder:text-muted/65 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted',
    hasError
      ? 'border-danger/60 focus:border-danger focus:ring-4 focus:ring-danger/12'
      : 'border-line-strong hover:border-candey/40 focus:border-candey focus:ring-4 focus:ring-candey/12',
    extra,
  ]
    .filter(Boolean)
    .join(' ')
