import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllBranches, getBranchesPage } from '../services/branchService.js'

export function useBranches({ enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['branches'],
    queryFn: getAllBranches,
  })

  return {
    branches: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useBranchesPage({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = useQuery({
    queryKey: ['branches', 'page', page, pageSize, search],
    queryFn: () => getBranchesPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })

  return {
    branches: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
