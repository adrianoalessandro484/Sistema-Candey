import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { XCircle } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Textarea from '../Textarea.jsx'
import FormError from '../FormError.jsx'
import { rejectBranchRequestSchema } from '../../schemas/branchRequestSchema.js'

export default function BranchRequestRejectModal({ open, request, onClose, onReject }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(rejectBranchRequestSchema),
    defaultValues: { reason: '' },
  })

  useEffect(() => {
    if (open) reset({ reason: '' })
  }, [open, reset])

  if (!request) return null

  async function submit(values) {
    try {
      await onReject(request.id, values.reason)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo rechazar el requerimiento.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Rechazar ${request.code}`}
      description={`Indica a ${request.branchName} por qué se rechaza el requerimiento completo.`}
      icon={XCircle}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="reject-request-form" variant="danger" loading={isSubmitting}>
            Confirmar rechazo
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4">
        <FormError message={errors.root?.message} />
        <form id="reject-request-form" onSubmit={handleSubmit(submit)} noValidate>
          <Textarea
            id="reason"
            label="Motivo del rechazo"
            required
            rows={3}
            placeholder="Ej. Lote en cuarentena o stock dañado en revisión física..."
            error={errors.reason?.message}
            {...register('reason')}
          />
        </form>
      </div>
    </Modal>
  )
}
