import { useMemo } from 'react'
import { Package } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import StockBadge from '../StockBadge.jsx'
import { formatCurrency } from '../../utils/format.js'

export default function StockTable({ items }) {
  const columns = useMemo(
    () => [
      {
        id: 'product',
        header: 'Producto',
        accessorFn: (row) => row.productName,
        cell: ({ getValue }) => <span className="font-semibold text-ink">{getValue()}</span>,
      },
      {
        id: 'category',
        header: 'Categoría',
        accessorFn: (row) => row.categoryName,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'unit',
        header: 'Unidad',
        accessorFn: (row) => row.unitName,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'stock',
        header: 'Stock',
        accessorFn: (row) => row.stock,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">{row.original.stock}</span>
            <StockBadge stock={row.original.stock} minStock={row.original.minStock} />
          </div>
        ),
      },
      {
        id: 'minStock',
        header: 'Mínimo',
        accessorFn: (row) => row.minStock,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'price',
        header: 'Precio',
        accessorFn: (row) => row.price,
        cell: ({ getValue }) => <span className="text-body">{formatCurrency(getValue())}</span>,
      },
      {
        id: 'value',
        header: 'Valor',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        accessorFn: (row) => row.value,
        cell: ({ getValue }) => (
          <span className="font-semibold text-ink">{formatCurrency(getValue())}</span>
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={items}
      minWidth="780px"
      emptyIcon={Package}
      emptyTitle="Sin existencias"
      emptyDescription="Todavía no hay productos registrados en el inventario."
    />
  )
}
