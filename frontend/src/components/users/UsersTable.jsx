import { useMemo } from 'react'
import { Pencil, Store, Trash2, UserCheck, UserX, Users } from 'lucide-react'
import DataTable from '../DataTable.jsx'
import Badge from '../Badge.jsx'
import IconButton from '../IconButton.jsx'
import { Avatar, AvatarFallback } from '../Avatar.jsx'
import { initials, formatShortDate } from '../../utils/format.js'
import RoleBadge from './RoleBadge.jsx'

export default function UsersTable({ users, currentUserId, onEdit, onToggleAccess, onDelete, loading }) {
  const columns = useMemo(
    () => [
      {
        id: 'user',
        header: 'Usuario',
        accessorFn: (row) => row.userName,
        cell: ({ row }) => {
          const user = row.original
          const isCurrent = user.id === currentUserId

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-1 ring-candey/10">
                <AvatarFallback className="text-[12px]">{initials(user.userName)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-ink">
                  {user.userName}
                  {isCurrent ? (
                    <span className="ml-2 text-[12px] font-normal text-muted">(usted)</span>
                  ) : null}
                </span>
                <span className="text-[12px] text-muted">Código #{String(user.id).padStart(3, '0')}</span>
              </div>
            </div>
          )
        },
      },
      {
        id: 'role',
        header: 'Rol',
        accessorFn: (row) => row.role,
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <RoleBadge role={row.original.role} />
            {row.original.branchName ? (
              <span className="inline-flex items-center gap-1 text-[12px] text-muted">
                <Store size={12} aria-hidden="true" />
                {row.original.branchName}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        id: 'access',
        header: 'Acceso',
        accessorFn: (row) => row.hasAccess,
        cell: ({ row }) =>
          row.original.hasAccess ? (
            <Badge tone="ok" dot>
              Con acceso
            </Badge>
          ) : (
            <Badge tone="neutral" dot>
              Sin acceso
            </Badge>
          ),
      },
      {
        id: 'createdAt',
        header: 'Registrado',
        accessorFn: (row) => row.createdAt,
        cell: ({ getValue }) => <span className="text-muted">{formatShortDate(getValue())}</span>,
      },
      {
        id: 'actions',
        header: 'Acciones',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => {
          const user = row.original
          const isCurrent = user.id === currentUserId

          return (
            <div className="flex items-center justify-end gap-2">
              <IconButton title="Editar" onClick={() => onEdit(user)}>
                <Pencil size={16} />
              </IconButton>
              <IconButton
                title={user.hasAccess ? 'Quitar acceso' : 'Dar acceso'}
                tone="gold"
                disabled={isCurrent && user.hasAccess}
                onClick={() => onToggleAccess(user)}
              >
                {user.hasAccess ? <UserX size={16} /> : <UserCheck size={16} />}
              </IconButton>
              <IconButton title="Eliminar" tone="danger" disabled={isCurrent} onClick={() => onDelete(user)}>
                <Trash2 size={16} />
              </IconButton>
            </div>
          )
        },
      },
    ],
    [currentUserId, onEdit, onToggleAccess, onDelete],
  )

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={loading}
      minWidth="820px"
      emptyIcon={Users}
      emptyTitle="No hay usuarios"
      emptyDescription="Crea el primer usuario para dar acceso al sistema."
    />
  )
}
