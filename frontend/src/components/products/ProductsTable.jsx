import { useMemo } from 'react'
import { Package, Pencil, Power, Trash2 } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import StockBadge from '../StockBadge.jsx'
import IconButton from '../IconButton.jsx'
import { formatCurrency } from '../../utils/format.js'

export default function ProductsTable({
  products,
  canManage = true,
  onEdit,
  onChangeStatus,
  onDelete,
  loading,
}) {
  const columns = useMemo(() => {
    const base = [
      {
        id: 'product',
        header: 'Producto',
        accessorFn: (row) => row.name,
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-candey-50 text-candey ring-1 ring-candey/10 ring-inset">
                <Package size={19} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-ink">{product.name}</span>
                <span className="text-[12px] text-muted">
                  COD-{String(product.id).padStart(3, '0')} · {product.unitName}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        id: 'category',
        header: 'Categoría',
        accessorFn: (row) => row.categoryName,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'stock',
        header: 'Existencias / Disponible',
        accessorFn: (row) => row.stock,
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex flex-col gap-1 tabular-nums">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-ink">{product.stock}</span>
                <StockBadge stock={product.stock} minStock={product.minStock} />
              </div>
              {product.committedStock > 0 ? (
                <span className="text-[11.5px] font-medium text-warn">
                  Disponible para pedir: {product.availableStock} ({product.committedStock} en pedidos)
                </span>
              ) : (
                <span className="text-[11.5px] text-muted">Disponible para pedir: {product.availableStock}</span>
              )}
            </div>
          )
        },
      },
      {
        id: 'minStock',
        header: 'Stock mínimo',
        accessorFn: (row) => row.minStock,
        cell: ({ getValue }) => <span className="text-muted tabular-nums">{getValue()}</span>,
      },
      {
        id: 'price',
        header: 'Precio',
        accessorFn: (row) => row.price,
        cell: ({ getValue }) => <span className="font-semibold text-body tabular-nums">{formatCurrency(getValue())}</span>,
      },
      {
        id: 'active',
        header: 'Estado',
        accessorFn: (row) => row.active,
        cell: ({ row }) =>
          row.original.active ? (
            <Badge tone="ok" dot>
              Activo
            </Badge>
          ) : (
            <Badge tone="neutral" dot>
              Inactivo
            </Badge>
          ),
      },
    ]

    if (canManage) {
      base.push({
        id: 'actions',
        header: 'Acciones',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex items-center justify-end gap-2">
              <IconButton title="Editar" onClick={() => onEdit(product)}>
                <Pencil size={16} />
              </IconButton>
              <IconButton
                title={product.active ? 'Desactivar' : 'Activar'}
                tone="gold"
                onClick={() => onChangeStatus(product)}
              >
                <Power size={16} />
              </IconButton>
              <IconButton title="Eliminar" tone="danger" onClick={() => onDelete(product)}>
                <Trash2 size={16} />
              </IconButton>
            </div>
          )
        },
      })
    }

    return base
  }, [canManage, onEdit, onChangeStatus, onDelete])

  return (
    <DataTable
      columns={columns}
      data={products}
      loading={loading}
      minWidth={canManage ? '940px' : '820px'}
      emptyIcon={Package}
      emptyTitle="No hay productos"
      emptyDescription="Crea el primer producto para comenzar a controlar tus existencias."
    />
  )
}
