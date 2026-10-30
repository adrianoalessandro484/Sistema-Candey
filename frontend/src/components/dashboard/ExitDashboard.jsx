import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpFromLine, Plus, RotateCw, Store, Truck } from 'lucide-react'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import Card from '../Card.jsx'
import Spinner from '../Spinner.jsx'
import StatCard from '../StatCard.jsx'
import { formatShortDate } from '../../utils/format.js'
import { useExits } from '../../hooks/useExits.js'
import { useSuppliers } from '../../hooks/useSuppliers.js'
import { useBranches } from '../../hooks/useBranches.js'

export default function ExitDashboard({ name }) {
  const { exits, loading: exitsLoading, error: exitsError, reload: reloadExits } = useExits()
  const { suppliers, loading: suppliersLoading, error: suppliersError, reload: reloadSuppliers } =
    useSuppliers()
  const { branches, loading: branchesLoading, error: branchesError, reload: reloadBranches } =
    useBranches()

  const loading = exitsLoading || suppliersLoading || branchesLoading
  const error = exitsError || suppliersError || branchesError
  const totalUnits = exits.reduce((total, exit) => total + exit.totalUnits, 0)
  const activeSuppliers = suppliers.filter((supplier) => supplier.active).length
  const activeBranches = branches.filter((branch) => branch.active).length

  function reload() {
    reloadExits()
    reloadSuppliers()
    reloadBranches()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--color-wine)_0%,#5a1a32_55%,var(--color-candey)_100%)] px-6 py-6 text-white shadow-[var(--shadow-float)] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-7">
        <span className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />

        <div className="relative flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
            Vista de técnico de salida
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">Hola, {name}</h1>
          <p className="max-w-xl text-sm text-white/75">
            Registra despachos y muestras respetando el orden FEFO de los lotes.
          </p>
        </div>

        <Link to="/salidas" className="relative">
          <Button size="lg" className="bg-white text-candey-dark shadow-lg hover:bg-white hover:brightness-100">
            <Plus size={18} />
            Registrar salida
          </Button>
        </Link>
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
          Cargando tu resumen...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={ArrowUpFromLine}
              label="Salidas registradas"
              value={String(exits.length)}
              hint="Documentos de despacho"
              tone="candey"
            />
            <StatCard
              icon={ArrowUpFromLine}
              label="Unidades despachadas"
              value={String(totalUnits)}
              hint="Suma de todos los lotes"
              tone="info"
            />
            <StatCard
              icon={Truck}
              label="Proveedores activos"
              value={String(activeSuppliers)}
              hint="Directorio comercial"
              tone="gold"
            />
            <StatCard
              icon={Store}
              label="Sucursales activas"
              value={String(activeBranches)}
              hint="Destinos de despacho"
              tone="ok"
            />
          </div>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <h2 className="text-lg">Últimas salidas</h2>
                <p className="text-xs text-muted">Los despachos más recientes que registraste</p>
              </div>
              <Badge tone="candey">{exits.length} en total</Badge>
            </div>

            {exits.length === 0 ? (
              <p className="py-4 text-sm text-muted">Aún no hay salidas registradas.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {exits.slice(0, 5).map((exit) => (
                  <li key={exit.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-ink">{exit.code}</span>
                      <span className="text-xs text-muted">
                        {exit.reason} · {exit.branchName} · {formatShortDate(exit.date)}
                      </span>
                    </div>
                    <Badge tone={exit.status === 'Anulada' ? 'danger' : 'ok'} dot>
                      {exit.totalUnits} u.
                    </Badge>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/salidas"
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-candey hover:text-candey-dark"
            >
              Ver todas las salidas
              <ArrowRight size={15} />
            </Link>
          </Card>
        </>
      )}
    </div>
  )
}
