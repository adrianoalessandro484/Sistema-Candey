import { Link } from 'react-router-dom'
import {
  ArrowLeftRight,
  ArrowRight,
  Boxes,
  Package,
  RotateCw,
  TrendingDown,
  Truck,
} from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/format.js'
import StatCard from '../StatCard.jsx'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import Card from '../Card.jsx'
import Spinner from '../Spinner.jsx'
import { useReportSummary } from '../../hooks/useReportSummary.js'
import { useReportAlerts } from '../../hooks/useReportAlerts.js'
import { useEntries } from '../../hooks/useEntries.js'
import { useExits } from '../../hooks/useExits.js'
import { useSuppliers } from '../../hooks/useSuppliers.js'

export default function AdminDashboard({ name }) {
  const { report, loading: summaryLoading, error: summaryError, reload: reloadSummary } = useReportSummary()
  const { alerts: alertItems, loading: alertsLoading, error: alertsError, reload: reloadAlerts } = useReportAlerts()
  const { entries } = useEntries()
  const { exits } = useExits()
  const { suppliers } = useSuppliers()

  const activeSuppliers = suppliers.filter((supplier) => supplier.active).length
  const alerts = alertItems.slice(0, 3)
  const rotation = report.rotation.slice(0, 3)
  const loading = summaryLoading || alertsLoading
  const error = summaryError || alertsError

  function reload() {
    reloadSummary()
    reloadAlerts()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--color-wine)_0%,#5a1a32_55%,var(--color-candey)_100%)] px-6 py-6 text-white shadow-[var(--shadow-float)] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-7">
        <span className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />
        <span className="pointer-events-none absolute -bottom-28 right-44 h-56 w-56 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
            Vista de administrador
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
            Bienvenida, {name}
          </h1>
          <p className="max-w-xl text-sm text-white/75">
            Este es el estado del almacén de Candey Cosméticos al {formatDate()}. La información se
            actualiza desde el servidor.
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-3 lg:min-w-[300px]">
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-[11px] tracking-wide text-white/60 uppercase">Entradas</p>
            <p className="text-2xl font-bold">{entries.length}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-[11px] tracking-wide text-white/60 uppercase">Salidas</p>
            <p className="text-2xl font-bold">{exits.length}</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col gap-3 rounded-xl border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={reload}>
            <RotateCw size={16} />
            Reintentar
          </Button>
        </div>
      ) : null}

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="flex flex-row items-center justify-between gap-4 p-5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] text-muted">Unidades en inventario</span>
                <span className="text-[26px] leading-none font-bold text-ink">{report.summary.units}</span>
              </div>
              <Boxes className="text-candey" size={24} />
            </Card>
            <Card className="flex flex-row items-center justify-between gap-4 p-5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] text-muted">Valor del inventario</span>
                <span className="text-[26px] leading-none font-bold text-ink">
                  {formatCurrency(report.summary.inventoryValue)}
                </span>
              </div>
              <TrendingDown className="text-gold-dark" size={24} />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-lg">Alertas de reposición</h2>
                  <p className="text-xs text-muted">Productos en o por debajo del stock mínimo</p>
                </div>
                <Badge tone="gold">{alertItems.length} por reponer</Badge>
              </div>

              {alerts.length === 0 ? (
                <p className="py-4 text-sm text-muted">No hay productos por debajo del stock mínimo.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-line">
                  {alerts.map((alert) => (
                    <li key={alert.productId} className="flex items-center justify-between gap-3 py-3">
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-ink">{alert.productName}</span>
                        <span className="text-xs text-muted">
                          Stock mínimo: {alert.minStock} · {alert.categoryName}
                        </span>
                      </div>
                      <Badge tone={alert.stock === 0 ? 'danger' : 'warn'} dot>
                        {alert.stock} u.
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                to="/reportes"
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-candey hover:text-candey-dark"
              >
                Ver reporte de alertas
                <ArrowRight size={15} />
              </Link>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-lg">Rotación del inventario</h2>
                  <p className="text-xs text-muted">Productos con mayor movimiento</p>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold-50 text-gold-dark">
                  <ArrowLeftRight size={18} />
                </span>
              </div>

              {rotation.length === 0 ? (
                <p className="py-4 text-sm text-muted">Aún no hay movimientos registrados.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-line">
                  {rotation.map((item) => (
                    <li key={item.productId} className="flex items-center justify-between gap-3 py-3">
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-ink">{item.productName}</span>
                        <span className="text-[11.5px] text-muted">
                          Ingresos: {item.received} · Egresos: {item.issued}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge tone={item.level.tone}>{item.level.label}</Badge>
                        <span className="text-[11.5px] text-muted">Saldo {item.balance}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                to="/reportes"
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-candey hover:text-candey-dark"
              >
                Ver reporte de rotación
                <ArrowRight size={15} />
              </Link>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
