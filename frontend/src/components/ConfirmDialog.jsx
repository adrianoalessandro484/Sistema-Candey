import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import { TriangleAlert } from 'lucide-react'
import Button from './Button.jsx'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AlertDialogPrimitive.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onCancel?.()
      }}
    >
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Backdrop className="dialog-backdrop" />
        <AlertDialogPrimitive.Popup className="confirm-popup">
          <div className="flex items-start gap-4 px-6 pt-6">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger-bg text-danger">
              <TriangleAlert size={23} aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
              <AlertDialogPrimitive.Title className="text-[18px] leading-tight font-bold text-ink">
                {title}
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="text-[14px] leading-relaxed text-muted">
                {message}
              </AlertDialogPrimitive.Description>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line bg-surface-2 px-6 py-4 sm:flex-row sm:justify-end">
            <AlertDialogPrimitive.Close
              disabled={loading}
              render={<Button variant="secondary" disabled={loading} />}
            >
              Cancelar
            </AlertDialogPrimitive.Close>
            <AlertDialogPrimitive.Close
              disabled={loading}
              onClick={onConfirm}
              render={
                <Button
                  variant={variant === 'danger' ? 'danger' : 'primary'}
                  loading={loading}
                  disabled={loading}
                />
              }
            >
              {confirmText}
            </AlertDialogPrimitive.Close>
          </div>
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
