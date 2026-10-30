import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
  size = 'md',
}) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose?.()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="dialog-backdrop" />
        <DialogPrimitive.Popup className={`dialog-popup ${SIZES[size] ?? SIZES.md}`}>
          <div className="flex items-start gap-3.5 border-b border-line bg-[linear-gradient(180deg,#ffffff_0%,var(--color-surface-2)_100%)] px-6 py-5">
            {Icon ? (
              <span className="brand-gradient mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]">
                <Icon size={21} aria-hidden="true" />
              </span>
            ) : null}

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <DialogPrimitive.Title className="text-[19px] leading-tight font-bold text-ink">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-[13px] leading-relaxed text-muted">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>

            <DialogPrimitive.Close
              aria-label="Cerrar ventana"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted transition-colors hover:border-line hover:bg-white hover:text-ink"
            >
              <X size={19} />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

          {footer ? (
            <div className="flex flex-col-reverse gap-2 border-t border-line bg-surface-2 px-6 py-4 sm:flex-row sm:justify-end">
              {footer}
            </div>
          ) : null}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
