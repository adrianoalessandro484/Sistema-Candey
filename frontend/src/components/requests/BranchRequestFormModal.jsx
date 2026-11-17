import { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClipboardList, Plus, Trash2 } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Textarea from '../Textarea.jsx'
import FormError from '../FormError.jsx'
import { createBranchRequestSchema, emptyBranchRequestLine } from '../../schemas/branchRequestSchema.js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function BranchRequestFormModal({
  open,
  onClose,
  onSave,
  products,
  branches,
  lockedBranchId = null,
  lockedBranchName = null,
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createBranchRequestSchema),
    defaultValues: {
      date: today(),
      branchId: lockedBranchId ? String(lockedBranchId) : '',
      note: '',
      lines: [{ ...emptyBranchRequestLine }],
    },
  })

  useEffect(() => {
    if (!open) return
    reset({
      date: today(),
      branchId: lockedBranchId ? String(lockedBranchId) : '',
      note: '',
      lines: [{ ...emptyBranchRequestLine }],
    })
  }, [open, lockedBranchId, reset])

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = useWatch({ control, name: 'lines' }) ?? []
  const totalUnits = lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0)

  async function submit(values) {
    if (!lockedBranchId && (!values.branchId || Number(values.branchId) <= 0)) {
      setError('branchId', { message: 'Seleccione una sucursal' })
      return
    }

    for (let i = 0; i < values.lines.length; i += 1) {
      const line = values.lines[i]
      const product = products.find((p) => p.id === Number(line.productId))
      if (product && Number(line.quantity) > product.availableStock) {
        setError(`lines.${i}.quantity`, {
          message: `Solo hay ${product.availableStock} u. disponibles para pedir`,
        })
        return
      }
    }

    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo enviar el requerimiento.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo requerimiento a almacén"
      description="Solicita mercadería verificando el stock disponible en almacén central."
      icon={ClipboardList}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="branch-request-form" loading={isSubmitting}>
            Enviar requerimiento
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4">
        <FormError message={errors.root?.message} />

        <form id="branch-request-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lockedBranchId ? (
              <Input
                id="branchDisplay"
                label="Sucursal solicitante"
                value={lockedBranchName || `Sucursal #${lockedBranchId}`}
                disabled
              />
            ) : (
              <Select
                id="branchId"
                label="Sucursal solicitante"
                required
                error={errors.branchId?.message}
                {...register('branchId')}
              >
                <option value="">Seleccione una sucursal</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </Select>
            )}

            <Input
              id="date"
              label="Fecha del pedido"
              required
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
          </div>

          <Textarea
            id="note"
            label="Observación o urgencia"
            rows={2}
            placeholder="Ej. Reposición fin de semana (opcional)"
            error={errors.note?.message}
            {...register('note')}
          />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <h3 className="text-[15px] font-bold text-ink">Productos solicitados</h3>
                <p className="text-[12.5px] text-muted">
                  El disponible ya descuenta los pedidos pendientes de otras sucursales.
                </p>
              </div>
              <Button variant="soft" size="sm" type="button" onClick={() => append({ ...emptyBranchRequestLine })}>
                <Plus size={18} />
                Agregar producto
              </Button>
            </div>

            {fields.map((field, index) => {
              const selectedId = Number(lines[index]?.productId || 0)
              const selectedProduct = products.find((p) => p.id === selectedId)

              return (
                <div key={field.id} className="rounded-2xl border border-line bg-surface-2 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center rounded-full bg-candey-50 px-3 py-1 text-[11.5px] font-bold tracking-wide text-candey uppercase">
                        Ítem {index + 1}
                      </span>
                      {selectedProduct ? (
                        <span
                          className={`text-[12.5px] font-semibold tabular-nums ${
                            selectedProduct.availableStock > 0 ? 'text-ok' : 'text-danger'
                          }`}
                        >
                          Disponible: {selectedProduct.availableStock} u.
                          {selectedProduct.committedStock > 0
                            ? ` (${selectedProduct.committedStock} comprometidas)`
                            : ''}
                        </span>
                      ) : null}
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

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    <Select
                      id={`req-product-${index}`}
                      label="Producto"
                      required
                      className="sm:col-span-2"
                      error={errors.lines?.[index]?.productId?.message}
                      {...register(`lines.${index}.productId`)}
                    >
                      <option value="">Seleccione un producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id} disabled={product.availableStock <= 0}>
                          {product.name} · {product.availableStock} disp. ({product.unitName})
                        </option>
                      ))}
                    </Select>

                    <Input
                      id={`req-qty-${index}`}
                      label="Cantidad"
                      required
                      type="number"
                      min="1"
                      max={selectedProduct?.availableStock || undefined}
                      error={errors.lines?.[index]?.quantity?.message}
                      {...register(`lines.${index}.quantity`)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-candey/20 bg-candey-50/45 px-5 py-4 text-[14.5px]">
            <span className="font-medium text-body">Resumen del requerimiento ({fields.length} ítem(s))</span>
            <span className="text-muted tabular-nums">
              Total unidades: <strong className="text-[17px] text-candey-dark">{totalUnits}</strong>
            </span>
          </div>
        </form>
      </div>
    </Modal>
  )
}
