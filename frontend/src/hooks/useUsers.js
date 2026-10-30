import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getUsers, getUsersPage } from '../services/userService.js'

export function useUsers() {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  return {
    users: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useUsersPage({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = useQuery({
    queryKey: ['users', 'page', page, pageSize, search],
    queryFn: () => getUsersPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })

  return {
    users: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
