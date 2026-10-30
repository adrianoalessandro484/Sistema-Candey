import { useQuery } from '@tanstack/react-query'
import { getReports } from '../services/reportService.js'

const EMPTY_REPORT = {
  summary: {
    totalProducts: 0,
    units: 0,
    inventoryValue: 0,
    lowStock: 0,
    outOfStock: 0,
  },
  stock: [],
  rotation: [],
  alerts: [],
}

export function useReports() {
  const query = useQuery({
    queryKey: ['reports'],
    queryFn: () => getReports(),
  })

  return {
    report: query.data ?? EMPTY_REPORT,
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
