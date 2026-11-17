import { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpFromLine, Plus, Trash2 } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Textarea from '../Textarea.jsx'
import FormError from '../FormError.jsx'
import { formatShortDate } from '../../utils/format.js'
import { EXIT_REASONS } from '../../utils/catalogs.js'
import { getAvailableLots } from '../../services/lotService.js'
import { exitSchema, emptyExitLine } from '../../schemas/exitSchema.js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function ExitFormModal({ open, onClose, onSave, products, branches }) {
  const [lotsByLine, setLotsByLine] = useState({})
  const { register, control, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(exitSchema),
    defaultValues: {
      reason: EXIT_REASONS[0],
      date: today(),
      branchId: '',
      note: '',
      lines: [{ ...emptyExitLine }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = useWatch({ control, name: 'lines' }) ?? []
  const totalUnits = lines.reduce((total, line) => total + Number(line.quantity || 0), 0)

  function loadLots(fieldId, productId) {
    if (!productId) {
      setLotsByLine((current) => ({ ...current, [fieldId]: [] }))
      return
    }

    getAvailableLots(productId)
      .then((data) => setLotsByLine((current) => ({ ...current, [fieldId]: data })))
      .catch(() => {
        setLotsByLine((current) => ({ ...current, [fieldId]: [] }))
      })
  }

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo registrar la salida.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva salida"
      description="Registra el despacho de productos respetando el orden FEFO."
      icon={ArrowUpFromLine}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="exit-form" loading={isSubmitting}>
            Registrar salida
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4">
        <FormError message={errors.root?.message} />

        <form id="exit-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select id="reason" label="Motivo" required error={errors.reason?.message} {...register('reason')}>
              {EXIT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </Select>

            <Select id="branchId" label="Sucursal destino" required error={errors.branchId?.message} {...register('branchId')}>
              <option value="">Seleccione una sucursal</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </Select>

            <Input id="date" label="Fecha de salida" required type="date" error={errors.date?.message} {...register('date')} />
          </div>

          <Textarea
            id="note"
            label="Observación"
            rows={2}
            placeholder="Destino, cliente o referencia (opcional)"
            error={errors.note?.message}
            {...register('note')}
          />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <h3 className="text-[15px] font-bold text-ink">Productos y lotes</h3>
                <p className="text-[12.5px] text-muted">Los lotes se ordenan por fecha de vencimiento (FEFO)</p>
              </div>
              <Button variant="soft" size="sm" type="button" onClick={() => append({ ...emptyExitLine })}>
                <Plus size={18} />
                Agregar producto
              </Button>
            </div>

            {typeof errors.lines?.message === 'string' ? (
              <span className="text-xs font-medium text-danger" role="alert">
                {errors.lines.message}
              </span>
            ) : null}

            {fields.map((field, index) => {
              const lots = lotsByLine[field.id] ?? []

              return (
                <div key={field.id} className="rounded-2xl border border-line bg-surface-2 p-4">
                  <div className="mb-3.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-candey-50 px-3 py-1 text-[11.5px] font-bold tracking-wide text-candey uppercase">
                      Línea {index + 1}
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
                      id={`product-${index}`}
                      label="Producto"
                      required
                      className="lg:col-span-2"
                      error={errors.lines?.[index]?.productId?.message}
                      {...register(`lines.${index}.productId`, {
                        onChange: (event) => {
                          setValue(`lines.${index}.lotId`, '')
                          setValue(`lines.${index}.quantity`, 1)
                          loadLots(field.id, event.target.value)
                        },
                      })}
                    >
                      <option value="">Seleccione un producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (stock {product.stock})
                        </option>
                      ))}
                    </Select>

                    <Select
                      id={`lot-${index}`}
                      label="Lote"
                      disabled={lots.length === 0}
                      error={errors.lines?.[index]?.lotId?.message}
                      {...register(`lines.${index}.lotId`)}
                    >
                      <option value="">{lots.length ? 'Seleccione un lote' : 'Sin lotes disponibles'}</option>
                      {lots.map((lot) => (
                        <option key={lot.id} value={lot.id}>
                          {lot.lotCode} · {lot.available} disp. · vence {formatShortDate(lot.expirationDate)}
                        </option>
                      ))}
                    </Select>

                    <Input
                      id={`quantity-${index}`}
                      label="Cantidad"
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

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-candey/20 bg-candey-50/45 px-5 py-4 text-[14.5px]">
            <span className="font-medium text-body">Resumen de despacho ({fields.length} línea(s))</span>
            <span className="text-muted tabular-nums">
              Unidades a despachar: <strong className="text-[17px] text-candey-dark">{totalUnits}</strong>
            </span>
          </div>
        </form>
      </div>
    </Modal>
  )
}
