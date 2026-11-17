import { useState } from 'react'
import { CircleCheck, Plus, Tag } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import TableToolbar from '../components/TableToolbar.jsx'
import Pagination from '../components/Pagination.jsx'
import { useToast } from '../components/toast/toastContext.js'
import CategoriesTable from '../components/categories/CategoriesTable.jsx'
import CategoryFormModal from '../components/categories/CategoryFormModal.jsx'
import { useCategories, useCategoriesPage } from '../hooks/useCategories.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import {
  createCategory,
  updateCategory,
  changeCategoryStatus,
  deleteCategory,
} from '../services/categoryService.js'

const CLOSED_MODAL = { open: false, mode: 'create', category: null }
const CLOSED_CONFIRM = { open: false, category: null }

export default function CategoriesPage() {
  const { notify } = useToast()
  const { categories, loading, error: allError, reload: reloadAll } = useCategories()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const {
    categories: pagedCategories,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useCategoriesPage({ page, pageSize, search: debouncedSearch })
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
    setModal({ open: true, mode: 'create', category: null })
  }

  function openEdit(category) {
    setModal({ open: true, mode: 'edit', category })
  }

  function closeModal() {
    setModal(CLOSED_MODAL)
  }

  async function saveCategory(values) {
    if (modal.mode === 'edit') {
      await updateCategory(modal.category.id, values)
      notify('Categoría actualizada correctamente.', 'success')
    } else {
      await createCategory(values)
      notify('Categoría creada correctamente.', 'success')
    }

    closeModal()
    reload()
  }

  async function confirmDelete() {
    setProcessing(true)

    try {
      await deleteCategory(confirmation.category.id)
      notify('Categoría eliminada.', 'success')
      setConfirmation(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  async function toggleStatus(category) {
    try {
      await changeCategoryStatus(category.id, !category.active)
      notify(category.active ? 'Categoría desactivada.' : 'Categoría activada.', 'success')
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    }
  }

  const activeCount = categories.filter((category) => category.active).length
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Catálogo"
        icon={Tag}
        title="Categorías"
        description="Clasifica los productos por categoría para encontrarlos más rápido."
      >
        <Button size="lg" onClick={openCreate}>
          <Plus size={20} />
          Nueva categoría
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={Tag}
          label="Categorías registradas"
          value={String(categories.length)}
          tone="candey"
        />
        <StatCard icon={CircleCheck} label="Categorías activas" value={String(activeCount)} tone="ok" />
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar categoría..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="categoría(s)"
        onRefresh={reload}
        refreshing={fetching}
      />

      <CategoriesTable
        categories={pagedCategories}
        loading={tableLoading || (loading && pagedCategories.length === 0)}
        onEdit={openEdit}
        onChangeStatus={toggleStatus}
        onDelete={(category) => setConfirmation({ open: true, category })}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        itemLabel="categorías"
        disabled={fetching}
      />

      <CategoryFormModal
        open={modal.open}
        mode={modal.mode}
        category={modal.category}
        onClose={closeModal}
        onSave={saveCategory}
      />

      <ConfirmDialog
        open={confirmation.open}
        title="Eliminar categoría"
        message={`¿Deseas eliminar "${confirmation.category?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={processing}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmation(CLOSED_CONFIRM)}
      />
    </div>
  )
}
