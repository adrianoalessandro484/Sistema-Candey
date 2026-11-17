import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpFromLine,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Plus,
  Store,
  Truck,
} from 'lucide-react'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import Card from '../Card.jsx'
import ErrorBanner from '../ErrorBanner.jsx'
import Spinner from '../Spinner.jsx'
import StatCard from '../StatCard.jsx'
import { useToast } from '../toast/toastContext.js'
import { formatRelativeAge, formatShortDate } from '../../utils/format.js'
import { approveBranchRequest } from '../../services/branchRequestService.js'
import { useExits } from '../../hooks/useExits.js'
import { useBranchRequests } from '../../hooks/useBranchRequests.js'
import { useExpiringLots } from '../../hooks/useExpiringLots.js'
import BranchRequestApproveModal from '../requests/BranchRequestApproveModal.jsx'

export default function ExitDashboard({ name }) {
  const { notify } = useToast()
  const { exits, loading: exitsLoading, error: exitsError, reload: reloadExits } = useExits()
  const {
    requests,
    loading: requestsLoading,
    error: requestsError,
    reload: reloadRequests,
  } = useBranchRequests()
  const {
    lots: expiringLots,
    loading: lotsLoading,
    error: lotsError,
    reload: reloadLots,
  } = useExpiringLots({ days: 60 })

  const [approveTarget, setApproveTarget] = useState(null)

  const loading = exitsLoading || requestsLoading || lotsLoading
  const error = exitsError || requestsError || lotsError

  const pendingRequests = requests.filter((r) => r.status === 'Pendiente')
  const inTransitRequests = requests.filter((r) => r.status === 'En camino')
  const observedRequests = requests.filter((r) => r.status === 'Observado')

  function reload() {
    reloadExits()
    reloadRequests()
    reloadLots()
  }

  async function handleApprove(id, values) {
    await approveBranchRequest(id, values)
    notify('Requerimiento aprobado y salida generada.', 'success')
    setApproveTarget(null)
    reload()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--color-wine)_0%,#5a1a32_55%,var(--color-candey)_100%)] px-6 py-7 text-white shadow-[var(--shadow-float)] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-8">
        <span className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />

        <div className="relative flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
            Vista de técnico de salida
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-[34px]">Hola, {name}</h1>
          <p className="max-w-xl text-[14.5px] leading-relaxed text-white/80">
            Atiende los requerimientos de las sucursales asignando lotes en orden FEFO y controla los despachos.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-3">
          <Link to="/requerimientos">
            <Button variant="hero" size="lg">
              <ClipboardCheck size={20} />
              Ver requerimientos ({pendingRequests.length})
            </Button>
          </Link>
          <Link to="/salidas">
            <Button variant="hero-ghost" size="md">
              <Plus size={19} />
              Salida directa
            </Button>
          </Link>
          <Link to="/sucursales">
            <Button variant="hero-ghost" size="md">
              <Store size={19} />
              Sucursales
            </Button>
          </Link>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando tu bandeja de despachos...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Clock}
              label="Pedidos por aprobar"
              value={String(pendingRequests.length)}
              hint="Requerimientos pendientes"
              tone="gold"
            />
            <StatCard
              icon={Truck}
              label="Despachos en camino"
              value={String(inTransitRequests.length)}
              hint="Sin confirmar en sucursal"
              tone="info"
            />
            <StatCard
              icon={AlertTriangle}
              label="Incidencias"
              value={String(observedRequests.length)}
              hint="Pedidos observados"
              tone="danger"
            />
            <StatCard
              icon={ArrowUpFromLine}
              label="Salidas registradas"
              value={String(exits.length)}
              hint="Documentos emitidos"
              tone="candey"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-[19px] font-bold">Requerimientos por atender</h2>
                  <p className="text-[13px] text-muted">
                    Aprueba y despacha directamente asignando lotes FEFO
                  </p>
                </div>
                <Badge tone="gold">{pendingRequests.length} pendientes</Badge>
              </div>

              {pendingRequests.length === 0 ? (
                <p className="rounded-xl bg-surface-2 px-4 py-6 text-center text-sm text-muted">
                  No hay requerimientos pendientes de las sucursales.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {pendingRequests.slice(0, 5).map((req) => (
                    <li
                      key={req.id}
                      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-ink">{req.code}</span>
                          <Badge tone="candey">{req.branchName}</Badge>
                        </div>
                        <span className="text-[13px] text-muted tabular-nums">
                          {req.lines.length} producto(s) · {req.totalUnits} u. · {formatRelativeAge(req.date)}
                        </span>
                      </div>
                      <Button size="sm" onClick={() => setApproveTarget(req)}>
                        <CheckCircle2 size={16} />
                        Revisar y despachar
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-1">
                <Link to="/requerimientos">
                  <Button variant="soft" size="sm">
                    Ir a bandeja de requerimientos
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <h2 className="text-[19px] font-bold">Lotes por vencer (FEFO)</h2>
                    <p className="text-[13px] text-muted">Prioridad de despacho en los próximos 60 días</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warn-bg text-warn">
                    <CalendarClock size={19} />
                  </span>
                </div>

                {expiringLots.length === 0 ? (
                  <p className="rounded-xl bg-surface-2 px-4 py-5 text-center text-sm text-muted">
                    Sin lotes próximos a vencer en los próximos 60 días.
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
                    <h2 className="text-[18px] font-bold">Últimas salidas</h2>
                    <p className="text-[12.5px] text-muted">Despachos emitidos recientemente</p>
                  </div>
                  <Badge tone="candey">{exits.length} en total</Badge>
                </div>

                {exits.length === 0 ? (
                  <p className="rounded-xl bg-surface-2 px-4 py-5 text-center text-sm text-muted">
                    Aún no hay salidas registradas.
                  </p>
                ) : (
                  <ul className="flex flex-col divide-y divide-line">
                    {exits.slice(0, 3).map((exit) => (
                      <li key={exit.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-[14px] font-semibold text-ink">{exit.code}</span>
                          <span className="text-[12px] text-muted">
                            {exit.branchName} · {formatShortDate(exit.date)}
                          </span>
                        </div>
                        <Badge tone={exit.status === 'Anulada' ? 'danger' : 'ok'} dot>
                          {exit.totalUnits} u.
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-1">
                  <Link to="/salidas">
                    <Button variant="soft" size="sm">
                      Ver todas las salidas
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <BranchRequestApproveModal
        open={Boolean(approveTarget)}
        request={approveTarget}
        onClose={() => setApproveTarget(null)}
        onApprove={handleApprove}
      />
    </div>
  )
}
