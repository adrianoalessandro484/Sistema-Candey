import { CircleAlert } from 'lucide-react'

export default function FormError({ message }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger-bg px-4 py-3 text-[13.5px] font-medium text-danger"
    >
      <CircleAlert size={18} className="mt-px shrink-0" />
      <span>{message}</span>
    </div>
  )
}
