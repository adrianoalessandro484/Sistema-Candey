import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Barcode,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers,
  LogIn,
  ShieldCheck,
  Store,
  Truck,
  Users,
} from 'lucide-react'
import Logo from '../components/Logo.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import OperationsPreview from '../components/landing/OperationsPreview.jsx'
import { useSession } from '../context/sessionContext.js'

const WORKFLOW_STAGES = [
  {
    icon: ArrowDownToLine,
    title: 'Recepción por lote',
    text: 'Registra órdenes de compra e ingresos directos con código de lote, cantidad y fecha de vencimiento.',
  },
  {
    icon: Layers,
    title: 'Kardex auditado',
    text: 'Cada entrada, salida o anulación queda registrada con documento, responsable y saldo histórico.',
  },
  {
    icon: CalendarClock,
    title: 'Prioridad FEFO',
    text: 'Al aprobar despachos, el sistema prioriza automáticamente los lotes más próximos a vencer.',
  },
  {
    icon: Store,
    title: 'Confirmación en tienda',
    text: 'Las sucursales reciben su guía PDF, validan unidades en destino o reportan incidencias al instante.',
  },
]

const SAMPLE_ALERTS = [
  { name: 'Protector Solar Toque Seco SPF 50', stock: 4, min: 15, tone: 'warn', label: 'Stock bajo' },
  { name: 'Delineador Líquido Waterproof Negro', stock: 0, min: 20, tone: 'danger', label: 'Agotado' },
  { name: 'Agua Micelar Bifásica 400 ml', stock: 38, min: 20, tone: 'ok', label: 'Óptimo' },
]

const ROLES_DIRECTORY = [
  {
    id: 'Administrator',
    title: 'Administrador',
    summary: 'Supervisión integral del almacén, catálogo maestro, usuarios y reportes ejecutivos.',
    capabilities: [
      'Gestión de productos, categorías, unidades, proveedores y sucursales',
      'Emisión de órdenes de ingreso y revisión global de envíos',
      'Reportes de valorización, alertas de reposición y rotación',
    ],
  },
  {
    id: 'EntryClerk',
    title: 'Técnico de Entrada',
    summary: 'Control físico de mercadería entrante y etiquetado inmediato de cada lote.',
    capabilities: [
      'Recepción de órdenes de proveedor e ingresos directos al almacén',
      'Registro de fechas de vencimiento y generación de etiquetas Code128',
      'Monitoreo preventivo de lotes próximos a vencer en 60 días',
    ],
  },
  {
    id: 'ExitClerk',
    title: 'Técnico de Salida',
    summary: 'Atención de pedidos de sucursales con asignación FEFO y control de tránsito.',
    capabilities: [
      'Aprobación o rechazo fundamentado de requerimientos de tiendas',
      'Selección prioritaria de lotes por vencimiento más cercano',
      'Emisión de guías de despacho PDF y seguimiento de entregas',
    ],
  },
  {
    id: 'BranchClerk',
    title: 'Encargado de Sucursal',
    summary: 'Abastecimiento oportuno de tienda y validación de cada envío recibido.',
    capabilities: [
      'Solicitud de requerimientos de reposición al almacén central',
      'Consulta de catálogo disponible en tiempo real',
      'Confirmación de recepción conforme o reporte de observaciones',
    ],
  },
]

