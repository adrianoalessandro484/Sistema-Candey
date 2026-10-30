const TONES = {
  candey: 'border-transparent bg-candey text-white',
  gold: 'border-gold/30 bg-gold-50 text-gold-dark',
  ok: 'border-ok/20 bg-ok-bg text-ok',
  warn: 'border-warn/20 bg-warn-bg text-warn',
  danger: 'border-danger/20 bg-danger-bg text-danger',
  info: 'border-info/20 bg-info-bg text-info',
  neutral: 'border-line-strong bg-surface-2 text-muted',
}

export default function Badge({ children, tone = 'neutral', dot = false, className = '' }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap ${
        TONES[tone] ?? TONES.neutral
      } ${className}`.trim()}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}
