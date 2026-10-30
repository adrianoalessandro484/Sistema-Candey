import { useQuery } from '@tanstack/react-query'
import { getReportSummary } from '../services/reportService.js'

const EMPTY_SUMMARY = {
  summary: {
    totalProducts: 0,
    units: 0,
    inventoryValue: 0,
    lowStock: 0,
    outOfStock: 0,
  },
  rotation: [],
}

export function useReportSummary({ enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['report-summary'],
    queryFn: () => getReportSummary(),
  })

  return {
    report: query.data ?? EMPTY_SUMMARY,
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
