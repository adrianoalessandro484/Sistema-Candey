const TONES = {
  default: 'hover:border-candey/50 hover:bg-candey-50 hover:text-candey',
  gold: 'hover:border-gold/60 hover:bg-gold-50 hover:text-gold-dark',
  danger: 'hover:border-danger/45 hover:bg-danger-bg hover:text-danger',
}

export default function IconButton({ title, tone = 'default', className = '', children, ...rest }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-white text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        TONES[tone] ?? TONES.default
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
}
