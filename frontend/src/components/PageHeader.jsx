export default function PageHeader({ title, description, eyebrow, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface/90 px-5 py-5 shadow-[var(--shadow-card)] backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-4">
        {Icon ? (
          <span className="hidden h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-candey-50 text-candey ring-1 ring-candey/15 ring-inset sm:inline-flex">
            <Icon size={24} aria-hidden="true" />
          </span>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-candey-50 px-2.5 py-0.5 text-[11px] font-bold tracking-[0.14em] text-candey uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-candey" aria-hidden="true" />
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[31px]">{title}</h1>
          {description ? <p className="text-[14.5px] leading-relaxed text-muted">{description}</p> : null}
        </div>
      </div>
      {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
    </div>
  )
}
