export function Avatar({ children, className = '' }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none ${className}`.trim()}
    >
      {children}
    </span>
  )
}

export function AvatarFallback({ children, className = '' }) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center rounded-full bg-candey-light font-bold text-candey-dark ${className}`.trim()}
    >
      {children}
    </span>
  )
}
