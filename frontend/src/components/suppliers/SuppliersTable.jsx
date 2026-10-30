import { useMemo } from 'react'
import { Mail, MapPin, Pencil, Phone, Power, Trash2, Truck } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import IconButton from '../IconButton.jsx'

export default function SuppliersTable({ suppliers, onEdit, onChangeStatus, onDelete, loading }) {
  const columns = useMemo(
    () => [
      {
        id: 'supplier',
        header: 'Proveedor',
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-candey-50 text-candey ring-1 ring-candey/10 ring-inset">
              <Truck size={19} />
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-ink">{row.original.name}</span>
              <span className="text-[12px] text-muted">RUC {row.original.taxId}</span>
            </div>
          </div>
        ),
      },
      {
        id: 'contact',
        header: 'Contacto',
        accessorFn: (row) => `${row.phone ?? ''} ${row.email ?? ''}`,
        cell: ({ row }) => (
          <div className="flex flex-col gap-1 text-[12.5px] text-muted">
            {row.original.phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={13} /> {row.original.phone}
              </span>
            ) : null}
            {row.original.email ? (
              <span className="inline-flex items-center gap-1.5">
                <Mail size={13} /> {row.original.email}
              </span>
            ) : null}
            {!row.original.phone && !row.original.email ? <span>Sin contacto</span> : null}
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
      {
        id: 'actions',
        header: 'Acciones',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => {
          const supplier = row.original
          return (
            <div className="flex items-center justify-end gap-1.5">
              <IconButton title="Editar" onClick={() => onEdit(supplier)}>
                <Pencil size={16} />
              </IconButton>
              <IconButton
                title={supplier.active ? 'Desactivar' : 'Activar'}
                tone="gold"
                onClick={() => onChangeStatus(supplier)}
              >
                <Power size={16} />
              </IconButton>
              <IconButton title="Eliminar" tone="danger" onClick={() => onDelete(supplier)}>
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
      data={suppliers}
      loading={loading}
      minWidth="840px"
      emptyIcon={Truck}
      emptyTitle="No hay proveedores"
      emptyDescription="Registra a tus distribuidores para agilizar las entradas."
    />
  )
}
