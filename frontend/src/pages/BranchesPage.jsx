import { useState } from 'react'
import { CircleCheck, Plus, Store } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import TableToolbar from '../components/TableToolbar.jsx'
import Pagination from '../components/Pagination.jsx'
import { useToast } from '../components/toast/toastContext.js'
import BranchesTable from '../components/branches/BranchesTable.jsx'
import BranchFormModal from '../components/branches/BranchFormModal.jsx'
import { useBranches, useBranchesPage } from '../hooks/useBranches.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import {
  createBranch,
  updateBranch,
  changeBranchStatus,
  deleteBranch,
} from '../services/branchService.js'

const CLOSED_MODAL = { open: false, mode: 'create', branch: null }
const CLOSED_CONFIRM = { open: false, branch: null }

export default function BranchesPage() {
  const { notify } = useToast()
  const { branches, loading, error: allError, reload: reloadAll } = useBranches()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const {
    branches: pagedBranches,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useBranchesPage({ page, pageSize, search: debouncedSearch })
  const [modal, setModal] = useState(CLOSED_MODAL)
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

  function openCreate() {
    setModal({ open: true, mode: 'create', branch: null })
  }

  function openEdit(branch) {
    setModal({ open: true, mode: 'edit', branch })
  }

  function closeModal() {
    setModal(CLOSED_MODAL)
  }

  async function saveBranch(values) {
    if (modal.mode === 'edit') {
      await updateBranch(modal.branch.id, values)
      notify('Sucursal actualizada correctamente.', 'success')
    } else {
      await createBranch(values)
      notify('Sucursal creada correctamente.', 'success')
    }

    closeModal()
    reload()
  }

  async function confirmDelete() {
    setProcessing(true)

    try {
      await deleteBranch(confirmation.branch.id)
      notify('Sucursal eliminada.', 'success')
      setConfirmation(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  async function toggleStatus(branch) {
    try {
      await changeBranchStatus(branch.id, !branch.active)
      notify(branch.active ? 'Sucursal desactivada.' : 'Sucursal activada.', 'success')
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    }
  }

  const activeCount = branches.filter((branch) => branch.active).length
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Administración"
        icon={Store}
        title="Sucursales"
        description="Destinos de despacho de los productos."
      >
        <Button size="lg" onClick={openCreate}>
          <Plus size={20} />
          Nueva sucursal
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={Store}
          label="Sucursales registradas"
          value={String(branches.length)}
          tone="candey"
        />
        <StatCard icon={CircleCheck} label="Sucursales activas" value={String(activeCount)} tone="ok" />
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar sucursal..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="sucursal(es)"
        onRefresh={reload}
        refreshing={fetching}
      />

      <BranchesTable
        branches={pagedBranches}
        loading={tableLoading || (loading && pagedBranches.length === 0)}
        onEdit={openEdit}
        onChangeStatus={toggleStatus}
        onDelete={(branch) => setConfirmation({ open: true, branch })}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        itemLabel="sucursales"
        disabled={fetching}
      />

      <BranchFormModal
        open={modal.open}
        mode={modal.mode}
        branch={modal.branch}
        onClose={closeModal}
        onSave={saveBranch}
      />

      <ConfirmDialog
        open={confirmation.open}
        title="Eliminar sucursal"
        message={`¿Deseas eliminar "${confirmation.branch?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={processing}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmation(CLOSED_CONFIRM)}
      />
    </div>
  )
}
