import { useState } from 'react'
import { ArrowDownToLine, ClipboardList, Coins, PackagePlus, Plus } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import TableToolbar from '../components/TableToolbar.jsx'
import Pagination from '../components/Pagination.jsx'
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
        icon={ArrowDownToLine}
        title="Entradas"
        description="Registra el ingreso de productos con su lote y costo."
      >
        <Button size="lg" onClick={() => setFormOpen(true)}>
          <Plus size={20} />
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

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por documento, proveedor o nota..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="entrada(s)"
        onRefresh={reload}
        refreshing={fetching}
      />

      <EntriesTable
        entries={pagedEntries}
        loading={tableLoading || (loading && pagedEntries.length === 0)}
        onView={setDetail}
        onCancel={(entry) => setConfirmation({ open: true, entry })}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
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
