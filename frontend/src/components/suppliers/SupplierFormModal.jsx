import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Hash, Mail, Phone, Truck } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Textarea from '../Textarea.jsx'
import Toggle from '../Toggle.jsx'
import FormError from '../FormError.jsx'
import { supplierSchema } from '../../schemas/supplierSchema.js'

const EMPTY_SUPPLIER = {
  name: '',
  taxId: '',
  phone: '',
  email: '',
  address: '',
  active: true,
}

export default function SupplierFormModal({ open, mode, supplier, onClose, onSave }) {
  const isEdit = mode === 'edit'
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: EMPTY_SUPPLIER,
  })

  useEffect(() => {
    if (!open) return

    if (isEdit && supplier) {
      reset({
        name: supplier.name,
        taxId: supplier.taxId,
        phone: supplier.phone ?? '',
        email: supplier.email ?? '',
        address: supplier.address ?? '',
        active: supplier.active,
      })
    } else {
      reset(EMPTY_SUPPLIER)
    }
  }, [open, isEdit, supplier, reset])

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo guardar el proveedor.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar proveedor' : 'Nuevo proveedor'}
      description="Registra los datos de contacto del distribuidor."
      icon={Truck}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="supplier-form" loading={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Crear proveedor'}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-5">
        <form
          id="supplier-form"
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <FormError message={errors.root?.message} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="name"
              label="Razón social"
              required
              icon={Truck}
              placeholder="Ej. Distribuidora Belleza Andina"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              id="taxId"
              label="RUC"
              required
              icon={Hash}
              placeholder="20548796321"
              error={errors.taxId?.message}
              {...register('taxId')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="phone"
              label="Teléfono / WhatsApp"
              icon={Phone}
              placeholder="+51 987 654 321"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              id="email"
              label="Correo"
              icon={Mail}
              type="email"
              placeholder="ventas@proveedor.pe"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Textarea
            id="address"
            label="Dirección"
            placeholder="Dirección del proveedor (opcional)"
            error={errors.address?.message}
            {...register('address')}
          />

          <Toggle
            id="active"
            label="Proveedor activo"
            hint="Disponible para registrar entradas."
            {...register('active')}
          />
        </form>
      </div>
    </Modal>
  )
}
