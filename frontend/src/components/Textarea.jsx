import { forwardRef } from 'react'
import Field, { controlClasses } from './Field.jsx'

const Textarea = forwardRef(function Textarea(
  {
    label,
    id,
    error,
    hint,
    rows = 3,
    required = false,
    className = '',
    controlClassName = '',
    ...rest
  },
  ref,
) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={controlClasses(
          Boolean(error),
          `min-h-[104px] resize-y px-4 py-3 leading-relaxed ${controlClassName}`,
        )}
        {...rest}
      />
    </Field>
  )
})

export default Textarea
