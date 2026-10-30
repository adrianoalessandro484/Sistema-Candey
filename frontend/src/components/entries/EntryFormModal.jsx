import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDownToLine, Plus, Trash2 } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Textarea from '../Textarea.jsx'
import FormError from '../FormError.jsx'
import { formatCurrency } from '../../utils/format.js'
import { entrySchema, emptyEntryLine } from '../../schemas/entrySchema.js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function EntryFormModal({ open, onClose, onSave, products, suppliers }) {
  const { register, control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      supplierId: '',
      date: today(),
      note: '',
      lines: [{ ...emptyEntryLine }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = useWatch({ control, name: 'lines' }) ?? []
  const totalUnits = lines.reduce((total, line) => total + Number(line.quantity || 0), 0)
  const totalCost = lines.reduce(
    (total, line) => total + Number(line.quantity || 0) * Number(line.unitCost || 0),
    0,
  )

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo registrar la entrada.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva entrada"
      description="Registra el ingreso de uno o más productos con su lote y costo."
      icon={ArrowDownToLine}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="entry-form" loading={isSubmitting}>
            Registrar entrada
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4">
        <FormError message={errors.root?.message} />

        <form id="entry-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select id="supplierId" label="Proveedor" required error={errors.supplierId?.message} {...register('supplierId')}>
              <option value="">Seleccione un proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>

            <Input id="date" label="Fecha de ingreso" required type="date" error={errors.date?.message} {...register('date')} />
          </div>

          <Textarea
            id="note"
            label="Observación"
            rows={2}
            placeholder="Nota o referencia (opcional)"
            error={errors.note?.message}
            {...register('note')}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Productos y lotes</h3>
              <Button variant="secondary" type="button" onClick={() => append({ ...emptyEntryLine })}>
                <Plus size={16} />
                Agregar producto
              </Button>
            </div>

            {typeof errors.lines?.message === 'string' ? (
              <span className="text-xs text-danger" role="alert">
                {errors.lines.message}
              </span>
            ) : null}

            {fields.map((field, index) => (
              <div key={field.id} className="rounded-xl border border-line bg-surface-2 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                    Producto {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                    Quitar
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Select
                      id={`product-${index}`}
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
                    id={`lot-${index}`}
                    label="Lote"
                    placeholder="Ej. L-2026-01"
                    error={errors.lines?.[index]?.lotCode?.message}
                    {...register(`lines.${index}.lotCode`)}
                  />

                  <Input
                    id={`quantity-${index}`}
                    label="Cantidad"
                    type="number"
                    min="1"
                    error={errors.lines?.[index]?.quantity?.message}
                    {...register(`lines.${index}.quantity`)}
                  />

                  <Input
                    id={`cost-${index}`}
                    label="Costo unitario"
                    type="number"
                    step="0.01"
                    min="0"
                    error={errors.lines?.[index]?.unitCost?.message}
                    {...register(`lines.${index}.unitCost`)}
                  />

                  <Input
                    id={`expiration-${index}`}
                    label="Vencimiento"
                    type="date"
                    error={errors.lines?.[index]?.expirationDate?.message}
                    {...register(`lines.${index}.expirationDate`)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-6 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm">
            <span className="text-muted">
              Unidades: <strong className="text-ink">{totalUnits}</strong>
            </span>
            <span className="text-muted">
              Costo total: <strong className="text-ink">{formatCurrency(totalCost)}</strong>
            </span>
          </div>
        </form>
      </div>
    </Modal>
  )
}
