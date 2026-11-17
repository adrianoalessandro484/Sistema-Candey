const TONES = {
  default: 'hover:border-candey/55 hover:bg-candey-50 hover:text-candey',
  gold: 'hover:border-gold/65 hover:bg-gold-50 hover:text-gold-dark',
  danger: 'hover:border-danger/50 hover:bg-danger-bg hover:text-danger',
}

export default function IconButton({ title, tone = 'default', className = '', children, ...rest }) {
  return (
    <div className="group/iconbtn relative inline-flex">
      <button
        type="button"
        aria-label={title}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-white text-muted shadow-[0_1px_2px_rgba(27,20,24,0.04)] transition-all duration-150 hover:-translate-y-px active:scale-95 focus-visible:ring-4 focus-visible:ring-candey/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-[18px] ${
          TONES[tone] ?? TONES.default
        } ${className}`.trim()}
        {...rest}
      >
        {children}
      </button>

      {title ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute -top-9 left-1/2 z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-wine px-2.5 py-1 text-[11.5px] font-semibold text-white opacity-0 shadow-md transition-all duration-150 group-hover/iconbtn:translate-y-0 group-hover/iconbtn:opacity-100 group-focus-within/iconbtn:translate-y-0 group-focus-within/iconbtn:opacity-100"
        >
          {title}
        </span>
      ) : null}
    </div>
  )
}
