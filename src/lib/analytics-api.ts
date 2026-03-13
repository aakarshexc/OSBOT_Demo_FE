import { getDataWithToken } from './api'
import { ANALYTICS_ENDPOINTS } from './api-endpoints'
import type { AxiosRequestConfig } from 'axios'

// Types
export interface Pagination {
    page: number
    limit: number
    hasMore: boolean
    totalCount?: number
}

export interface ApiResponse<T> {
    success: boolean
    data: T[]
    pagination: Pagination
    filters?: Record<string, unknown>
    totals?: Record<string, unknown>
    timestamp?: string
}

export interface SummaryData {
    averageValuePerCase: string
    prospectCount: string
    matterCount: string
    activeCasesCount: number
    timeOnDeskDays: string
    caseVelocityDays: string
    advancedClientCostRecoveryRate: string
    PipelineValue: {
        total_attorney_fee: string
        total_pipeline_value: string
        conservative_attorney_fee: string
    }
    litigationValue: {
        litigation_count: string
        projected_actual_value: string
        projected_future_value: string
    }
    demandValue: {
        demand_count: string
        demand_offer_amount_total: string
    }
    SettlementValue: {
        total_settlement_count: string
        demand_offer_amount_total: string
        llf_attorney_fee_total: string
    }
    activeCasesByPhase: Record<string, number>
    casePhases: Record<string, string>
    treatmentLevels: Record<string, string>
    caseValues: {
        projected_actual_value: string | null
        projected_future_value: string | null
        case_phase: string | null
    }[]
}

export interface HistoryItem {
    objectName: string
    status: 'completed' | 'failed' | 'running'
    recordsProcessed: number
    durationSeconds: string | null
    errorMessage: string | null
}

export interface HistoryResponse {
    success: boolean
    data: HistoryItem[]
    pagination: Pagination
}

export interface SummaryResponse {
    success: boolean
    data: SummaryData
    filters: {
        startDate: string
        endDate: string
    }
    timestamp: string
}

export interface ActiveCase {
    projection_id: string
    matter_link: string
    projection_name: string
    projected_actual_value: string
    projected_future_value: string
    projection_matter_phase: string
    matter_name: string
    matter_created_date: string
    client_name: string
    case_type: string
    latest_offer_amount: string
    total_settlement_amount: string
    matter_phase?: string
    case_open_date?: string
}

export interface ReportItem {
    projection_id: string
    projection_name: string
    matter_name: string
    conservative_attorney_fee: string | null
    llf_attorney_fee: string | null
    matter_phase: string
}

export interface SettlementCase {
    projection_id: string
    matter_name: string
    client_name: string
    total_settlement_amount: string
    matter_phase: string
    case_type: string
}

export interface LitigationCase {
    projection_id: string
    matter_name: string
    client_name: string
    litigation_stage: string
    projected_actual_value: string
}

export interface Prospect {
    prospect_sf_id: string
    first_name: string
    last_name: string
    client_email: string
    mobile_phone: string
    intake_status: string
    lead_source: string
    lead_score: string
    prospect_number?: string
}

export interface DummyResponseData {
    averageCaseValue: string
    caseVelocity: string
    pipelineValue: string
    caseAcquisitionCost: string
    returnOnAdSpendPerChannel: string
    referralFeeLeakageRate: string
    effectiveHourlyRate: string
    advancedClientCostRecoveryRate: string
    supportStaffUtilizationRate: string
    rolling13WeekCashFlowForecast: string
    capitalAdequacyRatio: string
}

export interface DummyResponse {
    success: boolean
    data: DummyResponseData
}

export interface FilterOptionsData {
    phases: Array<{ case_phase: string }>
    prospectStatuses: Array<{ intake_status: string }>
    prospectSources: Array<{ lead_source: string }>
    prospectScoreRange: {
        min: number
        max: number
    }
    caseValueRanges: {
        projectedValueActual: {
            min: number
            max: number
        }
        totalSettlementAmount: {
            min: number
            max: number
        }
    }
}

export interface FilterOptionsResponse {
    success: boolean
    data: FilterOptionsData
    timestamp: string
}

// Filter types
export interface ActiveCasesFilters {
    phases?: string // Comma-separated phase values
    projectedValueMin?: number
    projectedValueMax?: number
    settlementValueMin?: number
    settlementValueMax?: number
}

export interface ReportsFilters {
    phases?: string // Comma-separated phase values
}

export interface SettlementCasesFilters {
    phases?: string // Comma-separated phase values
    projectedValueMin?: number
    projectedValueMax?: number
    settlementValueMin?: number
    settlementValueMax?: number
}

export interface LitigationCasesFilters {
    phases?: string // Comma-separated phase values
}

export interface ProspectsFilters {
    status?: string // Comma-separated status values
    source?: string // Comma-separated source values
    scoreMin?: number
    scoreMax?: number
}

