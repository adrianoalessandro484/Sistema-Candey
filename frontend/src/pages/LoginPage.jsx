import { Navigate, useNavigate } from 'react-router-dom'
import {
  Boxes,
  LifeBuoy,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import Logo from '../components/Logo.jsx'
import LoginForm from '../components/auth/LoginForm.jsx'
import { useSession } from '../context/sessionContext.js'

const BENEFITS = [
  {
    icon: Boxes,
    title: 'Existencias y Kardex en tiempo real',
    text: 'Consulta el stock por producto y por lote en el momento en que lo necesites.',
  },
  {
    icon: TrendingUp,
    title: 'Alertas de reposición',
    text: 'Detecta productos con stock bajo y lotes próximos a vencer antes de que sea tarde.',
  },
  {
    icon: ShieldCheck,
    title: 'Acceso por roles',
    text: 'Cada persona ve únicamente las funciones que necesita para hacer su trabajo.',
  },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { user } = useSession()

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.08fr_1fr]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(150deg,var(--color-wine-dark)_0%,var(--color-wine)_46%,var(--color-candey-dark)_100%)] px-7 py-9 text-white lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute -right-36 -bottom-40 h-[430px] w-[430px] rounded-full bg-candey/25 blur-3xl" />
        <div className="pointer-events-none absolute -top-28 -left-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 h-40 w-40 rounded-full border border-white/10" />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative max-w-[520px] py-10">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase backdrop-blur">
            <Sparkles size={13} />
            Sistema de inventario · Candey App v1.0
          </span>

          <h1 className="mb-4 text-[34px] leading-[1.06] font-bold tracking-tight text-white lg:text-[46px]">
            Controla tu inventario con claridad
          </h1>
          <p className="mb-4 max-w-[470px] text-[15.5px] leading-relaxed text-white/80">
            Registra entradas y salidas por lote, consulta el Kardex y mantén tus existencias bajo
            control desde un solo lugar. Toda la información de tu almacén, siempre disponible.
          </p>
          <span className="mb-9 block h-1 w-20 rounded-full bg-[linear-gradient(90deg,#ffffff,var(--color-gold))]" />

          <ul className="hidden flex-col gap-4 lg:flex">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3.5 backdrop-blur-sm"
              >
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold-light">
                  <Icon size={20} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14.5px] font-semibold text-white">{title}</span>
                  <span className="text-[13px] leading-relaxed text-white/65">{text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[13px] text-white/55">
          © {new Date().getFullYear()} Candey Cosméticos · Sistema de inventario
        </p>
      </section>

      <section className="flex items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,var(--color-canvas)_100%)] px-5 py-10 sm:px-8">
        <div className="w-full max-w-[460px] overflow-hidden rounded-[28px] border border-line bg-white shadow-[var(--shadow-float)]">
          <div className="h-1.5 w-full bg-[linear-gradient(90deg,var(--color-candey)_0%,var(--color-gold)_100%)]" />

          <div className="px-7 py-8 sm:px-9 sm:py-9">
            <div className="mb-7 flex flex-col gap-2">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-candey-50 text-candey ring-1 ring-candey/10 ring-inset">
                <LockKeyhole size={23} />
              </span>
              <h2 className="mt-2 text-[27px] leading-tight font-bold">Iniciar sesión</h2>
              <p className="text-[14.5px] leading-relaxed text-muted">
                Ingresa tus credenciales para acceder al sistema. Si aún no tienes acceso,
                solicítalo a la administradora del almacén.
              </p>
            </div>

            <LoginForm onSuccess={() => navigate('/', { replace: true })} />

            <div className="mt-7 flex items-start gap-2.5 rounded-xl border border-line bg-surface-2 px-4 py-3 text-[13px] leading-relaxed text-muted">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-ok" />
              <span>Acceso exclusivo para personal autorizado de Candey Cosméticos.</span>
            </div>

            <div className="mt-4 flex items-start justify-center gap-2 text-center text-[12.5px] leading-relaxed text-muted">
              <LifeBuoy size={15} className="mt-0.5 shrink-0" />
              <span>¿Problemas para ingresar? Contacta a la administradora del almacén.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
