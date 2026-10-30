const TONES = {
  candey: 'bg-candey-50 text-candey ring-candey/10',
  gold: 'bg-gold-50 text-gold-dark ring-gold/15',
  ok: 'bg-ok-bg text-ok ring-ok/15',
  warn: 'bg-warn-bg text-warn ring-warn/15',
  danger: 'bg-danger-bg text-danger ring-danger/15',
  info: 'bg-info-bg text-info ring-info/15',
}

export default function StatCard({ icon: Icon, label, value, hint, tone = 'candey' }) {
  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[0_20px_44px_-30px_rgba(58,17,34,0.35)] sm:p-5">
      <span
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset sm:h-12 sm:w-12 ${
          TONES[tone] ?? TONES.candey
        }`}
      >
        <Icon size={23} aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        <span className="text-[24px] leading-none font-bold tracking-tight text-ink sm:text-[27px]">
          {value}
        </span>
        {hint ? <span className="mt-0.5 text-[12.5px] text-muted">{hint}</span> : null}
      </div>
    </div>
  )
}