export default function LandingPage() {
  const { user } = useSession()
  const [selectedRoleId, setSelectedRoleId] = useState('Administrator')

  const activeRole =
    ROLES_DIRECTORY.find((role) => role.id === selectedRoleId) ?? ROLES_DIRECTORY[0]
  const authDestination = user ? '/inicio' : '/autenticacion'
  const authLabel = user ? 'Ir al panel' : 'Iniciar sesión'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3 rounded-2xl py-1">
            <Logo compact />
            <div className="flex flex-col leading-tight">
              <span className="text-[19px] font-extrabold tracking-tight text-ink">
                Candey Inventario
              </span>
              <span className="text-[11px] font-semibold tracking-[0.16em] text-candey uppercase">
                Cosméticos · Almacén
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-[14.5px] font-semibold text-body md:flex" aria-label="Navegación principal">
            <a href="#flujo" className="transition-colors hover:text-candey">
              Flujo operativo
            </a>
            <a href="#operacion" className="transition-colors hover:text-candey">
              Capacidades
            </a>
            <a href="#roles" className="transition-colors hover:text-candey">
              Roles
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link to={authDestination}>
              <Button variant="primary" size="sm">
                <LogIn size={16} />
                {authLabel}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="inicio" className="mx-auto max-w-7xl px-5 pt-12 pb-16 lg:px-8 lg:pt-18 lg:pb-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
            <div className="flex flex-col gap-6">
              <h1 className="text-[36px] leading-[1.06] font-extrabold tracking-[-0.03em] text-ink sm:text-[46px] lg:text-[54px]">
                Controla cada lote cosmético desde el ingreso hasta la sucursal.
              </h1>

              <p className="max-w-[54ch] text-[17px] leading-relaxed text-body">
                Candey Inventario centraliza órdenes de compra, vencimientos FEFO, Kardex inmutable y
                despachos entre almacén y tiendas en una sola plataforma operativa.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link to={authDestination}>
                  <Button variant="primary" size="lg">
                    <LogIn size={19} />
                    {user ? 'Entrar a mi panel' : 'Iniciar sesión en el sistema'}
                  </Button>
                </Link>
                <a href="#flujo">
                  <Button variant="secondary" size="lg">
                    Conocer el flujo
                    <ArrowRight size={18} />
                  </Button>
                </a>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-3 border-t border-line pt-6 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink">
                  <ShieldCheck size={18} className="shrink-0 text-candey" />
                  <span>Trazabilidad FEFO</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink">
                  <Barcode size={18} className="shrink-0 text-candey" />
                  <span>Etiquetas Code128</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink">
                  <FileText size={18} className="shrink-0 text-candey" />
                  <span>Guías y reportes PDF</span>
                </div>
              </div>
            </div>

            <OperationsPreview />
          </div>
        </section>

        <section
          id="flujo"
          className="relative overflow-hidden bg-[linear-gradient(155deg,var(--color-wine-dark)_0%,var(--color-wine)_58%,var(--color-candey-deep)_100%)] py-16 text-white lg:py-22"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-12 flex flex-col gap-3">
              <h2 className="max-w-2xl text-[30px] leading-[1.12] font-bold tracking-[-0.025em] text-white sm:text-[38px]">
                Un flujo continuo sin quiebres de stock ni mermas por vencimiento
              </h2>
              <p className="max-w-[60ch] text-[16px] leading-relaxed text-white/78">
                Desde que el proveedor entrega la mercadería hasta que la tienda confirma la llegada,
                cada etapa actualiza el stock real en el servidor.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {WORKFLOW_STAGES.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 rounded-2xl border border-white/14 bg-white/[0.06] p-6"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/20 text-gold-light">
                    <Icon size={21} />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[18px] font-bold text-white">{title}</h3>
                    <p className="text-[14px] leading-relaxed text-white/75">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="operacion" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-22">
          <div className="mb-10 flex flex-col gap-3">
            <h2 className="max-w-2xl text-[30px] leading-[1.12] font-bold tracking-[-0.025em] text-ink sm:text-[38px]">
              Herramientas diseñadas para la rutina real del almacén
            </h2>
            <p className="max-w-[62ch] text-[16px] leading-relaxed text-body">
              Visualiza alertas preventivas, emite comprobantes con respaldo de lote y coordina envíos
              con tus sucursales sin hojas sueltas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col justify-between gap-6 rounded-3xl border border-line bg-surface p-7 sm:p-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-[22px] font-bold text-ink">Alertas preventivas y salud del stock</h3>
                <p className="max-w-[56ch] text-[15px] leading-relaxed text-body">
                  Detecta automáticamente los productos por debajo del stock mínimo y los lotes que
                  vencen en los próximos 60 días para programar reposiciones o priorizar salidas.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface-2 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-ink">
                    Distribución ilustrativa de existencias
                  </span>
                  <span className="text-[12px] font-medium text-muted">Ejemplo de monitoreo</span>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-ok" style={{ width: '74%' }} />
                  <div className="h-full bg-warn" style={{ width: '18%' }} />
                  <div className="h-full bg-danger" style={{ width: '8%' }} />
                </div>
                <ul className="flex flex-col divide-y divide-line">
                  {SAMPLE_ALERTS.map((item) => (
                    <li key={item.name} className="flex items-center justify-between gap-3 py-3 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-ink">{item.name}</p>
                        <p className="text-[12px] text-muted tabular-nums">Mínimo requerido: {item.min} u.</p>
                      </div>
                      <Badge tone={item.tone} dot>
                        {item.stock} u. · {item.label}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-3xl border border-candey/20 bg-candey-50 p-7 sm:p-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-[22px] font-bold text-ink">Guías PDF y control de envíos</h3>
                <p className="text-[15px] leading-relaxed text-body">
                  Cada salida aprobada genera su comprobante PDF con el detalle exacto de productos,
                  lotes despachados y destinatario en sucursal.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-candey-100 text-candey-dark">
                      <ArrowUpFromLine size={17} />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-ink">Guía SAL-0042</p>
                      <p className="text-[12px] text-muted">Sucursal Miraflores</p>
                    </div>
                  </div>
                  <Badge tone="info">En camino</Badge>
                </div>

                <div className="flex flex-col gap-2 text-[13px] text-body tabular-nums">
                  <div className="flex items-center justify-between">
                    <span>Lotes asignados por FEFO</span>
                    <span className="font-semibold text-ink">3 lotes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total unidades despachadas</span>
                    <span className="font-semibold text-ink">36 u.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estado de recepción</span>
                    <span className="font-semibold text-candey-dark">Pendiente de firma</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-gold-50 px-3.5 py-2.5 text-[12.5px] font-medium text-gold-dark">
                  <Truck size={16} className="shrink-0" />
                  <span>Si hay faltantes al llegar, la tienda registra la observación directa.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="border-t border-line bg-surface-2 py-16 lg:py-22">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="flex flex-col gap-5">
                <h2 className="text-[30px] leading-[1.12] font-bold tracking-[-0.025em] text-ink sm:text-[36px]">
                  Un espacio de trabajo claro para cada rol del equipo
                </h2>
                <p className="text-[15.5px] leading-relaxed text-body">
                  Cada colaborador ingresa con sus credenciales y accede únicamente a los módulos y
                  acciones que le corresponden dentro de Candey.
                </p>

                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Roles del sistema">
                  {ROLES_DIRECTORY.map((role) => {
                    const selected = role.id === activeRole.id
                    return (
                      <button
                        key={role.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`rounded-xl border px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                          selected
                            ? 'border-candey bg-candey text-white'
                            : 'border-line-strong bg-surface text-body hover:border-candey/45 hover:text-candey-dark'
                        }`}
                      >
                        {role.title}
                      </button>
                    )
                  })}
                </div>

                <div className="pt-2">
                  <Link to={authDestination}>
                    <Button variant="primary" size="md">
                      <LogIn size={18} />
                      {user ? 'Ir a mi panel' : 'Ingresar con mi cuenta'}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-line bg-surface p-7 sm:p-8">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-line pb-5">
                  <div className="flex items-center gap-3.5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-wine text-gold-light">
                      <Users size={22} />
                    </span>
                    <div>
                      <h3 className="text-[21px] font-bold text-ink">{activeRole.title}</h3>
                      <p className="text-[13.5px] text-muted">{activeRole.summary}</p>
                    </div>
                  </div>
                </div>

                <ul className="flex flex-col gap-3.5">
                  {activeRole.capabilities.map((capability) => (
                    <li key={capability} className="flex items-start gap-3 text-[15px] text-body">
                      <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-candey" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[linear-gradient(125deg,var(--color-wine-dark)_0%,var(--color-wine)_55%,var(--color-candey)_100%)] px-7 py-10 text-white lg:flex-row lg:items-center lg:px-12 lg:py-12">
            <div className="flex max-w-2xl flex-col gap-2.5">
              <h2 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-white sm:text-[34px]">
                Accede al portal de Candey Inventario
              </h2>
              <p className="text-[15.5px] leading-relaxed text-white/80">
                Ingresa con tu usuario asignado para registrar lotes, aprobar requerimientos de sucursal
                o consultar reportes del almacén.
              </p>
            </div>

            <Link to={authDestination} className="shrink-0">
              <Button variant="hero" size="lg">
                <ClipboardCheck size={20} />
                {user ? 'Abrir panel de inventario' : 'Ir al inicio de sesión'}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center lg:px-8">
          <div className="flex items-center gap-3">
            <Logo compact />
            <span className="text-[14px] font-semibold text-ink">
              Candey Cosméticos · Sistema de Inventario
            </span>
          </div>

          <div className="flex items-center gap-5 text-[13.5px] text-muted">
            <span>© {new Date().getFullYear()} Candey</span>
            <Link to={authDestination} className="font-semibold text-candey-dark hover:underline">
              {authLabel}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
