import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllProducts, getProductsPage } from '../services/productService.js'

export function useProducts({ enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['products'],
    queryFn: getAllProducts,
  })

  return {
    products: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}

export function useProductsPage({ page = 1, pageSize = 10, search = '' } = {}) {
  const query = useQuery({
    queryKey: ['products', 'page', page, pageSize, search],
    queryFn: () => getProductsPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  })

  return {
    products: query.data?.items ?? [],
    meta: query.data,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
