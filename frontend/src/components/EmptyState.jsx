export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center shadow-[var(--shadow-card)]">
      {Icon ? (
        <span className="inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-candey-50 text-candey ring-4 ring-candey-50/70">
          <Icon size={32} aria-hidden="true" />
        </span>
      ) : null}
      <div className="flex max-w-md flex-col items-center gap-1.5">
        <h3 className="text-[19px] font-bold text-ink">{title}</h3>
        {description ? <p className="text-[14.5px] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {children ? <div className="mt-1 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </div>
  )
}
