import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Boxes, Hash, Tag } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Toggle from '../Toggle.jsx'
import FormError from '../FormError.jsx'
import { unitSchema } from '../../schemas/unitSchema.js'

const EMPTY_UNIT = { name: '', abbreviation: '', factor: 1, active: true }

export default function UnitFormModal({ open, mode, unit, onClose, onSave }) {
  const isEdit = mode === 'edit'
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(unitSchema),
    defaultValues: EMPTY_UNIT,
  })

  useEffect(() => {
    if (!open) return

    if (isEdit && unit) {
      reset({
        name: unit.name,
        abbreviation: unit.abbreviation,
        factor: unit.factor,
        active: unit.active,
      })
    } else {
      reset(EMPTY_UNIT)
    }
  }, [open, isEdit, unit, reset])

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo guardar la unidad.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar unidad' : 'Nueva unidad'}
      description="Define las presentaciones en las que se almacenan los productos."
      icon={Boxes}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="unit-form" loading={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Crear unidad'}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-5">
        <form id="unit-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <FormError message={errors.root?.message} />

          <Input
            id="name"
            label="Nombre de la unidad"
            required
            icon={Tag}
            placeholder="Ej. Caja"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="abbreviation"
              label="Abreviatura"
              required
              icon={Hash}
              placeholder="Ej. CJA"
              error={errors.abbreviation?.message}
              {...register('abbreviation')}
            />
            <Input
              id="factor"
              label="Unidades que contiene"
              type="number"
              min="1"
              hint="Ej. una caja contiene 12 unidades."
              error={errors.factor?.message}
              {...register('factor')}
            />
          </div>

          <Toggle
            id="active"
            label="Unidad activa"
            hint="Disponible para asignar a productos."
            {...register('active')}
          />
        </form>
      </div>
    </Modal>
  )
}
