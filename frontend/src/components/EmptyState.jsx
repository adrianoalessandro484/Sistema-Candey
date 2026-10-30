export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      {Icon ? (
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-candey-50 text-candey ring-1 ring-candey/10 ring-inset">
          <Icon size={30} aria-hidden="true" />
        </span>
      ) : null}
      <div className="flex max-w-sm flex-col items-center gap-1.5">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        {description ? <p className="text-[14px] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-3">{children}</div> : null}
    </div>
  )
}
