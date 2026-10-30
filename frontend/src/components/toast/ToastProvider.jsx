import { Toaster, toast } from 'sonner'
import { ToastContext } from './toastContext.js'

const NOTIFIERS = {
  success: toast.success,
  error: toast.error,
  info: toast.info,
  warning: toast.warning,
}

export function ToastProvider({ children }) {
  function notify(message, type = 'info') {
    const notifier = NOTIFIERS[type] ?? NOTIFIERS.info
    return notifier(message)
  }

  return (
    <ToastContext.Provider value={{ notify, close: toast.dismiss }}>
      {children}
      <Toaster
        position="top-right"
        closeButton
        visibleToasts={4}
        gap={10}
        offset={18}
        toastOptions={{ duration: 4200 }}
      />
    </ToastContext.Provider>
  )
}
