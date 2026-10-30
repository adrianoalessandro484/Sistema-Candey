import { useEffect, useState } from 'react'
import { Plus, RotateCw, Users } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Pagination from '../components/Pagination.jsx'
import Spinner from '../components/Spinner.jsx'
import { useToast } from '../components/toast/toastContext.js'
import { useSession } from '../context/sessionContext.js'
import UsersTable from '../components/users/UsersTable.jsx'
import UserFormModal from '../components/users/UserFormModal.jsx'
import { useUsers, useUsersPage } from '../hooks/useUsers.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { createUser, updateUser, changeUserAccess, deleteUser } from '../services/userService.js'

const CLOSED_MODAL = { open: false, mode: 'create', user: null }
const CLOSED_CONFIRM = { open: false, user: null }

export default function UsersPage() {
  const { notify } = useToast()
  const { user: currentUser } = useSession()
  const { users, loading, error: allError, reload: reloadAll } = useUsers()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const {
    users: pagedUsers,
    meta,
    loading: tableLoading,
    fetching,
    error: pageError,
    reload: reloadPage,
  } = useUsersPage({ page, pageSize, search: debouncedSearch })
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
    setModal({ open: true, mode: 'create', user: null })
  }

  function openEdit(user) {
    setModal({ open: true, mode: 'edit', user })
  }

  function closeModal() {
    setModal(CLOSED_MODAL)
  }

  async function saveUser(values) {
    if (modal.mode === 'edit') {
      await updateUser(modal.user.id, values)
      notify('Usuario actualizado correctamente.', 'success')
    } else {
      await createUser(values)
      notify('Usuario creado correctamente.', 'success')
    }

    closeModal()
    reload()
  }

  async function confirmDelete() {
    setProcessing(true)

    try {
      await deleteUser(confirmation.user.id)
      notify('Usuario eliminado.', 'success')
      setConfirmation(CLOSED_CONFIRM)
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    } finally {
      setProcessing(false)
    }
  }

  async function toggleAccess(user) {
    try {
      await changeUserAccess(user.id, !user.hasAccess)
      notify(user.hasAccess ? 'Acceso retirado.' : 'Acceso otorgado.', 'success')
      reload()
    } catch (exception) {
      notify(exception.message, 'error')
    }
  }

  const error = pageError || allError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Administración"
        title="Usuarios"
        description="Personal de almacén, roles y acceso al sistema."
      >
        <Button onClick={openCreate}>
          <Plus size={18} />
          Nuevo usuario
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={Users} label="Usuarios registrados" value={String(users.length)} tone="candey" />
        <StatCard
          icon={Users}
          label="Con acceso activo"
          value={String(users.filter((user) => user.hasAccess).length)}
          tone="ok"
        />
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
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar usuario o rol..." />
        <span className="text-[12.5px] text-muted">
          {meta?.totalItems ?? 0} usuario(s) en total
        </span>
      </div>

      {loading && !tableLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Cargando usuarios...
        </div>
      ) : (
        <UsersTable
          users={pagedUsers}
          loading={tableLoading}
          currentUserId={currentUser?.userId}
          onEdit={openEdit}
          onToggleAccess={toggleAccess}
          onDelete={(user) => setConfirmation({ open: true, user })}
        />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="usuarios"
        disabled={fetching}
      />

      <UserFormModal
        open={modal.open}
        mode={modal.mode}
        user={modal.user}
        onClose={closeModal}
        onSave={saveUser}
      />

      <ConfirmDialog
        open={confirmation.open}
        title="Eliminar usuario"
        message={`¿Deseas eliminar a "${confirmation.user?.userName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={processing}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmation(CLOSED_CONFIRM)}
      />
    </div>
  )
}
