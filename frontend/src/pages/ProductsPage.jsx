import { useEffect, useState } from 'react'
import { Package, PackagePlus, Plus, RotateCw, TriangleAlert } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Pagination from '../components/Pagination.jsx'
import Spinner from '../components/Spinner.jsx'
import { useToast } from '../components/toast/toastContext.js'
import ProductsTable from '../components/products/ProductsTable.jsx'
import ProductFormModal from '../components/products/ProductFormModal.jsx'
import { useProducts, useProductsPage } from '../hooks/useProducts.js'
import { useCategories } from '../hooks/useCategories.js'
import { useUnits } from '../hooks/useUnits.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
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

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, pageSize])

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
        title="Productos"
        description="Catálogo de productos, stock mínimo y control de existencias."
      >
        <Button onClick={openCreate}>
          <Plus size={18} />
          Nuevo producto
        </Button>
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
          placeholder="Buscar por nombre, categoría o unidad..."
        />
        <span className="text-[12.5px] text-muted">
          {meta?.totalItems ?? 0} producto(s) en total
        </span>
      </div>

      {loading && !tableLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando productos...
        </div>
      ) : (
        <ProductsTable
          products={pagedProducts}
          loading={tableLoading}
          onEdit={openEdit}
          onChangeStatus={toggleStatus}
          onDelete={(product) => setConfirmation({ open: true, product })}
        />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="productos"
        disabled={fetching}
      />

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
    </div>
  )
}
