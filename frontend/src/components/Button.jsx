import { forwardRef } from 'react'

const BASE =
  'group/button relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl font-semibold tracking-[-0.01em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-candey/25 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:shrink-0'

const VARIANTS = {
  primary:
    'brand-gradient text-white shadow-[var(--shadow-brand)] hover:brightness-[1.06] hover:-translate-y-0.5 hover:shadow-[var(--shadow-brand-hover)] active:translate-y-0 active:brightness-95',
  secondary:
    'border border-line-strong bg-white text-ink shadow-[0_2px_6px_rgba(27,20,24,0.05)] hover:border-candey/50 hover:bg-candey-50/75 hover:text-candey-dark hover:-translate-y-px',
  ghost: 'text-body hover:bg-candey-50 hover:text-candey-dark',
  danger:
    'border border-danger/25 bg-danger-bg text-danger shadow-[0_1px_3px_rgba(201,54,74,0.08)] hover:border-danger/50 hover:bg-danger hover:text-white',
  gold: 'border border-gold/40 bg-gold-50 text-gold-dark shadow-[0_1px_3px_rgba(169,133,58,0.1)] hover:border-gold/65 hover:bg-gold-light',
  soft: 'border border-candey/15 bg-candey-50 text-candey-dark hover:border-candey/30 hover:bg-candey-light',
  hero: 'bg-white text-candey-dark shadow-lg hover:-translate-y-0.5 hover:bg-candey-50 hover:text-candey-deep',
  'hero-ghost':
    'border border-white/25 bg-white/14 text-white backdrop-blur hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/22 hover:text-white',
}

const SIZES = {
  sm: 'h-11 rounded-xl px-4.5 text-[14px] [&_svg]:size-[18px]',
  md: 'h-[50px] px-6 text-[15.5px] [&_svg]:size-5',
  lg: 'h-14 px-7 text-[16.5px] [&_svg]:size-[22px]',
  icon: 'h-12 w-12 p-0 [&_svg]:size-[22px]',
  'icon-sm': 'h-11 w-11 rounded-xl p-0 [&_svg]:size-[19px]',
}

const SPINNER = {
  primary: 'border-white/35 border-t-white',
  danger: 'border-white/35 border-t-white',
  secondary: 'border-ink/20 border-t-ink',
  ghost: 'border-ink/20 border-t-ink',
  gold: 'border-gold-dark/25 border-t-gold-dark',
  soft: 'border-candey-dark/25 border-t-candey-dark',
  hero: 'border-candey-dark/25 border-t-candey-dark',
  'hero-ghost': 'border-white/35 border-t-white',
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
          className={`h-[19px] w-[19px] animate-[candey-spin_0.7s_linear_infinite] rounded-full border-2 ${
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
