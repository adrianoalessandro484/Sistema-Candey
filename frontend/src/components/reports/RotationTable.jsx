import { useMemo } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'

export default function RotationTable({ items }) {
  const columns = useMemo(
    () => [
      {
        id: 'product',
        header: 'Producto',
        accessorFn: (row) => row.productName,
        cell: ({ getValue }) => <span className="font-semibold text-ink">{getValue()}</span>,
      },
      {
        id: 'received',
        header: 'Ingresado',
        accessorFn: (row) => row.received,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'issued',
        header: 'Egresado',
        accessorFn: (row) => row.issued,
        cell: ({ getValue }) => <span className="text-body">{getValue()}</span>,
      },
      {
        id: 'balance',
        header: 'Saldo',
        accessorFn: (row) => row.balance,
        cell: ({ getValue }) => <span className="font-medium text-ink">{getValue()}</span>,
      },
      {
        id: 'level',
        header: 'Rotación',
        accessorFn: (row) => row.level.label,
        cell: ({ row }) => <Badge tone={row.original.level.tone}>{row.original.level.label}</Badge>,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={items}
      minWidth="700px"
      emptyIcon={ArrowLeftRight}
      emptyTitle="Sin movimientos"
      emptyDescription="Aún no hay entradas ni salidas registradas para calcular la rotación."
    />
  )
}
