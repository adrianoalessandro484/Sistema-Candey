import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getExits, getExitsPage } from '../services/exitService.js'

export function useExits({ enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['exits'],
    queryFn: getExits,
  })

  return {
    exits: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useExitsPage({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = useQuery({
    queryKey: ['exits', 'page', page, pageSize, search],
    queryFn: () => getExitsPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })

  return {
    exits: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