// API Functions - Using getDataWithToken which uses BASE_URL from env
export const analyticsApi = {
    getActiveCases: async (startDate: string, endDate: string, page = 1, limit = 10, filters?: ActiveCasesFilters) => {
        const params: Record<string, unknown> = { startDate, endDate, page, limit }
        if (filters?.phases && filters.phases !== 'all') {
            params.phases = filters.phases
        }
        if (filters?.projectedValueMin !== undefined) {
            params.projectedValueMin = filters.projectedValueMin
        }
        if (filters?.projectedValueMax !== undefined) {
            params.projectedValueMax = filters.projectedValueMax
        }
        if (filters?.settlementValueMin !== undefined) {
            params.settlementValueMin = filters.settlementValueMin
        }
        if (filters?.settlementValueMax !== undefined) {
            params.settlementValueMax = filters.settlementValueMax
        }
        const config: AxiosRequestConfig = { params }
        const response = await getDataWithToken<ApiResponse<ActiveCase>>(
            ANALYTICS_ENDPOINTS.ACTIVE_CASES,
            config
        )
        return response.data
    },

    getPipelineValue: async (startDate: string, endDate: string, page = 1, limit = 10, filters?: ReportsFilters) => {
        const params: Record<string, unknown> = { startDate, endDate, page, limit }
        if (filters?.phases && filters.phases !== 'all') {
            params.phases = filters.phases
        }
        const config: AxiosRequestConfig = { params }
        const response = await getDataWithToken<ApiResponse<ReportItem>>(
            ANALYTICS_ENDPOINTS.PIPELINE_VALUE,
            config
        )
        return response.data
    },

    getSettlementCases: async (startDate: string, endDate: string, page = 1, limit = 10, filters?: SettlementCasesFilters) => {
        const params: Record<string, unknown> = { startDate, endDate, page, limit }
        if (filters?.phases && filters.phases !== 'all') {
            params.phases = filters.phases
        }
        if (filters?.projectedValueMin !== undefined) {
            params.projectedValueMin = filters.projectedValueMin
        }
        if (filters?.projectedValueMax !== undefined) {
            params.projectedValueMax = filters.projectedValueMax
        }
        if (filters?.settlementValueMin !== undefined) {
            params.settlementValueMin = filters.settlementValueMin
        }
        if (filters?.settlementValueMax !== undefined) {
            params.settlementValueMax = filters.settlementValueMax
        }
        const config: AxiosRequestConfig = { params }
        const response = await getDataWithToken<ApiResponse<SettlementCase>>(
            ANALYTICS_ENDPOINTS.SETTLEMENT_CASES,
            config
        )
        return response.data
    },

    getLitigationCases: async (startDate: string, endDate: string, page = 1, limit = 10, filters?: LitigationCasesFilters) => {
        const params: Record<string, unknown> = { startDate, endDate, page, limit }
        if (filters?.phases && filters.phases !== 'all') {
            params.phases = filters.phases
        }
        const config: AxiosRequestConfig = { params }
        const response = await getDataWithToken<ApiResponse<LitigationCase>>(
            ANALYTICS_ENDPOINTS.LITIGATION_CASES,
            config
        )
        return response.data
    },

    getProspects: async (startDate: string, endDate: string, page = 1, limit = 10, filters?: ProspectsFilters) => {
        const params: Record<string, unknown> = { startDate, endDate, page, limit }
        if (filters?.status && filters.status !== 'all') {
            params.status = filters.status
        }
        if (filters?.source && filters.source !== 'all') {
            params.source = filters.source
        }
        if (filters?.scoreMin !== undefined) {
            params.scoreMin = filters.scoreMin
        }
        if (filters?.scoreMax !== undefined) {
            params.scoreMax = filters.scoreMax
        }
        const config: AxiosRequestConfig = { params }
        const response = await getDataWithToken<ApiResponse<Prospect>>(
            ANALYTICS_ENDPOINTS.PROSPECTS,
            config
        )
        return response.data
    },

    getSummary: async (startDate: string, endDate: string) => {
        const config: AxiosRequestConfig = {
            params: { startDate, endDate }
        }
        const response = await getDataWithToken<SummaryResponse>(
            ANALYTICS_ENDPOINTS.SUMMARY,
            config
        )
        return response.data
    },

    getHistory: async (startDate: string, endDate: string, page = 1, limit = 100) => {
        const config: AxiosRequestConfig = {
            params: { startDate, endDate, page, limit }
        }
        const response = await getDataWithToken<HistoryResponse>(
            ANALYTICS_ENDPOINTS.HISTORY,
            config
        )
        return response.data
    },

    getDummyResponse: async () => {
        const response = await getDataWithToken<DummyResponse>(
            ANALYTICS_ENDPOINTS.DUMMY_RESPONSE
        )
        return response.data
    },

    getFilterOptions: async () => {
        const response = await getDataWithToken<FilterOptionsResponse>(
            ANALYTICS_ENDPOINTS.FILTER_OPTIONS
        )
        return response.data
    }
}

