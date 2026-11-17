import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Clock,
  PackageCheck,
  PackagePlus,
  Plus,
  TriangleAlert,
} from 'lucide-react'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import Card from '../Card.jsx'
import ErrorBanner from '../ErrorBanner.jsx'
import Spinner from '../Spinner.jsx'
import StatCard from '../StatCard.jsx'
import { useToast } from '../toast/toastContext.js'
import { formatShortDate } from '../../utils/format.js'
import { receiveEntryOrder } from '../../services/entryOrderService.js'
import { useEntries } from '../../hooks/useEntries.js'
import { useEntryOrders } from '../../hooks/useEntryOrders.js'
import { useProducts } from '../../hooks/useProducts.js'
import { useExpiringLots } from '../../hooks/useExpiringLots.js'
import EntryOrderReceiveModal from '../entryOrders/EntryOrderReceiveModal.jsx'

export default function EntryDashboard({ name }) {
  const { notify } = useToast()
  const { entries, loading: entriesLoading, error: entriesError, reload: reloadEntries } = useEntries()
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    reload: reloadOrders,
  } = useEntryOrders()
  const {
    products,
    loading: productsLoading,
    error: productsError,
    reload: reloadProducts,
  } = useProducts()
  const {
    lots: expiringLots,
    loading: lotsLoading,
    error: lotsError,
    reload: reloadLots,
  } = useExpiringLots({ days: 60 })

  const [receiveTarget, setReceiveTarget] = useState(null)

  const loading = entriesLoading || ordersLoading || productsLoading || lotsLoading
  const error = entriesError || ordersError || productsError || lotsError

  const pendingOrders = orders.filter((o) => o.status === 'Pendiente')
  const totalUnits = entries.reduce((total, entry) => total + entry.totalUnits, 0)
  const lowStock = products.filter((product) => product.stock <= product.minStock).length

  function reload() {
    reloadEntries()
    reloadOrders()
    reloadProducts()
    reloadLots()
  }

  async function handleReceive(id, values) {
    await receiveEntryOrder(id, values)
    notify('Orden recibida e ingreso registrado en Kardex.', 'success')
    setReceiveTarget(null)
    reload()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--color-wine)_0%,#5a1a32_55%,var(--color-candey)_100%)] px-6 py-7 text-white shadow-[var(--shadow-float)] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-8">
        <span className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />

        <div className="relative flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
            Vista de técnico de entrada
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-[34px]">Hola, {name}</h1>
          <p className="max-w-xl text-[14.5px] leading-relaxed text-white/80">
            Revisa las órdenes de compra por llegar, registra los lotes con su vencimiento e imprime sus etiquetas.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-3">
          <Link to="/ordenes-ingreso">
            <Button variant="hero" size="lg">
              <PackagePlus size={20} />
              Órdenes por recibir ({pendingOrders.length})
            </Button>
          </Link>
          <Link to="/entradas">
            <Button variant="hero-ghost" size="md">
              <Plus size={19} />
              Ingreso directo
            </Button>
          </Link>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando tus órdenes pendientes...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Clock}
              label="Órdenes por recibir"
              value={String(pendingOrders.length)}
              hint="Pedidos a proveedores"
              tone="gold"
            />
            <StatCard
              icon={ClipboardList}
              label="Entradas registradas"
              value={String(entries.length)}
              hint="Documentos de ingreso"
              tone="candey"
            />
            <StatCard
              icon={PackageCheck}
              label="Unidades ingresadas"
              value={String(totalUnits)}
              hint="Suma de todos los lotes"
              tone="info"
            />
            <StatCard
              icon={TriangleAlert}
              label="Productos bajo mínimo"
              value={String(lowStock)}
              hint="Stock crítico en almacén"
              tone="warn"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-[19px] font-bold">Órdenes pendientes por recibir</h2>
                  <p className="text-[13px] text-muted">
                    Registra la mercadería cuando llegue el proveedor
                  </p>
                </div>
                <Badge tone="gold">{pendingOrders.length} pendientes</Badge>
              </div>

              {pendingOrders.length === 0 ? (
                <p className="rounded-xl bg-surface-2 px-4 py-6 text-center text-sm text-muted">
                  No hay órdenes de proveedor pendientes por recibir.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {pendingOrders.slice(0, 5).map((order) => (
                    <li
                      key={order.id}
                      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-ink">{order.code}</span>
                          <Badge tone="candey">{order.supplierName}</Badge>
                        </div>
                        <span className="text-[13px] text-muted tabular-nums">
                          {order.lines.length} producto(s) · {order.totalUnits} u.
                          {order.expectedDate
                            ? ` · Esperada ${formatShortDate(order.expectedDate)}`
                            : ''}
                        </span>
                      </div>
                      <Button size="sm" onClick={() => setReceiveTarget(order)}>
                        <PackageCheck size={16} />
                        Recibir ahora
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-1">
                <Link to="/ordenes-ingreso">
                  <Button variant="soft" size="sm">
                    Ver todas las órdenes
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <h2 className="text-[19px] font-bold">Lotes por vencer (60 días)</h2>
                    <p className="text-[13px] text-muted">Control preventivo de fechas en almacén</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warn-bg text-warn">
                    <CalendarClock size={19} />
                  </span>
                </div>

                {expiringLots.length === 0 ? (
                  <p className="rounded-xl bg-surface-2 px-4 py-5 text-center text-sm text-muted">
                    Sin lotes próximos a vencer.
                  </p>
                ) : (
                  <ul className="flex flex-col divide-y divide-line">
                    {expiringLots.slice(0, 4).map((lot) => (
                      <li key={lot.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-[14px] font-semibold text-ink">{lot.productName}</span>
                          <span className="text-[12px] text-muted">
                            Lote {lot.lotCode} · Vence {formatShortDate(lot.expirationDate)}
                          </span>
                        </div>
                        <Badge tone="warn" dot>
                          {lot.available} u.
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <h2 className="text-[18px] font-bold">Últimas entradas</h2>
                    <p className="text-[12.5px] text-muted">Ingresos registrados recientemente</p>
                  </div>
                  <Badge tone="candey">{entries.length} en total</Badge>
                </div>

                {entries.length === 0 ? (
                  <p className="rounded-xl bg-surface-2 px-4 py-5 text-center text-sm text-muted">
                    Aún no hay entradas registradas.
                  </p>
                ) : (
                  <ul className="flex flex-col divide-y divide-line">
                    {entries.slice(0, 3).map((entry) => (
                      <li key={entry.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-[14px] font-semibold text-ink">{entry.code}</span>
                          <span className="text-[12px] text-muted">
                            {entry.supplierName} · {formatShortDate(entry.date)}
                          </span>
                        </div>
                        <Badge tone={entry.status === 'Anulada' ? 'danger' : 'ok'} dot>
                          {entry.totalUnits} u.
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-1">
                  <Link to="/entradas">
                    <Button variant="soft" size="sm">
                      Ver todas las entradas
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <EntryOrderReceiveModal
        open={Boolean(receiveTarget)}
        order={receiveTarget}
        products={products.filter((product) => product.active)}
        onClose={() => setReceiveTarget(null)}
        onReceive={handleReceive}
      />
    </div>
  )
}
