import { useQuery } from '@tanstack/react-query'
import { getExpiringLots } from '../services/lotService.js'

export function useExpiringLots({ days = 60, enabled = true } = {}) {
  const query = useQuery({
    enabled,
    queryKey: ['lots', 'expiring', days],
    queryFn: () => getExpiringLots(days),
  })

  return {
    lots: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? '',
    reload: query.refetch,
  }
}
