import { forwardRef } from 'react'

const BASE =
  'group/button relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-candey/20 disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:shrink-0'

const VARIANTS = {
  primary:
    'brand-gradient text-white shadow-[var(--shadow-brand)] hover:brightness-[1.06] hover:-translate-y-px active:translate-y-0 active:brightness-95',
  secondary:
    'border border-line-strong bg-white text-ink shadow-[0_1px_2px_rgba(27,20,24,0.05)] hover:border-candey/45 hover:bg-candey-50/70 hover:text-candey-dark',
  ghost: 'text-body hover:bg-candey-50 hover:text-candey-dark',
  danger:
    'border border-danger/25 bg-danger-bg text-danger hover:border-danger/45 hover:bg-danger hover:text-white',
  gold: 'border border-gold/35 bg-gold-50 text-gold-dark hover:border-gold/60 hover:bg-gold-light',
  soft: 'bg-candey-50 text-candey-dark hover:bg-candey-light',
}

const SIZES = {
  sm: 'h-10 px-4 text-[13.5px] [&_svg]:size-4',
  md: 'h-12 px-5 text-[15px] [&_svg]:size-[18px]',
  lg: 'h-13 px-6 text-base [&_svg]:size-5',
  icon: 'h-11 w-11 p-0 [&_svg]:size-5',
  'icon-sm': 'h-9 w-9 p-0 [&_svg]:size-4',
}

const SPINNER = {
  primary: 'border-white/35 border-t-white',
  danger: 'border-white/35 border-t-white',
  secondary: 'border-ink/20 border-t-ink',
  ghost: 'border-ink/20 border-t-ink',
  gold: 'border-gold-dark/25 border-t-gold-dark',
  soft: 'border-candey-dark/25 border-t-candey-dark',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    loading = false,
    fullWidth = false,
    disabled = false,
    className = '',
    ...rest
  },
  ref,
) {
  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          className={`h-[18px] w-[18px] animate-[candey-spin_0.7s_linear_infinite] rounded-full border-2 ${
            SPINNER[variant] ?? SPINNER.primary
          }`}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  )
})

export default Button
