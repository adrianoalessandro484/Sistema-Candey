import { useState } from 'react'
import { AlertTriangle, CheckCircle2, ClipboardCheck, Clock, Plus, Truck } from 'lucide-react'
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
import { generateExitPdf } from '../utils/pdf.js'
import { getExitById } from '../services/exitService.js'
import {
  approveBranchRequest,
  cancelBranchRequest,
  confirmBranchRequestReception,
  createBranchRequest,
  rejectBranchRequest,
} from '../services/branchRequestService.js'
import { useBranchRequests, useBranchRequestsPage } from '../hooks/useBranchRequests.js'
import { useProducts } from '../hooks/useProducts.js'
import { useBranches } from '../hooks/useBranches.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import BranchRequestsTable from '../components/requests/BranchRequestsTable.jsx'
import BranchRequestFormModal from '../components/requests/BranchRequestFormModal.jsx'
import BranchRequestApproveModal from '../components/requests/BranchRequestApproveModal.jsx'
import BranchRequestRejectModal from '../components/requests/BranchRequestRejectModal.jsx'
import BranchRequestReceptionModal from '../components/requests/BranchRequestReceptionModal.jsx'
import BranchRequestDetailModal from '../components/requests/BranchRequestDetailModal.jsx'

const STATUS_FILTERS = ['', 'Pendiente', 'En camino', 'Observado', 'Recibido', 'Rechazado']
const CLOSED_CONFIRM = { open: false, request: null }

export default function BranchRequestsPage() {
  const { notify } = useToast()
  const { user } = useSession()
  const canCreate = can(user?.role, 'branchRequests.create')
  const canReview = can(user?.role, 'branchRequests.review')
  const canReceive = can(user?.role, 'branchRequests.receive')
  const isBranchUser = user?.role === 'BranchClerk'

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const { requests: allRequests, loading, error: allError, reload: reloadAll } = useBranchRequests()
  const {
    requests: pagedRequests,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useBranchRequestsPage({ page, pageSize, search: debouncedSearch, status: statusFilter })

  const { products, reload: reloadProducts } = useProducts()
  const { branches } = useBranches({ enabled: !isBranchUser })

  const [createOpen, setCreateOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [approveTarget, setApproveTarget] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [receptionTarget, setReceptionTarget] = useState(null)
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
    await createBranchRequest(values)
    notify('Requerimiento enviado al almacén correctamente.', 'success')
    setCreateOpen(false)
    reload()
  }

  async function handleApprove(id, values) {
    await approveBranchRequest(id, values)
    notify('Requerimiento aprobado y salida generada.', 'success')
    setApproveTarget(null)
    reload()
  }

  async function handleReject(id, reason) {
    await rejectBranchRequest(id, reason)
    notify('Requerimiento rechazado. El stock reservado fue liberado.', 'success')
    setRejectTarget(null)
    reload()
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
    reload()
  }

  async function confirmCancel() {
    setProcessing(true)
    try {
      await cancelBranchRequest(cancelConfirm.request.id)
      notify('Requerimiento cancelado.', 'success')
      setCancelConfirm(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
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

  const pendingCount = allRequests.filter((r) => r.status === 'Pendiente').length
  const inTransitCount = allRequests.filter((r) => r.status === 'En camino').length
  const observedCount = allRequests.filter((r) => r.status === 'Observado').length
  const receivedCount = allRequests.filter((r) => r.status === 'Recibido').length
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Operación"
        icon={ClipboardCheck}
        title="Requerimientos de sucursales"
        description={
          isBranchUser
            ? 'Solicita mercadería al almacén central y confirma su llegada.'
            : 'Recepciona pedidos de sucursales, aprueba con lotes FEFO y monitorea entregas.'
        }
      >
        {canCreate ? (
          <Button size="lg" onClick={() => setCreateOpen(true)}>
            <Plus size={20} />
            Nuevo requerimiento
          </Button>
        ) : null}
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Clock} label="Pendientes" value={String(pendingCount)} tone="gold" />
        <StatCard icon={Truck} label="En camino" value={String(inTransitCount)} tone="info" />
        <StatCard icon={AlertTriangle} label="Observados" value={String(observedCount)} tone="danger" />
        <StatCard icon={CheckCircle2} label="Recibidos" value={String(receivedCount)} tone="ok" />
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por código, sucursal o salida..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="requerimiento(s)"
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
                {status || 'Todos'}
              </button>
            )
          })}
        </div>
      </TableToolbar>

      <BranchRequestsTable
        requests={pagedRequests}
        loading={tableLoading || (loading && pagedRequests.length === 0)}
        canReview={canReview}
        canReceive={canReceive}
        onView={setDetail}
        onApprove={setApproveTarget}
        onReject={setRejectTarget}
        onConfirmReception={setReceptionTarget}
        onCancel={(item) => setCancelConfirm({ open: true, request: item })}
        onPrintPdf={handlePrintPdf}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        itemLabel="requerimientos"
        disabled={fetching}
      />

      <BranchRequestFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
        products={products.filter((product) => product.active)}
        branches={branches.filter((branch) => branch.active)}
        lockedBranchId={isBranchUser ? user?.branchId : null}
        lockedBranchName={isBranchUser ? user?.branchName : null}
      />

      <BranchRequestApproveModal
        open={Boolean(approveTarget)}
        request={approveTarget}
        onClose={() => setApproveTarget(null)}
        onApprove={handleApprove}
      />

      <BranchRequestRejectModal
        open={Boolean(rejectTarget)}
        request={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onReject={handleReject}
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

      <ConfirmDialog
        open={cancelConfirm.open}
        title="Cancelar requerimiento"
        message={`¿Deseas cancelar "${cancelConfirm.request?.code}"? El stock reservado se liberará.`}
        confirmText="Cancelar requerimiento"
        loading={processing}
        onConfirm={confirmCancel}
        onCancel={() => setCancelConfirm(CLOSED_CONFIRM)}
      />
    </div>
  )
}
