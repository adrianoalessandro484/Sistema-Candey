import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getEntryOrders, getEntryOrdersPage } from '../services/entryOrderService.js'

export function useEntryOrders({ status = '', enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['entry-orders', status],
    queryFn: () => getEntryOrders({ status }),
  })

  return {
    orders: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useEntryOrdersPage({ page = 1, pageSize = 10, search = '', status = '' } = {}) {
  const query = useQuery({
    queryKey: ['entry-orders', 'page', page, pageSize, search, status],
    queryFn: () => getEntryOrdersPage({ page, pageSize, search, status }),
    placeholderData: keepPreviousData,
  })

  return {
    orders: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
