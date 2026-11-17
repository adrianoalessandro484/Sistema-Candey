import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckCircle2, Clock, PackageCheck, PackagePlus, Plus } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import TableToolbar from '../components/TableToolbar.jsx'
import Pagination from '../components/Pagination.jsx'
import { useToast } from '../components/toast/toastContext.js'
import { useSession } from '../context/sessionContext.js'
import { can } from '../utils/permissions.js'
import { cancelEntryOrder, createEntryOrder, receiveEntryOrder } from '../services/entryOrderService.js'
import { useEntryOrders, useEntryOrdersPage } from '../hooks/useEntryOrders.js'
import { useProducts } from '../hooks/useProducts.js'
import { useSuppliers } from '../hooks/useSuppliers.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import EntryOrdersTable from '../components/entryOrders/EntryOrdersTable.jsx'
import EntryOrderFormModal from '../components/entryOrders/EntryOrderFormModal.jsx'
import EntryOrderReceiveModal from '../components/entryOrders/EntryOrderReceiveModal.jsx'
import EntryOrderDetailModal from '../components/entryOrders/EntryOrderDetailModal.jsx'

const STATUS_FILTERS = ['', 'Pendiente', 'Recibida', 'Cancelada']
const CLOSED_CONFIRM = { open: false, order: null }

export default function EntryOrdersPage() {
  const { notify } = useToast()
  const { user } = useSession()
  const location = useLocation()
  const canCreate = can(user?.role, 'entryOrders.create')
  const canReceive = can(user?.role, 'entryOrders.receive')

  const prefill = location.state?.prefillOrder ?? null

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const { orders: allOrders, loading, error: allError, reload: reloadAll } = useEntryOrders()
  const {
    orders: pagedOrders,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useEntryOrdersPage({ page, pageSize, search: debouncedSearch, status: statusFilter })

  const { products, reload: reloadProducts } = useProducts()
  const { suppliers } = useSuppliers({ enabled: canCreate })

  const [createOpen, setCreateOpen] = useState(Boolean(prefill && canCreate))
  const [detail, setDetail] = useState(null)
  const [receiveTarget, setReceiveTarget] = useState(null)
  const [cancelConfirm, setCancelConfirm] = useState(CLOSED_CONFIRM)
  const [processing, setProcessing] = useState(false)

  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

  function handleStatusChange(value) {
    setStatusFilter(value)
    setPage(1)
  }

  function handlePageSizeChange(value) {
    setPageSize(value)
    setPage(1)
  }

  function reload() {
    reloadAll()
    reloadPage()
    reloadProducts()
  }

  async function handleCreate(values) {
    await createEntryOrder(values)
    notify('Orden de ingreso creada correctamente.', 'success')
    setCreateOpen(false)
    reload()
  }

  async function handleReceive(id, values) {
    await receiveEntryOrder(id, values)
    notify('Orden recibida e ingreso registrado en Kardex.', 'success')
    setReceiveTarget(null)
    reload()
  }

  async function confirmCancel() {
    setProcessing(true)
    try {
      await cancelEntryOrder(cancelConfirm.order.id)
      notify('Orden de ingreso cancelada.', 'success')
      setCancelConfirm(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  const pendingOrders = allOrders.filter((o) => o.status === 'Pendiente')
  const receivedOrders = allOrders.filter((o) => o.status === 'Recibida')
  const pendingUnits = pendingOrders.reduce((sum, o) => sum + o.totalUnits, 0)
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Operación"
        icon={PackagePlus}
        title="Órdenes de ingreso"
        description={
          canCreate
            ? 'Programa pedidos a proveedores y haz seguimiento a su recepción en almacén.'
            : 'Consulta los pedidos pendientes de proveedores y registra su ingreso con lotes.'
        }
      >
        {canCreate ? (
          <Button size="lg" onClick={() => setCreateOpen(true)}>
            <Plus size={20} />
            Nueva orden
          </Button>
        ) : null}
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Clock} label="Órdenes por recibir" value={String(pendingOrders.length)} tone="gold" />
        <StatCard icon={PackageCheck} label="Unidades esperadas" value={String(pendingUnits)} tone="info" />
        <StatCard icon={CheckCircle2} label="Órdenes recibidas" value={String(receivedOrders.length)} tone="ok" />
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por código, proveedor o entrada..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="orden(es)"
        onRefresh={reload}
        refreshing={fetching}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((status) => {
            const active = statusFilter === status
            return (
              <button
                key={status || 'all'}
                type="button"
                onClick={() => handleStatusChange(status)}
                className={`h-10 rounded-xl border px-3.5 text-[13px] font-semibold transition-all ${
                  active
                    ? 'border-candey bg-candey text-white shadow-xs'
                    : 'border-line-strong bg-white text-body hover:border-candey/45 hover:bg-candey-50'
                }`}
              >
                {status || 'Todas'}
              </button>
            )
          })}
        </div>
      </TableToolbar>

      <EntryOrdersTable
        orders={pagedOrders}
        loading={tableLoading || (loading && pagedOrders.length === 0)}
        canReceive={canReceive}
        canCancel={canCreate}
        onView={setDetail}
        onReceive={setReceiveTarget}
        onCancel={(order) => setCancelConfirm({ open: true, order })}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        itemLabel="órdenes"
        disabled={fetching}
      />

      {canCreate ? (
        <EntryOrderFormModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSave={handleCreate}
          products={products.filter((product) => product.active)}
          suppliers={suppliers.filter((supplier) => supplier.active)}
          initialLines={prefill?.lines ?? null}
          initialNote={prefill?.note ?? ''}
        />
      ) : null}

      <EntryOrderReceiveModal
        open={Boolean(receiveTarget)}
        order={receiveTarget}
        products={products.filter((product) => product.active)}
        onClose={() => setReceiveTarget(null)}
        onReceive={handleReceive}
      />

      <EntryOrderDetailModal
        open={Boolean(detail)}
        order={detail}
        onClose={() => setDetail(null)}
      />

      <ConfirmDialog
        open={cancelConfirm.open}
        title="Cancelar orden de ingreso"
        message={`¿Deseas cancelar la orden "${cancelConfirm.order?.code}"?`}
        confirmText="Cancelar orden"
        loading={processing}
        onConfirm={confirmCancel}
        onCancel={() => setCancelConfirm(CLOSED_CONFIRM)}
      />
    </div>
  )
}
