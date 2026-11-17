const TONES = {
  candey: {
    icon: 'bg-candey-50 text-candey ring-candey/15',
    bar: 'bg-candey',
  },
  gold: {
    icon: 'bg-gold-50 text-gold-dark ring-gold/25',
    bar: 'bg-gold',
  },
  ok: {
    icon: 'bg-ok-bg text-ok ring-ok/20',
    bar: 'bg-ok',
  },
  warn: {
    icon: 'bg-warn-bg text-warn ring-warn/20',
    bar: 'bg-warn',
  },
  danger: {
    icon: 'bg-danger-bg text-danger ring-danger/20',
    bar: 'bg-danger',
  },
  info: {
    icon: 'bg-info-bg text-info ring-info/20',
    bar: 'bg-info',
  },
}

export default function StatCard({ icon: Icon, label, value, hint, tone = 'candey' }) {
  const palette = TONES[tone] ?? TONES.candey

  return (
    <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-4.5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card-hover)] sm:p-5">
      <span
        aria-hidden="true"
        className={`absolute inset-y-3 left-0 w-1 rounded-r-full opacity-75 transition-opacity group-hover:opacity-100 ${palette.bar}`}
      />
      <span
        className={`inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${palette.icon}`}
      >
        <Icon size={25} aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-muted">{label}</span>
        <span className="text-[26px] leading-tight font-bold tracking-tight text-ink tabular-nums sm:text-[30px]">
          {value}
        </span>
        {hint ? <span className="text-[12.5px] text-muted">{hint}</span> : null}
      </div>
    </div>
  )
}
