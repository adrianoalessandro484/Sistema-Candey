export default function Card({ children, className = '' }) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] ${className}`.trim()}
    >
      {children}
    </div>
  )
}
