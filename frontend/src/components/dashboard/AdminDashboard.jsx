import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpFromLine,
  BarChart3,
  Boxes,
  ClipboardCheck,
  Coins,
  Package,
  PackagePlus,
  TrendingDown,
  Truck,
} from 'lucide-react'
import { formatCurrency, formatDate, formatRelativeAge, hoursSince } from '../../utils/format.js'
import StatCard from '../StatCard.jsx'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import Card from '../Card.jsx'
import ErrorBanner from '../ErrorBanner.jsx'
import Spinner from '../Spinner.jsx'
import { useReportSummary } from '../../hooks/useReportSummary.js'
import { useReportAlerts } from '../../hooks/useReportAlerts.js'
import { useEntries } from '../../hooks/useEntries.js'
import { useExits } from '../../hooks/useExits.js'
import { useSuppliers } from '../../hooks/useSuppliers.js'
import { useBranchRequests } from '../../hooks/useBranchRequests.js'
import { useEntryOrders } from '../../hooks/useEntryOrders.js'

export default function AdminDashboard({ name }) {
  const { report, loading: summaryLoading, error: summaryError, reload: reloadSummary } = useReportSummary()
  const { alerts: alertItems, loading: alertsLoading, error: alertsError, reload: reloadAlerts } = useReportAlerts()
  const { entries } = useEntries()
  const { exits } = useExits()
  const { suppliers } = useSuppliers()
  const { requests, reload: reloadRequests } = useBranchRequests()
  const { orders, reload: reloadOrders } = useEntryOrders()

  const activeSuppliers = suppliers.filter((supplier) => supplier.active).length
  const alerts = alertItems.slice(0, 4)
  const rotation = report.rotation.slice(0, 4)
  const loading = summaryLoading || alertsLoading
  const error = summaryError || alertsError

  const pendingRequests = requests.filter((r) => r.status === 'Pendiente')
  const inTransitRequests = requests.filter((r) => r.status === 'En camino')
  const observedRequests = requests.filter((r) => r.status === 'Observado')
  const pendingOrders = orders.filter((o) => o.status === 'Pendiente')

  const totalProducts = report.summary.totalProducts
  const lowStock = report.summary.lowStock
  const outOfStock = report.summary.outOfStock
  const healthyStock = Math.max(totalProducts - lowStock - outOfStock, 0)
  const pctHealthy = totalProducts > 0 ? Math.round((healthyStock / totalProducts) * 100) : 0
  const pctLow = totalProducts > 0 ? Math.round((lowStock / totalProducts) * 100) : 0
  const pctOut = totalProducts > 0 ? Math.max(100 - pctHealthy - pctLow, 0) : 0

  function reload() {
    reloadSummary()
    reloadAlerts()
    reloadRequests()
    reloadOrders()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--color-wine)_0%,#5a1a32_55%,var(--color-candey)_100%)] px-6 py-7 text-white shadow-[var(--shadow-float)] lg:px-8 lg:py-8">
        <span className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />
        <span className="pointer-events-none absolute -bottom-28 right-44 h-56 w-56 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
              Vista de administrador
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white lg:text-[34px]">
              Bienvenida, {name}
            </h1>
            <p className="max-w-xl text-[14.5px] leading-relaxed text-white/80">
              Estado del almacén de Candey Cosméticos al {formatDate()}. Supervisa existencias,
              pedidos de sucursales, tránsito y órdenes a proveedor.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:min-w-[310px]">
            <Link
              to="/entradas"
              className="group rounded-2xl border border-white/18 bg-white/10 px-4.5 py-3.5 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/16"
            >
              <p className="text-[11px] font-semibold tracking-wider text-white/65 uppercase">Entradas</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums">{entries.length}</p>
            </Link>
            <Link
              to="/salidas"
              className="group rounded-2xl border border-white/18 bg-white/10 px-4.5 py-3.5 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/16"
            >
              <p className="text-[11px] font-semibold tracking-wider text-white/65 uppercase">Salidas</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums">{exits.length}</p>
            </Link>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center gap-3 border-t border-white/15 pt-5">
          <Link to="/requerimientos">
            <Button variant="hero" size="md">
              <ClipboardCheck size={19} />
              Requerimientos ({pendingRequests.length})
            </Button>
          </Link>
          <Link to="/ordenes-ingreso">
            <Button variant="hero-ghost" size="md">
              <PackagePlus size={19} />
              Órdenes ({pendingOrders.length})
            </Button>
          </Link>
          <Link to="/entradas">
            <Button variant="hero-ghost" size="md">
              <ArrowDownToLine size={19} />
              Entradas
            </Button>
          </Link>
          <Link to="/salidas">
            <Button variant="hero-ghost" size="md">
              <ArrowUpFromLine size={19} />
              Salidas
            </Button>
          </Link>
          <Link to="/reportes">
            <Button variant="hero-ghost" size="md">
              <BarChart3 size={19} />
              Reportes
            </Button>
          </Link>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando resumen del almacén...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Package}
              label="Productos registrados"
              value={String(report.summary.totalProducts)}
              hint="Catálogo activo"
              tone="candey"
            />
            <StatCard
              icon={TrendingDown}
              label="Stock bajo"
              value={String(report.summary.lowStock)}
              hint="Requieren reposición"
              tone="warn"
            />
            <StatCard
              icon={Boxes}
              label="Sin stock"
              value={String(report.summary.outOfStock)}
              hint="Alerta crítica"
              tone="danger"
            />
            <StatCard
              icon={Truck}
              label="Proveedores activos"
              value={String(activeSuppliers)}
              hint="Directorio comercial"
              tone="info"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="flex-row items-center justify-between gap-4 p-5 sm:p-6">
              <div className="flex flex-col gap-1">
                <span className="text-[13.5px] font-semibold text-muted">Unidades en inventario</span>
                <span className="text-[28px] leading-none font-bold text-ink tabular-nums sm:text-[32px]">
                  {report.summary.units}
                </span>
                <span className="text-[12.5px] text-muted">Existencia física total</span>
              </div>
              <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-candey-50 text-candey ring-1 ring-candey/15 ring-inset">
                <Boxes size={25} aria-hidden="true" />
              </span>
            </Card>

            <Card className="flex-row items-center justify-between gap-4 p-5 sm:p-6">
              <div className="flex flex-col gap-1">
                <span className="text-[13.5px] font-semibold text-muted">Valor del inventario</span>
                <span className="text-[28px] leading-none font-bold text-ink tabular-nums sm:text-[32px]">
                  {formatCurrency(report.summary.inventoryValue)}
                </span>
                <span className="text-[12.5px] text-muted">Valorizado a precio catálogo</span>
              </div>
              <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gold-50 text-gold-dark ring-1 ring-gold/25 ring-inset">
                <Coins size={25} aria-hidden="true" />
              </span>
            </Card>

            <Card className="justify-between gap-3 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13.5px] font-semibold text-muted">Salud del stock</span>
                <Badge tone={outOfStock > 0 ? 'warn' : 'ok'} dot>
                  {pctHealthy}% disponible
                </Badge>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-line">
                {pctHealthy > 0 ? (
                  <div className="h-full bg-ok transition-all" style={{ width: `${pctHealthy}%` }} />
                ) : null}
                {pctLow > 0 ? (
                  <div className="h-full bg-warn transition-all" style={{ width: `${pctLow}%` }} />
                ) : null}
                {pctOut > 0 ? (
                  <div className="h-full bg-danger transition-all" style={{ width: `${pctOut}%` }} />
                ) : null}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-ok" /> {healthyStock} óptimo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warn" /> {lowStock} bajo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-danger" /> {outOfStock} agotado
                </span>
              </div>
            </Card>
          </div>

          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <h2 className="text-[19px] font-bold">Monitoreo de envíos a sucursales</h2>
                <p className="text-[13px] text-muted">
                  Seguimiento en tránsito e incidencias para detectar demoras o faltantes
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="gold">{pendingRequests.length} pendientes</Badge>
                <Badge tone="info">{inTransitRequests.length} en camino</Badge>
                <Badge tone={observedRequests.length > 0 ? 'danger' : 'ok'}>
                  {observedRequests.length} observados
                </Badge>
              </div>
            </div>

            {observedRequests.length === 0 && inTransitRequests.length === 0 ? (
              <p className="rounded-xl bg-surface-2 px-4 py-5 text-center text-sm text-muted">
                No hay despachos en tránsito ni incidencias activas en este momento.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {observedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-danger/30 bg-danger-bg/60 p-4"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="shrink-0 text-danger" />
                        <span className="font-bold text-ink">
                          {req.code} · {req.branchName}
                        </span>
                      </div>
                      <p className="text-[13px] text-danger">
                        {req.receptionNote || 'Incidencia reportada al recibir el pedido'}
                      </p>
                    </div>
                    <Badge tone="danger">Observado</Badge>
                  </div>
                ))}

                {inTransitRequests.map((req) => {
                  const delayed = hoursSince(req.dispatchedAt) >= 24
                  return (
                    <div
                      key={req.id}
                      className={`flex items-start justify-between gap-3 rounded-2xl border p-4 ${
                        delayed
                          ? 'border-warn/35 bg-warn-bg/60'
                          : 'border-info/25 bg-info-bg/40'
                      }`}
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Truck size={16} className={delayed ? 'text-warn' : 'text-info'} />
                          <span className="font-bold text-ink">
                            {req.code} ({req.exitCode}) · {req.branchName}
                          </span>
                        </div>
                        <p className="text-[13px] text-muted tabular-nums">
                          {req.totalUnits} u. · Salió {formatRelativeAge(req.dispatchedAt)}
                        </p>
                      </div>
                      <Badge tone={delayed ? 'warn' : 'info'}>
                        {delayed ? 'Demorado' : 'En camino'}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="pt-1">
              <Link to="/requerimientos">
                <Button variant="soft" size="sm">
                  Abrir centro de requerimientos
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-[19px] font-bold">Alertas de reposición</h2>
                  <p className="text-[13px] text-muted">Productos en o por debajo del stock mínimo</p>
                </div>
                <Badge tone="gold">{alertItems.length} por reponer</Badge>
              </div>

              {alerts.length === 0 ? (
                <p className="rounded-xl bg-surface-2 px-4 py-6 text-center text-sm text-muted">
                  No hay productos por debajo del stock mínimo.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-line">
                  {alerts.map((alert) => {
                    const ratio =
                      alert.minStock > 0
                        ? Math.min(Math.round((alert.stock / alert.minStock) * 100), 100)
                        : 0

                    return (
                      <li key={alert.productId} className="flex items-center justify-between gap-4 py-3.5">
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <span className="truncate text-[14.5px] font-semibold text-ink">
                            {alert.productName}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
                              <div
                                className={`h-full rounded-full ${
                                  alert.stock === 0 ? 'bg-danger' : 'bg-warn'
                                }`}
                                style={{ width: `${ratio}%` }}
                              />
                            </div>
                            <span className="text-[12px] text-muted tabular-nums">
                              Mínimo: {alert.minStock} · {alert.categoryName}
                            </span>
                          </div>
                        </div>
                        <Badge tone={alert.stock === 0 ? 'danger' : 'warn'} dot>
                          {alert.stock} u.
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              )}

              <div className="pt-1">
                <Link to="/reportes">
                  <Button variant="soft" size="sm">
                    Ver reporte de alertas
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-[19px] font-bold">Rotación del inventario</h2>
                  <p className="text-[13px] text-muted">Productos con mayor movimiento</p>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-dark ring-1 ring-gold/20 ring-inset">
                  <ArrowLeftRight size={20} />
                </span>
              </div>

              {rotation.length === 0 ? (
                <p className="rounded-xl bg-surface-2 px-4 py-6 text-center text-sm text-muted">
                  Aún no hay movimientos registrados.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-line">
                  {rotation.map((item) => (
                    <li key={item.productId} className="flex items-center justify-between gap-3 py-3.5">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-[14.5px] font-semibold text-ink">
                          {item.productName}
                        </span>
                        <span className="text-[12.5px] text-muted tabular-nums">
                          Ingresos: {item.received} · Egresos: {item.issued}
                        </span>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <Badge tone={item.level.tone}>{item.level.label}</Badge>
                        <span className="text-[12px] font-medium text-muted tabular-nums">
                          Saldo {item.balance}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-1">
                <Link to="/reportes">
                  <Button variant="soft" size="sm">
                    Ver reporte de rotación
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
