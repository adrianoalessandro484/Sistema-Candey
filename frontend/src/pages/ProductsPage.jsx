import { useState } from 'react'
import { Package, PackagePlus, Plus, TriangleAlert } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import TableToolbar from '../components/TableToolbar.jsx'
import Pagination from '../components/Pagination.jsx'
import { useToast } from '../components/toast/toastContext.js'
import { useSession } from '../context/sessionContext.js'
import ProductsTable from '../components/products/ProductsTable.jsx'
import ProductFormModal from '../components/products/ProductFormModal.jsx'
import { useProducts, useProductsPage } from '../hooks/useProducts.js'
import { useCategories } from '../hooks/useCategories.js'
import { useUnits } from '../hooks/useUnits.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { can } from '../utils/permissions.js'
import {
  createProduct,
  updateProduct,
  changeProductStatus,
  deleteProduct,
} from '../services/productService.js'

const CLOSED_MODAL = { open: false, mode: 'create', product: null }
const CLOSED_CONFIRM = { open: false, product: null }

export default function ProductsPage() {
  const { notify } = useToast()
  const { user } = useSession()
  const canManage = can(user?.role, 'products.manage')
  const { products, loading, error: allError, reload: reloadAll } = useProducts()
  const { categories } = useCategories()
  const { units } = useUnits()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const {
    products: pagedProducts,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useProductsPage({ page, pageSize, search: debouncedSearch })
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
    setModal({ open: true, mode: 'create', product: null })
  }

  function openEdit(product) {
    setModal({ open: true, mode: 'edit', product })
  }

  function closeModal() {
    setModal(CLOSED_MODAL)
  }

  async function saveProduct(values) {
    if (modal.mode === 'edit') {
      await updateProduct(modal.product.id, values)
      notify('Producto actualizado correctamente.', 'success')
    } else {
      await createProduct(values)
      notify('Producto creado correctamente.', 'success')
    }

    closeModal()
    reload()
  }

  async function confirmDelete() {
    setProcessing(true)

    try {
      await deleteProduct(confirmation.product.id)
      notify('Producto eliminado.', 'success')
      setConfirmation(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  async function toggleStatus(product) {
    try {
      await changeProductStatus(product.id, !product.active)
      notify(product.active ? 'Producto desactivado.' : 'Producto activado.', 'success')
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    }
  }

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= product.minStock,
  ).length
  const outOfStock = products.filter((product) => product.stock === 0).length
  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Catálogo"
        icon={Package}
        title="Productos"
        description={
          canManage
            ? 'Catálogo de productos, stock mínimo y control de existencias.'
            : 'Consulta el catálogo del almacén central y la disponibilidad real para pedidos.'
        }
      >
        {canManage ? (
          <Button size="lg" onClick={openCreate}>
            <Plus size={20} />
            Nuevo producto
          </Button>
        ) : null}
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Package}
          label="Productos registrados"
          value={String(products.length)}
          tone="candey"
        />
        <StatCard icon={TriangleAlert} label="Con stock bajo" value={String(lowStock)} tone="warn" />
        <StatCard icon={PackagePlus} label="Sin stock" value={String(outOfStock)} tone="danger" />
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por nombre, categoría o unidad..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="producto(s)"
        onRefresh={reload}
        refreshing={fetching}
      />

      <ProductsTable
        products={pagedProducts}
        canManage={canManage}
        loading={tableLoading || (loading && pagedProducts.length === 0)}
        onEdit={openEdit}
        onChangeStatus={toggleStatus}
        onDelete={(product) => setConfirmation({ open: true, product })}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        itemLabel="productos"
        disabled={fetching}
      />

      {canManage ? (
        <>
          <ProductFormModal
            open={modal.open}
            mode={modal.mode}
            product={modal.product}
            categories={categories}
            units={units}
            onClose={closeModal}
            onSave={saveProduct}
          />

          <ConfirmDialog
            open={confirmation.open}
            title="Eliminar producto"
            message={`¿Deseas eliminar "${confirmation.product?.name}"? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            loading={processing}
            onConfirm={confirmDelete}
            onCancel={() => setConfirmation(CLOSED_CONFIRM)}
          />
        </>
      ) : null}
    </div>
  )
}
