import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tag } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Textarea from '../Textarea.jsx'
import Toggle from '../Toggle.jsx'
import FormError from '../FormError.jsx'
import { categorySchema } from '../../schemas/categorySchema.js'

const EMPTY_CATEGORY = { name: '', description: '', active: true }

export default function CategoryFormModal({ open, mode, category, onClose, onSave }) {
  const isEdit = mode === 'edit'
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: EMPTY_CATEGORY,
  })

  useEffect(() => {
    if (!open) return

    if (isEdit && category) {
      reset({
        name: category.name,
        description: category.description ?? '',
        active: category.active,
      })
    } else {
      reset(EMPTY_CATEGORY)
    }
  }, [open, isEdit, category, reset])

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo guardar la categoría.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar categoría' : 'Nueva categoría'}
      description="Agrupa los productos por tipo para facilitar su búsqueda."
      icon={Tag}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form" loading={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-5">
        <form
          id="category-form"
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <FormError message={errors.root?.message} />

          <Input
            id="name"
            label="Nombre de la categoría"
            required
            placeholder="Ej. Labiales"
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            id="description"
            label="Descripción"
            placeholder="Detalle de la categoría (opcional)"
            error={errors.description?.message}
            {...register('description')}
          />

          <Toggle
            id="active"
            label="Categoría activa"
            hint="Disponible para asignar a productos."
            {...register('active')}
          />
        </form>
      </div>
    </Modal>
  )
}
