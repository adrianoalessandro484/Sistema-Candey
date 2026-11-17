import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, UserRound } from 'lucide-react'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import FormError from '../FormError.jsx'
import { ROLES, roleLabel } from '../../utils/roles.js'
import { createUserSchema, editUserSchema } from '../../schemas/userSchema.js'

const EMPTY_USER = { userName: '', password: '', role: 'EntryClerk', branchId: '' }

export default function UserFormModal({ open, mode, user, branches = [], onClose, onSave }) {
  const isEdit = mode === 'edit'
  const schema = isEdit ? editUserSchema : createUserSchema
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_USER,
  })

  const selectedRole = useWatch({ control, name: 'role' })
  const activeBranches = branches.filter((branch) => branch.active)

  useEffect(() => {
    if (!open) return

    if (isEdit && user) {
      reset({
        userName: user.userName,
        password: '',
        role: user.role,
        branchId: user.branchId ? String(user.branchId) : '',
      })
    } else {
      reset(EMPTY_USER)
    }
  }, [open, isEdit, user, reset])

  async function submit(values) {
    try {
      await onSave(values)
    } catch (error) {
      setError('root', { message: error?.message ?? 'No se pudo guardar el usuario.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar usuario' : 'Nuevo usuario'}
      description="Asigna un rol y acceso al personal del almacén o sucursales."
      icon={UserRound}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="user-form" loading={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-5">
        <form id="user-form" className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <FormError message={errors.root?.message} />

          <Input
            id="userName"
            label="Usuario"
            required
            icon={UserRound}
            placeholder="Ej. sucursal_norte"
            autoComplete="off"
            error={errors.userName?.message}
            {...register('userName')}
          />

          <Input
            id="password"
            label={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            required={!isEdit}
            icon={Lock}
            type="password"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            error={errors.password?.message}
            hint={isEdit ? 'Déjala vacía para conservar la contraseña actual.' : undefined}
            {...register('password')}
          />

          <Select
            id="role"
            label="Rol"
            required
            error={errors.role?.message}
            {...register('role', {
              onChange: (event) => {
                if (event.target.value !== 'BranchClerk') {
                  setValue('branchId', '')
                }
              },
            })}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {roleLabel(role)}
              </option>
            ))}
          </Select>

          {selectedRole === 'BranchClerk' ? (
            <Select
              id="branchId"
              label="Sucursal asignada"
              required
              hint="Este usuario solo podrá enviar requerimientos y confirmar recepciones de esta sucursal."
              error={errors.branchId?.message}
              {...register('branchId')}
            >
              <option value="">Seleccione una sucursal</option>
              {activeBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </Select>
          ) : null}
        </form>
      </div>
    </Modal>
  )
}
