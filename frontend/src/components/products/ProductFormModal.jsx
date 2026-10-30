import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Package } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import Textarea from '../Textarea.jsx'
import Toggle from '../Toggle.jsx'
import FormError from '../FormError.jsx'
import { productSchema } from '../../schemas/productSchema.js'
import { getCategories } from '../../services/categoryService.js'
import { getUnits } from '../../services/unitService.js'

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  categoryId: '',
  unitId: '',
  minStock: 0,
  price: 0,
  active: true,
}

export default function ProductFormModal({
  open,
  mode,
  product,
  categories: initialCategories,
  units: initialUnits,
  onClose,
  onSave,
}) {
  const isEdit = mode === 'edit'
  const [categories, setCategories] = useState(initialCategories)
  const [units, setUnits] = useState(initialUnits)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY_PRODUCT,
  })

  useEffect(() => {
    if (!open) return

    if (isEdit && product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        categoryId: product.categoryId,
        unitId: product.unitId,
        minStock: product.minStock,
        price: product.price,
        active: product.active,
      })
    } else {
      reset(EMPTY_PRODUCT)
    }
  }, [open, isEdit, product, reset])

  useEffect(() => {
    if (!open) return

    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories(initialCategories))

    getUnits()
      .then((data) => setUnits(data))
      .catch(() => setUnits(initialUnits))
  }, [open, initialCategories, initialUnits])

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo guardar el producto.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar producto' : 'Nuevo producto'}
      description="Completa los datos del producto para el catálogo del almacén."
      icon={Package}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="product-form" loading={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-5">
        <form
          id="product-form"
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <FormError message={errors.root?.message} />

          <Input
            id="name"
            label="Nombre del producto"
            required
            placeholder="Ej. Labial cremoso"
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            id="description"
            label="Descripción"
            placeholder="Detalle del producto (opcional)"
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              id="categoryId"
              label="Categoría"
              required
              error={errors.categoryId?.message}
              {...register('categoryId')}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>

            <Select
              id="unitId"
              label="Unidad"
              required
              error={errors.unitId?.message}
              {...register('unitId')}
            >
              <option value="">Seleccione una unidad</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="minStock"
              label="Stock mínimo"
              type="number"
              min="0"
              hint="Cantidad mínima antes de alertar reposición."
              error={errors.minStock?.message}
              {...register('minStock')}
            />
            <Input
              id="price"
              label="Precio unitario"
              type="number"
              step="0.01"
              min="0"
              hint="Precio de referencia en soles."
              error={errors.price?.message}
              {...register('price')}
            />
          </div>

          <Toggle
            id="active"
            label="Producto activo"
            hint="Disponible para entradas y salidas."
            {...register('active')}
          />
        </form>
      </div>
    </Modal>
  )
}
