import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CheckCircle2, ClipboardCheck } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Textarea from '../Textarea.jsx'
import FormError from '../FormError.jsx'
import { receptionSchema } from '../../schemas/branchRequestSchema.js'

export default function BranchRequestReceptionModal({ open, request, onClose, onConfirm }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(receptionSchema),
    defaultValues: { hasIncident: false, note: '' },
  })

  const hasIncident = useWatch({ control, name: 'hasIncident' })

  useEffect(() => {
    if (open) reset({ hasIncident: false, note: '' })
  }, [open, reset])

  if (!request) return null

  async function submit(values) {
    try {
      await onConfirm(request.id, values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo registrar la recepción.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Confirmar llegada · ${request.code}`}
      description={`Despacho ${request.exitCode || ''} hacia ${request.branchName} (${request.totalUnits} u.).`}
      icon={ClipboardCheck}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="reception-form"
            variant={hasIncident ? 'danger' : 'primary'}
            loading={isSubmitting}
          >
            {hasIncident ? 'Reportar incidencia' : 'Confirmar recepción'}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-5">
        <FormError message={errors.root?.message} />

        <div className="rounded-2xl border border-line bg-surface-2 p-3.5">
          <p className="mb-2 text-[11.5px] font-bold tracking-wider text-muted uppercase">
            Productos despachados
          </p>
          <ul className="flex flex-col gap-1.5 text-[13.5px]">
            {request.lines.map((line) => (
              <li key={line.productId} className="flex items-center justify-between gap-2 tabular-nums">
                <span className="font-medium text-ink">{line.productName}</span>
                <strong className="text-body">{line.requestedQuantity} u.</strong>
              </li>
            ))}
          </ul>
        </div>

        <form id="reception-form" className="flex flex-col gap-4" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setValue('hasIncident', false, { shouldValidate: true })}
              className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                !hasIncident
                  ? 'border-ok bg-ok-bg/60 ring-2 ring-ok/25'
                  : 'border-line-strong bg-white hover:border-ok/40'
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ok-bg text-ok">
                <CheckCircle2 size={20} />
              </span>
              <span className="text-[14.5px] font-bold text-ink">Llegó conforme</span>
              <span className="text-[12.5px] text-muted">Recibí todas las unidades completas y en buen estado.</span>
            </button>

            <button
              type="button"
              onClick={() => setValue('hasIncident', true, { shouldValidate: true })}
              className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                hasIncident
                  ? 'border-danger bg-danger-bg/70 ring-2 ring-danger/25'
                  : 'border-line-strong bg-white hover:border-danger/40'
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-danger-bg text-danger">
                <AlertTriangle size={20} />
              </span>
              <span className="text-[14.5px] font-bold text-ink">Reportar incidencia</span>
              <span className="text-[12.5px] text-muted">Faltan unidades, llegó dañado o no llegó el despacho.</span>
            </button>
          </div>

          <Textarea
            id="reception-note"
            label={hasIncident ? 'Detalle de la incidencia o faltante' : 'Comentario de recepción (opcional)'}
            required={hasIncident}
            rows={3}
            placeholder={
              hasIncident
                ? 'Ej. Salieron 15 unidades pero solo llegaron 12...'
                : 'Ej. Recibido sin novedades'
            }
            error={errors.note?.message}
            {...register('note')}
          />
        </form>
      </div>
    </Modal>
  )
}
