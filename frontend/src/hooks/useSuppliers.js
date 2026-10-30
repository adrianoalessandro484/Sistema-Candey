import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllSuppliers, getSuppliersPage } from '../services/supplierService.js'

export function useSuppliers({ enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['suppliers'],
    queryFn: getAllSuppliers,
  })

  return {
    suppliers: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useSuppliersPage({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = useQuery({
    queryKey: ['suppliers', 'page', page, pageSize, search],
    queryFn: () => getSuppliersPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })

  return {
    suppliers: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
