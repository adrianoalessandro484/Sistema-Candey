import { useEffect, useState } from 'react'
import { CircleCheck, Plus, RotateCw, Truck } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Pagination from '../components/Pagination.jsx'
import Spinner from '../components/Spinner.jsx'
import { useToast } from '../components/toast/toastContext.js'
import SuppliersTable from '../components/suppliers/SuppliersTable.jsx'
import SupplierFormModal from '../components/suppliers/SupplierFormModal.jsx'
import { useSuppliers, useSuppliersPage } from '../hooks/useSuppliers.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import {
  createSupplier,
  updateSupplier,
  changeSupplierStatus,
  deleteSupplier,
} from '../services/supplierService.js'

const CLOSED_MODAL = { open: false, mode: 'create', supplier: null }
const CLOSED_CONFIRM = { open: false, supplier: null }

export default function SuppliersPage() {
  const { notify } = useToast()
  const { suppliers, loading, error: allError, reload: reloadAll } = useSuppliers()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const {
    suppliers: pagedSuppliers,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useSuppliersPage({ page, pageSize, search: debouncedSearch })
  const [modal, setModal] = useState(CLOSED_MODAL)
  const [confirmation, setConfirmation] = useState(CLOSED_CONFIRM)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, pageSize])

  function reload() {
    reloadAll()
    reloadPage()
  }

  function openCreate() {
    setModal({ open: true, mode: 'create', supplier: null })
  }

  function openEdit(supplier) {
    setModal({ open: true, mode: 'edit', supplier })
  }

  function closeModal() {
    setModal(CLOSED_MODAL)
  }

  async function saveSupplier(values) {
    if (modal.mode === 'edit') {
      await updateSupplier(modal.supplier.id, values)
      notify('Proveedor actualizado correctamente.', 'success')
    } else {
      await createSupplier(values)
      notify('Proveedor creado correctamente.', 'success')
    }

    closeModal()
    reload()
  }

  async function confirmDelete() {
    setProcessing(true)

    try {
      await deleteSupplier(confirmation.supplier.id)
      notify('Proveedor eliminado.', 'success')
      setConfirmation(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  async function toggleStatus(supplier) {
    try {
      await changeSupplierStatus(supplier.id, !supplier.active)
      notify(supplier.active ? 'Proveedor desactivado.' : 'Proveedor activado.', 'success')
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    }
  }

  const activeCount = suppliers.filter((supplier) => supplier.active).length
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Administración"
        title="Proveedores"
        description="Directorio de distribuidores y contacto para reposición."
      >
        <Button onClick={openCreate}>
          <Plus size={18} />
          Nuevo proveedor
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={Truck}
          label="Proveedores registrados"
          value={String(suppliers.length)}
          tone="candey"
        />
        <StatCard icon={CircleCheck} label="Proveedores activos" value={String(activeCount)} tone="ok" />
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
          placeholder="Buscar por nombre, RUC o correo..."
        />
        <span className="text-[12.5px] text-muted">
          {meta?.totalItems ?? 0} proveedor(es) en total
        </span>
      </div>

      {loading && !tableLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando proveedores...
        </div>
      ) : (
        <SuppliersTable
          suppliers={pagedSuppliers}
          loading={tableLoading}
          onEdit={openEdit}
          onChangeStatus={toggleStatus}
          onDelete={(supplier) => setConfirmation({ open: true, supplier })}
        />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="proveedores"
        disabled={fetching}
      />

      <SupplierFormModal
        open={modal.open}
        mode={modal.mode}
        supplier={modal.supplier}
        onClose={closeModal}
        onSave={saveSupplier}
      />

      <ConfirmDialog
        open={confirmation.open}
        title="Eliminar proveedor"
        message={`¿Deseas eliminar "${confirmation.supplier?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={processing}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmation(CLOSED_CONFIRM)}
      />
    </div>
  )
}
