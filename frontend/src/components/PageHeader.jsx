export default function PageHeader({ title, description, eyebrow, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow ? (
          <span className="text-[11px] font-bold tracking-[0.16em] text-candey uppercase">{eyebrow}</span>
        ) : null}
        <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[30px]">{title}</h1>
        {description ? <p className="text-[14.5px] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
    </div>
  )
}
