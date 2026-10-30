import { useMemo } from 'react'
import { Boxes, Pencil, Power, Trash2 } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import IconButton from '../IconButton.jsx'

export default function UnitsTable({ units, onEdit, onChangeStatus, onDelete, loading }) {
  const columns = useMemo(
    () => [
      {
        id: 'unit',
        header: 'Unidad',
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-candey-50 text-candey ring-1 ring-candey/10 ring-inset">
              <Boxes size={19} />
            </span>
            <span className="font-semibold text-ink">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: 'abbreviation',
        header: 'Abreviatura',
        accessorFn: (row) => row.abbreviation,
        cell: ({ getValue }) => (
          <span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[12px] font-medium text-muted">
            {getValue()}
          </span>
        ),
      },
      {
        id: 'factor',
        header: 'Contiene',
        accessorFn: (row) => row.factor,
        cell: ({ row }) => (
          <span className="text-body">
            {row.original.factor} {row.original.factor === 1 ? 'unidad' : 'unidades'}
          </span>
        ),
      },
      {
        id: 'active',
        header: 'Estado',
        accessorFn: (row) => row.active,
        cell: ({ row }) =>
          row.original.active ? (
            <Badge tone="ok" dot>
              Activa
            </Badge>
          ) : (
            <Badge tone="neutral" dot>
              Inactiva
            </Badge>
          ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => {
          const unit = row.original
          return (
            <div className="flex items-center justify-end gap-1.5">
              <IconButton title="Editar" onClick={() => onEdit(unit)}>
                <Pencil size={16} />
              </IconButton>
              <IconButton
                title={unit.active ? 'Desactivar' : 'Activar'}
                tone="gold"
                onClick={() => onChangeStatus(unit)}
              >
                <Power size={16} />
              </IconButton>
              <IconButton title="Eliminar" tone="danger" onClick={() => onDelete(unit)}>
                <Trash2 size={16} />
              </IconButton>
            </div>
          )
        },
      },
    ],
    [onEdit, onChangeStatus, onDelete],
  )

  return (
    <DataTable
      columns={columns}
      data={units}
      loading={loading}
      minWidth="660px"
      emptyIcon={Boxes}
      emptyTitle="No hay unidades"
      emptyDescription="Registra las presentaciones de empaque que usas en el almacén."
    />
  )
}
