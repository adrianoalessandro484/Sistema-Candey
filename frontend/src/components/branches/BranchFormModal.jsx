import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Phone, Store } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Toggle from '../Toggle.jsx'
import FormError from '../FormError.jsx'
import { branchSchema } from '../../schemas/branchSchema.js'

const EMPTY_BRANCH = { name: '', address: '', phone: '', active: true }

export default function BranchFormModal({ open, mode, branch, onClose, onSave }) {
  const isEdit = mode === 'edit'
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: EMPTY_BRANCH,
  })

  useEffect(() => {
    if (!open) return

    if (isEdit && branch) {
      reset({
        name: branch.name,
        address: branch.address ?? '',
        phone: branch.phone ?? '',
        active: branch.active,
      })
    } else {
      reset(EMPTY_BRANCH)
    }
  }, [open, isEdit, branch, reset])

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo guardar la sucursal.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar sucursal' : 'Nueva sucursal'}
      description="Define el destino de despacho y sus datos de contacto."
      icon={Store}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="branch-form" loading={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Crear sucursal'}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-5">
        <form id="branch-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <FormError message={errors.root?.message} />

          <Input
            id="name"
            label="Nombre de la sucursal"
            required
            icon={Store}
            placeholder="Ej. Tienda Central"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            id="address"
            label="Dirección"
            icon={MapPin}
            placeholder="Av. Larco 456"
            error={errors.address?.message}
            {...register('address')}
          />

          <Input
            id="phone"
            label="Teléfono"
            icon={Phone}
            placeholder="+51 01 445 7896"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Toggle
            id="active"
            label="Sucursal activa"
            hint="Disponible para despachos."
            {...register('active')}
          />
        </form>
      </div>
    </Modal>
  )
}
