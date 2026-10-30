import { useEffect, useState } from 'react'
import { ClipboardList, Coins, PackagePlus, Plus, RotateCw } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Pagination from '../components/Pagination.jsx'
import Spinner from '../components/Spinner.jsx'
import { useToast } from '../components/toast/toastContext.js'
import EntriesTable from '../components/entries/EntriesTable.jsx'
import EntryFormModal from '../components/entries/EntryFormModal.jsx'
import EntryDetailModal from '../components/entries/EntryDetailModal.jsx'
import { useEntries, useEntriesPage } from '../hooks/useEntries.js'
import { useProducts } from '../hooks/useProducts.js'
import { useSuppliers } from '../hooks/useSuppliers.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { createEntry, cancelEntry } from '../services/entryService.js'
import { formatCurrency } from '../utils/format.js'

const CLOSED_CONFIRM = { open: false, entry: null }

export default function EntriesPage() {
  const { notify } = useToast()
  const { entries, loading, error: allError, reload: reloadAll } = useEntries()
  const { products } = useProducts()
  const { suppliers } = useSuppliers()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const {
    entries: pagedEntries,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useEntriesPage({ page, pageSize, search: debouncedSearch })
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

  async function saveEntry(values) {
    await createEntry(values)
    notify('Entrada registrada correctamente.', 'success')
    setFormOpen(false)
    reload()
  }

  async function confirmCancel() {
    setProcessing(true)

    try {
      await cancelEntry(confirmation.entry.id)
      notify('Entrada anulada correctamente.', 'success')
      setConfirmation(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  const totalUnits = entries.reduce((total, entry) => total + entry.totalUnits, 0)
  const totalCost = entries.reduce((total, entry) => total + entry.totalCost, 0)
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Operación"
        title="Entradas"
        description="Registra el ingreso de productos con su lote y costo."
      >
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={18} />
          Nueva entrada
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardList}
          label="Entradas registradas"
          value={String(entries.length)}
          tone="candey"
        />
        <StatCard icon={PackagePlus} label="Unidades ingresadas" value={String(totalUnits)} tone="info" />
        <StatCard icon={Coins} label="Costo total" value={formatCurrency(totalCost)} tone="gold" />
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
          placeholder="Buscar por documento, proveedor o nota..."
        />
        <span className="text-[12.5px] text-muted">
          {meta?.totalItems ?? 0} entrada(s) en total
        </span>
      </div>

      {loading && !tableLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando entradas...
        </div>
      ) : (
        <EntriesTable
          entries={pagedEntries}
          loading={tableLoading}
          onView={setDetail}
          onCancel={(entry) => setConfirmation({ open: true, entry })}
        />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="entradas"
        disabled={fetching}
      />

      <EntryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={saveEntry}
        products={products.filter((product) => product.active)}
        suppliers={suppliers.filter((supplier) => supplier.active)}
      />

      <EntryDetailModal open={Boolean(detail)} entry={detail} onClose={() => setDetail(null)} />

      <ConfirmDialog
        open={confirmation.open}
        title="Anular entrada"
        message={`¿Deseas anular "${confirmation.entry?.code}"? Esta acción revierte el stock ingresado.`}
        confirmText="Anular entrada"
        loading={processing}
        onConfirm={confirmCancel}
        onCancel={() => setConfirmation(CLOSED_CONFIRM)}
      />
    </div>
  )
}
