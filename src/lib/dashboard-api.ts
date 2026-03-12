import { getDataWithToken } from './api'
import { DASHBOARD_ENDPOINTS } from './api-endpoints'
import type { AxiosRequestConfig } from 'axios'

// Types
export interface GetDashboardDataParams {
    startDate: string
    endDate: string
}

export interface DashboardData {
    [key: string]: unknown
}

export interface DashboardDataResponse {
    success: boolean
    data: DashboardData
}

// API Functions
export const dashboardApi = {
    getDetails: async (params: GetDashboardDataParams) => {
        const config: AxiosRequestConfig = {
            params: { startDate: params.startDate, endDate: params.endDate },
        }
        const response = await getDataWithToken<DashboardDataResponse>(
            DASHBOARD_ENDPOINTS.STATS,
            config
        )
        return response
    },
}

// Export for backward compatibility
export const fetchDashboardDetails = dashboardApi.getDetails

