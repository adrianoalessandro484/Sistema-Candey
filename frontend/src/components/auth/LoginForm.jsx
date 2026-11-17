import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, Lock, LogIn, User } from 'lucide-react'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import { useSession } from '../../context/sessionContext.js'
import { loginSchema } from '../../schemas/loginSchema.js'

export default function LoginForm({ onSuccess }) {
  const { startSession } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { userName: '', password: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  async function submit(values) {
    try {
      await startSession(values)
      onSuccess?.()
    } catch (error) {
      setError('root', {
        message:
          error?.message ??
          'No se pudo iniciar sesión. Verifica tus datos e intenta nuevamente.',
      })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
        {errors.root ? (
          <div
            className="flex items-start gap-2.5 rounded-2xl border-2 border-danger/30 bg-danger-bg px-4 py-3.5 text-[14px] font-medium text-danger"
            role="alert"
          >
            <AlertCircle size={19} className="mt-px shrink-0" />
            <span>{errors.root.message}</span>
          </div>
        ) : null}

        <Input
          id="userName"
          label="Usuario"
          icon={User}
          placeholder="Escribe tu usuario"
          autoComplete="username"
          autoFocus
          controlClassName="h-[56px] text-[15.5px]"
          error={errors.userName?.message}
          {...register('userName')}
        />

        <Input
          id="password"
          label="Contraseña"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          placeholder="Escribe tu contraseña"
          autoComplete="current-password"
          controlClassName="h-[56px] text-[15.5px]"
          error={errors.password?.message}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-candey-50 hover:text-candey"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          }
          {...register('password')}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={isSubmitting}
          className="mt-1 h-[58px] text-[16.5px]"
        >
          {isSubmitting ? (
            'Validando acceso...'
          ) : (
            <>
              <LogIn size={20} />
              Ingresar al sistema
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
