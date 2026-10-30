import { useMemo } from 'react'
import { MapPin, Pencil, Phone, Power, Store, Trash2 } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import IconButton from '../IconButton.jsx'

export default function BranchesTable({ branches, onEdit, onChangeStatus, onDelete, loading }) {
  const columns = useMemo(
    () => [
      {
        id: 'branch',
        header: 'Sucursal',
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-candey-50 text-candey ring-1 ring-candey/10 ring-inset">
              <Store size={19} />
            </span>
            <span className="font-semibold text-ink">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: 'address',
        header: 'Dirección',
        accessorFn: (row) => row.address,
        cell: ({ getValue }) =>
          getValue() ? (
            <span className="inline-flex items-start gap-1.5 text-[12.5px] text-muted">
              <MapPin size={13} className="mt-0.5 shrink-0" /> {getValue()}
            </span>
          ) : (
            <span className="text-[12.5px] text-muted">Sin dirección</span>
          ),
      },
      {
        id: 'phone',
        header: 'Teléfono',
        accessorFn: (row) => row.phone,
        cell: ({ getValue }) =>
          getValue() ? (
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted">
              <Phone size={13} /> {getValue()}
            </span>
          ) : (
            <span className="text-[12.5px] text-muted">Sin teléfono</span>
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
          const branch = row.original
          return (
            <div className="flex items-center justify-end gap-1.5">
              <IconButton title="Editar" onClick={() => onEdit(branch)}>
                <Pencil size={16} />
              </IconButton>
              <IconButton
                title={branch.active ? 'Desactivar' : 'Activar'}
                tone="gold"
                onClick={() => onChangeStatus(branch)}
              >
                <Power size={16} />
              </IconButton>
              <IconButton title="Eliminar" tone="danger" onClick={() => onDelete(branch)}>
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
      data={branches}
      loading={loading}
      minWidth="740px"
      emptyIcon={Store}
      emptyTitle="No hay sucursales"
      emptyDescription="Agrega los destinos de despacho de tus productos."
    />
  )
}
