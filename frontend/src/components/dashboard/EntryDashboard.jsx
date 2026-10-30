import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList, Package, PackagePlus, Plus, RotateCw, TriangleAlert } from 'lucide-react'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import Card from '../Card.jsx'
import Spinner from '../Spinner.jsx'
import StatCard from '../StatCard.jsx'
import { formatShortDate } from '../../utils/format.js'
import { useEntries } from '../../hooks/useEntries.js'
import { useProducts } from '../../hooks/useProducts.js'

export default function EntryDashboard({ name }) {
  const { entries, loading: entriesLoading, error: entriesError, reload: reloadEntries } = useEntries()
  const { products, loading: productsLoading, error: productsError, reload: reloadProducts } = useProducts()

  const loading = entriesLoading || productsLoading
  const error = entriesError || productsError
  const totalUnits = entries.reduce((total, entry) => total + entry.totalUnits, 0)
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= product.minStock,
  ).length

  function reload() {
    reloadEntries()
    reloadProducts()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--color-wine)_0%,#5a1a32_55%,var(--color-candey)_100%)] px-6 py-6 text-white shadow-[var(--shadow-float)] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-7">
        <span className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />

        <div className="relative flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
            Vista de técnico de entrada
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
            Hola, {name}
          </h1>
          <p className="max-w-xl text-sm text-white/75">
            Registra el ingreso de productos con su lote y mantén el stock actualizado.
          </p>
        </div>

        <Link to="/entradas" className="relative">
          <Button size="lg" className="bg-white text-candey-dark shadow-lg hover:bg-white hover:brightness-100">
            <Plus size={18} />
            Registrar entrada
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
              icon={ClipboardList}
              label="Entradas registradas"
              value={String(entries.length)}
              hint="Documentos de ingreso"
              tone="candey"
            />
            <StatCard
              icon={PackagePlus}
              label="Unidades ingresadas"
              value={String(totalUnits)}
              hint="Suma de todos los lotes"
              tone="info"
            />
            <StatCard
              icon={Package}
              label="Productos disponibles"
              value={String(products.length)}
              hint="Catálogo del almacén"
              tone="gold"
            />
            <StatCard
              icon={TriangleAlert}
              label="Productos con stock bajo"
              value={String(lowStock)}
              hint="Para avisar a administración"
              tone="warn"
            />
          </div>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <h2 className="text-lg">Últimas entradas</h2>
                <p className="text-xs text-muted">Los ingresos más recientes que registraste</p>
              </div>
              <Badge tone="candey">{entries.length} en total</Badge>
            </div>

            {entries.length === 0 ? (
              <p className="py-4 text-sm text-muted">Aún no hay entradas registradas.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {entries.slice(0, 5).map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-ink">{entry.code}</span>
                      <span className="text-xs text-muted">
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

            <Link
              to="/entradas"
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-candey hover:text-candey-dark"
            >
              Ver todas las entradas
              <ArrowRight size={15} />
            </Link>
          </Card>
        </>
      )}
    </div>
  )
}
