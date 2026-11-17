import { useState } from 'react'
import { Plus, UserCheck, Users } from 'lucide-react'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import TableToolbar from '../components/TableToolbar.jsx'
import Pagination from '../components/Pagination.jsx'
import { useToast } from '../components/toast/toastContext.js'
import { useSession } from '../context/sessionContext.js'
import UsersTable from '../components/users/UsersTable.jsx'
import UserFormModal from '../components/users/UserFormModal.jsx'
import { useUsers, useUsersPage } from '../hooks/useUsers.js'
import { useBranches } from '../hooks/useBranches.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { createUser, updateUser, changeUserAccess, deleteUser } from '../services/userService.js'

const CLOSED_MODAL = { open: false, mode: 'create', user: null }
const CLOSED_CONFIRM = { open: false, user: null }

export default function UsersPage() {
  const { notify } = useToast()
  const { user: currentUser } = useSession()
  const { users, loading, error: allError, reload: reloadAll } = useUsers()
  const { branches } = useBranches()
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

  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

  function handlePageSizeChange(value) {
    setPageSize(value)
    setPage(1)
  }

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
        icon={Users}
        title="Usuarios"
        description="Personal de almacén, roles y acceso al sistema."
      >
        <Button size="lg" onClick={openCreate}>
          <Plus size={20} />
          Nuevo usuario
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={Users} label="Usuarios registrados" value={String(users.length)} tone="candey" />
        <StatCard
          icon={UserCheck}
          label="Con acceso activo"
          value={String(users.filter((user) => user.hasAccess).length)}
          tone="ok"
        />
      </div>

      <ErrorBanner message={error} onRetry={reload} />

      <TableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar usuario o rol..."
        totalCount={meta?.totalItems ?? 0}
        totalLabel="usuario(s)"
        onRefresh={reload}
        refreshing={fetching}
      />

      <UsersTable
        users={pagedUsers}
        loading={tableLoading || (loading && pagedUsers.length === 0)}
        currentUserId={currentUser?.userId}
        onEdit={openEdit}
        onToggleAccess={toggleAccess}
        onDelete={(user) => setConfirmation({ open: true, user })}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={meta?.totalItems ?? 0}
        totalPages={meta?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        itemLabel="usuarios"
        disabled={fetching}
      />

      <UserFormModal
        open={modal.open}
        mode={modal.mode}
        user={modal.user}
        branches={branches}
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
