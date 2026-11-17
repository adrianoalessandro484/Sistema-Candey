import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import Field from './Field.jsx'
import { controlClasses } from './fieldStyles.js'

const Select = forwardRef(function Select(
  {
    label,
    id,
    error,
    hint,
    required = false,
    className = '',
    controlClassName = '',
    children,
    ...rest
  },
  ref,
) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={controlClasses(
            Boolean(error),
            `h-[52px] cursor-pointer appearance-none py-0 pr-12 pl-4 ${controlClassName}`,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={19}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </Field>
  )
})

export default Select
