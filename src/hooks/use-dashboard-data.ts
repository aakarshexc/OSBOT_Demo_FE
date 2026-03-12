import { useQuery } from '@tanstack/react-query'
import { dashboardApi, type GetDashboardDataParams } from '@/lib/dashboard-api'

export function useDashboardData(params: GetDashboardDataParams) {
    return useQuery({
        queryKey: ['dashboard-data', params],
        queryFn: async () => {
            const response = await dashboardApi.getDetails(params)
            if (!response?.data?.data) {
                throw new Error('Invalid response structure')
            }
            return response.data.data
        },
        enabled: !!params.startDate && !!params.endDate,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        retryDelay: 1000,
    })
}

