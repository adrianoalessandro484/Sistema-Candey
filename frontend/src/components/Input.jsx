import { forwardRef } from 'react'
import Field, { controlClasses } from './Field.jsx'

const Input = forwardRef(function Input(
  {
    label,
    id,
    error,
    hint,
    icon: Icon,
    trailing,
    required = false,
    className = '',
    controlClassName = '',
    type = 'text',
    ...rest
  },
  ref,
) {
  const hasIcon = Boolean(Icon)
  const hasTrailing = Boolean(trailing)

  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <div className="relative">
        {hasIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-muted">
            <Icon size={18} aria-hidden="true" />
          </span>
        ) : null}

        <input
          ref={ref}
          id={id}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={controlClasses(
            Boolean(error),
            `h-12 px-4 ${hasIcon ? 'pl-11' : ''} ${hasTrailing ? 'pr-12' : ''} ${controlClassName}`,
          )}
          {...rest}
        />

        {hasTrailing ? (
          <span className="absolute inset-y-0 right-0 flex w-12 items-center justify-center">
            {trailing}
          </span>
        ) : null}
      </div>
    </Field>
  )
})

export default Input
