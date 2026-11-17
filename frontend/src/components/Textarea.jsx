import { forwardRef } from 'react'
import Field from './Field.jsx'
import { controlClasses } from './fieldStyles.js'

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
          `min-h-[108px] resize-y px-4 py-3.5 leading-relaxed ${controlClassName}`,
        )}
        {...rest}
      />
    </Field>
  )
})

export default Textarea
