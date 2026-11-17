import { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PackagePlus, Plus, Trash2 } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Textarea from '../Textarea.jsx'
import FormError from '../FormError.jsx'
import { createEntryOrderSchema, emptyOrderLine } from '../../schemas/entryOrderSchema.js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function EntryOrderFormModal({
  open,
  onClose,
  onSave,
  products,
  suppliers,
  initialLines = null,
  initialNote = '',
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createEntryOrderSchema),
    defaultValues: {
      supplierId: '',
      orderDate: today(),
      expectedDate: '',
      note: '',
      lines: [{ ...emptyOrderLine }],
    },
  })

  useEffect(() => {
    if (!open) return
    reset({
      supplierId: '',
      orderDate: today(),
      expectedDate: '',
      note: initialNote || '',
      lines: initialLines?.length ? initialLines : [{ ...emptyOrderLine }],
    })
  }, [open, initialLines, initialNote, reset])

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = useWatch({ control, name: 'lines' }) ?? []
  const totalUnits = lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0)

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo crear la orden de ingreso.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva orden de ingreso"
      description="Programa un pedido a proveedor para que el técnico de entrada lo reciba con lotes."
      icon={PackagePlus}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="entry-order-form" loading={isSubmitting}>
            Crear orden
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4">
        <FormError message={errors.root?.message} />

        <form id="entry-order-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              id="order-supplierId"
              label="Proveedor"
              required
              error={errors.supplierId?.message}
              {...register('supplierId')}
            >
              <option value="">Seleccione un proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>

            <Input
              id="order-date"
              label="Fecha de orden"
              required
              type="date"
              error={errors.orderDate?.message}
              {...register('orderDate')}
            />

            <Input
              id="order-expected"
              label="Llegada estimada"
              type="date"
              error={errors.expectedDate?.message}
              {...register('expectedDate')}
            />
          </div>

          <Textarea
            id="order-note"
            label="Observación"
            rows={2}
            placeholder="Nota para el técnico de entrada (opcional)"
            error={errors.note?.message}
            {...register('note')}
          />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[15px] font-bold text-ink">Productos esperados</h3>
              <Button variant="soft" size="sm" type="button" onClick={() => append({ ...emptyOrderLine })}>
                <Plus size={18} />
                Agregar producto
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="rounded-2xl border border-line bg-surface-2 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-candey-50 px-3 py-1 text-[11.5px] font-bold tracking-wide text-candey uppercase">
                    Ítem {index + 1}
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

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <Select
                    id={`ord-product-${index}`}
                    label="Producto"
                    required
                    className="sm:col-span-2"
                    error={errors.lines?.[index]?.productId?.message}
                    {...register(`lines.${index}.productId`)}
                  >
                    <option value="">Seleccione un producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.unitName})
                      </option>
                    ))}
                  </Select>

                  <Input
                    id={`ord-qty-${index}`}
                    label="Cantidad solicitada"
                    required
                    type="number"
                    min="1"
                    error={errors.lines?.[index]?.quantity?.message}
                    {...register(`lines.${index}.quantity`)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-candey/20 bg-candey-50/45 px-5 py-4 text-[14.5px]">
            <span className="font-medium text-body">Resumen de la orden ({fields.length} producto(s))</span>
            <span className="text-muted tabular-nums">
              Unidades esperadas: <strong className="text-[17px] text-candey-dark">{totalUnits}</strong>
            </span>
          </div>
        </form>
      </div>
    </Modal>
  )
}
