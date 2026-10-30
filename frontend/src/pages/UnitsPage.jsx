import { useEffect, useState } from 'react'
import { Boxes, CircleCheck, Plus, RotateCw } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Pagination from '../components/Pagination.jsx'
import Spinner from '../components/Spinner.jsx'
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

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, pageSize])

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
        title="Unidades"
        description="Presentaciones de empaque: unidad, box, caja y tira."
      >
        <Button onClick={openCreate}>
          <Plus size={18} />
          Nueva unidad
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={Boxes} label="Unidades registradas" value={String(units.length)} tone="candey" />
        <StatCard icon={CircleCheck} label="Unidades activas" value={String(activeCount)} tone="ok" />
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
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar unidad..." />
        <span className="text-[12.5px] text-muted">{meta?.totalItems ?? 0} unidad(es) en total</span>
      </div>

      {loading && !tableLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando unidades...
        </div>
      ) : (
        <UnitsTable
          units={pagedUnits}
          loading={tableLoading}
          onEdit={openEdit}
          onChangeStatus={toggleStatus}
          onDelete={(unit) => setConfirmation({ open: true, unit })}
        />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
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
