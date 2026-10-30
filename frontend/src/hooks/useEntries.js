import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getEntries, getEntriesPage } from '../services/entryService.js'

export function useEntries({ enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['entries'],
    queryFn: getEntries,
  })

  return {
    entries: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useEntriesPage({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = useQuery({
    queryKey: ['entries', 'page', page, pageSize, search],
    queryFn: () => getEntriesPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })

  return {
    entries: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
