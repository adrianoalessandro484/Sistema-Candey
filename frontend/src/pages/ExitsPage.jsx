import { useEffect, useState } from 'react'
import { ArrowUpFromLine, Plus, RotateCw } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Pagination from '../components/Pagination.jsx'
import Spinner from '../components/Spinner.jsx'
import { useToast } from '../components/toast/toastContext.js'
import ExitsTable from '../components/exits/ExitsTable.jsx'
import ExitFormModal from '../components/exits/ExitFormModal.jsx'
import ExitDetailModal from '../components/exits/ExitDetailModal.jsx'
import { useExits, useExitsPage } from '../hooks/useExits.js'
import { useProducts } from '../hooks/useProducts.js'
import { useBranches } from '../hooks/useBranches.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { createExit, cancelExit } from '../services/exitService.js'

const CLOSED_CONFIRM = { open: false, exit: null }

export default function ExitsPage() {
  const { notify } = useToast()
  const { exits, loading, error: allError, reload: reloadAll } = useExits()
  const { products } = useProducts()
  const { branches } = useBranches()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const {
    exits: pagedExits,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useExitsPage({ page, pageSize, search: debouncedSearch })
  const [formOpen, setFormOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [confirmation, setConfirmation] = useState(CLOSED_CONFIRM)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, pageSize])

  function reload() {
    reloadAll()
    reloadPage()
  }

  async function saveExit(values) {
    await createExit(values)
    notify('Salida registrada correctamente.', 'success')
    setFormOpen(false)
    reload()
  }

  async function confirmCancel() {
    setProcessing(true)

    try {
      await cancelExit(confirmation.exit.id)
      notify('Salida anulada correctamente.', 'success')
      setConfirmation(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  const totalUnits = exits.reduce((total, exit) => total + exit.totalUnits, 0)
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Operación"
        title="Salidas"
        description="Registra despachos, mermas y muestras respetando FEFO."
      >
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={18} />
          Nueva salida
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={ArrowUpFromLine}
          label="Salidas registradas"
          value={String(exits.length)}
          tone="candey"
        />
        <StatCard
          icon={ArrowUpFromLine}
          label="Unidades despachadas"
          value={String(totalUnits)}
          tone="info"
        />
      </div>

      {error ? (
        <div className="flex items-center justify-between rounded-xl border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={reload}>
            <RotateCw size={16} />
            Reintentar
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por documento, motivo o sucursal..."
        />
        <span className="text-[12.5px] text-muted">{meta?.totalItems ?? 0} salida(s) en total</span>
      </div>

      {loading && !tableLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando salidas...
        </div>
      ) : (
        <ExitsTable
          exits={pagedExits}
          loading={tableLoading}
          onView={setDetail}
          onCancel={(exit) => setConfirmation({ open: true, exit })}
        />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="salidas"
        disabled={fetching}
      />

      <ExitFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={saveExit}
        products={products.filter((product) => product.active)}
        branches={branches.filter((branch) => branch.active)}
      />

      <ExitDetailModal open={Boolean(detail)} exit={detail} onClose={() => setDetail(null)} />

      <ConfirmDialog
        open={confirmation.open}
        title="Anular salida"
        message={`¿Deseas anular "${confirmation.exit?.code}"? Esta acción devuelve el stock.`}
        confirmText="Anular salida"
        loading={processing}
        onConfirm={confirmCancel}
        onCancel={() => setConfirmation(CLOSED_CONFIRM)}
      />
    </div>
  )
}
