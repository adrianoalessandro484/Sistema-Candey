import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Package,
  Plus,
  Printer,
  Truck,
} from 'lucide-react'
import Button from '../Button.jsx'
import Card from '../Card.jsx'
import ErrorBanner from '../ErrorBanner.jsx'
import Spinner from '../Spinner.jsx'
import StatCard from '../StatCard.jsx'
import { useToast } from '../toast/toastContext.js'
import { formatRelativeAge, formatShortDate } from '../../utils/format.js'
import { generateExitPdf } from '../../utils/pdf.js'
import { getExitById } from '../../services/exitService.js'
import { confirmBranchRequestReception, createBranchRequest } from '../../services/branchRequestService.js'
import { useBranchRequests } from '../../hooks/useBranchRequests.js'
import { useProducts } from '../../hooks/useProducts.js'
import RequestStatusBadge from '../requests/RequestStatusBadge.jsx'
import BranchRequestFormModal from '../requests/BranchRequestFormModal.jsx'
import BranchRequestReceptionModal from '../requests/BranchRequestReceptionModal.jsx'
import BranchRequestDetailModal from '../requests/BranchRequestDetailModal.jsx'

export default function BranchDashboard({ name, branchId, branchName }) {
  const { notify } = useToast()
  const { requests, loading, error, reload } = useBranchRequests()
  const { products, reload: reloadProducts } = useProducts()
  const [createOpen, setCreateOpen] = useState(false)
  const [receptionTarget, setReceptionTarget] = useState(null)
  const [detail, setDetail] = useState(null)

  const pending = requests.filter((r) => r.status === 'Pendiente')
  const inTransit = requests.filter((r) => r.status === 'En camino')
  const received = requests.filter((r) => r.status === 'Recibido')
  const observed = requests.filter((r) => r.status === 'Observado')

  function refreshAll() {
    reload()
    reloadProducts()
  }

  async function handleCreate(values) {
    await createBranchRequest(values)
    notify('Requerimiento enviado al almacén correctamente.', 'success')
    setCreateOpen(false)
    refreshAll()
  }

  async function handleReception(id, values) {
    await confirmBranchRequestReception(id, values)
    notify(
      values.hasIncident
        ? 'Incidencia reportada al administrador.'
        : 'Recepción confirmada correctamente.',
      values.hasIncident ? 'warning' : 'success',
    )
    setReceptionTarget(null)
    refreshAll()
  }

  async function handlePrintPdf(item) {
    if (!item?.exitId) return
    try {
      const exit = await getExitById(item.exitId)
      generateExitPdf(exit)
    } catch (exception) {
      notify(exception.message || 'No se pudo generar el PDF de despacho.', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--color-wine)_0%,#5a1a32_55%,var(--color-candey)_100%)] px-6 py-7 text-white shadow-[var(--shadow-float)] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-8">
        <span className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />

        <div className="relative flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
            {branchName || 'Encargado de sucursal'}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-[34px]">Hola, {name}</h1>
          <p className="max-w-xl text-[14.5px] leading-relaxed text-white/80">
            Solicita mercadería al almacén central y confirma la llegada de cada despacho.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-3">
          <Button variant="hero" size="lg" onClick={() => setCreateOpen(true)}>
            <Plus size={20} />
            Nuevo requerimiento
          </Button>
          <Link to="/productos">
            <Button variant="hero-ghost" size="md">
              <Package size={19} />
              Catálogo almacén
            </Button>
          </Link>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={refreshAll} />

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando tus requerimientos...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Clock} label="Pendientes" value={String(pending.length)} hint="En revisión" tone="gold" />
            <StatCard
              icon={Truck}
              label="En camino"
              value={String(inTransit.length)}
              hint="Esperando confirmación"
              tone="info"
            />
            <StatCard
              icon={CheckCircle2}
              label="Recibidos"
              value={String(received.length)}
              hint="Entregas conformes"
              tone="ok"
            />
            <StatCard
              icon={AlertTriangle}
              label="Observados"
              value={String(observed.length)}
              hint="Con incidencia"
              tone="danger"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-[19px] font-bold">Pedidos en camino por confirmar</h2>
                  <p className="text-[13px] text-muted">
                    Confirma cuando recibas la mercadería o reporta si hubo algún faltante
                  </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-info-bg text-info">
                  <Truck size={19} />
                </span>
              </div>

              {inTransit.length === 0 ? (
                <p className="rounded-xl bg-surface-2 px-4 py-6 text-center text-sm text-muted">
                  No tienes despachos en camino pendientes de confirmar.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {inTransit.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-info/25 bg-info-bg/35 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-ink">{item.code}</span>
                          <span className="text-xs font-semibold text-info">
                            {item.exitCode} · Salió {formatRelativeAge(item.dispatchedAt)}
                          </span>
                        </div>
                        <span className="text-[13px] text-muted tabular-nums">
                          {item.lines.length} producto(s) · {item.totalUnits} unidades
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handlePrintPdf(item)}>
                          <Printer size={16} />
                          PDF
                        </Button>
                        <Button size="sm" onClick={() => setReceptionTarget(item)}>
                          <ClipboardCheck size={16} />
                          Confirmar llegada
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h2 className="text-[19px] font-bold">Últimos requerimientos</h2>
                  <p className="text-[13px] text-muted">Historial reciente de tu sucursal</p>
                </div>
                <span className="text-[12.5px] font-semibold text-muted tabular-nums">
                  {requests.length} total
                </span>
              </div>

              {requests.length === 0 ? (
                <p className="rounded-xl bg-surface-2 px-4 py-6 text-center text-sm text-muted">
                  Aún no has enviado requerimientos al almacén.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-line">
                  {requests.slice(0, 5).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-3.5">
                      <button
                        type="button"
                        onClick={() => setDetail(item)}
                        className="flex min-w-0 flex-col items-start gap-0.5 text-left hover:text-candey"
                      >
                        <span className="font-semibold text-ink">{item.code}</span>
                        <span className="text-[12.5px] text-muted tabular-nums">
                          {item.totalUnits} u. · {formatShortDate(item.date)}
                        </span>
                      </button>
                      <RequestStatusBadge status={item.status} />
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-1">
                <Link to="/requerimientos">
                  <Button variant="soft" size="sm">
                    Ver todos mis requerimientos
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}

      <BranchRequestFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
        products={products.filter((product) => product.active)}
        branches={[]}
        lockedBranchId={branchId}
        lockedBranchName={branchName}
      />

      <BranchRequestReceptionModal
        open={Boolean(receptionTarget)}
        request={receptionTarget}
        onClose={() => setReceptionTarget(null)}
        onConfirm={handleReception}
      />

      <BranchRequestDetailModal
        open={Boolean(detail)}
        request={detail}
        onClose={() => setDetail(null)}
        onPrintPdf={handlePrintPdf}
      />
    </div>
  )
}
