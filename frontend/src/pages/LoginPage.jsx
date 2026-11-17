import { Navigate, useNavigate } from 'react-router-dom'
import {
  Barcode,
  Boxes,
  ClipboardCheck,
  LifeBuoy,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
} from 'lucide-react'
import Logo from '../components/Logo.jsx'
import LoginForm from '../components/auth/LoginForm.jsx'
import { useSession } from '../context/sessionContext.js'

const BENEFITS = [
  {
    icon: Boxes,
    title: 'Kardex y lotes en tiempo real',
    text: 'Controla existencias por producto, vencimiento y disponibilidad real en almacén.',
  },
  {
    icon: Store,
    title: 'Pedidos de sucursales',
    text: 'Solicitudes con reserva automática, despacho FEFO y confirmación de llegada.',
  },
  {
    icon: TrendingUp,
    title: 'Órdenes y alertas preventivas',
    text: 'Programa reposiciones a proveedores y detecta productos bajo mínimo a tiempo.',
  },
  {
    icon: ClipboardCheck,
    title: 'Trazabilidad y reportes PDF',
    text: 'Emite etiquetas con código de barras, guías de despacho y reportes por rol.',
  },
]

const PILLS = [
  { icon: Barcode, label: 'Etiquetas Code128' },
  { icon: Store, label: 'Control de sucursales' },
  { icon: ShieldCheck, label: 'Monitoreo FEFO' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { user } = useSession()

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.12fr_1fr]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(150deg,var(--color-wine-dark)_0%,var(--color-wine)_46%,var(--color-candey-dark)_100%)] px-7 py-9 text-white lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute -right-36 -bottom-40 h-[430px] w-[430px] rounded-full bg-candey/25 blur-3xl" />
        <div className="pointer-events-none absolute -top-28 -left-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 h-44 w-44 rounded-full border border-white/10" />

        <div className="relative flex items-center gap-4">
          <div className="rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur-sm">
            <Logo />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[28px] font-extrabold tracking-tight text-white sm:text-[34px]">
              Candey Inventario
            </span>
            <span className="mt-0.5 text-[12px] font-semibold tracking-[0.2em] text-gold-light uppercase">
              Cosméticos · Almacén y Sucursales
            </span>
          </div>
        </div>

        <div className="relative max-w-[600px] py-9">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11.5px] font-semibold tracking-[0.14em] uppercase backdrop-blur">
            <Sparkles size={14} className="text-gold-light" />
            Sistema integral de gestión · v1.0
          </span>

          <h1 className="mb-4 text-[34px] leading-[1.06] font-bold tracking-tight text-white lg:text-[46px]">
            Controla tu inventario con total claridad
          </h1>
          <p className="mb-5 max-w-[520px] text-[15.5px] leading-relaxed text-white/80">
            Administra entradas por lote, atiende requerimientos de sucursales en orden FEFO,
            monitorea envíos y supervisa tu Kardex desde un solo lugar.
          </p>

          <div className="mb-7 flex flex-wrap gap-2.5">
            {PILLS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-medium text-white/90 backdrop-blur-sm"
              >
                <Icon size={14} className="text-gold-light" />
                {label}
              </span>
            ))}
          </div>

          <span className="mb-7 block h-1 w-24 rounded-full bg-[linear-gradient(90deg,#ffffff,var(--color-gold))]" />

          <ul className="hidden grid-cols-1 gap-3.5 lg:grid lg:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex flex-col gap-2.5 rounded-2xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur-sm"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold-light">
                  <Icon size={20} />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-[14.5px] font-semibold text-white">{title}</span>
                  <span className="text-[12.5px] leading-relaxed text-white/70">{text}</span>
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
        <div className="w-full max-w-[490px] overflow-hidden rounded-[30px] border border-line bg-white shadow-[var(--shadow-float)]">
          <div className="h-2 w-full bg-[linear-gradient(90deg,var(--color-candey)_0%,var(--color-gold)_100%)]" />

          <div className="px-7 py-8 sm:px-10 sm:py-10">
            <div className="mb-7 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-candey-50 text-candey ring-1 ring-candey/15 ring-inset">
                    <LockKeyhole size={24} />
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[20px] font-extrabold tracking-tight text-ink">
                      Candey Inventario
                    </span>
                    <span className="text-[11.5px] font-bold tracking-[0.14em] text-candey uppercase">
                      Portal de acceso
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="mt-1 text-[28px] leading-tight font-bold">Iniciar sesión</h2>
              <p className="text-[14.5px] leading-relaxed text-muted">
                Ingresa tus credenciales para acceder al sistema.
              </p>
            </div>

            <LoginForm onSuccess={() => navigate('/', { replace: true })} />

            <div className="mt-6 flex items-start justify-center gap-2 text-center text-[12.5px] leading-relaxed text-muted">
              <LifeBuoy size={15} className="mt-0.5 shrink-0" />
              <span>¿Problemas para ingresar? Contacta a la administradora del almacén.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
