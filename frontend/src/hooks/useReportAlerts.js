import { useQuery } from '@tanstack/react-query'
import { getAlerts } from '../services/reportService.js'

export function useReportAlerts({ enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['report-alerts'],
    queryFn: getAlerts,
  })

  return {
    alerts: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
