import { useState } from 'react'
import { Boxes, CircleCheck, Plus } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import TableToolbar from '../components/TableToolbar.jsx'
import Pagination from '../components/Pagination.jsx'
import { useToast } from '../components/toast/toastContext.js'
import UnitsTable from '../components/units/UnitsTable.jsx'
import UnitFormModal from '../components/units/UnitFormModal.jsx'
import { useUnits, useUnitsPage } from '../hooks/useUnits.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { createUnit, updateUnit, changeUnitStatus, deleteUnit } from '../services/unitService.js'

const CLOSED_MODAL = { open: false, mode: 'create', unit: null }
const CLOSED_CONFIRM = { open: false, unit: null }

export default function UnitsPage() {
  const { notify } = useToast()
  const { units, loading, error: allError, reload: reloadAll } = useUnits()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const {
    units: pagedUnits,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useUnitsPage({ page, pageSize, search: debouncedSearch })
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
    setModal({ open: true, mode: 'create', unit: null })
  }

  function openEdit(unit) {
    setModal({ open: true, mode: 'edit', unit })
  }

  function closeModal() {
    setModal(CLOSED_MODAL)
  }

  async function saveUnit(values) {
    if (modal.mode === 'edit') {
      await updateUnit(modal.unit.id, values)
      notify('Unidad actualizada correctamente.', 'success')
    } else {
      await createUnit(values)
      notify('Unidad creada correctamente.', 'success')
    }

    closeModal()
    reload()
  }

  async function confirmDelete() {
    setProcessing(true)

    try {
      await deleteUnit(confirmation.unit.id)
      notify('Unidad eliminada.', 'success')
      setConfirmation(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  async function toggleStatus(unit) {
    try {
      await changeUnitStatus(unit.id, !unit.active)
      notify(unit.active ? 'Unidad desactivada.' : 'Unidad activada.', 'success')
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    }
  }

  const activeCount = units.filter((unit) => unit.active).length
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Catálogo"
        icon={Boxes}
        title="Unidades"
        description="Presentaciones de empaque: unidad, box, caja y tira."
      >
        <Button size="lg" onClick={openCreate}>
          <Plus size={20} />
          Nueva unidad
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={Boxes} label="Unidades registradas" value={String(units.length)} tone="candey" />
        <StatCard icon={CircleCheck} label="Unidades activas" value={String(activeCount)} tone="ok" />
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar unidad..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="unidad(es)"
        onRefresh={reload}
        refreshing={fetching}
      />

      <UnitsTable
        units={pagedUnits}
        loading={tableLoading || (loading && pagedUnits.length === 0)}
        onEdit={openEdit}
        onChangeStatus={toggleStatus}
        onDelete={(unit) => setConfirmation({ open: true, unit })}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        itemLabel="unidades"
        disabled={fetching}
      />

      <UnitFormModal
        open={modal.open}
        mode={modal.mode}
        unit={modal.unit}
        onClose={closeModal}
        onSave={saveUnit}
      />

      <ConfirmDialog
        open={confirmation.open}
        title="Eliminar unidad"
        message={`¿Deseas eliminar "${confirmation.unit?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={processing}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmation(CLOSED_CONFIRM)}
      />
    </div>
  )
}
