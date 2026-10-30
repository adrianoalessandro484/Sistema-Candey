import { useMemo } from 'react'
import { TriangleAlert } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import StockBadge from '../StockBadge.jsx'

export default function AlertsTable({ items }) {
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
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'minStock',
        header: 'Mínimo',
        accessorFn: (row) => row.minStock,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'missing',
        header: 'Faltante',
        accessorFn: (row) => row.missing,
        cell: ({ getValue }) => <Badge tone="danger">{getValue()} u.</Badge>,
      },
      {
        id: 'status',
        header: 'Estado',
        accessorFn: (row) => row.stock,
        cell: ({ row }) => (
          <StockBadge stock={row.original.stock} minStock={row.original.minStock} />
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={items}
      minWidth="760px"
      emptyIcon={TriangleAlert}
      emptyTitle="Sin alertas"
      emptyDescription="Ningún producto está por debajo de su stock mínimo."
    />
  )
}
