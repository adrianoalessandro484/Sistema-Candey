export default function Logo({ compact = false }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <img
        src="/logo.svg"
        alt="Candey"
        className={`rounded-xl object-contain ring-1 ring-black/5 ${compact ? 'h-10 w-10' : 'h-14 w-14'}`}
      />
    </div>
  )
}
