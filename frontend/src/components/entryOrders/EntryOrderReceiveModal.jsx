import { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PackageCheck, Plus, Trash2 } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Textarea from '../Textarea.jsx'
import FormError from '../FormError.jsx'
import { formatCurrency } from '../../utils/format.js'
import { receiveEntryOrderSchema } from '../../schemas/entryOrderSchema.js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function EntryOrderReceiveModal({ open, order, products, onClose, onReceive }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(receiveEntryOrderSchema),
    defaultValues: { date: today(), note: '', lines: [] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = useWatch({ control, name: 'lines' }) ?? []

  useEffect(() => {
    if (!open || !order) return

    reset({
      date: today(),
      note: order.note ?? '',
      lines: order.lines.map((line) => ({
        productId: String(line.productId),
        lotCode: '',
        quantity: line.requestedQuantity,
        unitCost: 0,
        expirationDate: '',
      })),
    })
  }, [open, order, reset])

  if (!order) return null

  const totalUnits = lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0)
  const totalCost = lines.reduce(
    (sum, line) => sum + Number(line.quantity || 0) * Number(line.unitCost || 0),
    0,
  )

  async function submit(values) {
    try {
      await onReceive(order.id, values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo registrar la recepción de la orden.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Recibir orden ${order.code}`}
      description={`Registra los lotes, vencimientos y costos reales entregados por ${order.supplierName}.`}
      icon={PackageCheck}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="receive-order-form" loading={isSubmitting}>
            Registrar ingreso
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4">
        <FormError message={errors.root?.message} />

        <form id="receive-order-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="rec-supplier" label="Proveedor" value={order.supplierName} disabled />
            <Input
              id="rec-date"
              label="Fecha de ingreso"
              required
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
          </div>

          <Textarea
            id="rec-note"
            label="Observación de recepción"
            rows={2}
            placeholder="Guía de remisión o nota (opcional)"
            error={errors.note?.message}
            {...register('note')}
          />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[15px] font-bold text-ink">Lotes recibidos</h3>
              <Button
                variant="soft"
                size="sm"
                type="button"
                onClick={() =>
                  append({
                    productId: order.lines[0]?.productId ? String(order.lines[0].productId) : '',
                    lotCode: '',
                    quantity: 1,
                    unitCost: 0,
                    expirationDate: '',
                  })
                }
              >
                <Plus size={18} />
                Agregar lote
              </Button>
            </div>

            {fields.map((field, index) => {
              const current = lines[index] ?? {}
              const subtotal = Number(current.quantity || 0) * Number(current.unitCost || 0)

              return (
                <div key={field.id} className="rounded-2xl border border-line bg-surface-2 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center rounded-full bg-candey-50 px-3 py-1 text-[11.5px] font-bold tracking-wide text-candey uppercase">
                        Lote {index + 1}
                      </span>
                      <span className="text-[13px] font-semibold text-muted tabular-nums">
                        Subtotal: <strong className="text-ink">{formatCurrency(subtotal)}</strong>
                      </span>
                    </div>
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
                      id={`rec-product-${index}`}
                      label="Producto"
                      required
                      className="sm:col-span-2 lg:col-span-4"
                      error={errors.lines?.[index]?.productId?.message}
                      {...register(`lines.${index}.productId`)}
                    >
                      <option value="">Seleccione un producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </Select>

                    <Input
                      id={`rec-lot-${index}`}
                      label="Código de lote"
                      required
                      placeholder="Ej. L-2026-05"
                      error={errors.lines?.[index]?.lotCode?.message}
                      {...register(`lines.${index}.lotCode`)}
                    />

                    <Input
                      id={`rec-qty-${index}`}
                      label="Cantidad recibida"
                      required
                      type="number"
                      min="1"
                      error={errors.lines?.[index]?.quantity?.message}
                      {...register(`lines.${index}.quantity`)}
                    />

                    <Input
                      id={`rec-cost-${index}`}
                      label="Costo unitario"
                      type="number"
                      step="0.01"
                      min="0"
                      error={errors.lines?.[index]?.unitCost?.message}
                      {...register(`lines.${index}.unitCost`)}
                    />

                    <Input
                      id={`rec-exp-${index}`}
                      label="Vencimiento"
                      type="date"
                      error={errors.lines?.[index]?.expirationDate?.message}
                      {...register(`lines.${index}.expirationDate`)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-candey/20 bg-candey-50/45 px-5 py-4 text-[14.5px]">
            <span className="font-medium text-body">Resumen del ingreso ({fields.length} lote(s))</span>
            <div className="flex flex-wrap items-center gap-6 tabular-nums">
              <span className="text-muted">
                Unidades: <strong className="text-[16px] text-ink">{totalUnits}</strong>
              </span>
              <span className="text-muted">
                Costo total: <strong className="text-[17px] text-candey-dark">{formatCurrency(totalCost)}</strong>
              </span>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}
