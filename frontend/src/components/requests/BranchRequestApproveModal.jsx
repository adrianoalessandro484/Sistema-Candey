import { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Textarea from '../Textarea.jsx'
import FormError from '../FormError.jsx'
import Badge from '../Badge.jsx'
import Spinner from '../Spinner.jsx'
import { formatShortDate } from '../../utils/format.js'
import { getAvailableLots } from '../../services/lotService.js'
import { approveBranchRequestSchema } from '../../schemas/branchRequestSchema.js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function allocateFefo(requestLines, lotsMap) {
  const allocated = []

  for (const item of requestLines) {
    const lots = lotsMap[item.productId] ?? []
    let remaining = item.requestedQuantity

    for (const lot of lots) {
      if (remaining <= 0) break
      const take = Math.min(remaining, lot.available)
      if (take > 0) {
        allocated.push({
          productId: item.productId,
          lotId: String(lot.id),
          quantity: take,
        })
        remaining -= take
      }
    }

    if (remaining > 0) {
      allocated.push({
        productId: item.productId,
        lotId: '',
        quantity: remaining,
      })
    }
  }

  return allocated
}

export default function BranchRequestApproveModal({ open, request, onClose, onApprove }) {
  const [lotsByProduct, setLotsByProduct] = useState({})
  const [loadingLots, setLoadingLots] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(approveBranchRequestSchema),
    defaultValues: { date: today(), note: '', lines: [] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const watchedLines = useWatch({ control, name: 'lines' }) ?? []

  useEffect(() => {
    if (!open || !request) return

    let active = true
    const fetchLots = async () => {
      setLoadingLots(true)
      try {
        const entries = await Promise.all(
          request.lines.map(async (line) => {
            const lots = await getAvailableLots(line.productId)
            return [line.productId, lots]
          }),
        )

        if (!active) return
        const map = Object.fromEntries(entries)
        setLotsByProduct(map)
        reset({
          date: today(),
          note: request.note ?? '',
          lines: allocateFefo(request.lines, map),
        })
      } finally {
        if (active) setLoadingLots(false)
      }
    }

    fetchLots()
    return () => {
      active = false
    }
  }, [open, request, reset])

  if (!request) return null

  const assignedByProduct = watchedLines.reduce((acc, line) => {
    const pid = Number(line.productId)
    acc[pid] = (acc[pid] ?? 0) + Number(line.quantity || 0)
    return acc
  }, {})

  const allExact = request.lines.every(
    (item) => (assignedByProduct[item.productId] ?? 0) === item.requestedQuantity,
  )

  async function submit(values) {
    if (!allExact) {
      setError('root', {
        message: 'La aprobación es completa: la suma de lotes asignados debe coincidir con la cantidad solicitada en cada producto.',
      })
      return
    }

    try {
      await onApprove(request.id, values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo aprobar y despachar el requerimiento.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Aprobar y despachar ${request.code}`}
      description={`Asigna los lotes FEFO para enviar el pedido completo a ${request.branchName}.`}
      icon={CheckCircle2}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="approve-request-form" loading={isSubmitting} disabled={loadingLots}>
            Aprobar y generar salida
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-5">
        <FormError message={errors.root?.message} />

        <div className="rounded-2xl border border-line bg-surface-2 p-4">
          <p className="mb-2.5 text-[12px] font-bold tracking-wider text-muted uppercase">
            Resumen requerido por {request.branchName}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {request.lines.map((item) => {
              const assigned = assignedByProduct[item.productId] ?? 0
              const matches = assigned === item.requestedQuantity
              return (
                <div
                  key={item.productId}
                  className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-[13px] tabular-nums"
                >
                  <span className="font-semibold text-ink">{item.productName}:</span>
                  <Badge tone={matches ? 'ok' : 'warn'} dot>
                    {assigned} / {item.requestedQuantity} u.
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>

        {loadingLots ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-line py-12 text-sm text-muted">
            <Spinner className="size-5 text-candey" />
            Calculando lotes FEFO disponibles...
          </div>
        ) : (
          <form id="approve-request-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="approve-date"
                label="Fecha de despacho"
                required
                type="date"
                error={errors.date?.message}
                {...register('date')}
              />
              <Textarea
                id="approve-note"
                label="Observación de despacho"
                rows={1}
                placeholder="Referencia del reparto (opcional)"
                error={errors.note?.message}
                {...register('note')}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-[15px] font-bold text-ink">Asignación por lote (FEFO)</h3>
                <Button
                  variant="soft"
                  size="sm"
                  type="button"
                  onClick={() =>
                    append({
                      productId: request.lines[0]?.productId ?? '',
                      lotId: '',
                      quantity: 1,
                    })
                  }
                >
                  <Plus size={18} />
                  Dividir en otro lote
                </Button>
              </div>

              {fields.map((field, index) => {
                const productId = Number(watchedLines[index]?.productId || 0)
                const lots = lotsByProduct[productId] ?? []

                return (
                  <div key={field.id} className="rounded-2xl border border-line bg-surface-2 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-full bg-candey-50 px-3 py-1 text-[11.5px] font-bold tracking-wide text-candey uppercase">
                        Lote #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line-strong bg-white px-3.5 text-[13px] font-semibold text-muted transition-all hover:border-danger/50 hover:bg-danger-bg hover:text-danger active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                        Quitar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                      <Select
                        id={`app-product-${index}`}
                        label="Producto"
                        required
                        error={errors.lines?.[index]?.productId?.message}
                        {...register(`lines.${index}.productId`)}
                      >
                        {request.lines.map((item) => (
                          <option key={item.productId} value={item.productId}>
                            {item.productName}
                          </option>
                        ))}
                      </Select>

                      <Select
                        id={`app-lot-${index}`}
                        label="Lote (orden FEFO)"
                        required
                        className="lg:col-span-2"
                        error={errors.lines?.[index]?.lotId?.message}
                        {...register(`lines.${index}.lotId`)}
                      >
                        <option value="">
                          {lots.length ? 'Seleccione un lote' : 'Sin lotes disponibles'}
                        </option>
                        {lots.map((lot) => (
                          <option key={lot.id} value={lot.id}>
                            {lot.lotCode} · {lot.available} disp. · vence {formatShortDate(lot.expirationDate)}
                          </option>
                        ))}
                      </Select>

                      <Input
                        id={`app-qty-${index}`}
                        label="Cantidad"
                        required
                        type="number"
                        min="1"
                        error={errors.lines?.[index]?.quantity?.message}
                        {...register(`lines.${index}.quantity`)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
