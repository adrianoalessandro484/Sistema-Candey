import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllCategories, getCategoriesPage } from '../services/categoryService.js'

export function useCategories() {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  })

  return {
    categories: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useCategoriesPage({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = useQuery({
    queryKey: ['categories', 'page', page, pageSize, search],
    queryFn: () => getCategoriesPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })

  return {
    categories: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
