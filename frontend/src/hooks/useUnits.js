import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllUnits, getUnitsPage } from '../services/unitService.js'

export function useUnits() {
  const query = useQuery({
    queryKey: ['units'],
    queryFn: getAllUnits,
  })

  return {
    units: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useUnitsPage({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = useQuery({
    queryKey: ['units', 'page', page, pageSize, search],
    queryFn: () => getUnitsPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })

  return {
    units: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
