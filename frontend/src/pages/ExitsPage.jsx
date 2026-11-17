import { useState } from 'react'
import { ArrowUpFromLine, PackageCheck, Plus } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import TableToolbar from '../components/TableToolbar.jsx'
import Pagination from '../components/Pagination.jsx'
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

  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

  function handlePageSizeChange(value) {
    setPageSize(value)
    setPage(1)
  }

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
        icon={ArrowUpFromLine}
        title="Salidas"
        description="Registra despachos, mermas y muestras respetando FEFO."
      >
        <Button size="lg" onClick={() => setFormOpen(true)}>
          <Plus size={20} />
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
          icon={PackageCheck}
          label="Unidades despachadas"
          value={String(totalUnits)}
          tone="info"
        />
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por documento, motivo o sucursal..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="salida(s)"
        onRefresh={reload}
        refreshing={fetching}
      />

      <ExitsTable
        exits={pagedExits}
        loading={tableLoading || (loading && pagedExits.length === 0)}
        onView={setDetail}
        onCancel={(exit) => setConfirmation({ open: true, exit })}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
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
