import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getBranchRequests, getBranchRequestsPage } from '../services/branchRequestService.js'

export function useBranchRequests({ status = '', branchId = null, enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['branch-requests', status, branchId],
    queryFn: () => getBranchRequests({ status, branchId }),
  })

  return {
    requests: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useBranchRequestsPage({
  page = 1,
  pageSize = 10,
  search = '',
  status = '',
  branchId = null,
} = {}) {
  const query = useQuery({
    queryKey: ['branch-requests', 'page', page, pageSize, search, status, branchId],
    queryFn: () => getBranchRequestsPage({ page, pageSize, search, status, branchId }),
    placeholderData: keepPreviousData,
  })

  return {
    requests: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
