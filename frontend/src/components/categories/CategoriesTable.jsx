import { useMemo } from 'react'
import { Pencil, Power, Tag, Trash2 } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import IconButton from '../IconButton.jsx'

export default function CategoriesTable({ categories, onEdit, onChangeStatus, onDelete, loading }) {
  const columns = useMemo(
    () => [
      {
        id: 'category',
        header: 'Categoría',
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-candey-50 text-candey ring-1 ring-candey/10 ring-inset">
              <Tag size={19} />
            </span>
            <span className="font-semibold text-ink">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: 'description',
        header: 'Descripción',
        accessorFn: (row) => row.description,
        cell: ({ getValue }) => <span className="text-muted">{getValue() || 'Sin descripción'}</span>,
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
          const category = row.original
          return (
            <div className="flex items-center justify-end gap-2">
              <IconButton title="Editar" onClick={() => onEdit(category)}>
                <Pencil size={16} />
              </IconButton>
              <IconButton
                title={category.active ? 'Desactivar' : 'Activar'}
                tone="gold"
                onClick={() => onChangeStatus(category)}
              >
                <Power size={16} />
              </IconButton>
              <IconButton title="Eliminar" tone="danger" onClick={() => onDelete(category)}>
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
      data={categories}
      loading={loading}
      minWidth="680px"
      emptyIcon={Tag}
      emptyTitle="No hay categorías"
      emptyDescription="Agrega una categoría para clasificar tus productos."
    />
  )
}
